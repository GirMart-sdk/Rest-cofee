# Tests E2E (Playwright)

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](../README.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)
![Framework](https://img.shields.io/badge/Framework-Playwright-brightgreen.svg)
![Navegador](https://img.shields.io/badge/Navegador-Chromium-blue.svg)

---

## ¿Qué son?

Las pruebas **E2E (de extremo a extremo)** verifican los flujos principales de Hostal Cofee
tal y como los usaría una persona real, navegando por la aplicación en un navegador real.

Cubren los flujos más importantes del sistema:

- **Inicio** (home).
- **Menú** digital.
- **Inicio de sesión** (autenticación).
- **Carrito** de compras.

También incluyen una opción para **generar capturas de pantalla** de las páginas principales,
que se usan para la documentación del proyecto.

## Requisitos

- Tener el sistema en marcha en **modo desarrollo** (las pruebas no lo inician solas).
- Instalar por única vez el navegador de pruebas y las dependencias de la suite.

## Cómo se ejecutan

Desde la raíz del proyecto, con el sistema corriendo, se ejecuta un único comando para correr
toda la suite. Los resultados se guardan en carpetas de **reportes** del proyecto.

Las **capturas de pantalla para la documentación** se generan solo cuando se pide
explícitamente, mediante su propio comando.

## Notas

- Las pruebas **no crean ni modifican datos** de la aplicación: se basan en contenido estable
  de la interfaz.
- Si el menú está vacío (sin datos iniciales), las pruebas del carrito se omiten de forma
  controlada y no se marcan como fallidas.
- La prueba de inicio de sesión usa un correo ficticio para verificar siempre el flujo de
  error esperado, de forma estable.

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](../LICENSE).
