<#
.SYNOPSIS
  Runs a command with a memory cap, so a runaway dev server cannot starve the whole machine (OPS-019).

.DESCRIPTION
  Windows has no ulimit, but it has job objects: a container for processes whose limits the kernel enforces.
  This script makes a job with two limits, puts itself in it, then runs your command as a child, which joins the
  job automatically (so do the child's own children, e.g. esbuild):

    - JOB_MEMORY: all processes in the job together may not commit more than -LimitGB (default 8). A process that
      asks for more is refused the memory; Node then aborts with an out-of-memory error and that one server exits.
      Nothing else on the machine feels it. It counts committed memory (what Windows promises), which is what
      grew to 131 GB in the incident behind OPS-019, not only the part in RAM.
    - KILL_ON_JOB_CLOSE: when this script ends for any reason (Ctrl+C, the shell closing, a kill), everything in
      the job is ended with it, so no dev server is left behind with nobody watching it.

  That alone did not cover a stopped shell, because nothing ended this script. Windows does not end a process's
  children when it ends, and a tree kill (Claude Code's TaskStop) finds children by parent PID. Git Bash breaks
  that chain: the bash it forks to run `npm` exits once it has exec'd it, so npm > cmd > this script > vite hang
  under a dead parent, out of the tree kill's reach. So the script also watches, and ends the job as soon as one
  of them exits:
    - its console host (conhost.exe / OpenConsole.exe): the tree kill ends it with the shell that made it, and
      closing a terminal window or tab ends it too;
    - the processes that started it, from its parent up to (not including) Explorer or a system process, as far
      as the parent chain is unbroken.
  A deliberately detached start (`nohup ... &`, `Start-Process`) keeps its console and loses its parents before
  this runs, so it can still outlive its shell: keep the command running in a shell instead.

  Nothing is installed or scheduled, nothing outside the job changes, and the cap exists only while the command
  runs. A healthy dev server here uses 0.2 to 0.7 GB, so 8 GB is generous.

  Only a command started through this script is capped. Usage: capped.ps1 [-LimitGB 8] <command> [args...]
  (-LimitGB, if given, comes first; everything after it is the command, flags included). Exit code: the command's
  own; 2 usage, 3 cap not applied (it refuses to start the command uncapped).

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File tools/capped.ps1 node node_modules/vite/bin/vite.js
.EXAMPLE
  # the restricted-profile adapter, on port 5247, with a 4 GB cap
  $env:PORT = '5247'; powershell -NoProfile -ExecutionPolicy Bypass -File tools/capped.ps1 -LimitGB 4 node --preserve-symlinks --preserve-symlinks-main .codex/vite.mjs dev
#>
# No param block on purpose: PowerShell would read the command's own flags (node -e, npm -v) as its parameters
# (-e is short for -ErrorAction). Every argument is taken raw from $args; only a leading -LimitGB <n> is ours.
$ErrorActionPreference = 'Stop'
$LimitGB = 8.0
$Command = @($args)
if ($Command.Count -ge 2 -and [string]$Command[0] -ieq '-LimitGB') {
  $LimitGB = [double][string]$Command[1]
  $Command = @($Command | Select-Object -Skip 2)
}
if ($Command.Count -eq 0) {
  [Console]::Error.WriteLine('usage: capped.ps1 [-LimitGB 8] <command> [args...]   (-LimitGB must come first)')
  exit 2
}
if ($LimitGB -lt 0.25) {
  [Console]::Error.WriteLine('[capped] -LimitGB must be at least 0.25')
  exit 2
}

Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;

public static class GcdJob {
  [StructLayout(LayoutKind.Sequential)]
  struct BASIC {
    public long PerProcessUserTimeLimit, PerJobUserTimeLimit;
    public uint LimitFlags;
    public UIntPtr MinimumWorkingSetSize, MaximumWorkingSetSize;
    public uint ActiveProcessLimit;
    public UIntPtr Affinity;
    public uint PriorityClass, SchedulingClass;
  }
  [StructLayout(LayoutKind.Sequential)]
  struct IOC { public ulong A, B, C, D, E, F; }
  [StructLayout(LayoutKind.Sequential)]
  struct EXT {
    public BASIC Basic;
    public IOC Io;
    public UIntPtr ProcessMemoryLimit, JobMemoryLimit, PeakProcessMemoryUsed, PeakJobMemoryUsed;
  }

  [DllImport("kernel32.dll", SetLastError = true)] static extern IntPtr CreateJobObject(IntPtr attrs, string name);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetInformationJobObject(IntPtr job, int infoClass, IntPtr info, uint len);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool AssignProcessToJobObject(IntPtr job, IntPtr process);
  [DllImport("kernel32.dll")] static extern IntPtr GetCurrentProcess();
  [DllImport("kernel32.dll")] static extern uint GetCurrentProcessId();
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool TerminateJobObject(IntPtr job, uint exitCode);

  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  struct PE32 {
    public uint dwSize, cntUsage, th32ProcessID;
    public IntPtr th32DefaultHeapID;
    public uint th32ModuleID, cntThreads, th32ParentProcessID;
    public int pcPriClassBase;
    public uint dwFlags;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 260)] public string szExeFile;
  }
  [DllImport("kernel32.dll", SetLastError = true)] static extern IntPtr CreateToolhelp32Snapshot(uint flags, uint pid);
  [DllImport("kernel32.dll", CharSet = CharSet.Unicode, EntryPoint = "Process32FirstW")] static extern bool Process32First(IntPtr snap, ref PE32 e);
  [DllImport("kernel32.dll", CharSet = CharSet.Unicode, EntryPoint = "Process32NextW")] static extern bool Process32Next(IntPtr snap, ref PE32 e);
  [DllImport("kernel32.dll", SetLastError = true)] static extern IntPtr OpenProcess(uint access, bool inherit, uint pid);
  [DllImport("kernel32.dll")] static extern bool GetProcessTimes(IntPtr p, out long created, out long exited, out long kernel, out long user);
  [DllImport("kernel32.dll")] static extern uint WaitForMultipleObjects(uint count, IntPtr[] handles, bool all, uint ms);
  [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr h);
  [DllImport("ntdll.dll")] static extern int NtQueryInformationProcess(IntPtr p, int infoClass, out IntPtr info, int len, out int retLen);

  // Kept open for the life of this process: closing it (at exit) is what ends the job's processes.
  static IntPtr job;

  // The walk up the parents stops below these, so an Explorer restart does not end a server started from a terminal.
  static readonly string[] Roots = { "explorer.exe", "sihost.exe", "svchost.exe", "services.exe", "wininit.exe",
    "winlogon.exe", "csrss.exe", "smss.exe", "System", "[System Process]" };

  // Watches this process's console host and its parent, their parent and so on, and ends the job (this script, the
  // command and all it started) as soon as one of them exits. Returns what it watches; "" when it could watch nothing.
  public static string WatchShell() {
    var parentOf = new Dictionary<uint, uint>();
    var nameOf = new Dictionary<uint, string>();
    IntPtr snap = CreateToolhelp32Snapshot(0x2, 0); // TH32CS_SNAPPROCESS
    if (snap == new IntPtr(-1)) return "";
    try {
      PE32 e = new PE32();
      e.dwSize = (uint)Marshal.SizeOf(typeof(PE32));
      for (bool ok = Process32First(snap, ref e); ok; ok = Process32Next(snap, ref e)) {
        parentOf[e.th32ProcessID] = e.th32ParentProcessID;
        nameOf[e.th32ProcessID] = e.szExeFile;
      }
    } finally { CloseHandle(snap); }

    var handles = new List<IntPtr>();
    var names = new List<string>();
    uint cur = GetCurrentProcessId();
    long curCreated, x, k, u;
    if (!GetProcessTimes(GetCurrentProcess(), out curCreated, out x, out k, out u)) return "";
    while (handles.Count < 64) { // WaitForMultipleObjects takes at most 64
      uint pid;
      if (!parentOf.TryGetValue(cur, out pid) || pid == 0 || !nameOf.ContainsKey(pid)) break; // already gone
      string name = nameOf[pid];
      if (Array.Exists(Roots, r => string.Equals(r, name, StringComparison.OrdinalIgnoreCase))) break;
      IntPtr h = OpenProcess(0x00100000 | 0x1000, false, pid); // SYNCHRONIZE | PROCESS_QUERY_LIMITED_INFORMATION
      if (h == IntPtr.Zero) break; // another user's or a protected process
      long created;
      // A "parent" younger than its child is a stranger that took a dead parent's PID: the real chain ends here.
      if (!GetProcessTimes(h, out created, out x, out k, out u) || created > curCreated) { CloseHandle(h); break; }
      handles.Add(h);
      names.Add(name + " " + pid);
      cur = pid;
      curCreated = created;
    }

    IntPtr host;
    int retLen;
    // 49 = ProcessConsoleHostProcess; the low two bits are flags. 0 when this process has no console.
    if (handles.Count < 64 && NtQueryInformationProcess(GetCurrentProcess(), 49, out host, IntPtr.Size, out retLen) == 0) {
      uint hostPid = (uint)((long)host & ~3L);
      if (hostPid != 0 && nameOf.ContainsKey(hostPid)) {
        IntPtr h = OpenProcess(0x00100000, false, hostPid); // SYNCHRONIZE
        if (h != IntPtr.Zero) { handles.Add(h); names.Add("console " + nameOf[hostPid] + " " + hostPid); }
      }
    }
    if (handles.Count == 0) return "";

    IntPtr[] hs = handles.ToArray();
    string[] ns = names.ToArray();
    Thread t = new Thread(delegate () {
      uint r = WaitForMultipleObjects((uint)hs.Length, hs, false, 0xFFFFFFFF);
      if (r >= (uint)hs.Length) return; // the wait failed: KILL_ON_JOB_CLOSE still covers this script ending
      try { Console.Error.WriteLine("[capped] " + ns[r] + " has ended, so its shell is gone; stopping the command."); } catch { }
      TerminateJobObject(job, 1);
    });
    t.IsBackground = true;
    t.Start();
    return string.Join(", ", ns);
  }

  // Returns null when the cap is on, else what failed.
  public static string Cap(ulong bytes) {
    job = CreateJobObject(IntPtr.Zero, null);
    if (job == IntPtr.Zero) return "CreateJobObject failed, Win32 error " + Marshal.GetLastWin32Error();
    EXT e = new EXT();
    e.Basic.LimitFlags = 0x00000200 | 0x00002000; // JOB_MEMORY | KILL_ON_JOB_CLOSE
    e.JobMemoryLimit = (UIntPtr)bytes;
    int len = Marshal.SizeOf(typeof(EXT));
    IntPtr p = Marshal.AllocHGlobal(len);
    try {
      Marshal.StructureToPtr(e, p, false);
      // 9 = JobObjectExtendedLimitInformation
      if (!SetInformationJobObject(job, 9, p, (uint)len)) return "SetInformationJobObject failed, Win32 error " + Marshal.GetLastWin32Error();
    } finally { Marshal.FreeHGlobal(p); }
    if (!AssignProcessToJobObject(job, GetCurrentProcess())) return "AssignProcessToJobObject failed, Win32 error " + Marshal.GetLastWin32Error();
    return null;
  }
}
'@

$err = [GcdJob]::Cap([uint64]($LimitGB * 1GB))
if ($err) {
  [Console]::Error.WriteLine("[capped] could not apply the memory cap ($err); not starting the command uncapped.")
  exit 3
}
[Console]::Error.WriteLine(('[capped] memory cap {0:N1} GB for this command and everything it starts' -f $LimitGB))
$watched = [GcdJob]::WatchShell()
if ($watched) { [Console]::Error.WriteLine("[capped] ends when any of these ends: $watched") }
else { [Console]::Error.WriteLine('[capped] no parent process to watch: it ends with its window, Ctrl+C or a kill') }

$exe = [string]$Command[0]
$rest = @($Command | Select-Object -Skip 1 | ForEach-Object { [string]$_ })
& $exe @rest
$code = $LASTEXITCODE
if ($null -eq $code) { $code = 0 }
if ($code -ne 0) { [Console]::Error.WriteLine("[capped] the command ended with exit code $code") }
exit $code
