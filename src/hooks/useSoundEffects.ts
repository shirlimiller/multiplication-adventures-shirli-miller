import { useCallback, useRef } from 'react';

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

  // Magical star/chime sound - short ascending sparkle
  const playCorrect = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create a short magical chime/star sound
    const frequencies = [1047, 1319, 1568]; // C6, E6, G6 - high sparkle
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      
      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.12);
      
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.15);
    });
  }, [getAudioContext]);

  // Victory fanfare - short triumphant sound
  const playCorrectFast = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Quick fanfare: C-E-G-C ascending
    const notes = [
      { freq: 523, time: 0, dur: 0.08 },     // C5
      { freq: 659, time: 0.06, dur: 0.08 },  // E5
      { freq: 784, time: 0.12, dur: 0.08 },  // G5
      { freq: 1047, time: 0.18, dur: 0.2 },  // C6 (longer, triumphant)
    ];
    
    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle'; // Softer, more musical
      osc.frequency.setValueAtTime(freq, now + time);
      
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.3, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, now + time + dur);
      
      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  }, [getAudioContext]);

  const playIncorrect = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Soft "wrong" sound - descending
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.2);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }, [getAudioContext]);

  return {
    playCorrect,
    playCorrectFast,
    playIncorrect,
    playClick,
  };
}
