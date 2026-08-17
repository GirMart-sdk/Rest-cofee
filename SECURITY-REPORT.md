# Seguridad — Información del Proyecto

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-blue.svg)
![Datos Cifrados](https://img.shields.io/badge/Datos-Cifrados-green.svg)

---

> Este documento ofrece **información general de seguridad** sobre Hostal Cofee: qué hace el
> proyecto para proteger la información, cómo se gestionan los riesgos y **cómo reportar una
> vulnerabilidad**. No es un informe técnico. La política detallada está en
> [`SECURITY.md`](SECURITY.md).

---

## 1. Compromiso con la seguridad

En Hostal Cofee la seguridad es una prioridad: manejamos información de clientes, pedidos y
pagos, por lo que protegemos los datos y aplicamos buenas prácticas en todo el ciclo de vida
del sistema (diseño, desarrollo, pruebas y operación).

## 2. Cómo protegemos la información

En términos generales:

- **Cuentas y accesos**: contraseñas almacenadas de forma segura, límites de intentos
  fallidos y **doble factor de autenticación (2FA)** opcional.
- **Sesiones**: se usan sesiones seguras que pueden renovarse y revocarse.
- **Roles**: cada usuario solo accede a lo que le corresponde (cliente o administrador).
- **Datos**: se valida lo que entra al sistema y no se exponen datos sensibles.
- **Comunicaciones**: el acceso en producción se realiza por conexiones seguras (HTTPS).
- **Respaldos**: las copias de seguridad de la base de datos se resguardan de forma cifrada.
- **Monitoreo**: el sistema lleva registro de eventos importantes para detectar incidentes.

## 3. Reportar una vulnerabilidad

Si encuentras una falla de seguridad en Hostal Cofee, **no la explotes ni la hagas pública**
sin avisar primero. Reporta de forma responsable a:

- **Correo:** `security@hostalcofee.com`

En tu reporte incluye:

- Qué encontraste y dónde.
- Pasos para reproducirlo (si aplica).
- El impacto potencial.

### Qué puedes esperar

- Acuse de recibo en un plazo razonable.
- Confirmación y evaluación del reporte.
- Coordinación de una corrección antes de publicar los detalles.
- Crédito en el agradecimiento, si así lo deseas.

## 4. Buenas prácticas para colaboradores

- **Nunca** compartas credenciales, contraseñas o claves de acceso.
- No subas archivos de configuración con datos sensibles al repositorio.
- Mantén las dependencias del proyecto actualizadas.
- Reporta de inmediato cualquier incidente o sospecha.
- Sigue la política y las guías de seguridad del proyecto.

## 5. Referencias

- [`SECURITY.md`](SECURITY.md) — política y buenas prácticas de seguridad.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — normas de convivencia del proyecto.

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.
Documento confidencial — prohibida su distribución sin autorización expresa.
Consulte el archivo [LICENSE](LICENSE).
