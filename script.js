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
        <article class="game-card win-window">
            <div class="win-titlebar"><span>${escapeHtml(project.title)}.rbxl</span><div class="win-controls"><span>_</span><span>□</span><span>×</span></div></div>
            <a class="game-preview" href="${robloxUrl}" target="_blank" rel="noopener noreferrer">
                ${project.thumbnailUrl
                    ? `<img src="${project.thumbnailUrl}" alt="${escapeHtml(project.title)} thumbnail">`
                    : `<div class="preview-placeholder" aria-hidden="true">ROBLOX</div>`}
            </a>
            <div class="game-info">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
                <a class="game-link" href="${project.writeupUrl}" target="_blank" rel="noopener noreferrer">More info<span aria-hidden="true">↗</span></a>
            </div>
        </article>`;
}

if (gameGrid) gameGrid.innerHTML = projects.map(renderProject).join("");