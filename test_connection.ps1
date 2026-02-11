$server = "db.kklvbnqznoymjncvgkuv.supabase.co"
$log = "connection_test.log"
"Starting Network Test..." | Out-File $log

try {
    $dns = Resolve-DnsName -Name $server -ErrorAction Stop
    "DNS Resolution: Success" | Out-File $log -Append
    $dns | select -ExpandProperty IPAddress | Out-File $log -Append
} catch {
    "DNS Resolution: Failed" | Out-File $log -Append
    $_ | Out-File $log -Append
}

$ports = @(5432, 6543)
foreach ($port in $ports) {
    "Testing Port $port..." | Out-File $log -Append
    try {
        $tcp = Test-NetConnection -ComputerName $server -Port $port -WarningAction SilentlyContinue
        "Port $port Reachable: $($tcp.TcpTestSucceeded)" | Out-File $log -Append
    } catch {
        "Port $port Test Failed" | Out-File $log -Append
    }
}
