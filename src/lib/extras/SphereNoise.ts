import { perlin3D } from '@leodeslf/perlin-noise';

export function getDisplacement(x: number, y: number, z: number): number {
    x += performance.timing.navigationStart;
    x = x/100;
    y = y/100;
    z = z/100;

    // x = x/100;
    // y = y/100;
    // z = z/100;

    let max = 10;
    let min = -2;

    let amp = 1;
    let freq = 1;
    let t = 0;
    for (var i = 1; i < 4; i++) {
        t += perlin3D(x * freq, y * freq, z * freq) * amp;
        amp *= 0.4;
        freq *= 2;
    }

    amp = t / 2;
    freq = 1;
    let n = 0;
    for (var i = 1; i < 13; i++) {
        n += perlin3D(x * freq, y * freq, z * freq) * amp;
        amp *= 0.5;
        freq *= 2;
    }

    if (n > max) max = n;
    if (n < min) min = n;

    // return 1+(0.05*n);
    return 1;

}