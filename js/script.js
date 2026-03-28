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

const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Shell: '#89e051',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Dart: '#00B4AB',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    PowerShell: '#012456',
    Markdown: '#083fa1',
};

function colorLenguaje(lang) {
    return LANG_COLORS[lang] ?? '#8b949e';
}

function tiempoRelativo(fechaISO) {
    if (!fechaISO) return 'Sin actividad';
    const diff = Date.now() - new Date(fechaISO).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'hace un momento';
    if (min < 60) return `hace ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const dias = Math.floor(hrs / 24);
    if (dias < 30) return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
    const meses = Math.floor(dias / 30);
    if (meses < 12) return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
    const años = Math.floor(meses / 12);
    return `hace ${años} año${años !== 1 ? 's' : ''}`;
}

async function cargarEstadisticasGitHub(wrapper) {
    const banner = document.createElement('div');
    banner.className = 'github-stats-banner';
    banner.innerHTML = '<span class="stats-loading">Cargando estadísticas...</span>';
    wrapper.insertAdjacentElement('afterbegin', banner);

    try {
        const [userRes, reposData] = await Promise.all([
            fetch('https://api.github.com/users/lnavarroto'),
            Promise.resolve(null)
        ]);

        if (!userRes.ok) {
            banner.remove();
            return;
        }

        const user = await userRes.json();

        banner.innerHTML = `
            <div class="github-stat">
                <strong>${user.public_repos}</strong>
                <span>Repos públicos</span>
            </div>
            <div class="github-stat">
                <strong>${user.followers}</strong>
                <span>Seguidores</span>
            </div>
            <div class="github-stat">
                <strong>${user.following}</strong>
                <span>Siguiendo</span>
            </div>
            <a class="github-stat github-stat-link" href="${user.html_url}" target="_blank" rel="noopener noreferrer">
                <strong>GitHub</strong>
                <span>Ver perfil →</span>
            </a>
        `;
    } catch (e) {
        banner.remove();
    }
}

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

    const wrapper = contenedor.closest('.github-projects-block');
    if (wrapper) {
        cargarEstadisticasGitHub(wrapper);
    }

    contenedor.innerHTML = '<p class="repos-status">Cargando repositorios...</p>';

    try {
        const { repos, origen } = await obtenerReposGitHub();

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        contenedor.innerHTML = '';

        repos.forEach((repo) => {
            const proyecto = document.createElement('article');
            proyecto.classList.add('repo-card');

            const langColor = colorLenguaje(repo.language);
            const esPrivado = repo.private;
            const totalStars = repo.stargazers_count ?? 0;
            const totalForks = repo.forks_count ?? 0;

            proyecto.innerHTML = `
                <div class="repo-card-header">
                    <h4 class="repo-name">${repo.name}</h4>
                    <span class="repo-badge ${esPrivado ? 'badge-privado' : 'badge-publico'}">
                        ${esPrivado ? '🔒 Privado' : '🌐 Público'}
                    </span>
                </div>

                <p class="repo-desc">${repo.description ?? 'Proyecto en desarrollo'}</p>

                <div class="repo-commits">
                    <span class="repo-commit-dot"></span>
                    Última actividad: <strong>${tiempoRelativo(repo.updated_at)}</strong>
                </div>

                <div class="repo-meta">
                    ${repo.language ? `
                    <span class="repo-lang">
                        <span class="lang-dot" style="background:${langColor}"></span>
                        ${repo.language}
                    </span>` : ''}
                    <span class="repo-stars">⭐ ${totalStars}</span>
                    ${totalForks ? `<span class="repo-forks">🍴 ${totalForks}</span>` : ''}
                </div>

                <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    Ver en GitHub →
                </a>
            `;

            contenedor.appendChild(proyecto);
        });

        if (origen === 'publico') {
            const mensaje = document.createElement('p');
            mensaje.className = 'repos-status';
            mensaje.textContent = 'Mostrando solo repositorios públicos. Ejecuta el workflow Sync GitHub Repositories para incluir privados.';
            contenedor.prepend(mensaje);
        }

        if (!repos.length) {
            contenedor.innerHTML = '<p class="repos-status">Aún no hay repositorios para mostrar.</p>';
        }
    } catch (error) {
        contenedor.innerHTML = '<p class="repos-status">No se pudieron cargar los repositorios.</p>';
        console.error(error);
    }
}

cargarRepos();
