// services/repoService.js

// Ye function GitHub API se baat karke repos layega
export const fetchUserRepos = async (accessToken) => {
    try {
        // GitHub API call kar rahe hain (sort=updated se sabse naye upar aayenge)
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Token yahan bhejna zaroori hai
                'Accept': 'application/vnd.github.v3+json' // GitHub API version 3
            }
        });

        if (!response.ok) {
            // Agar GitHub error de (e.g., token expire ho gaya)
            const errBody = await response.json();
            throw new Error(`GitHub API Error: ${errBody.message || response.statusText}`);
        }

        const rawRepos = await response.json();

        // 4. Data ko clean aur transform karna (jaise tumne design mein likha tha)
        const repos = rawRepos.map(repo => ({
            name: repo.name,
            owner: repo.owner.login,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            description: repo.description,
            isPrivate: repo.private,
            lastUpdated: repo.updated_at
        }));

        return repos;

    } catch (error) {
        console.error("RepoService Error:", error.message);
        throw error; // Is error ko controller handle karega
    }
};
