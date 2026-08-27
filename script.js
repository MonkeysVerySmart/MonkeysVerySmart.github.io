const projects = [
    {
        title: "Tycoon Secrets",
        placeId: 76629350614143,
        universeId: 9538484416,
        description: "A puzzle-based tycoon about solving codes and uncovering secrets hidden throughout the islands.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-680aa2831b5550d43f857aea4e0a1f8c/768/432/Image/Png/noFilter",
        writeupUrl: "/tycoon_secrets.html"
    },
    {
        title: "My Himitsu",
        placeId: 139563550688725,
        universeId: 6519019074,
        description: "A secret-filled experience where players discover and unravel the mysteries hidden across its worlds.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-f3a8900702181cc7443dcf0e11f616be/768/432/Image/Png/noFilter",
        writeupUrl: "/my_himitsu.html"
    },
    {
        title: "Untitled Secret Game",
        placeId: 71748258802409,
        universeId: 6740897827,
        description: "A code-focused Roblox experience with puzzles and commands designed for PC play.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-98f177f3f5f2ddf2b2d9f1321463cb74/768/432/Image/Png/noFilter",
        writeupUrl: "/untitled_secret_game.html"
    },
    {
        title: "Trinomaly",
        placeId: 99634526227845,
        universeId: 9810150139,
        description: "Find three anomalies and solve the puzzles to complete the event.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-2db260113ece7786e9046c8153e73cd2/768/432/GameMediaItem10/Png/noFilter",
        writeupUrl: "/trinomaly.html"
    }
];

const gameGrid = document.querySelector("#game-grid");

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[character]));
}

function renderProject(project) {
    const robloxUrl = `https://www.roblox.com/games/${project.placeId}`;

    return `
        <article class="game-card">
            <a class="game-preview" href="${robloxUrl}" target="_blank" rel="noopener noreferrer">
                ${project.thumbnailUrl
                    ? `<img src="${project.thumbnailUrl}" alt="${escapeHtml(project.title)} thumbnail">`
                    : `<div class="preview-placeholder" aria-hidden="true">ROBLOX</div>`}
                <span class="preview-label">Roblox experience</span>
            </a>
            <div class="game-info">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
                <a class="game-link" href="${project.writeupUrl}" target="_blank" rel="noopener noreferrer">More info<span aria-hidden="true">↗</span></a>
            </div>
        </article>`;
}

gameGrid.innerHTML = projects.map(renderProject).join("");