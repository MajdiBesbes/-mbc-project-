@echo off
cd /d D:\mbc-project
echo [92m🚀 Démarrage du déploiement...[0m
echo [93m📦 Sauvegarde locale des changements...[0m
xcopy /s /y "src\*" "backups\src\"
echo [93m🧹 Nettoyage des anciennes sauvegardes...[0m
for /f "skip=5 delims=" %%i in ('dir /b /o-d "backups\src\*"') do del "backups\src\%%i"
echo [93m💾 Sauvegarde sur GitHub Desktop...[0m
start "" "C:\Users\%USERNAME%\AppData\Local\GitHubDesktop\GitHubDesktop.exe" "D:\mbc-project"
timeout /t 5 /nobreak
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^a'); [System.Windows.Forms.SendKeys]::SendWait('{ENTER}'); [System.Windows.Forms.SendKeys]::SendWait('{TAB}'); [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')"
timeout /t 5 /nobreak
echo [93m🔨 Construction du projet...[0m
call npm run build
echo [93m🚀 Déploiement sur Netlify...[0m
call netlify deploy --prod --dir=dist
echo [92m✅ Déploiement terminé ![0m
echo [93mLes 5 dernières sauvegardes sont conservées dans le dossier 'backups'[0m
echo [92m🌐 Site déployé : https://mbc-consulting-050525.netlify.app[0m
echo [93m📱 Ouverture du site...[0m
start "" "https://mbc-consulting-050525.netlify.app"
echo [93mAppuyez sur une touche pour fermer...[0m
pause 