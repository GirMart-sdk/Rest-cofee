# Política de Seguridad

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Clasificación](https://img.shields.io/badge/Clasificación-Confidencial-red.svg)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

---

> Este documento resume, en términos generales, la **política de seguridad** de Hostal Cofee:
> compromisos del proyecto, cómo se protege la información y cómo reportar una vulnerabilidad.

---

## 1. Nuestro compromiso

La seguridad es una prioridad en Hostal Cofee. Nos comprometemos a:

- Proteger la información de clientes, usuarios y del sistema.
- Responder a los incidentes de seguridad con rapidez y seriedad.
- Aplicar buenas prácticas de seguridad en todo el ciclo de vida del sistema.
- Mantener la transparencia cuando un incidente afecte a los usuarios.
- Colaborar con las autoridades competentes ante actividad ilegal.

## 2. Cómo protegemos la información

En términos generales:

- **Cuentas y accesos**: contraseñas guardadas de forma segura, límite de intentos fallidos
  y doble factor de autenticación disponible.
- **Sesiones**: sesiones seguras, renovables y revocables.
- **Roles**: cada persona accede únicamente a lo que le corresponde.
- **Datos**: se valida lo que entra al sistema y no se exponen datos sensibles.
- **Comunicaciones**: acceso en producción mediante conexiones seguras (HTTPS).
- **Respaldos**: copias de seguridad cifradas y protegidas.
- **Supervisión**: registro de eventos importantes para detectar incidentes a tiempo.

## 3. Reportar una vulnerabilidad

Usa el **canal único** de reportes. No publiques ni explotes una vulnerabilidad antes de
reportarla.

**Correo:** `security@hostalcofee.com`

En tu reporte incluye, si es posible:

- Qué encontraste y dónde.
- Pasos para reproducirlo.
- El impacto potencial.

### Qué puedes esperar

- Acuse de recibo en el menor tiempo posible.
- Evaluación del reporte y respuesta proporcionada a la gravedad.
- Coordinación de una corrección antes de publicar cualquier detalle.
- Reconocimiento por tu reporte, si así lo deseas.

### Lo que está prohibido

Reportar en canales públicos (issues, redes sociales, chats) o divulgar una vulnerabilidad
antes de que se corrija puede derivar en la **suspensión definitiva** del acceso al proyecto
y en acciones legales.

## 4. Reglas para colaboradores

- **Nunca** compartas credenciales, contraseñas ni claves de acceso.
- No subas al repositorio archivos de configuración con datos sensibles.
- Mantén las dependencias actualizadas y sin vulnerabilidades conocidas.
- Valida la información de entrada y protege los datos de salida.
- Reporta de inmediato cualquier incidente o sospecha.
- Sigue esta política en todo momento.

## 5. Buenas prácticas para usuarios

- Usa contraseñas largas y diferentes en cada servicio.
- Activa la autenticación en dos pasos cuando esté disponible.
- No compartas tus credenciales con nadie.
- Cierra la sesión en dispositivos compartidos.
- No compartas datos sensibles por medios no seguros.

## 6. Ante un incidente

El proyecto responde según la gravedad del incidente:

1. **Contención**: se aísla lo afectado y se revocan accesos comprometidos.
2. **Erradicación**: se identifica la causa, se corrige y se verifica la solución.
3. **Recuperación**: se restauran los servicios y se confirma la integridad de los datos.
4. **Lecciones**: se documenta lo aprendido para prevenir futuros incidentes.

## 7. Contacto

| Propósito                | Correo                               |
| ------------------------ | ------------------------------------ |
| Reportar vulnerabilidad  | `security@hostalcofee.com`           |
| Preguntas de seguridad   | `security-questions@hostalcofee.com` |
| Emergencias de seguridad | `security-emergency@hostalcofee.com` |

## 8. Aceptación

Al usar Hostal Cofee aceptas cumplir esta política: reportar vulnerabilidades por el canal
establecido, no divulgar información de seguridad y someterte a las auditorías que se requieran.

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](LICENSE).
