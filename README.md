# Refugio Mobile — Prototipo TB2

Prototipo del **Design Sprint (TB2) del curso Lean Management (UPC)**. Evoluciona el prototipo Refugio del TB1.

## Pregunta del sprint (target)

**¿El usuario, al ver el prototipo, se siente cómodo compartiendo o marcando que iría al psicólogo?**

## Qué cambió respecto al TB1

| Cambio | Dónde |
|---|---|
| **Semáforo personal** (verde / amarillo / rojo), independiente del check-in y del ánimo, opcional y cambiable cuando quiera | Mi espacio |
| **Pedir cita** al pasar a rojo: lleva a Apoyo, elige psicólogo y horario (simulado) | Mi espacio → Apoyo |
| El equipo de psicología **solo ve cuántos** alumnos hay en amarillo o rojo, sin nombres | Apoyo |
| **Explicación de privacidad** solo en el primer ingreso | Después del registro (se puede volver a ver en Perfil) |
| **Nada se comparte automáticamente**: cada entrada del diario se comparte solo si el estudiante lo decide | Mi espacio |
| **Check-in** aparte del semáforo, con opción de omitirlo | Check-in |
| **Testimonios** de compañeros (incluido otro colegio) y **indicador semanal** anónimo | Comunidad |
| **Miniencuesta** (Me gusta / Me confunde / Quisiera) al dejar el primer comentario | Detalle de publicación |
| Avatares **3D**, feed con **fotos** y estilo de red social (me gusta con doble toque, foto opcional al publicar) | Toda la app |

## Cómo ejecutarlo

Abrir `index.html` en el navegador, o publicarlo con GitHub Pages. Las fotos del feed y las tipografías se cargan por internet.

## Archivos

```
index.html    estructura de las pantallas
style.css     sistema visual
app.js        lógica (semáforo, citas, feed, chat, encuesta)
data.js       contenido semilla (psicólogos, publicaciones, avatares)
img/avatars   avatares 3D (Fluent Emoji 3D, Microsoft, licencia MIT)
```

Los datos son simulados y se guardan solo en el navegador (`localStorage`).

## Notas

- Las fotos del feed vienen de picsum.photos; para cambiar una, edita el número del `id` en `data.js`.
- Todo el contenido es ficticio y con fines académicos. No es un servicio real de atención psicológica.
