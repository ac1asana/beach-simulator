import { state, cycleWeather, spawnSeashell, interactCharacter, selectDrink, toggleUmbrella, openMenu, closeMenu, resetProgress } from './game.js';
import { toggleAudio, toggleLofi, adjustVolume } from './audio.js';
import { initWaves } from './waves.js';

window.addEventListener('DOMContentLoaded', () => {
    // Initialize background ocean waves canvas
    initWaves(() => state);

    // Spawn seashells periodically
    setInterval(spawnSeashell, 3500);

    // Character tap interaction
    document.getElementById('characterWrapper').addEventListener('click', interactCharacter);

    // Weather / Time cycle button
    document.getElementById('weatherBtn').addEventListener('click', cycleWeather);

    // Umbrella toggle button
    document.getElementById('umbrellaToggleBtn').addEventListener('click', toggleUmbrella);

    // Drink Menu Modal Controls
    document.getElementById('drinkMenuBtn').addEventListener('click', () => openMenu('drinkModal'));
    document.getElementById('closeDrinkModal').addEventListener('click', () => closeMenu('drinkModal'));

    document.querySelectorAll('.drink-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const color = btn.getAttribute('data-color');
            const icon = btn.getAttribute('data-icon');
            selectDrink(name, color, icon);
        });
    });

    // Settings Modal Controls
    document.getElementById('settingsBtn').addEventListener('click', () => openMenu('settingsModal'));
    document.getElementById('closeSettingsModal').addEventListener('click', () => closeMenu('settingsModal'));
    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);

    // Volume slider control
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            adjustVolume(e.target.value);
        });
    }

    // Audio Toggles (Using standard 'click' for optimal mobile browser audio unlocking gesture compliance)
    document.getElementById('lofiToggleBtn').addEventListener('click', () => {
        toggleLofi((isPlaying) => {
            const icon = document.getElementById('lofiIcon');
            icon.innerText = isPlaying ? '⏸️' : '🎶';
        });
    });

    document.getElementById('soundToggleBtn').addEventListener('click', () => {
        toggleAudio((isPlaying) => {
            const icon = document.getElementById('soundIcon');
            icon.innerText = isPlaying ? '🔊' : '🔇';
        });
    });
});