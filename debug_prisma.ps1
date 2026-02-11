Write-Output "Testing connection with internal .env loading..."
npx prisma db push 2>&1 | Out-File -Encoding UTF8 prisma_log.txt
