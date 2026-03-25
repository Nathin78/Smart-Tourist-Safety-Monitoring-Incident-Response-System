@echo off
REM Smart Tourist Safety Monitoring System - Startup Script
REM This script automates the startup process for developers
REM Runs on Windows

echo.
echo ====================================================
echo  Smart Tourist Safety Monitoring System - Startup
echo ====================================================
echo.

REM Check if Java is installed
echo Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java not installed or not in PATH
    echo Please install Java JDK 11 or higher
    pause
    exit /b 1
)

REM Check if Maven is installed
echo Checking Maven installation...
mvn -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven not installed or not in PATH
    echo Please install Maven
    pause
    exit /b 1
)

REM Check if Node.js is installed
echo Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed or not in PATH
    echo Please install Node.js
    pause
    exit /b 1
)

echo.
echo Prerequisites check passed!
echo.

REM Ask user what to do
echo Select operation:
echo 1. Start both frontend and backend
echo 2. Start backend only
echo 3. Start frontend only
echo 4. Setup database only
echo 5. Build project only
echo 6. Clean and rebuild
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto setup_db
if "%choice%"=="5" goto build
if "%choice%"=="6" goto clean_build

echo Invalid choice
goto end

:start_all
echo.
echo Starting database (MySQL)...
echo Make sure MySQL is running on localhost:3306
echo.
timeout /t 2

echo.
echo Starting backend on port 8081...
echo Navigate to: http://localhost:8081
echo.
cd backend
start "Backend - Spring Boot" cmd /k mvn spring-boot:run
timeout /t 5

echo.
echo Starting frontend on port 3000...
echo Navigate to: http://localhost:3000
echo.
cd ..\frontend
start "Frontend - React" cmd /k npm start

echo.
echo Both servers started in separate windows
echo Backend: http://localhost:8081
echo Frontend: http://localhost:3000
echo.
echo Demo credentials:
echo Email: admin@touristsafety.com
echo Password: admin123
echo.
goto end

:start_backend
echo.
echo Verifying backend setup...
cd backend

if not exist target (
    echo Building backend...
    call mvn -DskipTests package
)

echo.
echo Starting backend server on port 8081...
echo Navigate to: http://localhost:8081
echo.
start "Backend - Spring Boot" cmd /k mvn spring-boot:run
timeout /t 3
goto end

:start_frontend
echo.
echo Verifying frontend setup...
cd frontend

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend server on port 3000...
echo Navigate to: http://localhost:3000
echo.
start "Frontend - React" cmd /k npm start
timeout /t 3
goto end

:setup_db
echo.
echo Setting up MySQL database...
echo.
echo Please ensure MySQL is running
echo Starting MySQL command...
echo.

REM Prompt for MySQL password
set /p mysql_user="MySQL username (default: root): "
if "%mysql_user%"=="" set mysql_user=root

mysql -u %mysql_user% -p -e "CREATE DATABASE IF NOT EXISTS tourist_safety;"
if %errorlevel% equ 0 (
    echo.
    echo Importing schema...
    mysql -u %mysql_user% -p tourist_safety < database\schema.sql
    if %errorlevel% equ 0 (
        echo.
        echo Database setup successful!
    ) else (
        echo Database import failed
    )
) else (
    echo MySQL connection failed
    echo Make sure MySQL is running and credentials are correct
)

goto end

:build
echo.
echo Building project...
echo.

cd backend
echo Building backend...
call mvn clean install
if %errorlevel% neq 0 (
    echo Backend build failed
    goto end
)

cd ..\frontend
echo Building frontend...
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed
    goto end
)

echo.
echo Build completed successfully!
echo.
goto end

:clean_build
echo.
echo Cleaning project...
echo.

cd backend
echo Cleaning backend...
call mvn clean

cd ..\frontend
echo Cleaning frontend...
RD /S /Q node_modules 2>nul
RD /S /Q build 2>nul

echo Clean completed!
echo.
echo Rebuilding...
cd backend
call mvn clean install

cd ..\frontend
call npm install
call npm run build

echo.
echo Rebuild completed successfully!
echo.
goto end

:end
cd "%cd%"
echo.
pause

