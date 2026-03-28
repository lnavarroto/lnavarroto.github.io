const GITHUB_API = 'https://api.github.com';
const DEFAULT_USERNAME = 'lnavarroto';

async function getAllRepos(token, username) {
    const repos = [];
    let page = 1;

    while (true) {
        const response = await fetch(
            `${GITHUB_API}/user/repos?visibility=all&affiliation=owner&sort=updated&direction=desc&per_page=100&page=${page}`,
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
            throw new Error(`GitHub API error: ${response.status} ${details}`);
        }

        const batch = await response.json();

        if (!Array.isArray(batch) || !batch.length) {
            break;
        }

        repos.push(...batch);

        if (batch.length < 100) {
            break;
        }

        page += 1;
    }

    return repos
        .filter((repo) => repo.owner && repo.owner.login === username)
        .map((repo) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            private: repo.private,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            fork: repo.fork
        }));
}

module.exports = async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || DEFAULT_USERNAME;

    if (!token) {
        res.status(500).json({
            error: 'Missing GITHUB_TOKEN environment variable.'
        });
        return;
    }

    // CORS optional for split frontend/backend deployment
    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    if (allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed.' });
        return;
    }

    try {
        const repos = await getAllRepos(token, username);
        res.status(200).json(repos);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to load repositories from GitHub.',
            details: String(error.message || error)
        });
    }
};
