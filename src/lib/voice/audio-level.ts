// Genuine mic-reactive levels for the "listening" waveform — a second,
// independent getUserMedia stream analyzed with an AnalyserNode, run purely
// for visualization. SpeechRecognition manages its own mic access internally
// and never exposes amplitude data, so this is the only way to make the
// waveform actually react to the user's voice instead of just looping a
// canned animation.

export interface AudioLevelMeter {
  stop: () => void;
}

export function startAudioLevelMeter(onLevel: (level: number) => void): AudioLevelMeter | null {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return null;

  let stopped = false;
  let stream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let rafId: number | null = null;

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((mediaStream) => {
      if (stopped) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }
      stream = mediaStream;

      const AudioContextCtor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      audioContext = new AudioContextCtor();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (stopped) return;
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const level = Math.min(1, sum / data.length / 110);
        onLevel(level);
        rafId = requestAnimationFrame(tick);
      };
      tick();
    })
    .catch(() => {
      // Mic-level visualization is purely decorative. Permission denial or
      // an environment without it (e.g. Brave's stricter defaults) just
      // means a static waveform — SpeechRecognition requests its own mic
      // access independently and surfaces that failure on its own.
    });

  return {
    stop: () => {
      stopped = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((track) => track.stop());
      audioContext?.close().catch(() => {});
    },
  };
}
