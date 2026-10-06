export const state = {
    currentWeatherMode: 0,
    shellCount: 0,
    umbrellaOpen: true
};

const phrases = [
    "Ahhh, pure relaxation! 🍹",
    "Beach breeze feels amazing! 🌴",
    "Sipping sunshine and good vibes ✨",
    "Found a cute seashell earlier! 🐚",
    "So cozy right now... 🥥"
];

const weatherConfigs = [
    { name: "Day Mode", icon: "☀️", sky: "from-sky-300 via-sky-200 to-amber-100", sunBg: "bg-amber-300 shadow-amber-300/50", ocean: "bg-sky-400", body: "#7dd3fc" },
    { name: "Sunset Mode", icon: "🌅", sky: "from-sky-400 via-rose-300 to-amber-300", sunBg: "bg-orange-500 shadow-orange-500/80", ocean: "bg-indigo-400", body: "#fb923c" },
    { name: "Night Mode", icon: "🌙", sky: "from-slate-900 via-indigo-950 to-slate-900", sunBg: "bg-slate-100 shadow-slate-100/50", ocean: "bg-slate-800", body: "#0f172a" }
];

export function cycleWeather() {
    state.currentWeatherMode = (state.currentWeatherMode + 1) % 3;
    const cfg = weatherConfigs[state.currentWeatherMode];

    document.getElementById('timeIcon').innerText = cfg.icon;
    document.getElementById('timeLabel').innerText = cfg.name;
    document.getElementById('weatherBtnIcon').innerText = cfg.icon;
    
    const skyZone = document.getElementById('skyZone');
    skyZone.className = `w-full h-[44%] bg-gradient-to-b ${cfg.sky} relative overflow-hidden transition-all duration-1000`;
    
    const celestial = document.getElementById('celestialBody');
    celestial.className = `absolute top-8 right-12 w-16 h-16 rounded-full shadow-2xl transition-all duration-1000 ${cfg.sunBg}`;
    
    document.getElementById('oceanZone').className = `w-full h-[26%] relative ${cfg.ocean} transition-colors duration-1000`;
    document.getElementById('appBody').style.backgroundColor = cfg.body;

    const stars = document.getElementById('starsOverlay');
    stars.style.opacity = state.currentWeatherMode === 2 ? '1' : '0';

    showTip(`Switched to ${cfg.name}! ✨`);
}

export function spawnSeashell() {
    const area = document.getElementById('shellSpawnArea');
    if (!area || area.children.length >= 4) return;

    const shell = document.createElement('div');
    shell.className = 'absolute text-xl cursor-pointer transform hover:scale-125 transition active:scale-95 animate-bounce';
    shell.style.left = (Math.random() * 85 + 5) + '%';
    shell.style.bottom = (Math.random() * 60 + 10) + '%';
    
    const icons = ['🐚', '⭐', '🦀', '💎'];
    shell.innerText = icons[Math.floor(Math.random() * icons.length)];
    
    shell.onclick = (e) => {
        e.stopPropagation();
        state.shellCount++;
        document.getElementById('shellCount').innerText = state.shellCount;
        document.getElementById('statsShells').innerText = state.shellCount;
        
        showFloatingFX(e.clientX, e.clientY, '+1 🐚');
        shell.remove();
    };

    area.appendChild(shell);
    setTimeout(() => { if (shell.parentElement) shell.remove(); }, 8000);
}

export function interactCharacter() {
    const char = document.getElementById('cartoonChar');
    char.classList.add('animate-wiggle');
    setTimeout(() => char.classList.remove('animate-wiggle'), 400);

    const rect = char.getBoundingClientRect();
    showFloatingFX(rect.left + rect.width / 2, rect.top, Math.random() > 0.5 ? '💖' : '🍹');

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    showTip(randomPhrase);
}

export function showFloatingFX(x, y, text) {
    const container = document.getElementById('fxContainer');
    const fx = document.createElement('div');
    fx.className = 'absolute floating-fx text-2xl font-bold text-rose-500 pointer-events-none';
    fx.style.left = (Math.random() * 60 - 30) + 'px';
    fx.innerText = text;
    container.appendChild(fx);
    setTimeout(() => fx.remove(), 1200);
}

export function showTip(msg) {
    document.getElementById('tipText').innerText = msg;
}

export function selectDrink(name, color, icon) {
    document.getElementById('drinkLiquid').style.backgroundColor = color;
    closeMenu('drinkModal');
    showTip(`Enjoying your fresh ${name} ${icon}`);
}

export function toggleUmbrella() {
    state.umbrellaOpen = !state.umbrellaOpen;
    const umbrella = document.getElementById('umbrella');
    umbrella.style.transform = state.umbrellaOpen ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0) translateY(50px)';
    showTip(state.umbrellaOpen ? 'Umbrella opened for shade ⛱️' : 'Soaking up the warm sun ☀️');
}

export function openMenu(id) {
    document.getElementById(id).classList.remove('hidden');
}

export function closeMenu(id) {
    document.getElementById(id).classList.add('hidden');
}

export function resetProgress() {
    state.shellCount = 0;
    document.getElementById('shellCount').innerText = '0';
    document.getElementById('statsShells').innerText = '0';
    closeMenu('settingsModal');
    showTip('Progress reset ✨');
}