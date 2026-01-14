import { useCallback, useRef } from 'react';

// Sound frequencies for different effects
const SOUNDS = {
  correct: { frequency: 523.25, duration: 0.15, type: 'sine' as OscillatorType }, // C5
  correctFast: { frequency: 659.25, duration: 0.2, type: 'sine' as OscillatorType }, // E5
  incorrect: { frequency: 220, duration: 0.3, type: 'sawtooth' as OscillatorType }, // A3
  click: { frequency: 440, duration: 0.05, type: 'sine' as OscillatorType }, // A4
  celebrate: { frequencies: [523.25, 659.25, 783.99], duration: 0.15, type: 'sine' as OscillatorType }, // C5, E5, G5
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', gain: number = 0.3) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  const playCorrect = useCallback(() => {
    const { frequency, duration, type } = SOUNDS.correct;
    playTone(frequency, duration, type);
    setTimeout(() => playTone(frequency * 1.25, duration, type), 100);
  }, [playTone]);

  const playCorrectFast = useCallback(() => {
    // Play a celebratory arpeggio for fast answers
    SOUNDS.celebrate.frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.4), i * 80);
    });
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    const { frequency, duration, type } = SOUNDS.incorrect;
    playTone(frequency, duration, type, 0.2);
  }, [playTone]);

  const playClick = useCallback(() => {
    const { frequency, duration, type } = SOUNDS.click;
    playTone(frequency, duration, type, 0.15);
  }, [playTone]);

  return {
    playCorrect,
    playCorrectFast,
    playIncorrect,
    playClick,
  };
}
