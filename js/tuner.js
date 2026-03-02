// ============================================================
// GUITAR TUNER — autocorrelation pitch detection
// ============================================================

const TUNER_STRINGS = [
  { name: 'E2', freq: 82.41,  label: '6 E' },
  { name: 'A2', freq: 110.00, label: '5 A' },
  { name: 'D3', freq: 146.83, label: '4 D' },
  { name: 'G3', freq: 196.00, label: '3 G' },
  { name: 'B3', freq: 246.94, label: '2 B' },
  { name: 'E4', freq: 329.63, label: '1 e' },
];

// All chromatic note names
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

class GuitarTuner {
  constructor() {
    this.active    = false;
    this.audioCtx  = null;
    this.analyser  = null;
    this.stream    = null;
    this.rafId     = null;

    // Smoothed display values
    this.smoothFreq  = 0;
    this.smoothCents = 0;
    this.alpha       = 0.15; // EMA factor (lower = smoother)

    // Canvas
    this.canvas  = document.getElementById('tuner-canvas');
    this.ctx     = this.canvas ? this.canvas.getContext('2d') : null;

    // DOM refs
    this.elNote     = document.getElementById('tuner-note');
    this.elCents    = document.getElementById('tuner-cents');
    this.elStatus   = document.getElementById('tuner-status');
    this.elFreq     = document.getElementById('tuner-freq');
    this.elBtnStart = document.getElementById('btn-tuner-start');
    this.elStrings  = document.querySelectorAll('.tuner-string-btn');

    this._bindEvents();
  }

  _bindEvents() {
    if (this.elBtnStart) {
      this.elBtnStart.addEventListener('click', () => {
        if (this.active) this.stop(); else this.start();
      });
    }
  }

  async start() {
    if (this.active) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 4096;
      this.analyser.smoothingTimeConstant = 0;
      source.connect(this.analyser);

      this.active = true;
      if (this.elBtnStart) {
        this.elBtnStart.textContent = '⏹ Stop Tuner';
        this.elBtnStart.classList.add('active');
      }
      this._render();
    } catch (err) {
      console.error('Tuner mic error:', err);
      if (this.elStatus) {
        this.elStatus.textContent = 'Mic access denied — check browser permissions';
        this.elStatus.className = 'tuner-status flat';
      }
    }
  }

  stop() {
    this.active = false;
    cancelAnimationFrame(this.rafId);
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
    this.smoothFreq  = 0;
    this.smoothCents = 0;

    if (this.elBtnStart) {
      this.elBtnStart.textContent = '🎤 Start Tuner';
      this.elBtnStart.classList.remove('active');
    }
    if (this.elNote)   this.elNote.textContent   = '—';
    if (this.elCents)  this.elCents.textContent  = '';
    if (this.elFreq)   this.elFreq.textContent   = '';
    if (this.elStatus) { this.elStatus.textContent = 'Press Start Tuner'; this.elStatus.className = 'tuner-status'; }
    this._highlightString(-1);
    this._drawGauge(0, false);
  }

  // ── Autocorrelation pitch detection ──────────────────────
  _detectPitch() {
    if (!this.analyser) return null;

    const buf = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buf);

    // Use first 2048 samples for speed
    const N = 2048;
    const sampleRate = this.audioCtx.sampleRate;

    // RMS check — ignore silence
    let rms = 0;
    for (let i = 0; i < N; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / N);
    if (rms < 0.01) return null;

    // Guitar range: 60 Hz (B1) – 400 Hz (G4 + some headroom)
    const minLag = Math.floor(sampleRate / 400);
    const maxLag = Math.ceil(sampleRate / 60);

    // Compute autocorrelation for lags in guitar range
    let bestLag = -1;
    let bestCorr = -Infinity;

    for (let lag = minLag; lag <= maxLag && lag < N; lag++) {
      let corr = 0;
      for (let i = 0; i < N - lag; i++) {
        corr += buf[i] * buf[i + lag];
      }
      if (corr > bestCorr) {
        bestCorr = corr;
        bestLag  = lag;
      }
    }

    if (bestLag === -1 || bestCorr <= 0) return null;

    // Parabolic interpolation for sub-sample accuracy
    const y1 = bestLag > minLag ? this._acf(buf, N, bestLag - 1) : bestCorr;
    const y2 = bestCorr;
    const y3 = bestLag < maxLag ? this._acf(buf, N, bestLag + 1) : bestCorr;
    const denom = 2 * (2 * y2 - y1 - y3);
    const refinedLag = denom !== 0 ? bestLag + (y1 - y3) / denom : bestLag;

    return sampleRate / refinedLag;
  }

  _acf(buf, N, lag) {
    let sum = 0;
    for (let i = 0; i < N - lag; i++) sum += buf[i] * buf[i + lag];
    return sum;
  }

  // ── Note / cents calculation ──────────────────────────────
  _freqToNoteInfo(freq) {
    // A4 = 440 Hz, MIDI note 69
    const midi  = 12 * Math.log2(freq / 440) + 69;
    const midiR = Math.round(midi);
    const cents = Math.round((midi - midiR) * 100);
    const octave = Math.floor(midiR / 12) - 1;
    const noteName = NOTE_NAMES[((midiR % 12) + 12) % 12];
    return { note: noteName + octave, cents };
  }

  // ── Closest guitar string ─────────────────────────────────
  _closestString(freq) {
    let best = -1, bestDist = Infinity;
    TUNER_STRINGS.forEach((s, i) => {
      const dist = Math.abs(Math.log2(freq / s.freq));
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  // ── Render loop ───────────────────────────────────────────
  _render() {
    if (!this.active) return;
    this.rafId = requestAnimationFrame(() => this._render());

    const rawFreq = this._detectPitch();

    if (rawFreq && rawFreq > 60 && rawFreq < 400) {
      // Smooth with EMA
      this.smoothFreq = this.smoothFreq === 0
        ? rawFreq
        : this.smoothFreq + this.alpha * (rawFreq - this.smoothFreq);

      const info  = this._freqToNoteInfo(this.smoothFreq);
      this.smoothCents = info.cents;

      if (this.elNote)  this.elNote.textContent  = info.note;
      if (this.elFreq)  this.elFreq.textContent  = this.smoothFreq.toFixed(1) + ' Hz';
      if (this.elCents) {
        const sign = info.cents > 0 ? '+' : '';
        this.elCents.textContent = sign + info.cents + '¢';
      }

      // Status
      const absC = Math.abs(info.cents);
      if (this.elStatus) {
        if (absC <= 5) {
          this.elStatus.textContent = 'In Tune ✓';
          this.elStatus.className = 'tuner-status intune';
        } else if (info.cents > 0) {
          this.elStatus.textContent = 'Sharp ▲';
          this.elStatus.className = 'tuner-status sharp';
        } else {
          this.elStatus.textContent = 'Flat ▼';
          this.elStatus.className = 'tuner-status flat';
        }
      }

      this._highlightString(this._closestString(this.smoothFreq));
      this._drawGauge(info.cents, true);
    } else {
      // No signal — decay needle toward center
      this.smoothFreq  *= 0.95;
      this.smoothCents  = Math.round(this.smoothCents * 0.9);
      if (Math.abs(this.smoothFreq) < 0.5) {
        if (this.elNote)   this.elNote.textContent   = '—';
        if (this.elFreq)   this.elFreq.textContent   = '';
        if (this.elCents)  this.elCents.textContent  = '';
        if (this.elStatus) { this.elStatus.textContent = 'Play a note…'; this.elStatus.className = 'tuner-status'; }
        this._highlightString(-1);
      }
      this._drawGauge(this.smoothCents, false);
    }
  }

  // ── Gauge canvas drawing ──────────────────────────────────
  _drawGauge(cents, hasSignal) {
    const canvas = this.canvas;
    if (!canvas) return;

    // Resize if needed
    const W = canvas.offsetWidth  || 300;
    const H = canvas.offsetHeight || 160;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H * 0.92;
    const R  = Math.min(W * 0.44, H * 0.82);

    // Angle range: ±80° from bottom vertical (π/2)
    // cents ∈ [-50, 50] → angle offset
    const maxAngle = (80 * Math.PI) / 180;
    const needleAngle = (Math.PI / 2) + maxAngle * Math.min(Math.max(cents / 50, -1), 1);

    // ── Arc zones ───────────────────────────────────────────
    const arcStart = Math.PI / 2 - maxAngle;
    const arcEnd   = Math.PI / 2 + maxAngle;

    // Red outer zone
    ctx.beginPath();
    ctx.arc(cx, cy, R, arcStart, arcEnd);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth   = 14;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Yellow middle zone (±30¢)
    const yellowFrac = 30 / 50;
    const yellowStart = Math.PI / 2 - maxAngle * yellowFrac;
    const yellowEnd   = Math.PI / 2 + maxAngle * yellowFrac;
    ctx.beginPath();
    ctx.arc(cx, cy, R, yellowStart, yellowEnd);
    ctx.strokeStyle = '#e8a534';
    ctx.lineWidth   = 14;
    ctx.stroke();

    // Green center zone (±10¢)
    const greenFrac = 10 / 50;
    const greenStart = Math.PI / 2 - maxAngle * greenFrac;
    const greenEnd   = Math.PI / 2 + maxAngle * greenFrac;
    ctx.beginPath();
    ctx.arc(cx, cy, R, greenStart, greenEnd);
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth   = 14;
    ctx.stroke();

    // ── Tick marks ──────────────────────────────────────────
    const ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];
    ticks.forEach(c => {
      const a = (Math.PI / 2) + maxAngle * (c / 50);
      const isMajor = c % 25 === 0;
      const r1 = R - (isMajor ? 18 : 10);
      const r2 = R + 4;
      ctx.beginPath();
      ctx.moveTo(cx + r1 * Math.cos(a), cy - r1 * Math.sin(a));
      ctx.lineTo(cx + r2 * Math.cos(a), cy - r2 * Math.sin(a));
      ctx.strokeStyle = isMajor ? '#d4c5a9' : '#6a6058';
      ctx.lineWidth   = isMajor ? 2 : 1;
      ctx.stroke();
    });

    // ── Needle ───────────────────────────────────────────────
    if (hasSignal || Math.abs(cents) > 0.5) {
      const absC = Math.abs(cents);
      const needleColor = absC <= 5 ? '#2ecc71' : absC <= 15 ? '#e8a534' : '#e74c3c';

      // Needle line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + (R - 10) * Math.cos(needleAngle),
        cy - (R - 10) * Math.sin(needleAngle)
      );
      ctx.strokeStyle = needleColor;
      ctx.lineWidth   = 3;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Pivot circle
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = needleColor;
      ctx.fill();
    }

    // ── Center label: 0¢ ────────────────────────────────────
    ctx.fillStyle = '#6a6058';
    ctx.font = `${Math.max(10, R * 0.09)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('0', cx, cy - R - 6);
  }

  // ── String buttons ────────────────────────────────────────
  _highlightString(idx) {
    this.elStrings.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
  }
}

// Singleton; instantiated after DOM ready
let tunerInstance = null;
function initTuner() {
  tunerInstance = new GuitarTuner();
}
