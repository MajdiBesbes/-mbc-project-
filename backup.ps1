# Script de sauvegarde pour MBC Consulting
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupDir = "backups"
$backupName = "mbc-backup-$date"

# Créer le dossier de sauvegarde s'il n'existe pas
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Créer l'archive
Compress-Archive -Path "src", "public", "index.html", "package.json", "vite.config.ts", "tsconfig.json", "netlify.toml" -DestinationPath "$backupDir/$backupName.zip"

Write-Host "Sauvegarde créée avec succès : $backupDir/$backupName.zip" 