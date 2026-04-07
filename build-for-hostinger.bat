@echo off
echo ===================================================
echo   TechBay - Hostinger Deployment Automatic Packager
echo ===================================================
echo.

echo [1/5] Building the Next.js project...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed! Please check the terminal errors.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Preparing deployment folder...
if exist hostinger_ready rmdir /s /q hostinger_ready
mkdir hostinger_ready

echo.
echo [3/5] Copying standalone core files...
xcopy /E /I /H /Y .next\standalone hostinger_ready\ >nul

echo [4/5] Organizing static and public assets for Next.js...
mkdir hostinger_ready\.next\static
xcopy /E /I /H /Y .next\static hostinger_ready\.next\static\ >nul

mkdir hostinger_ready\public
xcopy /E /I /H /Y public hostinger_ready\public\ >nul

if exist .env (
    copy .env hostinger_ready\.env >nul
)

if exist .env.local (
    copy .env.local hostinger_ready\.env >nul
)

copy server.js hostinger_ready\server.js >nul

echo.
echo [5/5] Creating a single ZIP file for Hostinger...
if exist techbay-hostinger.zip del techbay-hostinger.zip
powershell Compress-Archive -Path 'hostinger_ready\*' -DestinationPath 'techbay-hostinger.zip' -Force

echo.
echo Cleaning up temporary files...
rmdir /s /q hostinger_ready

echo ===================================================
echo SUCCESS! 
echo A file named "techbay-hostinger.zip" has been created.
echo.
echo WHAT TO DO NEXT:
echo 1. Go to Hostinger File Manager.
echo 2. Upload "techbay-hostinger.zip" inside your public_html folder.
echo 3. Right-click the zip and choose "Extract".
echo 4. Go to Hostinger Node.js section, choose server.js as the startup file and click Start.
echo ===================================================
pause
