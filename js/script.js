const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('section[id]');

// ==================== SMOOTH SCROLL NAVIGATION ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
        const targetSelector = this.getAttribute('href');
        const target = document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==================== NAVBAR EFFECT ON SCROLL ====================
function updateNavbarState() {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
}

// ==================== ACTIVE SECTION LINK ====================
function updateActiveLink() {
    const currentPosition = window.scrollY + 140;

    pageSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (currentPosition >= sectionTop && currentPosition < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
}

window.addEventListener('scroll', () => {
    updateNavbarState();
    updateActiveLink();
});

updateNavbarState();
updateActiveLink();

// ==================== GITHUB REPOSITORIES ====================
async function obtenerReposEstaticos(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error al consultar ${url}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error('El archivo no contiene un array valido.');
    }

    return data;
}

async function obtenerReposPaginados(url) {
    const todos = [];
    let pagina = 1;

    while (true) {
        const separador = url.includes('?') ? '&' : '?';
        const endpointPaginado = `${url}${separador}per_page=100&page=${pagina}`;
        const response = await fetch(endpointPaginado);

        if (!response.ok) {
            throw new Error(`Error al consultar ${url}`);
        }

        const lote = await response.json();

        if (!Array.isArray(lote) || !lote.length) {
            break;
        }

        todos.push(...lote);

        if (lote.length < 100) {
            break;
        }

        pagina += 1;
    }

    return todos;
}

async function obtenerReposGitHub() {
    try {
        // Primero intenta el JSON generado por GitHub Actions (incluye privados)
        const sincronizados = await obtenerReposEstaticos('/repos.json');
        return { repos: sincronizados, origen: 'sincronizado' };
    } catch (errorSincronizado) {
        // Fallback: API publica de GitHub (solo publicos)
        const publicos = await obtenerReposPaginados('https://api.github.com/users/lnavarroto/repos?sort=updated');
        return { repos: publicos, origen: 'publico' };
    }
}

async function cargarRepos() {
    const contenedor = document.getElementById('repos');

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '<p class="repos-status">Cargando repositorios...</p>';

    try {
        const { repos, origen } = await obtenerReposGitHub();

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        contenedor.innerHTML = '';

        repos.forEach((repo) => {
            const proyecto = document.createElement('article');

            proyecto.classList.add('repo-card');

            proyecto.innerHTML = `
                <h4>${repo.name}</h4>
                <p>${repo.description ?? 'Proyecto en desarrollo'}</p>

                <div class="repo-info">
                    <span>${repo.private ? 'Privado' : 'Publico'}</span>
                    <span>${repo.language ?? 'Code'}</span>
                    <span>⭐ ${repo.stargazers_count}</span>
                </div>

                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver proyecto</a>
            `;

            contenedor.appendChild(proyecto);
        });

        if (origen === 'publico') {
            const mensaje = document.createElement('p');
            mensaje.className = 'repos-status';
            mensaje.textContent = 'Mostrando solo repositorios publicos. Ejecuta el workflow Sync GitHub Repositories para incluir privados.';
            contenedor.prepend(mensaje);
        }

        if (!repos.length) {
            contenedor.innerHTML = '<p class="repos-status">Aun no hay repositorios para mostrar.</p>';
        }
    } catch (error) {
        contenedor.innerHTML = '<p class="repos-status">No se pudieron cargar los repositorios.</p>';
        console.error(error);
    }
}

cargarRepos();
