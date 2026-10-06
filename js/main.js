import { initWaves } from './waves.js';
import { toggleAudio, adjustVolume, toggleLofi } from './audio.js';
import { state, cycleWeather, spawnSeashell, interactCharacter, selectDrink, toggleUmbrella, openMenu, closeMenu, resetProgress } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    initWaves(() => state);

    setInterval(spawnSeashell, 4000);

    document.getElementById('soundToggleBtn').addEventListener('click', () => {
        toggleAudio((isPlaying) => {
            document.getElementById('soundIcon').innerText = isPlaying ? '🔊' : '🔇';
        });
    });

    document.getElementById('settingsBtn').addEventListener('click', () => openMenu('settingsModal'));
    document.getElementById('closeSettingsModal').addEventListener('click', () => closeMenu('settingsModal'));
    
    document.getElementById('drinkMenuBtn').addEventListener('click', () => openMenu('drinkModal'));
    document.getElementById('closeDrinkModal').addEventListener('click', () => closeMenu('drinkModal'));

    document.getElementById('weatherBtn').addEventListener('click', cycleWeather);
    document.getElementById('umbrellaToggleBtn').addEventListener('click', toggleUmbrella);
    
    document.getElementById('lofiToggleBtn').addEventListener('click', () => {
        toggleLofi((lofiPlaying) => {
            document.getElementById('lofiIcon').style.transform = lofiPlaying ? 'scale(1.2) rotate(10deg)' : 'scale(1)';
        });
    });

    document.getElementById('characterWrapper').addEventListener('click', interactCharacter);
    document.getElementById('volumeSlider').addEventListener('input', (e) => adjustVolume(e.target.value));
    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);

    document.querySelectorAll('.drink-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectDrink(btn.dataset.name, btn.dataset.color, btn.dataset.icon);
        });
    });
});