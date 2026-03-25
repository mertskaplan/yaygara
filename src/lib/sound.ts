/**
 * Sound Manager using Web Audio API to generate synthesized sounds.
 * This avoids the need for external audio assets and ensures reliability.
 */

class SoundManager {
    private audioCtx: AudioContext | null = null;

    private init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    private createOscillator(type: OscillatorType, freq: number, startTime: number, duration: number, gainValue: number = 0.3) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(gainValue, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playCorrect() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Ascending chime
        this.createOscillator('triangle', 523.25, now, 0.3, 0.3); // C5
        this.createOscillator('triangle', 659.25, now + 0.1, 0.3, 0.3); // E5
        this.createOscillator('triangle', 783.99, now + 0.2, 0.4, 0.3); // G5
    }

    playPass() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Descending "boop"
        this.createOscillator('sine', 440, now, 0.2, 0.4); // A4
        this.createOscillator('sine', 349.23, now + 0.1, 0.3, 0.3); // F4
    }

    playTick() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Short sharp pulse
        this.createOscillator('square', 880, now, 0.05, 0.15); // A5
    }

    playTimeUp() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Smoother "diloling" chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            this.createOscillator('triangle', freq, now + i * 0.08, 0.4, 0.3);
        });
    }

    playGameOver() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Longer festive triumphant melody
        const melody = [
            { freq: 523.25, time: 0, dur: 0.2 }, // C5
            { freq: 523.25, time: 0.2, dur: 0.2 }, // C5
            { freq: 523.25, time: 0.4, dur: 0.2 }, // C5
            { freq: 659.25, time: 0.6, dur: 0.4 }, // E5
            { freq: 587.33, time: 1.0, dur: 0.2 }, // D5
            { freq: 523.25, time: 1.2, dur: 0.2 }, // C5
            { freq: 659.25, time: 1.4, dur: 0.4 }, // E5
            { freq: 783.99, time: 1.8, dur: 0.8 }, // G5
        ];
        melody.forEach((note) => {
            this.createOscillator('triangle', note.freq, now + note.time, note.dur, 0.3);
        });
    }

    playUndo() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // Short "whoosh" or "undo" sound
        this.createOscillator('sine', 330, now, 0.2, 0.4); // E4
        this.createOscillator('sine', 440, now + 0.05, 0.1, 0.3); // A4
    }

    playPop() {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        // High pitched "pop" or "click" sound
        this.createOscillator('sine', 1200, now, 0.05, 0.2);
    }
}

export const soundManager = new SoundManager();
