# 👨‍💻 Portafolio de Luis Navarro

Mi portafolio profesional como desarrollador web full stack. Aquí puedes encontrar mis proyectos, habilidades técnicas y forma de contactarme.

## 🌐 Ver en Vivo

Visita mi portafolio: [https://lnavarroto.github.io](https://lnavarroto.github.io)

## 🔒 Mostrar Repositorios Privados de GitHub

Este portafolio soporta GitHub Pages usando sincronizacion automatica con GitHub Actions.

### Requisitos

- Agregar el secreto `PRIVATE_REPOS_TOKEN` en GitHub:
    - Repo -> Settings -> Secrets and variables -> Actions -> New repository secret.
    - Valor: token con permisos para leer repos privados.

### Flujo de funcionamiento

- El workflow `.github/workflows/sync-repos.yml` ejecuta `scripts/export-repos.mjs`.
- El script consulta GitHub y guarda todo en `data/repos.json`.
- Tu frontend en GitHub Pages lee `data/repos.json` y muestra todos los proyectos.
- Si no existe sincronizacion, el frontend cae automaticamente a la API publica.

### Ejecutar ahora

- Abre Actions en tu repo y ejecuta manualmente `Sync GitHub Repositories`.
- Luego espera el deploy de Pages para ver los cambios en https://lnavarroto.github.io.

### Seguridad

- Nunca coloques el token en el frontend.
- Todo lo que llegue a `data/repos.json` sera publico en tu web.

## 📋 Contenido del Portafolio

### 🎯 Secciones Principales

- **Inicio**: Presentación profesional y llamada a la acción
- **Proyectos**: Galería de proyectos destacados con diferentes estados (en desarrollo, completado, planeado)
- **Habilidades**: Listado de tecnologías y herramientas técnicas con niveles de dominio
- **Contacto**: Formulario de contacto y enlaces a redes sociales
- **Estadísticas**: Resumen de experiencia y logros

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y moderna
- **CSS3**: Diseño responsive y animaciones fluidas
- **JavaScript Vanilla**: Interactividad sin dependencias

### Características
- ✨ Diseño moderno y atractivo
- 📱 Completamente responsive (móvil, tablet, desktop)
- ⚡ Animaciones suaves y transiciones
- 🎨 Paleta de colores profesional con gradientes
- ♿ Accesibilidad básica integrada
- 🚀 Navegación fluida con scroll suave

## 📦 Estructura de Archivos

```
lnavarroto.github.io/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Interactividad y animaciones
├── README.md           # Este archivo
└── LICENSE             # Licencia del proyecto
```

## 🚀 Cómo Usar Este Portafolio

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/lnavarroto/lnavarroto.github.io.git
cd lnavarroto.github.io
```

### 2. **Abrir Localmente**
Simplemente abre el archivo `index.html` en tu navegador:
```bash
# En Windows
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

O usa un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (http-server)
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #3B82F6;      /* Azul principal */
    --secondary-color: #8B5CF6;    /* Púrpura secundario */
    --success-color: #10B981;      /* Verde éxito */
    --danger-color: #EF4444;       /* Rojo peligro */
    /* ... más variables ... */
}
```

### Actualizar Proyectos
En `index.html`, encuentra la sección de proyectos y:
1. Duplica una tarjeta de proyecto
2. Cambia el título, descripción y enlaces
3. Actualiza el estado de la insignia (`badge-active`, `badge-completed`, `badge-planned`)
4. Añade/quita etiquetas de tecnología según corresponda

### Actualizar Habilidades
Localiza la sección **"Habilidades Técnicas"** y:
1. Modifica los porcentajes en los atributos `style="width: XX%"`
2. Reordena las categorías (Frontend, Backend, Herramientas)
3. Actualiza los nombres de tecnologías

### Configurar Contacto
Para que el formulario funcione realmente:
1. Usa un servicio como [Formspree](https://formspree.io) o [Netlify Forms](https://www.netlify.com/products/forms/)
2. Modifica el atributo `action` del formulario en `index.html`
3. Reemplaza los enlaces de redes sociales con tus URLs

Ejemplo con Formspree:
```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## 📱 Características Responsive

El portafolio está optimizado para:
- 📱 Móviles (320px - 480px)
- 📑 Tablets (481px - 768px)
- 🖥️ Desktop (769px+)

Todos los elementos se adaptan automáticamente al tamaño de la pantalla.

## 🎯 Estados de Proyectos

### En Desarrollo (Azul)
Proyectos actuales en construcción
```html
<span class="badge badge-active">En Desarrollo</span>
```

### Completado (Verde)
Proyectos finalizados y funcionales
```html
<span class="badge badge-completed">Completado</span>
```

### Planeado (Amarillo)
Proyectos futuros en la hoja de ruta
```html
<span class="badge badge-planned">Planeado</span>
```

## 📚 Variables de Construcción

El proyecto incluye un conjunto de variables CSS reutilizables:

| Variable | Uso |
|----------|-----|
| `--primary-color` | Color principal de la marca |
| `--secondary-color` | Color secundario para acentos |
| `--success-color` | Color para estados exitosos |
| `--warning-color` | Color para advertencias |
| `--danger-color` | Color para errores |
| `--dark-bg` | Fondo oscuro principal |
| `--light-bg` | Fondo oscuro secundario |
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |

## 🔗 Enlaces Útiles

- [HTML5 Especificación](https://html.spec.whatwg.org/)
- [CSS3 Guía](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Formspree](https://formspree.io/) - Para formularios
- [Netlify](https://netlify.com) - Para hosting

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

## ✉️ Contacto

¿Preguntas o sugerencias? Contáctame a través de:
- **Email**: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- **GitHub**: [@lnavarroto](https://github.com/lnavarroto)
- **LinkedIn**: [Luis Navarro](https://linkedin.com)

---

**Hecho con ❤️ por Luis Navarro | 2024**
