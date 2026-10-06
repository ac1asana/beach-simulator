export function initWaves(getState) {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.26;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let waveStep = 0;

    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isNight = getState().currentWeatherMode === 2;
        const c1 = isNight ? 'rgba(14, 116, 144, 0.5)' : 'rgba(56, 189, 248, 0.4)';
        const c2 = isNight ? 'rgba(30, 58, 138, 0.6)' : 'rgba(14, 165, 233, 0.6)';
        const c3 = isNight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(2, 132, 199, 0.3)';

        drawWaveLayer(ctx, canvas, waveStep, 0.015, 12, 0, c1);
        drawWaveLayer(ctx, canvas, waveStep * 1.3, 0.02, 8, 15, c2);
        drawWaveLayer(ctx, canvas, waveStep * 0.8, 0.01, 15, 5, c3);

        waveStep += 0.03;
        requestAnimationFrame(drawWaves);
    }

    requestAnimationFrame(drawWaves);
}

function drawWaveLayer(ctx, canvas, step, frequency, amplitude, yOffset, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += 10) {
        let y = Math.sin(x * frequency + step) * amplitude + yOffset + (canvas.height * 0.4);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
}