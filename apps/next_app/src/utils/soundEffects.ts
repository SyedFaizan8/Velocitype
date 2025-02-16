import { Howl } from 'howler';

const soundEffects = {
    correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.2 }),
    spacebar: new Howl({ src: ['/sounds/space.mp3'], volume: 0.2 }),
    backspace: new Howl({ src: ['/sounds/backspace.mp3'], volume: 0.2 }),
    error: new Howl({ src: ['/sounds/error.wav'] }),
};

export const playSound = (key: string) => {
    switch (key) {
        case "Error":
            soundEffects.error.play();
            break;
        case 'Space':
            soundEffects.spacebar.play();
            break;
        case 'Backspace':
            soundEffects.backspace.play();
            break;
        default:
            soundEffects.correct.play();
            break;
    }
};
