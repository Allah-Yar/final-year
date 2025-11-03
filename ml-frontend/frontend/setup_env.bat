@echo off
echo Setting up environment configuration for Pakistani Currency Detection Frontend...
echo.

REM Check if .env file exists
if exist .env (
    echo .env file already exists. Skipping creation.
) else (
    echo Creating .env file from env.example...
    copy env.example .env
    echo .env file created successfully!
)

echo.
echo Environment setup complete!
echo.
echo To customize your API settings, edit the .env file:
echo - VITE_API_URL: Set to your backend URL (default: http://localhost:5000)
echo - VITE_APP_TITLE: Set your application title
echo.
echo Starting development server...
npm run dev
pause
