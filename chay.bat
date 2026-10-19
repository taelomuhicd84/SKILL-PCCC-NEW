@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Một cú bấm: build web nếu chưa có, bật runner (ẩn), mở trình duyệt tại http://127.0.0.1:8787
if not exist web\dist\index.html call npm run build
netstat -ano | findstr "127.0.0.1:8787.*LISTENING" >nul || start "" /min cmd /c "npm run runner"
timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:8787
