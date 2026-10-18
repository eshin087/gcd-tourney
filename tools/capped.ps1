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
using System.Runtime.InteropServices;

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

  // Kept open for the life of this process: closing it (at exit) is what ends the job's processes.
  static IntPtr job;

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

$exe = [string]$Command[0]
$rest = @($Command | Select-Object -Skip 1 | ForEach-Object { [string]$_ })
& $exe @rest
$code = $LASTEXITCODE
if ($null -eq $code) { $code = 0 }
if ($code -ne 0) { [Console]::Error.WriteLine("[capped] the command ended with exit code $code") }
exit $code
