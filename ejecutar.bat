@echo off
title Rest-Coffee - Ejecucion Completa
cd /d "%~dp0"

echo ============================================
echo  Rest-Coffee - Iniciando todo el proyecto
echo ============================================
echo.

echo [1/4] Instalando dependencias del servidor...
cd hostal-cofre\server
call npm install >nul 2>&1

echo [2/4] Generando Prisma Client...
call npx prisma generate --schema=./prisma/schema.prisma >nul 2>&1

echo [3/4] Iniciando backend (puerto 3001)...
start "Backend" cmd /c "npx tsx src/index.ts"

timeout /t 4 /nobreak >nul

echo [4/4] Iniciando frontend (puerto 5173)...
cd /d "%~dp0hostal-cofre\client"
start "Frontend" cmd /c "npm run dev"

echo.
echo ============================================
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:5173
echo ============================================
echo  Cierra las ventanas para detener.
echo.
pause
