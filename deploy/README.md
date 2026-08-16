# Hostal Cofee - Guia de Despliegue en Produccion (Windows)

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](../README.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)
![Plataforma](https://img.shields.io/badge/Plataforma-Windows-blue.svg)
![Proxy](https://img.shields.io/badge/HTTPS-Caddy%20%2B%20Let's%20Encrypt-brightgreen.svg)
![Servicio](<https://img.shields.io/badge/Servicio-NSSM%20(Node)-blue.svg>)

---

> **Resumen**: en produccion todo el sistema corre como **un solo proceso Node**
> (`node dist/index.js`) iniciado como **servicio de Windows** con NSSM. Ese mismo
> proceso sirve la API (`/api/*`) y el frontend compilado (`hostal-cofre/client/dist`).
> Delante se coloca **Caddy** para HTTPS automatico. Scripts de despliegue,
> backups diarios y monitor de salud en esta carpeta `deploy/`.

Guia paso a paso para poner el sistema **Hostal Cofee** en produccion
sobre Windows Server / Windows 10/11 usando la carpeta `deploy/`.

```
Cliente (navegador)
    |
    | https://tu-dominio.com  (puertos 80/443)
    v
Caddy (reverse proxy + HTTPS automatico)
    |
    | http://localhost:3001
    v
Servicio Windows "HostalCofee" (NSSM -> node dist/index.js)
    |
    v
PostgreSQL (base de datos hostal_cofee)
```

---

## 1. Prerrequisitos

| Componente | Version                                | Donde obtenerlo                              |
| ---------- | -------------------------------------- | -------------------------------------------- |
| Node.js    | 18 o superior (recomendado: 20/22 LTS) | https://nodejs.org                           |
| PostgreSQL | 14 o superior                          | https://www.postgresql.org/download/windows/ |
| NSSM       | ultima version (win64)                 | https://nssm.cc/download                     |
| Caddy      | ultima version                         | https://caddyserver.com/download             |
| Git        | opcional                               | https://git-scm.com                          |

Pasos de instalacion:

1. Instala Node.js con el instalador de Windows (marca "Add to PATH").
2. Instala PostgreSQL. Anota la contrasena del superusuario `postgres`.
3. Agrega la carpeta de herramientas de PostgreSQL al **PATH del sistema**:
   - `Panel de control > Sistema > Configuracion avanzada del sistema >
Variables de entorno > Path > Editar`
   - Agrega `C:\Program Files\PostgreSQL\17\bin` (ajusta el numero de
     version). Esto habilita `psql`, `pg_dump` y `pg_restore`.
   - Cierra y abre la terminal para que el PATH se actualice.
4. Descarga NSSM de https://nssm.cc/download, descomprime la version
   win64 y coloca `nssm.exe` en una carpeta del PATH (por ejemplo
   `C:\Windows\System32`) o pasale su ruta al script con `-NssmPath`.
5. Descarga Caddy desde https://caddyserver.com/download y guarda
   `caddy.exe` en `C:\Caddy\` junto con el archivo `deploy\Caddyfile`.

---

## 2. Firewall de Windows

Abre los puertos usados por la aplicacion:

```powershell
# Como Administrador:
New-NetFirewallRule -DisplayName "HostalCofee HTTP"  -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow
New-NetFirewallRule -DisplayName "HostalCofee HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

- El puerto **3001** (API interna) NO debe abrirse al exterior: solo Caddy
  se conecta a el desde `localhost`.
- Para probar la API antes de configurar HTTPS puedes abrir el 3001 de
  forma temporal y cerrarlo despues.

---

## 3. Configuracion de la base de datos

1. Inicia el servicio de PostgreSQL (`services.msc` -> `postgresql-x64-XX`).
2. Crea la base de datos y un usuario dedicado:

```sql
CREATE USER hostal_cofee_user WITH PASSWORD 'CLAVE_SEGURA';
CREATE DATABASE hostal_cofee OWNER hostal_cofee_user;
GRANT ALL PRIVILEGES ON DATABASE hostal_cofee TO hostal_cofee_user;
```

3. Si usas el usuario `postgres` directamente (recomendado para
   despliegues pequenos), la base de datos se crea igual:

```sql
CREATE DATABASE hostal_cofee;
```

4. Verifica la conexion:

```powershell
psql -U postgres -d hostal_cofee -c "SELECT 1;"
```

La `DATABASE_URL` correspondiente tendra este formato:

```
postgresql://USUARIO:CLAVE@localhost:5432/hostal_cofee?schema=public
```

---

## 4. Variables de entorno (`.env`)

El despliegue necesita `hostal-cofre/server/.env`. Si no existe,
`deploy.ps1` lo crea copiando `deploy\.env.production.example` y te
avisa para que lo edites. El script **aborta** si `JWT_SECRET` es menor
de 32 caracteres o sigue siendo el placeholder.

### Tabla de variables

| Variable                           | Que hace                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                         | `production`: sirve el frontend compilado y valida JWT en modo estricto.                                                                          |
| `PORT`                             | Puerto del proceso Node (3001).                                                                                                                   |
| `LOG_LEVEL`                        | Nivel de log del servidor (`info`, `debug`, `warn`, `error`).                                                                                     |
| `DATABASE_URL`                     | Cadena de conexion a PostgreSQL (formato `postgresql://...`).                                                                                     |
| `JWT_SECRET`                       | Secreto para firmar tokens. Minimo 32 caracteres, unico. Generalo con `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`. |
| `JWT_EXPIRES_IN`                   | Duracion del token de acceso (15m).                                                                                                               |
| `JWT_REFRESH_EXPIRES_IN`           | Duracion del token de refresco (7d).                                                                                                              |
| `CORS_ORIGIN`                      | Origen permitido por CORS. En produccion debe ser `https://tu-dominio.com`.                                                                       |
| `WOMPI_MODE`                       | `sandbox` (pruebas) o `production` (pagos reales).                                                                                                |
| `WOMPI_PUBLIC_KEY`                 | Llave publica de Wompi (va en el frontend).                                                                                                       |
| `WOMPI_PRIVATE_KEY`                | Llave privada de Wompi (solo servidor, nunca exponer).                                                                                            |
| `WOMPI_BASE_URL`                   | Opcional; sobreescribe la URL base de Wompi.                                                                                                      |
| `WHATSAPP_PHONE`                   | Numero del restaurante para enlaces deep link `wa.me`.                                                                                            |
| `WHATSAPP_API_TOKEN`               | Token permanente de la API de WhatsApp Business (opcional).                                                                                       |
| `WHATSAPP_PHONE_NUMBER_ID`         | ID del numero de telefono en Meta (opcional).                                                                                                     |
| `WHATSAPP_BUSINESS_ACCOUNT_ID`     | ID de la cuenta de negocio de WhatsApp (opcional).                                                                                                |
| `LOCKOUT_MAX_ATTEMPTS`             | Intentos de login fallidos antes de bloquear (5).                                                                                                 |
| `LOCKOUT_WINDOW_MS`                | Ventana de tiempo de los intentos en milisegundos (900000 = 15 min).                                                                              |
| `LOCKOUT_DURATION_MS`              | Duracion del bloqueo en milisegundos (900000 = 15 min).                                                                                           |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`   | Credenciales del usuario admin creadas por el seed.                                                                                               |
| `CLIENT_EMAIL` / `CLIENT_PASSWORD` | Credenciales del usuario demo creadas por el seed.                                                                                                |

### Wompi en produccion

- Entra a tu panel de **Wompi** (https://wompi.co) y configura tu comercio.
- En la seccion de llaves encontraras:
  - **Llave publica** (`pub_prod_...`): identificador publico del comercio.
  - **Llave privada** (`priv_...`): firma las transacciones; se usa solo
    en el servidor.
- Coloca `WOMPI_MODE=production` y las dos llaves en `.env`.
- En produccion Wompi usa la URL base `https://production.wompi.co/v1`
  (si dejas `WOMPI_BASE_URL` vacia se usa automaticamente).

### WhatsApp Business API (opcional)

- Registrate en **Meta for Developers** (https://developers.facebook.com)
  y crea una app tipo _Business_.
- Conecta tu numero de WhatsApp con la plataforma **WhatsApp Business API**
  (https://business.whatsapp.com). Alli obtienes:
  - `WHATSAPP_BUSINESS_ACCOUNT_ID`: ID de la cuenta de negocio.
  - `WHATSAPP_PHONE_NUMBER_ID`: ID del numero registrado.
  - `WHATSAPP_API_TOKEN`: token de acceso permanente de la API.
- Dejar estos valores vacios mantiene el comportamiento actual:
  enlaces `wa.me` al `WHATSAPP_PHONE`.

---

## 5. Despliegue automatico (`deploy.ps1`)

Ejecuta como **Administrador**:

```powershell
powershell -ExecutionPolicy Bypass -File D:\Rest-COFEE\deploy\deploy.ps1
```

Lo que hace, en orden:

1. Verifica que existan `node`, `npm`, `psql` y `nssm` (con instrucciones
   si falta alguno). Acepta `-NssmPath C:\ruta\nssm.exe`.
2. Detecta la raiz del proyecto (`D:\Rest-COFEE`).
3. Crea `hostal-cofre/server/.env` desde la plantilla de produccion si no
   existe y valida `JWT_SECRET` (mas de 32 caracteres y no placeholder).
4. Ejecuta `npm ci` en servidor y cliente.
5. Genera el cliente de Prisma y compila con `npm run build` (server `tsc`
   - client `vite build`).
6. Aplica las migraciones con `npx prisma migrate deploy`.
7. Si el menu esta vacio, ejecuta `npm run db:seed`.
8. Instala el servicio `HostalCofee` con NSSM (lo detiene y reinstala si
   ya existe): `node.exe dist/index.js`, directorio
   `hostal-cofre/server`, logs rotados cada 10 MB, entorno
   `NODE_ENV=production` y `PORT=3001`, arranque automatico y reinicio
   en caso de caida.
9. Inicia el servicio y espera hasta 30 segundos a que
   `http://localhost:3001/api/health` devuelva `{"status":"ok"}`.
10. Imprime un resumen con los siguientes pasos.

Opciones utiles:

```powershell
# Si nssm.exe no esta en el PATH:
powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1 -NssmPath "C:\herramientas\nssm.exe"

# Para no sembrar datos de prueba:
powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1 -SkipSeed
```

Tambien puedes lanzar el despliegue desde la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1 -Production
```

> Nota: el despliegue detiene el servicio antes de instalar dependencias
> para evitar bloqueos de archivos en Windows. Si el despliegue falla a
> mitad, corrige el error y vuelve a ejecutar `deploy.ps1`.

---

## 6. Verificacion

```powershell
# El servicio debe estar "Running":
Get-Service HostalCofee

# La API debe responder:
Invoke-RestMethod http://localhost:3001/api/health
# => status: ok

# Estado del proceso (node.exe debe correr bajo el servicio):
Get-Process node
```

---

## 7. HTTPS con Caddy

1. Apunta un registro **DNS tipo A** de tu dominio al IP publico del
   servidor (y `www` si lo usas).
2. Copia `deploy\Caddyfile` a `C:\Caddy\Caddyfile`.
3. Edita `Caddyfile` y reemplaza `yourdomain.com` por tu dominio real.
4. Verifica la configuracion:

```powershell
cd C:\Caddy
caddy validate --config Caddyfile
```

5. Ejecuta Caddy como **servicio de Windows**:

```powershell
sc create Caddy binPath= "C:\Caddy\caddy.exe run --config C:\Caddy\Caddyfile" start= auto
sc start Caddy
```

Caddy obtiene el certificado de Let's Encrypt automaticamente, renueva el
certificado solo y redirige HTTP a HTTPS. El `Caddyfile` incluido aplica:
`reverse_proxy localhost:3001`, compresion gzip y cabeceras de seguridad
(HSTS, nosniff, frame denial, referrer-policy).

---

## 8. Programador de tareas

### Backup diario de la base de datos

Abre el **Programador de tareas** y crea una tarea:

- **General**: ejecutar con maximos privilegios.
- **Desencadenadores**: cada dia, por ejemplo a las 03:00.
- **Accion** (iniciar un programa):
  - Programa: `powershell.exe`
  - Argumentos:
    ```
    -NoProfile -ExecutionPolicy Bypass -File "D:\Rest-COFEE\deploy\backup-db.ps1"
    ```
  - Directorio inicial: `D:\Rest-COFEE`

Los backups quedan en `D:\Rest-COFEE\backups\hostal_cofee_AAAAAMMDD_HHMMSS.dump`
y se conservan los ultimos 14 (ajustable con `-RetentionCount`).

### Monitor automatico

Crea otra tarea:

- **General**: ejecutar con maximos privilegios (necesario para reiniciar
  el servicio con `Restart-Service`).
- **Desencadenadores**: al iniciar el equipo (o al iniciar sesion).
- **Accion**:
  - Programa: `powershell.exe`
  - Argumentos:
    ```
    -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "D:\Rest-COFEE\deploy\monitor.ps1"
    ```
  - Directorio inicial: `D:\Rest-COFEE`

El monitor consulta `http://localhost:3001/api/health` cada 30 segundos y,
si falla 3 veces seguidas, reinicia el servicio `HostalCofee`. Todo queda
registrado en `D:\Rest-COFEE\logs\monitor.log`.

---

## 9. Ubicacion de los logs

| Archivo                             | Contenido                                           |
| ----------------------------------- | --------------------------------------------------- |
| `D:\Rest-COFEE\logs\server-out.log` | Salida estandar del servicio Node (rotado a 10 MB). |
| `D:\Rest-COFEE\logs\server-err.log` | Errores del servicio Node (rotado a 10 MB).         |
| `D:\Rest-COFEE\logs\monitor.log`    | Eventos del monitor (fallos, reinicios).            |
| `D:\Rest-COFEE\logs\backup.log`     | Resultado de cada backup y restauracion.            |

---

## 10. Solucion de problemas

| Sintoma                                             | Causa probable                                      | Solucion                                                                                                                          |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| "Puerto 3001 en uso" / `EADDRINUSE` al iniciar      | Hay otro proceso en el puerto                       | `netstat -ano                                                                                                                     | findstr :3001`, identifica el PID con `tasklist`y finalizalo, o cambia`PORT`en`.env` (y en Caddy). |
| El servicio no inicia / `Estado: Detenido`          | Error al arrancar Node                              | Mira `logs\server-err.log`; ejecuta `node dist/index.js` a mano dentro de `hostal-cofre/server` para ver el error exacto.         |
| `ECONNREFUSED` / "Base de datos no disponible"      | PostgreSQL caido o credenciales mal                 | `services.msc` -> inicia `postgresql-x64-XX`; verifica `DATABASE_URL` y prueba `psql -U postgres -d hostal_cofee -c "SELECT 1;"`. |
| "JWT_SECRET demasiado corto" / el despliegue aborta | El `.env` copiado no se edito                       | Genera un secreto con `node -e "..."` y pegalo en `JWT_SECRET` de `hostal-cofre/server/.env`; vuelve a ejecutar `deploy.ps1`.     |
| `502 Bad Gateway` desde Caddy                       | Caddy no llega al servicio                          | Verifica que el servicio `HostalCofee` este corriendo y que `http://localhost:3001/api/health` responda.                          |
| El sitio carga en HTTP pero no en HTTPS             | Certificado no emitido / DNS sin propagar           | Verifica el registro DNS A, los puertos 80 y 443 abiertos en el firewall y `caddy validate`.                                      |
| El seed no crea usuarios                            | `ADMIN_PASSWORD`/`CLIENT_PASSWORD` vacias en `.env` | Completa las variables en `.env` y ejecuta `npm run db:seed` dentro de `hostal-cofre/server`.                                     |
| El frontend muestra errores de CORS                 | `CORS_ORIGIN` no coincide con el dominio            | Pon `CORS_ORIGIN=https://tu-dominio.com` (sin barra final).                                                                       |

---

## 11. Rollback de una version

Antes de cada despliegue puedes conservar la version anterior para poder
volver atras:

```powershell
# 1. Detener el servicio (solo durante el cambio):
Stop-Service HostalCofee

# 2. Resguardar la version actual:
Rename-Item D:\Rest-COFEE\hostal-cofre\client\dist D:\Rest-COFEE\hostal-cofre\client\dist-backup-AAAAMMDD
Copy-Item D:\Rest-COFEE\hostal-cofre\server\dist D:\Rest-COFEE\hostal-cofre\server\dist-backup-AAAAMMDD -Recurse

# 3. Desplegar la nueva version (deploy.ps1) y verificar /api/health.

# 4. Para volver atras:
Stop-Service HostalCofee
Remove-Item D:\Rest-COFEE\hostal-cofre\client\dist -Recurse -Force
Rename-Item D:\Rest-COFEE\hostal-cofre\client\dist-backup-AAAAMMDD D:\Rest-COFEE\hostal-cofre\client\dist
Remove-Item D:\Rest-COFEE\hostal-cofre\server\dist -Recurse -Force
Rename-Item D:\Rest-COFEE\hostal-cofre\server\dist-backup-AAAAMMDD D:\Rest-COFEE\hostal-cofre\server\dist
Start-Service HostalCofee
```

Si ademas se cambiaron datos de la base de datos, restaura el backup
anterior antes de iniciar el servicio:

```powershell
powershell -ExecutionPolicy Bypass -File D:\Rest-COFEE\deploy\restore-db.ps1 -BackupFile D:\Rest-COFEE\backups\hostal_cofee_AAAAMMDD_HHMMSS.dump
```

---

## 12. Reinicio con poca interrupcion

NSSM reinicia el servicio en menos de un segundo, y Node arranca rapido,
por lo que una caida tipica de despliegue es de unos segundos:

```powershell
Restart-Service HostalCofee
```

Pasos recomendados para actualizar en caliente:

1. Ejecuta `deploy\backup-db.ps1` (copia de seguridad previa).
2. Deten el servicio con `Stop-Service HostalCofee`.
3. Copia el codigo nuevo a `D:\Rest-COFEE` (git pull o reemplazo de
   archivos) sin borrar `hostal-cofre/server/.env`.
4. Ejecuta `deploy\deploy.ps1` (recompila, migra y reinicia el servicio)
   o, si solo cambio el frontend, `deploy.ps1 -SkipSeed` no es necesario:
   el seed solo corre si el menu esta vacio.
5. Verifica `Invoke-RestMethod http://localhost:3001/api/health`.

---

## 13. Scripts incluidos en `deploy/`

| Script                    | Funcion                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `deploy.ps1`              | Despliegue completo (dependencias, build, migraciones, seed, servicio NSSM, health check). |
| `uninstall-service.ps1`   | Detiene y elimina el servicio `HostalCofee`.                                               |
| `backup-db.ps1`           | `pg_dump` diario con retencion (por defecto 14 backups).                                   |
| `restore-db.ps1`          | `pg_restore` desde un `.dump` (pide confirmacion).                                         |
| `monitor.ps1`             | Monitor de salud que reinicia el servicio si falla 3 veces seguidas.                       |
| `Caddyfile`               | Configuracion de Caddy para HTTPS automatico.                                              |
| `.env.production.example` | Plantilla de variables de entorno de produccion.                                           |

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](../LICENSE).
