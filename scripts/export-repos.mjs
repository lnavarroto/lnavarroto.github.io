import fs from 'node:fs/promises';
import path from 'node:path';

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || 'lnavarroto';

if (!token) {
    throw new Error('Falta GITHUB_TOKEN en variables de entorno.');
}

async function getAllRepos() {
    const repos = [];
    let page = 1;

    while (true) {
        const response = await fetch(
            `https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=updated&direction=desc&per_page=100&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }
        );

        if (!response.ok) {
            const details = await response.text();
            throw new Error(`Error GitHub API: ${response.status} ${details}`);
        }

        const batch = await response.json();

        if (!Array.isArray(batch) || batch.length === 0) {
            break;
        }

        repos.push(...batch);

        if (batch.length < 100) {
            break;
        }

        page += 1;
    }

    return repos;
}

const repos = await getAllRepos();
const propios = repos.filter((repo) => repo.owner?.login === username);

const salida = propios
    .map((repo) => ({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        homepage: repo.homepage,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        private: repo.private,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        fork: repo.fork
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

const outputPath = path.resolve('data', 'repos.json');
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(salida, null, 2) + '\n', 'utf8');

console.log(`Repos exportados: ${salida.length}`);
