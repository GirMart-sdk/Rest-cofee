# Política de Privacidad

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Tipo](https://img.shields.io/badge/Tipo-Documento%20Legal-yellow.svg)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)
![Venta de Datos](https://img.shields.io/badge/Venta%20de%20Datos-Nunca-red.svg)
![Derechos del Usuario](https://img.shields.io/badge/Derechos-Garantizados-blue.svg)
![Datos Cifrados](https://img.shields.io/badge/Datos-Cifrados-green.svg)

---

**Última actualización**: 08 de agosto de 2026

## 0. Resumen — Lo esencial

> - **Nunca vendemos tus datos personales a terceros.**
> - **Qué recopilamos**: datos de cuenta (nombre, email, contraseña hasheada con bcrypt), pedidos, reservas y datos de uso.
> - **Pagos**: procesados por terceros (Wompi); **no almacenamos datos de tarjetas**.
> - **Seguridad**: cifrado en tránsito (HTTPS/TLS), contraseñas con bcrypt, acceso por menor privilegio.
> - **Tus derechos**: acceder, rectificar, eliminar, portabilidad, oponerse y retirar consentimiento (`privacy@hostalcofee.com`, respuesta en 30 días).

---

## 1. Introducción

Hostal Cofee ("nosotros", "nuestro") opera la plataforma Hostal Cofee (el "Servicio"). Esta Política de Privacidad informa sobre nuestras políticas relacionadas con la recopilación, uso y divulgación de información personal cuando utiliza nuestro Servicio.

Al utilizar el Servicio, usted acepta la recopilación y uso de información de acuerdo con esta política.

---

## 2. Información que Recopilamos

### 2.1 Información de Cuenta

Cuando crea una cuenta, recopilamos:

- Nombre completo
- Dirección de correo electrónico
- Número de teléfono (opcional)
- Contraseña (almacenada de forma hasheada con bcrypt)

### 2.2 Información de Pedidos

Cuando realiza un pedido, recopilamos:

- Dirección de entrega
- Método de pago (procesado por terceros)
- Historial de pedidos
- Notas especiales (alergias, preferencias)

### 2.3 Información de Reservas

Cuando realiza una reserva, recopilamos:

- Fecha y hora de la reserva
- Número de comensales
- Solicitudes especiales
- Nombre de contacto

### 2.4 Información de Uso

Recopilamos automáticamente:

- Dirección IP
- Tipo de navegador
- Sistema operativo
- Páginas visitadas
- Tiempo de permanencia
- Errores experimentados

---

## 3. Cómo Usamos su Información

### 3.1 Para Prestar el Servicio

- Procesar y entregar pedidos
- Gestionar reservas de mesas
- Enviar confirmaciones y actualizaciones
- Procesar pagos a través de terceros (Wompi)

### 3.2 Para Mejorar el Servicio

- Analizar patrones de uso
- Desarrollar nuevas funcionalidades
- Diagnosticar problemas técnicos
- Optimizar el rendimiento

### 3.3 Para Comunicaciones

- Enviar confirmaciones de pedidos/reservas
- Notificar cambios en el estado de pedidos
- Enviar actualizaciones importantes del servicio
- Responder a consultas de soporte

### 3.4 Para Seguridad

- Prevenir fraude y abusos
- Autenticar usuarios
- Detectar actividad sospechosa
- Cumplir con obligaciones legales

---

## 4. Base Legal para el Procesamiento

Procesamos su información personal bajo las siguientes bases legales:

- **Ejecución de contrato**: Para proporcionar el Servicio solicitado
- **Consentimiento**: Para comunicaciones de marketing (opcional)
- **Interés legítimo**: Para mejorar el Servicio y prevenir fraude
- **Obligación legal**: Para cumplir con requisitos regulatorios

---

## 5. Compartir Información

### 5.1 Terceros que Proporcionan Servicios

Compartimos información con:

| Tercer Servicio | Propósito                 | Información Compartida        |
| --------------- | ------------------------- | ----------------------------- |
| **Wompi**       | Procesamiento de pagos    | Datos de transacción          |
| **PostgreSQL**  | Almacenamiento de datos   | Todos los datos de cuenta     |
| **WhatsApp**    | Comunicación con clientes | Número de teléfono (opcional) |

### 5.2 No Vendemos Datos

**Nunca** vendemos su información personal a terceros.

### 5.3 Requisitos Legales

Podemos divulgar información si es requerido por ley o en respuesta a solicitudes válidas de autoridades públicas.

---

## 6. Seguridad de Datos

Implementamos medidas de seguridad técnicas y organizativas:

- **Cifrado**: Contraseñas hasheadas con bcrypt (12 rounds)
- **Transporte**: HTTPS/TLS para todas las comunicaciones
- **Almacenamiento**: PostgreSQL con acceso restringido
- **Autenticación**: JWT con expiración y rotación de tokens
- **Acceso**: Principio de menor privilegio
- **Auditoría**: Logs de actividad del sistema

---

## 7. Retención de Datos

Retenemos su información personal solo mientras sea necesario:

| Tipo de Dato         | Período de Retención             |
| -------------------- | -------------------------------- |
| Cuenta de usuario    | Mientras la cuenta esté activa   |
| Historial de pedidos | 5 años (requerimientos fiscales) |
| Reservas             | 2 años                           |
| Logs de seguridad    | 1 año                            |
| Cookies de sesión    | Hasta cerrar sesión              |

Cuando eliminamos datos, lo hacemos de forma segura e irreversible.

---

## 8. Sus Derechos

Usted tiene derecho a:

- **Acceder**: Obtener una copia de sus datos personales
- **Rectificar**: Corregir datos inexactos
- **Eliminar**: Solicitar la eliminación de sus datos
- **Portabilidad**: Recibir sus datos en formato estructurado
- **Oponerse**: Oponerse al procesamiento de sus datos
- **Restringir**: Solicitar la restricción del procesamiento
- **Retirar consentimiento**: Retirar el consentimiento en cualquier momento

### Ejercer sus Derechos

Para ejercer estos derechos, contáctenos a través de:

- **Email**: privacy@hostalcofee.com
- **Asunto**: [Privacy Request] Tipo de solicitud

Responderemos a su solicitud dentro de 30 días.

---

## 9. Cookies y Tecnologías de Rastreo

### 9.1 Cookies que Utilizamos

| Cookie        | Propósito                | Duración |
| ------------- | ------------------------ | -------- |
| `session_id`  | Autenticación            | Sesión   |
| `preferences` | Preferencias del usuario | 1 año    |
| `analytics`   | Análisis de uso          | 1 año    |

### 9.2 Control de Cookies

Puede controlar las cookies a través de la configuración de su navegador.

---

## 10. Menores de Edad

El Servicio no está dirigido a menores de 16 años. No recopilamos intencionalmente información personal de menores de 16 años.

Si descubrimos que hemos recopilado información personal de un menor de 16 años, tomaremos medidas para eliminar esa información de nuestros servidores.

---

## 11. Transferencias Internacionales

Su información puede ser transferida y mantenida en servidores ubicados fuera de su jurisdicción.

Al utilizar el Servicio, usted consiente dichas transferencias.

---

## 12. Cambios en esta Política

Podemos actualizar esta Política de Privacidad periódicamente.

Notificaremos cambios significativos a través de:

- Correo electrónico a la dirección registrada
- Aviso en el Servicio
- Actualización de la fecha de "Última actualización"

---

## 13. Contacto

Si tiene preguntas sobre esta Política de Privacidad:

- **Email**: privacy@hostalcofee.com
- **Asunto**: [Privacy Inquiry]
- **Tiempo de respuesta**: 5 días hábiles

---

## 14. Autoridad de Control

Si no está satisfecho con nuestra respuesta, tiene derecho a presentar una queja ante la autoridad de control de protección de datos de su jurisdicción.

---

## 15. Aceptación

Al utilizar el Servicio, usted acepta esta Política de Privacidad.

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](LICENSE).

Si no está de acuerdo con esta política, por favor no utilice el Servicio.
