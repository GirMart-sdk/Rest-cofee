# TRD — Documento de Requisitos Técnicos

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

---

**Producto:** Hostal Cofee v2

---

## 1. Propósito

Este documento resume, en lenguaje general y sin entrar en detalles de implementación,
**qué es Hostal Cofee** y los requisitos que cumple como sistema. Su objetivo es servir de
guía informativa para entender el producto, su alcance y sus principales características.

---

## 2. El producto

Hostal Cofee es un sistema web completo para la operación de un restaurante: **menú digital,
pedidos, reservas, gestión de mesas, turnos, reportes y pagos**, todo en una sola plataforma.

Está pensado para dos tipos de usuarios:

- **Clientes**, que piden desde su mesa, para llevar o a domicilio.
- **Personal administrativo**, que gestiona el día a día del negocio.

---

## 3. Funcionalidades principales

- Menú digital con filtros y pedidos en línea.
- Carrito de compras con opciones de entrega: en el lugar, para llevar o a domicilio.
- Reservas de mesas y código QR por mesa para pedir desde la mesa.
- Pagos en línea (Wompi) y métodos alternativos (efectivo, Nequi, Daviplata).
- Notificaciones a los clientes por WhatsApp.
- Panel administrativo: pedidos en tiempo real, menú, mesas, turnos, reportes,
  auditoría y pagos.
- Cuentas de usuario con inicio de sesión y autenticación en dos pasos (2FA).

---

## 4. Cómo está construido (resumen)

- **Aplicación en el navegador** (frontend) con interfaz moderna y adaptable a móviles.
- **Servidor de aplicación** (backend) que expone los servicios de la plataforma.
- **Base de datos relacional** que almacena toda la información del sistema.
- **Servicios externos** para pagos en línea y notificaciones por WhatsApp.

Las principales tecnologías son: React y Vite en el frontend, Express con TypeScript en el
backend y PostgreSQL como base de datos.

---

## 5. Requisitos no funcionales

- **Seguridad:** protección de la información, acceso por roles, sesiones seguras y
  buenas prácticas de seguridad en general.
- **Fiabilidad:** operación continua para el servicio diario del restaurante.
- **Mantenibilidad:** código organizado y documentado, con pruebas automatizadas.
- **Usabilidad:** interfaz sencilla y clara tanto para clientes como para el personal.

---

## 6. Usuarios y roles

| Rol         | Qué puede hacer                                                     |
| ----------- | ------------------------------------------------------------------- |
| **Cliente** | Ver el menú, armar pedidos, reservar mesas y realizar pagos         |
| **Admin**   | Gestionar menú, pedidos, mesas, turnos, reportes, auditoría y pagos |

---

## 7. Ambiente de despliegue

El sistema se despliega en servidores propios (entorno Windows) y se accede por internet
mediante un dominio con conexión segura (HTTPS). La guía completa de despliegue está en
[`deploy/README.md`](deploy/README.md).

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](LICENSE).
