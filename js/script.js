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

function imagenRepo(repo) {
    if (repo.private) {
        const inicial = repo.name.charAt(0).toUpperCase();
        return `<div class="repo-card-img repo-card-img--privado" aria-hidden="true">
            <div class="repo-img-privado-inner">
                <svg class="repo-lock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#484f58" stroke-width="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#484f58" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="repo-img-inicial">${inicial}</span>
                <span class="repo-img-privado-label">Repositorio privado</span>
            </div>
        </div>`;
    }
    return `<div class="repo-card-img">
        <img
            src="https://opengraph.githubassets.com/1/lnavarroto/${repo.name}"
            alt="Preview de ${repo.name}"
            loading="lazy"
            onerror="this.closest('.repo-card-img').classList.add('repo-card-img--fallback'); this.remove();"
        >
        <div class="repo-img-overlay"></div>
    </div>`;
}

async function cargarEstadisticasGitHub(wrapper) {
    const banner = document.createElement('div');
    banner.className = 'github-stats-banner';
    banner.innerHTML = '<span class="stats-loading">Cargando perfil...</span>';
    wrapper.insertAdjacentElement('afterbegin', banner);

    try {
        const userRes = await fetch('https://api.github.com/users/lnavarroto');

        if (!userRes.ok) {
            banner.remove();
            return;
        }

        const user = await userRes.json();
        const bio = user.bio ? `<p class="github-profile-bio">${user.bio}</p>` : '';

        banner.innerHTML = `
            <div class="github-profile-card">
                <img class="github-avatar" src="${user.avatar_url}" alt="${user.login}" loading="lazy">
                <div class="github-profile-info">
                    <strong class="github-profile-name">${user.name ?? user.login}</strong>
                    ${bio}
                    <a class="github-profile-link" href="${user.html_url}" target="_blank" rel="noopener noreferrer">
                        @${user.login} <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
            <div class="github-stats-grid">
                <div class="github-stat">
                    <strong>${user.public_repos}</strong>
                    <span>Repos</span>
                </div>
                <div class="github-stat">
                    <strong>${user.followers}</strong>
                    <span>Seguidores</span>
                </div>
                <div class="github-stat">
                    <strong>${user.following}</strong>
                    <span>Siguiendo</span>
                </div>
                <a class="github-stat github-stat-cta" href="${user.html_url}" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
                    <span>Ver perfil</span>
                </a>
            </div>
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

        repos.forEach((repo, index) => {
            const proyecto = document.createElement('article');
            proyecto.classList.add('repo-card');
            if (index === 0) proyecto.classList.add('repo-card--featured');

            const langColor = colorLenguaje(repo.language);
            const esPrivado = repo.private;
            const totalStars = repo.stargazers_count ?? 0;
            const totalForks = repo.forks_count ?? 0;

            proyecto.innerHTML = `
                ${imagenRepo(repo)}
                <div class="repo-card-body">
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
                        Ver proyecto
                        <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.75.75 0 0 1-1.5 0V2.561l-3.97 3.97a.749.749 0 0 1-1.06-1.06l3.97-3.97H10.604a.75.75 0 0 1 0-1.5Z"/></svg>
                    </a>
                </div>
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
