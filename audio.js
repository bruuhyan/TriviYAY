// audio.js - Web Audio API Synthesizer
let audioCtx = null;
let musicInterval = null;
let currentTempoIndex = 0;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Memutar efek suara retro yang disintesis secara real-time
 * @param {string} type - Tipe efek: 'click', 'correct', 'wrong', 'start', 'complete'
 * @param {boolean} enabled - Apakah sfx diaktifkan
 */
export const playSFX = (type, enabled) => {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Ambil preferensi volume dari localStorage (default 80%)
    const sfxVol = Number(localStorage.getItem("triviyay-sfx-volume") ?? 80) / 100;

    if (type === "click") {
      // Short metallic retro click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.08 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "correct") {
      // Cheerful major arpeggio: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const time = now + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12 * sfxVol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

        osc.start(time);
        osc.stop(time + 0.25);
      });
    } else if (type === "wrong") {
      // Low buzzy down-glide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.35);

      gain.gain.setValueAtTime(0.14 * sfxVol, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "start") {
      // Energizing ascending fanfare
      const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25]; // C4 -> E4 -> G4 -> C5 -> G4 -> C5
      const durations = [0.08, 0.08, 0.08, 0.16, 0.08, 0.25];
      let offset = 0;
      
      notes.forEach((freq, index) => {
        const time = now + offset;
        const dur = durations[index];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1 * sfxVol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.start(time);
        osc.stop(time + dur);
        offset += dur * 0.85;
      });
    } else if (type === "complete") {
      // Warm final celebration chords
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.08 * sfxVol, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 1.2);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.2);
      });
    }
  } catch (err) {
    console.warn("Gagal memutar SFX:", err);
  }
};

/**
 * Memulai loop musik latar belakang retro chiptune
 * @param {boolean} enabled - Apakah musik diaktifkan
 */
export const startMusic = (enabled) => {
  stopMusic();
  if (!enabled) return;

  try {
    const ctx = getAudioContext();
    
    // Melodi & Bassline Chiptune yang lucu, pelan, dan bersahabat
    // Progression: C -> Am -> F -> G
    const bassline = [
      130.81, 130.81, 130.81, 130.81, // C3
      110.00, 110.00, 110.00, 110.00, // A2
      87.31, 87.31, 87.31, 87.31,     // F2
      98.00, 98.00, 98.00, 98.00       // G2
    ];
    
    const melody = [
      261.63, 329.63, 392.00, 523.25, // C4 -> E4 -> G4 -> C5
      440.00, 349.23, 392.00, 0,      // A4 -> F4 -> G4 -> _
      349.23, 261.63, 293.66, 329.63, // F4 -> C4 -> D4 -> E4
      293.66, 0, 392.00, 0            // D4 -> _ -> G4 -> _
    ];
 
    const playNote = () => {
      const now = ctx.currentTime;
      
      // Ambil preferensi volume musik secara real-time dari localStorage (default 50%)
      const musicVol = Number(localStorage.getItem("triviyay-music-volume") ?? 50) / 100;

      // Putar Bass (Triangle wave lembut)
      const bassFreq = bassline[currentTempoIndex % bassline.length];
      if (bassFreq > 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        
        bassOsc.type = "triangle";
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        
        bassGain.gain.setValueAtTime(0.03 * musicVol, now); // Volume sangat rendah agar tidak berisik
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        bassOsc.start(now);
        bassOsc.stop(now + 0.45);
      }

      // Putar Melodi Utama (Sine wave jernih)
      const melFreq = melody[currentTempoIndex % melody.length];
      if (melFreq > 0) {
        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();
        
        melOsc.connect(melGain);
        melGain.connect(ctx.destination);
        
        melOsc.type = "sine";
        melOsc.frequency.setValueAtTime(melFreq, now);
        
        melGain.gain.setValueAtTime(0.015 * musicVol, now); // Melodi lembut
        melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        melOsc.start(now);
        melOsc.stop(now + 0.35);
      }

      currentTempoIndex++;
    };

    // Mainkan setiap 450ms (Tempo santai)
    musicInterval = setInterval(playNote, 450);
  } catch (err) {
    console.warn("Gagal memutar musik:", err);
  }
};

/**
 * Menghentikan loop musik latar belakang
 */
export const stopMusic = () => {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
};
