const projects = [
    {
        title: "Tycoon Secrets",
        placeId: 76629350614143,
        writeupUrl: "#"
    },
    {
        title: "My Himitsu",
        placeId: 139563550688725,
        writeupUrl: "#"
    },
    {
        title: "Untitled Secret Game",
        placeId: 71748258802409,
        writeupUrl: "#"
    },
    {
        title: "Trinomaly",
        placeId: 99634526227845,
        writeupUrl: "#"
    }
];

const gameGrid = document.querySelector("#game-grid");
const universeEndpoint = "https://apis.roblox.com/universes/v1/places";
const detailsEndpoint = "https://games.roblox.com/v1/games";
const thumbnailsEndpoint = "https://thumbnails.roblox.com/v1/games/multiget/thumbnails";

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[character]));
}

function renderProject(project, details, thumbnailUrl) {
    const description = (details.description?.trim().split(/\n\s*\n/)[0] || "A Roblox experience I helped build.")
        .replace(/\s+/g, " ")
        .slice(0, 180)
        .trim();
    const robloxUrl = `https://www.roblox.com/games/${project.placeId}`;

    return `
        <article class="game-card">
            <a class="game-preview" href="${robloxUrl}" target="_blank" rel="noopener noreferrer">
                ${thumbnailUrl
                    ? `<img src="${thumbnailUrl}" alt="${escapeHtml(details.name)} thumbnail">`
                    : `<div class="preview-placeholder" aria-hidden="true">ROBLOX</div>`}
                <span class="preview-label">Roblox experience</span>
            </a>
            <div class="game-info">
                <h3>${escapeHtml(details.name || project.title)}</h3>
                <p>${escapeHtml(description)}</p>
                <a class="game-link" href="${project.writeupUrl}" target="_blank" rel="noopener noreferrer">Read my writeup <span aria-hidden="true">↗</span></a>
            </div>
        </article>`;
}

async function loadProjects() {
    const universeResults = await Promise.all(projects.map(async (project) => {
        const response = await fetch(`${universeEndpoint}/${project.placeId}/universe`);
        if (!response.ok) throw new Error(`Could not resolve place ${project.placeId}.`);
        const result = await response.json();
        return { ...project, universeId: result.universeId };
    }));
    const universeIds = universeResults.map((project) => project.universeId).join(",");
    const detailsResponse = await fetch(`${detailsEndpoint}?universeIds=${universeIds}`);
    if (!detailsResponse.ok) throw new Error("Could not load Roblox game details.");

    const details = await detailsResponse.json();
    const games = details.data || [];
    const thumbnailResponse = await fetch(`${thumbnailsEndpoint}?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
    const thumbnails = thumbnailResponse.ok ? (await thumbnailResponse.json()).data || [] : [];
    const thumbnailByUniverseId = new Map(thumbnails.map((result) => [
        result.universeId,
        result.thumbnails?.[0]?.imageUrl
    ]));

    gameGrid.innerHTML = universeResults.map((project) => {
        const game = games.find((item) => item.id === project.universeId);
        return game
            ? renderProject(project, game, thumbnailByUniverseId.get(game.universeId))
            : "";
    }).join("");
}

loadProjects().catch(() => {
    gameGrid.innerHTML = "<p class=\"loading-state\">idk some stupid error happened.</p>";
});