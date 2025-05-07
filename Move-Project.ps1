# Créer le nouveau répertoire s'il n'existe pas
New-Item -ItemType Directory -Force -Path "D:\mbc-project"

# Copier tous les fichiers du projet
Copy-Item -Path "D:\OneDrive\Bureau\mbc-vrai\*" -Destination "D:\mbc-project" -Recurse -Force

# Supprimer l'ancien raccourci s'il existe
Remove-Item -Path "$env:USERPROFILE\Desktop\MBC Project.lnk" -Force -ErrorAction SilentlyContinue

# Créer le nouveau raccourci
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\MBC Project.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoExit -Command `"cd 'D:\mbc-project'; npm run dev`""
$Shortcut.WorkingDirectory = "D:\mbc-project"
$Shortcut.IconLocation = "C:\Program Files\nodejs\node.exe"
$Shortcut.Save()

Write-Host "Projet déplacé avec succès vers D:\mbc-project"
Write-Host "Nouveau raccourci créé sur le bureau" 