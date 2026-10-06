let audioCtx = null;
let noiseNode = null, filterNode = null, gainNode = null, lfo = null, lfoGain = null;
let isPlaying = false;

let lofiPlaying = false;
let lofiInterval = null;

export function toggleAudio(onStateChange) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (isPlaying) {
        stopSound();
    } else {
        startSoothingSound();
    }
    if (onStateChange) onStateChange(isPlaying);
}

function startSoothingSound() {
    try {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 400;

        lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.15;
        lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 300;

        lfo.connect(lfoGain);
        lfoGain.connect(filterNode.frequency);

        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.35;

        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start();
        lfo.start();

        isPlaying = true;
    } catch (e) { console.error(e); }
}

function stopSound() {
    if (noiseNode) { try { noiseNode.stop(); } catch(e){} noiseNode.disconnect(); }
    if (lfo) { try { lfo.stop(); } catch(e){} lfo.disconnect(); }
    isPlaying = false;
}

export function adjustVolume(val) {
    if (gainNode && audioCtx) {
        gainNode.gain.value = parseFloat(val);
    }
}

export function toggleLofi(onStateChange) {
    lofiPlaying = !lofiPlaying;
    
    if (lofiPlaying) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        playLofiChord();
        lofiInterval = setInterval(playLofiChord, 3500);
    } else {
        clearInterval(lofiInterval);
    }
    if (onStateChange) onStateChange(lofiPlaying);
}

function playLofiChord() {
    if (!lofiPlaying || !audioCtx) return;
    const chordFrequencies = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 369.99]
    ];
    const chord = chordFrequencies[Math.floor(Math.random() * chordFrequencies.length)];

    chord.forEach((freq, idx) => {
        setTimeout(() => {
            if (!lofiPlaying) return;
            const osc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;

            noteGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.8);
            noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

            osc.connect(noteGain);
            noteGain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 3.2);
        }, idx * 120);
    });
}