(function initBackgroundParticles() {
    // Hide the old CSS rays/rings background (defined in style.css)
    const override = document.createElement("style");
    override.textContent = "body::before, body::after, html::before { content: none !important; }";
    document.head.appendChild(override);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");

    // Soft glowing dots in the site's purple/blue palette, pre-rendered once
    const palette = ["139, 92, 246", "88, 101, 242", "167, 139, 250", "196, 181, 253"];
    const sprites = palette.map((rgb) => {
        const sprite = document.createElement("canvas");
        sprite.width = sprite.height = 64;
        const sctx = sprite.getContext("2d");
        const glow = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        glow.addColorStop(0, `rgba(${rgb}, 1)`);
        glow.addColorStop(0.2, `rgba(${rgb}, .6)`);
        glow.addColorStop(1, `rgba(${rgb}, 0)`);
        sctx.fillStyle = glow;
        sctx.fillRect(0, 0, 64, 64);
        return sprite;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const random = (min, max) => min + Math.random() * (max - min);
    let width = 0;
    let height = 0;
    let particles = [];

    function createParticle(y = random(0, height)) {
        return {
            x: random(0, width),
            y,
            size: random(5, 18),
            speed: random(5, 16),
            driftAmount: random(4, 16),
            driftSpeed: random(0.1, 0.35),
            twinkleSpeed: random(0.4, 1.2),
            phase: random(0, Math.PI * 2),
            alpha: random(0.3, 0.75),
            sprite: sprites[Math.floor(Math.random() * sprites.length)]
        };
    }

    function resize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Keep existing particles in proportionally the same spot
        particles.forEach((particle) => {
            particle.x *= newWidth / (width || newWidth);
            particle.y *= newHeight / (height || newHeight);
        });

        width = newWidth;
        height = newHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const target = Math.round(Math.min(60, Math.max(20, (width * height) / 26000)));
        while (particles.length < target) particles.push(createParticle());
        particles.length = target;
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
            const twinkle = 0.6 + 0.4 * Math.sin(time * particle.twinkleSpeed + particle.phase);
            const x = particle.x + Math.sin(time * particle.driftSpeed + particle.phase) * particle.driftAmount;
            ctx.globalAlpha = particle.alpha * twinkle;
            ctx.drawImage(particle.sprite, x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        });
        ctx.globalAlpha = 1;
    }

    let lastFrame = performance.now();

    function frame(now) {
        const delta = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;

        if (!reducedMotion.matches) {
            particles.forEach((particle) => {
                particle.y -= particle.speed * delta;
                if (particle.y < -particle.size) Object.assign(particle, createParticle(height + particle.size));
            });
        }

        draw(reducedMotion.matches ? 0 : now / 1000);
        requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(frame);
})();

const projects = [
    {
        title: "???", // Incremental Secrets (unreleased)
        placeId: 82121046291880,
        universeId: 10435267522,
        description: "???",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-1aa4a135979e09c4c5a0f5fb7fe4a903/768/432/Image/Png/noFilter",
        topCcu: null,
        unreleased: true,
        progress: 50, // percent, shown as a progress bar instead of stats
        writeupUrl: null
    },
    {
        title: "Tycoon Secrets",
        placeId: 76629350614143,
        universeId: 9538484416,
        description: "A puzzle-based tycoon about solving codes and uncovering secrets hidden throughout the islands.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-680aa2831b5550d43f857aea4e0a1f8c/768/432/Image/Png/noFilter",
        topCcu: 846, 
        writeupUrl: "/tycoon_secrets.html"
    },
    {
        title: "My Himitsu",
        placeId: 139563550688725,
        universeId: 6519019074,
        description: "A secret-filled experience where players discover and unravel the mysteries hidden across its worlds.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-f3a8900702181cc7443dcf0e11f616be/768/432/Image/Png/noFilter",
        topCcu: 63, // all-time peak from RoMonitor; live "playing" overrides it if higher
        writeupUrl: "/my_himitsu.html"
    },
    {
        title: "Untitled Secret Game",
        placeId: 71748258802409,
        universeId: 6740897827,
        description: "A code-focused Roblox experience with puzzles and commands designed for PC play.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-98f177f3f5f2ddf2b2d9f1321463cb74/768/432/Image/Png/noFilter",
        topCcu: 15, // all-time peak from RoMonitor; live "playing" overrides it if higher
        writeupUrl: "/untitled_secret_game.html"
    },
    {
        title: "Trinomaly",
        placeId: 99634526227845,
        universeId: 9810150139,
        description: "Find three anomalies and solve the puzzles to complete the event.",
        thumbnailUrl: "https://tr.rbxcdn.com/180DAY-2db260113ece7786e9046c8153e73cd2/768/432/GameMediaItem10/Png/noFilter",
        topCcu: 563, // all-time peak from RoMonitor; live "playing" overrides it if higher
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

const STAT_FIELDS = [
    ["playing", "Playing"],
    ["visits", "Visits"],
    ["favorites", "Favorites"],
    ["rating", "Rating"],
    ["topCcu", "Top CCU"]
];

const SUMMARY_FIELDS = [
    ["playing", "Playing now"],
    ["visits", "Total visits"],
    ["favorites", "Favorites"],
    ["rating", "Avg rating"],
    ["topCcu", "Top CCU"]
];

const GAMES_API = "https://games.roproxy.com/v1";

async function fetchGamesApi(path) {
    const response = await fetch(`${GAMES_API}${path}`);
    if (!response.ok) throw new Error(`Roblox games API returned ${response.status} for ${path}`);
    return (await response.json()).data ?? [];
}

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
// Whole compact units, rounded down so the total never overstates (1.37M -> "~1M").
const roughNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0, roundingMode: "floor" });

function formatRating(upVotes, downVotes) {
    const total = upVotes + downVotes;
    return total ? `${Math.round((upVotes / total) * 100)}%` : "—";
}

function renderStatList(fields, attributes = "") {
    return `
        <dl class="game-stats" ${attributes}>
            ${fields.map(([key, label]) => `<div class="game-stat"><dt>${label}</dt><dd data-stat="${key}">…</dd></div>`).join("")}
        </dl>`;
}

function fillStats(statsList, values) {
    for (const [key, value] of Object.entries(values)) {
        const cell = statsList.querySelector(`[data-stat="${key}"]`);
        if (cell) cell.textContent = value;
    }
}

// Thumbnail URLs on tr.rbxcdn.com are signed for 180 days, so refresh them from the API and keep the hardcoded ones as a fallback.
async function loadThumbnails() {
    const ids = projects.map((project) => project.universeId).join(",");
    const response = await fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`);
    if (!response.ok) return;
    for (const entry of (await response.json()).data ?? []) {
        const thumbnail = entry.thumbnails?.find((item) => item.state === "Completed");
        const img = document.querySelector(`.game-preview[data-universe-id="${entry.universeId}"] img`);
        if (thumbnail?.imageUrl && img && img.src !== thumbnail.imageUrl) img.src = thumbnail.imageUrl;
    }
}

function handleThumbnailError(img) {
    img.replaceWith(Object.assign(document.createElement("div"), { className: "preview-placeholder", textContent: "ROBLOX" }));
}

async function loadGameStats() {
    const ids = projects.map((project) => project.universeId).join(",");
    const [games, votes] = await Promise.allSettled([
        fetchGamesApi(`/games?universeIds=${ids}`),
        fetchGamesApi(`/games/votes?universeIds=${ids}`)
    ]);
    const gameById = new Map((games.value ?? []).map((game) => [game.id, game]));
    const votesById = new Map((votes.value ?? []).map((vote) => [vote.id, vote]));
    const totals = { playing: 0, visits: 0, favorites: 0, upVotes: 0, downVotes: 0, topCcu: 0 };

    for (const project of projects) {
        if (project.unreleased) continue;
        const statsList = document.querySelector(`.game-stats[data-universe-id="${project.universeId}"]`);
        const game = gameById.get(project.universeId);
        const vote = votesById.get(project.universeId);
        const topCcu = Math.max(project.topCcu ?? 0, game?.playing ?? 0);

        if (game) {
            totals.playing += game.playing ?? 0;
            totals.visits += game.visits ?? 0;
            totals.favorites += game.favoritedCount ?? 0;
        }
        if (vote) {
            totals.upVotes += vote.upVotes;
            totals.downVotes += vote.downVotes;
        }
        totals.topCcu = Math.max(totals.topCcu, topCcu);

        if (statsList) fillStats(statsList, {
            playing: game ? compactNumber.format(game.playing ?? 0) : "—",
            visits: game ? compactNumber.format(game.visits ?? 0) : "—",
            favorites: game ? compactNumber.format(game.favoritedCount ?? 0) : "—",
            rating: vote ? formatRating(vote.upVotes, vote.downVotes) : "—",
            topCcu: topCcu ? compactNumber.format(topCcu) : "—"
        });
    }

    const summary = document.querySelector("#game-summary .game-stats");
    if (summary) fillStats(summary, {
        playing: games.value ? compactNumber.format(totals.playing) : "—",
        visits: games.value ? `~${roughNumber.format(totals.visits)}` : "—",
        favorites: games.value ? compactNumber.format(totals.favorites) : "—",
        rating: formatRating(totals.upVotes, totals.downVotes),
        topCcu: totals.topCcu ? compactNumber.format(totals.topCcu) : "—"
    });
}

function renderProject(project) {
    const robloxUrl = `https://www.roblox.com/games/${project.placeId}`;
    const classes = ["game-card", "win-window", project.unreleased && "game-card--unreleased"].filter(Boolean).join(" ");
    const thumbnail = project.thumbnailUrl
        ? `<img src="${project.thumbnailUrl}" alt="${escapeHtml(project.title)} thumbnail" onerror="handleThumbnailError(this)">`
        : `<div class="preview-placeholder" aria-hidden="true">ROBLOX</div>`;
    const stats = project.unreleased
        ? `<div class="win-progress" role="progressbar" aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Development progress"><span style="width: ${project.progress}%"></span></div>`
        : renderStatList(STAT_FIELDS, `data-universe-id="${project.universeId}"`);
    const link = project.writeupUrl
        ? `<a class="game-link" href="${project.writeupUrl}" target="_blank" rel="noopener noreferrer">More info<span aria-hidden="true">↗</span></a>`
        : "";

    return `
        <article class="${classes}">
            <div class="win-titlebar"><span>${escapeHtml(project.title)}.rbxl${project.unreleased ? " [UNRELEASED]" : ""}</span><div class="win-controls"><span>_</span><span>□</span><span>×</span></div></div>
            <div class="game-body">
                <a class="game-preview" data-universe-id="${project.universeId}" href="${robloxUrl}" target="_blank" rel="noopener noreferrer">
                    ${thumbnail}
                    ${project.unreleased ? `<span class="redacted-bars" aria-hidden="true"><span></span><span></span><span></span></span><span class="redacted-stamp">Redacted</span>` : ""}
                </a>
                <div class="game-info">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    ${stats}
                    ${link}
                </div>
            </div>
        </article>`;
}

const gameSummary = document.querySelector("#game-summary");
const releasedCount = projects.filter((project) => !project.unreleased).length;

if (gameGrid) {
    gameGrid.innerHTML = projects.map(renderProject).join("");
    if (gameSummary) gameSummary.innerHTML = `
        <div class="win-titlebar"><span>Combined stats across ${releasedCount} released games</span><div class="win-controls"><span>_</span><span>□</span><span>×</span></div></div>
        ${renderStatList(SUMMARY_FIELDS)}`;
    loadGameStats();
    loadThumbnails().catch(() => {});
}