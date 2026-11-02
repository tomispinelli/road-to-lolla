# Road to Lolla · El Predio de las Facciones

Prototipo navegable de la landing de **Road to Lolla**, el proyecto transmedia del TP final de *Contenidos multiplataforma* (UCES, 2026), de Santos, Spinelli y Villordo.

> **Tu música es tu bandera.** Cuatro Facciones musicales compiten durante los 30 días previos a Lollapalooza Argentina 2027 (12 al 14 de marzo, Hipódromo de San Isidro).

Es un proyecto académico, no un sitio oficial de Lollapalooza Argentina. No envía ni guarda datos fuera del navegador.

## Qué se puede hacer
- **Test de Facción:** 5 preguntas, con barra de progreso, atajos de teclado (1 a 4) y la opción de volver a la anterior.
- **Resultado:** la Facción asignada, por qué salió esa, la afinidad con cada una, la tarjeta para compartir (1080 × 1920) y un único cambio de bandera con confirmación.
- **Barrio de cada Facción:** energía de la semana, reto activo, carta del referente, artistas del lineup y un solo CTA. Ese CTA cambia según el caso: si es tu barrio, "Comprá tu entrada"; si todavía no hiciste el test, "Descubrí tu Facción"; si estás de visita, "Volvé a tu barrio".
- **El Predio:** mapa del hipódromo con los cuatro barrios y las zonas que se abren cada miércoles. También tiene una lista accesible.
- **Marcador y meta colectiva** de 40.000 banderas.
- **Reto de la semana** y aportes destacados de TikTok (ficción).
- **El Diario de las Facciones:** edición semanal y suscripción con un solo campo, con sus estados de error, carga y listo.
- **"Antes de salir":** precio, cuotas y entradas antes de ir a la ticketera.
- **Control del prototipo** (botón dorado): simula las semanas 1 a 4, la víspera y el epílogo. También reinicia el prototipo entre una prueba con usuarios y la siguiente.

## Cómo verlo
- **Local:** desde esta carpeta, `python3 -m http.server 8765` y abrir http://127.0.0.1:8765/
- **Online:** https://tomispinelli.github.io/road-to-lolla/

## Stack
- **Front:** HTML5, CSS3 (variables, grid, clip-path, mix-blend-mode para el duotono) y JavaScript sin frameworks.
- **Animación:** GSAP 3.12.5 + ScrollTrigger y Lenis 1.1.13 para el scroll suave.
- **Gráficos:** SVG inline (mapa del Predio, íconos, papel rasgado) y Canvas (ilustraciones y tarjeta para compartir).
- **Tipografías:** Google Fonts (Permanent Marker, Barlow, Barlow Condensed y Caveat).
- **Hosting:** GitHub Pages.

## Archivos
- `index.html`: estructura y textos fijos.
- `css/styles.css`: estilos (collage, papel rasgado, pincel, duotono).
- `js/data.js`: el universo (Facciones, test, semanas, Diario, zonas). **Los textos se cambian acá.**
- `js/art.js`: ilustraciones de multitud provisorias, papel rasgado y tarjeta para compartir.
- `js/app.js`: lógica (test, router, capas, mapa, marcador, formulario).
- `assets/img/`: imágenes. `hero.webp` es provisoria (recorte del mockup de ChatGPT).

Librerías por CDN: GSAP 3.12.5 y ScrollTrigger (animación), Lenis 1.1.13 (scroll suave). Sin ellas el sitio funciona igual, sin animaciones. Si la persona tiene activado "reducir movimiento", no se anima nada.
