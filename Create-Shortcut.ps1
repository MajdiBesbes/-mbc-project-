$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\MBC Project.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoExit -Command `"cd 'D:\mbc-project'; npm run dev`""
$Shortcut.WorkingDirectory = "D:\mbc-project"
$Shortcut.IconLocation = "C:\Program Files\nodejs\node.exe"
$Shortcut.Save() 