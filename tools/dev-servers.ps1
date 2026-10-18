<#
.SYNOPSIS
  Lists the dev servers running now, and how close the machine is to running out of memory (OPS-019).

.DESCRIPTION
  Read-only: it prints and changes nothing. A "dev server" here is a node, bun, deno, python, wrangler or workerd
  process that is listening on a TCP port, which is what a Vite, Next or Wrangler server looks like. For each it
  shows the ports, its age, committed memory, how many browser connections it has, and the folder it serves when
  that can be told (from its command line or its helpers').

  Flags:
    - "no browser connected" and older than -IdleHours: probably forgotten. Check, then stop it yourself with
      Stop-Process -Id <PID>.
    - committed memory above -HighGB: a leak is likely.
  The header line is the machine's committed memory against its limit (RAM plus pagefile). Near 100% Windows
  starts refusing memory to every program; that is what a runaway server caused on 2026-10-17.

  Windows cannot show a process's working folder, so a server started with a relative path
  (node_modules/vite/bin/vite.js) is named by its helpers' paths when it has any.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File tools/dev-servers.ps1
#>
param(
  [double]$IdleHours = 1,
  [double]$HighGB = 2
)

$os = Get-CimInstance Win32_OperatingSystem
$limitGB = $os.TotalVirtualMemorySize / 1MB                              # KB -> GB
$usedGB = ($os.TotalVirtualMemorySize - $os.FreeVirtualMemory) / 1MB
$pct = 100 * $usedGB / $limitGB
$line = 'Committed memory: {0:N1} of {1:N1} GB ({2:N0}%)' -f $usedGB, $limitGB, $pct
if ($pct -ge 85) { $line += '   <-- WARNING: close to the limit; see the biggest process below' }
Write-Output $line

$big = Get-Process | Sort-Object PrivateMemorySize64 -Descending | Select-Object -First 1
Write-Output ('Biggest process:  {0} (PID {1}), {2:N1} GB committed' -f $big.ProcessName, $big.Id, ($big.PrivateMemorySize64 / 1GB))
Write-Output ''

$procs = Get-CimInstance Win32_Process
$tcp = @(Get-NetTCPConnection -ErrorAction SilentlyContinue)
$listeners = $tcp | Where-Object State -eq 'Listen' | Group-Object OwningProcess

function Get-Folder([string]$cmd) {
  if ($cmd -match '([A-Za-z]:\\[^"]*?)\\node_modules') { return $Matches[1] }
  return $null
}

$found = 0
foreach ($g in ($listeners | Sort-Object { [int]$_.Name })) {
  $id = [int]$g.Name
  $p = $procs | Where-Object ProcessId -eq $id
  if (-not $p -or $p.Name -notmatch '^(node|bun|deno|python|wrangler|workerd)') { continue }
  $found++
  $ports = @($g.Group.LocalPort | Sort-Object -Unique)
  $clients = @($tcp | Where-Object { $_.State -eq 'Established' -and $ports -contains $_.LocalPort -and $_.LocalAddress -match '^(127\.|::1)' }).Count
  $gp = Get-Process -Id $id -ErrorAction SilentlyContinue
  $commitMB = 0
  if ($gp) { $commitMB = [math]::Round($gp.PrivateMemorySize64 / 1MB) }
  $ageH = [math]::Round(((Get-Date) - $p.CreationDate).TotalHours, 1)
  $cmd = [string]$p.CommandLine

  $folder = Get-Folder $cmd
  if (-not $folder) {
    foreach ($k in ($procs | Where-Object ParentProcessId -eq $id)) {
      $folder = Get-Folder ([string]$k.CommandLine)
      if ($folder) { break }
    }
  }

  Write-Output ('PID {0}   ports {1}   age {2} h   committed {3} MB   browser connections {4}' -f $id, ($ports -join ','), $ageH, $commitMB, $clients)
  Write-Output ('  ' + $cmd.Substring(0, [math]::Min(150, $cmd.Length)))
  if ($folder) { Write-Output ('  folder: ' + $folder) }
  if ($clients -eq 0 -and $ageH -ge $IdleHours) { Write-Output ('  note: no browser connected and {0} h old: probably forgotten' -f $ageH) }
  if ($commitMB -ge ($HighGB * 1024)) { Write-Output ('  note: committed memory is high ({0:N1} GB): a leak is likely' -f ($commitMB / 1024)) }
  Write-Output ''
}
if ($found -eq 0) { Write-Output 'No dev servers are listening.' }
