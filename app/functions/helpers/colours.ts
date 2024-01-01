import { randomNumber } from '..';

export function randomHSLValues() {
    const hue = randomNumber(12) * 30;
    const saturation = Math.max(70, randomNumber(100));
    const lightness = randomNumber(70) + 15;

    return { hue, saturation, lightness };
}
