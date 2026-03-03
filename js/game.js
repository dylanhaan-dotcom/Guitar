// ============================================================
// COUNTRY GUITAR HERO — Game Engine
// ============================================================

// ---------- Constants ----------

const DIFFICULTY = {
  beginner: {
    label: 'Beginner',
    beatsLookAhead: 20,   // how many beats visible on highway
    toleranceMs: 380,     // timing tolerance for a "hit"
    multiplier: 0.75,
  },
  intermediate: {
    label: 'Intermediate',
    beatsLookAhead: 12,
    toleranceMs: 240,
    multiplier: 1.0,
  },
  expert: {
    label: 'Expert',
    beatsLookAhead: 7,
    toleranceMs: 130,
    multiplier: 1.5,
  }
};

const HIT_QUALITY = {
  PERFECT: { label: 'PERFECT!', color: '#f5c842', points: 300, minMs: 0,   maxMs: 70  },
  GREAT:   { label: 'GREAT',    color: '#3498db', points: 150, minMs: 71,  maxMs: 160 },
  GOOD:    { label: 'GOOD',     color: '#2ecc71', points: 75,  minMs: 161, maxMs: 999 },
  MISS:    { label: 'MISS',     color: '#e74c3c', points: 0,   minMs: -1,  maxMs: -1  },
};

const STRUM_ZONE_Y_RATIO = 0.82; // strum zone at 82% down the highway
const HIGHWAY_PADDING_X   = 50;   // px from edge of canvas

// ---------- Audio Engine ----------

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  _createGain(volume) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(volume, this.ctx.currentTime);
    g.connect(this.ctx.destination);
    return g;
  }

  playMetronome(isDownbeat = false) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this._createGain(0);
    osc.connect(gain);
    osc.frequency.value = isDownbeat ? 1000 : 700;
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playStrum(quality) {
    if (!this.ctx || !this.enabled) return;
    // Guitar strum: 6 sawtooth oscillators at guitar string frequencies
    const freqs   = [82.4, 110, 146.8, 196, 246.9, 329.6]; // E2 A2 D3 G3 B3 E4
    const dur     = quality === 'PERFECT' ? 0.5 : 0.35;
    const vol     = quality === 'MISS' ? 0.0 : 0.04;

    freqs.forEach((freq, i) => {
      const osc  = this.ctx.createOscillator();
      const gain = this._createGain(0);
      osc.connect(gain);
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      const t0 = this.ctx.currentTime + i * 0.018;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    });
  }

  playMiss() {
    if (!this.ctx || !this.enabled) return;
    const osc  = this.ctx.createOscillator();
    const gain = this._createGain(0.15);
    osc.connect(gain);
    osc.type = 'square';
    osc.frequency.value = 120;
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.2);
  }
}

// ---------- Score Manager ----------

class ScoreManager {
  constructor() { this.reset(); }

  reset() {
    this.score    = 0;
    this.streak   = 0;
    this.maxStreak = 0;
    this.hits     = 0;
    this.misses   = 0;
    this.totalNotes = 0;
  }

  getMultiplier() {
    if (this.streak >= 30) return 4;
    if (this.streak >= 20) return 3;
    if (this.streak >= 10) return 2;
    return 1;
  }

  addHit(quality, diffMultiplier) {
    const basePoints = HIT_QUALITY[quality].points;
    this.score += Math.round(basePoints * this.getMultiplier() * diffMultiplier);
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);
    this.hits++;
  }

  addMiss() {
    this.streak = 0;
    this.misses++;
  }

  getAccuracy() {
    const total = this.hits + this.misses;
    if (total === 0) return 100;
    return Math.round((this.hits / total) * 100);
  }

  getGrade() {
    const acc = this.getAccuracy();
    if (acc >= 95) return 'S';
    if (acc >= 88) return 'A';
    if (acc >= 78) return 'B';
    if (acc >= 65) return 'C';
    if (acc >= 50) return 'D';
    return 'F';
  }
}

// ---------- Chord Chromagram Templates ----------
// 12 pitch classes: C C# D D# E F F# G G# A A# B  (indices 0–11)
const CHORD_CHROMA = {
  'G':  [0,0,1,0,0,0,0,1,0,0,0,1],  // G(7) B(11) D(2)
  'C':  [1,0,0,0,1,0,0,1,0,0,0,0],  // C(0) E(4)  G(7)
  'D':  [0,0,1,0,0,0,1,0,0,1,0,0],  // D(2) F#(6) A(9)
  'Em': [0,0,0,0,1,0,0,1,0,0,0,1],  // E(4) G(7)  B(11)
  'Am': [1,0,0,0,1,0,0,0,0,1,0,0],  // C(0) E(4)  A(9)
  'A':  [0,1,0,0,1,0,0,0,0,1,0,0],  // A(9) C#(1) E(4)
  'E':  [0,0,0,0,1,0,0,0,1,0,0,1],  // E(4) G#(8) B(11)
  'A7': [0,1,0,0,1,0,0,1,0,1,0,0],  // A(9) C#(1) E(4) G(7)
  'D7': [1,0,1,0,0,0,1,0,0,1,0,0],  // D(2) F#(6) A(9) C(0)
  'B7': [0,0,0,1,0,0,1,0,0,1,0,1],  // B(11) D#(3) F#(6) A(9)
  'G7': [0,0,1,0,0,1,0,1,0,0,0,1],  // G(7) B(11) D(2) F(5)
};

// ---------- Microphone Input & Chord Detector ----------

class MicInput {
  constructor() {
    this.enabled     = false;
    this.ready       = false;
    this.calibrating = false;
    this.stream      = null;
    this.analyser    = null;
    this.timeData    = null;
    this.freqData    = null;
    this.sampleRate  = 44100;

    this._noiseFloor    = 0.01;
    this._calibSamples  = [];
    this._calibStart    = 0;
    this._CALIB_MS      = 1500;   // shorter calibration (was 2000)
    this._lastStrumMs   = -Infinity;
    this._MIN_STRUM_GAP = 160;    // slightly tighter (was 180)
    this._strumActive   = false;
    this._rmsHistory    = [];
    this._historyLen    = 4;      // shorter window = faster decay (was 8)
  }

  async start(audioCtx) {
    if (this.enabled) return { ok: true };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false }
      });
      const source  = audioCtx.createMediaStreamSource(this.stream);
      this.analyser = audioCtx.createAnalyser();
      this.analyser.fftSize               = 4096;
      this.analyser.smoothingTimeConstant = 0.3;
      source.connect(this.analyser);
      this.timeData  = new Float32Array(this.analyser.fftSize);
      this.freqData  = new Float32Array(this.analyser.frequencyBinCount);
      this.sampleRate = audioCtx.sampleRate;
      this.enabled    = true;
      this.calibrating = true;
      this._calibStart  = performance.now();
      this._calibSamples = [];
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  stop() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.enabled = false;
    this.ready   = false;
    this.calibrating = false;
  }

  // Call every animation frame. Returns { strum, chord, confidence, level, calibrating, calibProgress }
  poll(nowMs) {
    if (!this.enabled || !this.analyser) return { strum: false, level: 0 };

    const rms   = this._getRMS();
    const level = Math.min(1, rms / 0.15);

    // Calibration phase — measure background noise for 2 s
    if (this.calibrating) {
      this._calibSamples.push(rms);
      const progress = (nowMs - this._calibStart) / this._CALIB_MS;
      if (progress >= 1) {
        const sorted  = [...this._calibSamples].sort((a, b) => a - b);
        // Use the 90th-percentile sample as noise floor so occasional
        // room sounds during calibration don't inflate the threshold.
        const p90idx  = Math.floor(sorted.length * 0.9);
        this._noiseFloor = Math.max(0.003, sorted[p90idx] * 1.5);
        this.calibrating = false;
        this.ready = true;
      }
      return { strum: false, level, calibrating: true, calibProgress: Math.min(1, progress) };
    }

    const strum = this._detectStrum(rms, nowMs);

    // Chord detection for ~800 ms after a strum
    let chord = null, confidence = 0;
    if (strum || nowMs - this._lastStrumMs < 800) {
      const res = this._detectChord();
      chord      = res.chord;
      confidence = res.confidence;
    }

    return { strum, chord, confidence, level, calibrating: false };
  }

  get calibProgress() {
    if (!this.calibrating) return 1;
    return Math.min(1, (performance.now() - this._calibStart) / this._CALIB_MS);
  }

  _getRMS() {
    this.analyser.getFloatTimeDomainData(this.timeData);
    let sum = 0;
    for (let i = 0; i < this.timeData.length; i++) sum += this.timeData[i] ** 2;
    return Math.sqrt(sum / this.timeData.length);
  }

  _detectStrum(rms, nowMs) {
    this._rmsHistory.push(rms);
    if (this._rmsHistory.length > this._historyLen) this._rmsHistory.shift();

    const prev    = this._rmsHistory.slice(0, -1);
    const prevAvg = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : 0;

    // Lower absolute floor and multiplier so moderate guitar strums register.
    // noiseFloor is calibrated from the quiet room — 2× is enough headroom.
    const threshold = Math.max(this._noiseFloor * 2, 0.008);  // was *3 / 0.015
    // Spike needs to be 30% above recent average (was 60%).
    // With a 4-frame window the recent avg decays quickly after a strum ends.
    const isSpike   = rms > threshold && rms > prevAvg * 1.3;

    if (isSpike && !this._strumActive && nowMs - this._lastStrumMs > this._MIN_STRUM_GAP) {
      this._strumActive = true;
      this._lastStrumMs = nowMs;
      return true;
    }
    if (rms < threshold * 0.5) this._strumActive = false;
    return false;
  }

  _detectChord() {
    this.analyser.getFloatFrequencyData(this.freqData);
    const chroma = new Float32Array(12).fill(0);
    const C1 = 32.703;   // Hz — lowest C on standard guitar range

    for (let bin = 2; bin < this.freqData.length; bin++) {
      const freq = bin * this.sampleRate / this.analyser.fftSize;
      if (freq < 60 || freq > 2600) continue;
      const db = this.freqData[bin];
      if (db < -80) continue;
      const amp = Math.pow(10, db / 20);
      const semitones = 12 * Math.log2(freq / C1);
      const pc = ((Math.round(semitones) % 12) + 12) % 12;
      chroma[pc] += amp;
    }

    const maxC = Math.max(...chroma);
    if (maxC === 0) return { chord: null, confidence: 0 };
    for (let i = 0; i < 12; i++) chroma[i] /= maxC;

    let best = null, bestSim = 0;
    for (const [name, tmpl] of Object.entries(CHORD_CHROMA)) {
      const sim = this._cosineSim(chroma, tmpl);
      if (sim > bestSim) { bestSim = sim; best = name; }
    }
    return { chord: best, confidence: bestSim };
  }

  _cosineSim(a, b) {
    let dot = 0, mA = 0, mB = 0;
    for (let i = 0; i < 12; i++) { dot += a[i]*b[i]; mA += a[i]**2; mB += b[i]**2; }
    return (mA && mB) ? dot / Math.sqrt(mA * mB) : 0;
  }
}

// ---------- Game State ----------

const State = { MENU: 'menu', LEARN: 'learn', GAME: 'game', PLAYING: 'playing', PAUSED: 'paused', RESULTS: 'results' };

// ---------- Main Game ----------

class Game {
  constructor() {
    this.state        = State.MENU;
    this.currentSong  = null;
    this.difficulty   = 'beginner';
    this.timeline     = [];
    this.startTime    = 0;
    this.elapsed      = 0;
    this.totalMs      = 0;
    this.animId       = null;
    this.beatCount    = 0;
    this.lastBeatTime = -Infinity;
    this.countdownVal = 3;
    this.feedback     = [];  // { text, color, y, alpha, vy }
    this.strumFlash   = 0;   // countdown for flash effect on strum zone

    this.audio   = new AudioEngine();
    this.scorer  = new ScoreManager();
    this.mic     = new MicInput();
    this.micFeedback = null;  // { match, detected, expected, time }
    this.micLevel    = 0;

    // Canvas
    this.canvas  = null;
    this.ctx     = null;

    // DOM refs
    this.dom = {};
  }

  // ---- Initialization ----

  init() {
    this.audio.init();
    this._cacheDom();
    this._buildSongGrid();
    this._bindEvents();
    this._showScreen(State.MENU);
  }

  _cacheDom() {
    const ids = [
      'screen-menu', 'screen-learn', 'screen-game', 'screen-results', 'screen-tuner',
      'song-grid', 'learn-song-title', 'learn-song-meta', 'learn-chords-grid',
      'learn-tips', 'btn-start-game', 'btn-back-menu',
      'highway-canvas', 'hud-score', 'hud-streak', 'hud-multiplier',
      'hud-song-name', 'current-chord-name', 'current-chord-diagram',
      'next-chord-name', 'hud-lyric', 'beat-dots', 'results-score', 'results-accuracy',
      'results-streak', 'results-grade', 'results-song-name',
      'btn-try-again', 'btn-back-songs', 'countdown-display',
      'section-label', 'diff-beginner', 'diff-intermediate', 'diff-expert',
      'pause-overlay', 'btn-resume',
      'btn-mic', 'mic-status', 'mic-level-bar', 'mic-chord-feedback',
      'btn-open-tuner', 'btn-back-tuner'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.dom[id] = el;
    });
  }

  _showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const id = `screen-${name}`;
    if (document.getElementById(id)) {
      document.getElementById(id).classList.add('active');
    }
    this.state = name;
  }

  // ---- Song Grid ----

  _buildSongGrid() {
    const grid = this.dom['song-grid'];
    if (!grid) return;
    grid.innerHTML = '';
    SONGS.forEach(song => {
      const card = document.createElement('div');
      card.className = `song-card diff-${song.difficulty}`;
      card.innerHTML = `
        <div class="song-year">${song.year}</div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
        <div class="song-meta">
          <span class="song-difficulty">${this._diffLabel(song.difficulty)}</span>
          <span class="song-chords">${song.chordsUsed.join(' · ')}</span>
        </div>
        <div class="song-desc">${song.description}</div>
      `;
      card.addEventListener('click', () => this._selectSong(song));
      grid.appendChild(card);
    });
  }

  _diffLabel(d) {
    const labels = { beginner: '⭐ Beginner', intermediate: '⭐⭐ Intermediate', expert: '⭐⭐⭐ Expert' };
    return labels[d] || d;
  }

  // ---- Song Selection -> Learn Screen ----

  _selectSong(song) {
    this.currentSong = song;
    this._showLearnScreen(song);
  }

  _showLearnScreen(song) {
    if (this.dom['learn-song-title']) {
      this.dom['learn-song-title'].textContent = song.title;
    }
    if (this.dom['learn-song-meta']) {
      this.dom['learn-song-meta'].textContent = `${song.artist} · ${song.year} · Key of ${song.key}${song.capo ? ' (Capo ' + song.capo + ')' : ''}`;
    }

    // Chord diagrams
    const chordGrid = this.dom['learn-chords-grid'];
    if (chordGrid) {
      chordGrid.innerHTML = '';
      song.chordsUsed.forEach(chordName => {
        const def = CHORD_DEFS[chordName];
        const item = document.createElement('div');
        item.className = 'learn-chord-item';
        item.innerHTML = `
          <div class="chord-diagram-wrap">${generateChordSVG(chordName, 140, 175)}</div>
          <div class="chord-label">${chordName}</div>
          <div class="chord-full-name">${def ? def.fullName : ''}</div>
          <div class="chord-tip">${def ? def.tip : ''}</div>
        `;
        chordGrid.appendChild(item);
      });
    }

    // Strum pattern on learn screen
    const strumLabel = document.getElementById('learn-strum-label');
    if (strumLabel) strumLabel.textContent = song.strumLabel || '';

    const strumGrid = document.getElementById('learn-strum-grid');
    if (strumGrid && song.strumPattern) {
      strumGrid.innerHTML = song.strumPattern.map(sym => {
        if (sym === 'D') return `<div class="strum-cell down">↓</div>`;
        if (sym === 'U') return `<div class="strum-cell up">↑</div>`;
        return `<div class="strum-cell rest">·</div>`;
      }).join('');
    }

    // Tips
    const tipsEl = this.dom['learn-tips'];
    if (tipsEl && song.tips) {
      tipsEl.innerHTML = '<h3>Tips</h3><ul>' + song.tips.map(t => `<li>${t}</li>`).join('') + '</ul>';
    }

    this._showScreen(State.LEARN);
  }

  // ---- Build Timeline ----

  _buildTimeline(song) {
    const msPerBeat = 60000 / song.bpm;
    let t = 0;
    const timeline = song.progression.map((item, idx) => {
      const durationMs = item.beats * msPerBeat;
      const note = {
        index:      idx,
        chord:      item.chord,
        section:    item.section,
        lyric:      item.lyric || '',
        startMs:    t,
        durationMs: durationMs,
        endMs:      t + durationMs,
        beaten:     false,
        missed:     false,
        hitQuality: null,
      };
      t += durationMs;
      return note;
    });
    this.totalMs = t;
    return timeline;
  }

  // ---- Start Game ----

  async _startGame() {
    if (!this.currentSong) return;
    this.audio.resume();
    this.timeline = this._buildTimeline(this.currentSong);
    this.scorer.reset();
    this.feedback = [];
    this.strumFlash = 0;
    this.beatCount = 0;
    this.lastBeatTime = -Infinity;

    // Auto-enable mic if the browser already granted permission (no prompt shown).
    // If mic is already running from a previous round, leave it as-is.
    if (!this.mic.enabled) {
      try {
        const perm = await navigator.permissions.query({ name: 'microphone' });
        if (perm.state === 'granted') {
          await this.mic.start(this.audio.ctx);
          this._updateMicUI();
        }
      } catch (_) { /* permissions API unavailable — user must click Mic manually */ }
    }

    this._showScreen(State.GAME);  // must be visible before canvas can measure dimensions
    this._setupCanvas();
    this._runCountdown();
  }

  _setupCanvas() {
    const canvas = this.dom['highway-canvas'];
    if (!canvas) return;

    // Remove any previous resize listener
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }

    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    this._resizeHandler = resize;
    window.addEventListener('resize', this._resizeHandler);
  }

  _runCountdown() {
    let count = 3;
    const overlay = document.getElementById('countdown-overlay');
    const display = this.dom['countdown-display'];
    if (overlay) overlay.style.display = 'flex';

    const tick = () => {
      if (display) display.textContent = count;
      this.audio.playMetronome(true);
      count--;
      if (count > 0) {
        setTimeout(tick, 1000);
      } else {
        if (display) display.textContent = 'GO!';
        setTimeout(() => {
          if (overlay) overlay.style.display = 'none';
          this._beginPlaying();
        }, 500);
      }
    };
    tick();
  }

  _beginPlaying() {
    this.state     = State.PLAYING;
    this.startTime = performance.now();
    this._gameLoop(this.startTime);
  }

  // ---- Game Loop ----

  _gameLoop(timestamp) {
    if (this.state !== State.PLAYING) return;

    this.elapsed = timestamp - this.startTime;

    // Auto-expire missed notes
    this.timeline.forEach(note => {
      if (!note.beaten && !note.missed && this.elapsed > note.endMs + 300) {
        note.missed = true;
        this.scorer.addMiss();
      }
    });

    // Microphone polling — detect strums and chords from guitar audio
    if (this.mic.enabled) {
      const nowMs = performance.now();
      const micResult = this.mic.poll(nowMs);
      this.micLevel = micResult.level || 0;

      if (micResult.strum) this._handleStrum();

      if (micResult.chord && micResult.confidence > 0.55) {
        let expectedChord = null;
        for (const note of this.timeline) {
          if (note.startMs <= this.elapsed && this.elapsed < note.endMs) {
            expectedChord = note.chord; break;
          }
        }
        this.micFeedback = {
          match:      micResult.chord === expectedChord,
          detected:   micResult.chord,
          expected:   expectedChord,
          confidence: micResult.confidence,
          time:       nowMs,
        };
      }
      this._updateMicUI();
    }

    // Beat tick
    this._processBeat();

    // Draw
    this._drawHighway();
    this._updateHUD();

    // End of song
    if (this.elapsed >= this.totalMs + 1500) {
      this._endGame();
      return;
    }

    this.animId = requestAnimationFrame(ts => this._gameLoop(ts));
  }

  _processBeat() {
    const song      = this.currentSong;
    const msPerBeat = 60000 / song.bpm;
    const beatNum   = Math.floor(this.elapsed / msPerBeat);
    const beatTime  = beatNum * msPerBeat;

    if (beatTime > this.lastBeatTime + msPerBeat * 0.5) {
      this.lastBeatTime = beatTime;
      this.beatCount    = (this.beatCount % 4) + 1;
      this.audio.playMetronome(this.beatCount === 1);
    }
  }

  // ---- Highway Drawing ----

  _drawHighway() {
    const { ctx, canvas, currentSong, elapsed } = this;
    if (!ctx || !canvas || !currentSong) return;

    const W = canvas.width;
    const H = canvas.height;
    const diff = DIFFICULTY[this.difficulty];
    const msPerBeat   = 60000 / currentSong.bpm;
    const lookAheadMs = diff.beatsLookAhead * msPerBeat;
    const strumY      = H * STRUM_ZONE_Y_RATIO;
    const hPad        = HIGHWAY_PADDING_X;
    const hwLeft      = hPad;
    const hwRight     = W - hPad;
    const hwWidth     = hwRight - hwLeft;

    // Background
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, W, H);

    // Highway background
    const hwGrad = ctx.createLinearGradient(hwLeft, 0, hwRight, 0);
    hwGrad.addColorStop(0,   '#0d0b09');
    hwGrad.addColorStop(0.5, '#161210');
    hwGrad.addColorStop(1,   '#0d0b09');
    ctx.fillStyle = hwGrad;
    ctx.fillRect(hwLeft, 0, hwWidth, H);

    // Highway edge lines
    ctx.strokeStyle = '#3a2e20';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(hwLeft, 0);
    ctx.lineTo(hwLeft, H);
    ctx.moveTo(hwRight, 0);
    ctx.lineTo(hwRight, H);
    ctx.stroke();

    // Subtle fret-like grid lines scrolling
    const gridSpacing = (msPerBeat / lookAheadMs) * H;
    const gridOffset  = ((elapsed % msPerBeat) / lookAheadMs) * H;
    ctx.strokeStyle = '#1e1810';
    ctx.lineWidth   = 1;
    for (let y = strumY - gridOffset; y >= -gridSpacing; y -= gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(hwLeft + 1, y);
      ctx.lineTo(hwRight - 1, y);
      ctx.stroke();
    }
    for (let y = strumY - gridOffset + gridSpacing; y < H; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(hwLeft + 1, y);
      ctx.lineTo(hwRight - 1, y);
      ctx.stroke();
    }

    // Draw chord blocks
    this.timeline.forEach(note => {
      const timeUntilStrum = note.startMs - elapsed;
      // y of the TOP edge of the block when it reaches strum zone
      const blockTopY = strumY - (timeUntilStrum / lookAheadMs) * strumY;
      const blockH    = (note.durationMs / lookAheadMs) * strumY;
      const blockBotY = blockTopY + blockH;

      // Clip to highway (don't draw far off-screen)
      if (blockTopY > H + 20 || blockBotY < -20) return;

      const color = getChordColor(note.chord);
      const alpha = note.beaten ? 0.25 : (note.missed ? 0.1 : 1.0);

      ctx.globalAlpha = alpha;

      // Block body
      const inset = 8;
      const bx = hwLeft + inset;
      const bw = hwWidth - inset * 2;

      // Gradient fill
      const bGrad = ctx.createLinearGradient(bx, blockTopY, bx + bw, blockTopY);
      bGrad.addColorStop(0, this._hexAlpha(color, 0.7));
      bGrad.addColorStop(0.5, this._hexAlpha(color, 0.95));
      bGrad.addColorStop(1, this._hexAlpha(color, 0.7));
      ctx.fillStyle = bGrad;

      this._roundRect(ctx, bx, blockTopY, bw, Math.max(blockH, 4), 6);
      ctx.fill();

      // Glow border
      ctx.shadowColor = color;
      ctx.shadowBlur  = 12;
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.5;
      this._roundRect(ctx, bx, blockTopY, bw, Math.max(blockH, 4), 6);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Chord name + lyric text inside block
      if (blockH > 20 && blockTopY < H - 5 && blockBotY > 5) {
        const hasLyric = note.lyric && note.lyric.trim().length > 0;
        const chordFontSize = Math.min(26, Math.max(14, blockH * 0.35));
        const lyricFontSize = Math.min(13, Math.max(9, blockH * 0.14));

        // Chord name — positioned in upper center of block
        const chordY = hasLyric
          ? Math.max(blockTopY + chordFontSize, blockTopY + blockH * 0.35)
          : Math.max(blockTopY + blockH / 2, blockTopY + chordFontSize);
        const clampedChordY = Math.min(chordY, Math.min(blockBotY - chordFontSize, H - 5));

        ctx.fillStyle    = '#fff';
        ctx.shadowColor  = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur   = 4;
        ctx.font         = `bold ${chordFontSize}px Arial, sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(note.chord, bx + bw / 2, clampedChordY);
        ctx.shadowBlur   = 0;

        // Lyric text — positioned below chord name
        if (hasLyric && blockH > 44) {
          const lyricY = clampedChordY + chordFontSize * 0.8;
          const clampedLyricY = Math.min(lyricY, Math.min(blockBotY - 6, H - 5));
          ctx.fillStyle    = 'rgba(255,255,255,0.75)';
          ctx.font         = `italic ${lyricFontSize}px Arial, sans-serif`;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          // Truncate lyric if too wide for block
          let lyricText = note.lyric;
          ctx.font = `italic ${lyricFontSize}px Arial, sans-serif`;
          while (lyricText.length > 4 && ctx.measureText(lyricText).width > bw - 12) {
            lyricText = lyricText.slice(0, -4) + '…';
          }
          ctx.fillText(lyricText, bx + bw / 2, clampedLyricY);
        }
      }

      ctx.globalAlpha = 1.0;
    });

    // Strum zone
    this._drawStrumZone(ctx, strumY, W, hwLeft, hwRight);

    // Strum pattern visualizer (below strum zone)
    this._drawStrumPattern(ctx, W, H, strumY, hwLeft, hwRight);

    // Floating feedback text
    this._drawFeedback(ctx);

    // Progress bar at top
    const progress = Math.min(1, elapsed / this.totalMs);
    ctx.fillStyle = '#2a2218';
    ctx.fillRect(hwLeft, 0, hwWidth, 5);
    ctx.fillStyle = '#e8a534';
    ctx.fillRect(hwLeft, 0, hwWidth * progress, 5);
  }

  _drawStrumZone(ctx, strumY, W, hwLeft, hwRight) {
    // Background band
    ctx.fillStyle = 'rgba(232,165,52,0.07)';
    ctx.fillRect(hwLeft, strumY - 20, hwRight - hwLeft, 40);

    // Flash color based on strum timing
    const flashIntensity = Math.max(0, this.strumFlash / 20);
    if (flashIntensity > 0) {
      ctx.strokeStyle = `rgba(245,200,66,${flashIntensity})`;
      ctx.lineWidth   = 4;
      ctx.shadowColor = '#f5c842';
      ctx.shadowBlur  = 20 * flashIntensity;
    } else {
      ctx.strokeStyle = '#e8a534';
      ctx.lineWidth   = 2;
      ctx.shadowColor = '#e8a534';
      ctx.shadowBlur  = 8;
    }
    ctx.beginPath();
    ctx.moveTo(hwLeft, strumY);
    ctx.lineTo(hwRight, strumY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // STRUM label
    ctx.fillStyle   = 'rgba(232,165,52,0.5)';
    ctx.font        = '11px Arial, sans-serif';
    ctx.textAlign   = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('STRUM', hwLeft - 6, strumY);

    if (this.strumFlash > 0) this.strumFlash--;
  }

  _drawStrumPattern(ctx, W, H, strumY, hwLeft, hwRight) {
    const song = this.currentSong;
    if (!song || !song.strumPattern) return;

    const pattern   = song.strumPattern;   // 8-element array
    const msPerBeat = 60000 / song.bpm;
    const msPerEighth  = msPerBeat / 2;
    const msPerMeasure = msPerBeat * 4;

    // Which 8th-note position are we on right now?
    const currentPos = Math.floor((this.elapsed % msPerMeasure) / msPerEighth) % 8;

    const cellPad  = 6;
    const areaW    = hwRight - hwLeft - cellPad * 2;
    const cellW    = areaW / 8;
    const cellH    = Math.min(42, (H - strumY - 10) * 0.75);
    const rowY     = strumY + (H - strumY - cellH) / 2;

    for (let i = 0; i < 8; i++) {
      const sym    = pattern[i]; // 'D', 'U', or ''
      const cx     = hwLeft + cellPad + i * cellW;
      const active = i === currentPos;

      // Cell background
      ctx.fillStyle = active ? 'rgba(232,165,52,0.18)' : 'rgba(26,21,16,0.8)';
      this._roundRect(ctx, cx + 2, rowY, cellW - 4, cellH, 5);
      ctx.fill();

      // Cell border
      ctx.strokeStyle = active ? '#e8a534' : '#2a2018';
      ctx.lineWidth   = active ? 1.5 : 1;
      if (active) {
        ctx.shadowColor = '#f5c842';
        ctx.shadowBlur  = 8;
      }
      this._roundRect(ctx, cx + 2, rowY, cellW - 4, cellH, 5);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Arrow / symbol
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      const midX = cx + cellW / 2;
      const midY = rowY + cellH / 2;

      if (sym === 'D') {
        ctx.fillStyle  = active ? '#f5c842' : '#7a5a1a';
        ctx.font       = `bold ${Math.round(cellH * 0.52)}px Arial, sans-serif`;
        ctx.fillText('↓', midX, midY);
      } else if (sym === 'U') {
        ctx.fillStyle  = active ? '#6ab4f5' : '#1a4a7a';
        ctx.font       = `bold ${Math.round(cellH * 0.52)}px Arial, sans-serif`;
        ctx.fillText('↑', midX, midY);
      } else {
        ctx.fillStyle  = active ? 'rgba(232,165,52,0.4)' : '#2a2018';
        ctx.font       = `${Math.round(cellH * 0.3)}px Arial, sans-serif`;
        ctx.fillText('·', midX, midY + 2);
      }

      // Beat number below (1, 2, 3, 4 on even indices; "+" on odd)
      const beatLabel = i % 2 === 0 ? String(i / 2 + 1) : '+';
      ctx.fillStyle   = active ? 'rgba(232,165,52,0.7)' : '#3a2e20';
      ctx.font        = `${Math.round(cellH * 0.22)}px Arial, sans-serif`;
      ctx.fillText(beatLabel, midX, rowY + cellH + 8);
    }
  }

  _drawFeedback(ctx) {
    this.feedback = this.feedback.filter(f => f.alpha > 0.05);
    this.feedback.forEach(f => {
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle   = f.color;
      ctx.font        = 'bold 22px Arial, sans-serif';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = f.color;
      ctx.shadowBlur  = 10;
      ctx.fillText(f.text, f.x, f.y);
      ctx.shadowBlur  = 0;
      f.y    -= 1.2;
      f.alpha -= 0.018;
    });
    ctx.globalAlpha = 1;
  }

  // ---- HUD Update ----

  _updateHUD() {
    const song     = this.currentSong;
    const elapsed  = this.elapsed;

    if (this.dom['hud-score'])      this.dom['hud-score'].textContent      = this.scorer.score.toLocaleString();
    if (this.dom['hud-streak'])     this.dom['hud-streak'].textContent     = `${this.scorer.streak}x`;
    if (this.dom['hud-multiplier']) this.dom['hud-multiplier'].textContent = `×${this.scorer.getMultiplier()}`;
    if (this.dom['hud-song-name'])  this.dom['hud-song-name'].textContent  = `${song.title} — ${song.artist}`;

    // Find current and next chord
    let currentNote = null;
    let nextNote    = null;
    for (let i = 0; i < this.timeline.length; i++) {
      const n = this.timeline[i];
      if (n.startMs <= elapsed && elapsed < n.endMs) {
        currentNote = n;
        nextNote    = this.timeline[i + 1] || null;
        break;
      }
    }
    if (!currentNote) {
      // Before first note or after last
      for (let i = 0; i < this.timeline.length; i++) {
        if (this.timeline[i].startMs > elapsed) {
          nextNote = this.timeline[i];
          break;
        }
      }
    }

    const curChord = currentNote ? currentNote.chord : (nextNote ? nextNote.chord : '—');
    const nxtChord = nextNote ? nextNote.chord : '—';
    const section  = currentNote ? currentNote.section : '';

    if (this.dom['current-chord-name'])    this.dom['current-chord-name'].textContent    = curChord;
    if (this.dom['next-chord-name'])       this.dom['next-chord-name'].textContent       = nxtChord;
    if (this.dom['section-label'])         this.dom['section-label'].textContent         = section;

    // Lyrics — show current note's lyric; keep last lyric while chord is playing
    const lyric = currentNote ? (currentNote.lyric || '') : '';
    if (this.dom['hud-lyric']) {
      if (lyric !== this._lastLyric) {
        this._lastLyric = lyric;
        this.dom['hud-lyric'].textContent = lyric || '♪';
      }
    }

    // Update chord diagram if chord changed
    if (this._lastDisplayedChord !== curChord) {
      this._lastDisplayedChord = curChord;
      if (this.dom['current-chord-diagram']) {
        this.dom['current-chord-diagram'].innerHTML = generateChordSVG(curChord, 130, 160);
      }
    }

    // Beat dots — highlight current beat (1-4)
    if (this.dom['beat-dots']) {
      const dots = this.dom['beat-dots'].querySelectorAll('.beat-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === (this.beatCount - 1) % 4);
      });
    }
  }

  // ---- Input Handling ----

  _handleStrum() {
    if (this.state !== State.PLAYING) return;
    this.audio.resume();

    const elapsed = performance.now() - this.startTime;
    const diff    = DIFFICULTY[this.difficulty];

    // Find the note closest to the strum zone
    let bestNote  = null;
    let bestDelta = Infinity;

    for (const note of this.timeline) {
      if (note.beaten || note.missed) continue;
      const delta = Math.abs(elapsed - note.startMs);
      if (delta < diff.toleranceMs && delta < bestDelta) {
        bestDelta = delta;
        bestNote  = note;
      }
    }

    const canvas  = this.canvas;
    const strumX  = canvas ? canvas.width / 2 : 200;
    const strumY  = canvas ? canvas.height * STRUM_ZONE_Y_RATIO : 300;

    if (bestNote) {
      const quality = bestDelta < 70 ? 'PERFECT' : bestDelta < 160 ? 'GREAT' : 'GOOD';
      bestNote.beaten     = true;
      bestNote.hitQuality = quality;
      this.scorer.addHit(quality, diff.multiplier);
      this.audio.playStrum(quality);
      this.strumFlash = 20;
      this.feedback.push({
        text:  HIT_QUALITY[quality].label,
        color: HIT_QUALITY[quality].color,
        x:     strumX,
        y:     strumY - 40,
        alpha: 1.0,
      });
    } else {
      // Check if we strummed but no note is in range
      const hasUpcoming = this.timeline.some(n => !n.beaten && !n.missed && n.startMs > elapsed);
      if (hasUpcoming) {
        this.scorer.addMiss();
        this.audio.playMiss();
        this.feedback.push({
          text:  'MISS',
          color: '#e74c3c',
          x:     strumX,
          y:     strumY - 40,
          alpha: 1.0,
        });
      } else {
        // Free strum at end of song or before first note — just play sound
        this.audio.playStrum('GOOD');
      }
    }
  }

  // ---- Microphone ----

  async _toggleMic() {
    if (!this.audio.ctx) {
      alert('Audio not available in this browser.');
      return;
    }
    this.audio.resume();

    if (this.mic.enabled) {
      this.mic.stop();
      this.micFeedback = null;
      this.micLevel    = 0;
      this._updateMicUI();
      return;
    }

    // Show "requesting" state immediately
    this._updateMicUI('requesting');
    const result = await this.mic.start(this.audio.ctx);
    if (!result.ok) {
      alert('Microphone access denied.\n\nTo use this feature, allow microphone access in your browser settings and try again.');
    }
    this._updateMicUI();
  }

  _updateMicUI(overrideStatus) {
    const btn       = this.dom['btn-mic'];
    const statusEl  = this.dom['mic-status'];
    const levelBar  = this.dom['mic-level-bar'];
    const feedbackEl= this.dom['mic-chord-feedback'];

    // Determine display status
    let status = overrideStatus;
    if (!status) {
      if (!this.mic.enabled)      status = 'off';
      else if (this.mic.calibrating) status = 'calibrating';
      else if (this.mic.ready)    status = 'ready';
      else                        status = 'starting';
    }

    if (btn) {
      btn.dataset.status = status;
      btn.classList.toggle('active', status !== 'off');
    }

    if (statusEl) {
      const labels = {
        off:          'Off',
        requesting:   'Requesting…',
        starting:     'Starting…',
        calibrating:  `Calibrating… ${Math.round(this.mic.calibProgress * 100)}%`,
        ready:        'Listening',
      };
      statusEl.textContent = labels[status] || status;
    }

    if (levelBar) {
      levelBar.style.width = (this.micLevel * 100).toFixed(1) + '%';
    }

    if (feedbackEl && this.micFeedback) {
      const age = performance.now() - this.micFeedback.time;
      if (age < 2500) {
        const { match, detected, expected } = this.micFeedback;
        if (match) {
          feedbackEl.textContent  = `✓ Sounds like ${detected}!`;
          feedbackEl.className    = 'mic-chord-feedback match';
        } else {
          feedbackEl.textContent  = expected
            ? `Heard ${detected} — need ${expected}`
            : `Heard: ${detected}`;
          feedbackEl.className    = 'mic-chord-feedback mismatch';
        }
      } else {
        feedbackEl.textContent = status === 'ready' ? 'Strum your guitar…' : '';
        feedbackEl.className   = 'mic-chord-feedback';
      }
    }
  }

  // ---- Event Binding ----

  _bindEvents() {
    // Difficulty buttons
    ['beginner', 'intermediate', 'expert'].forEach(d => {
      const btn = this.dom[`diff-${d}`];
      if (btn) btn.addEventListener('click', () => {
        this.difficulty = d;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Mic toggle
    if (this.dom['btn-mic']) {
      this.dom['btn-mic'].addEventListener('click', () => this._toggleMic());
    }

    // Back to menu (from learn screen)
    if (this.dom['btn-back-menu']) {
      this.dom['btn-back-menu'].addEventListener('click', () => this._showScreen(State.MENU));
    }

    // Tuner screen navigation
    if (this.dom['btn-open-tuner']) {
      this.dom['btn-open-tuner'].addEventListener('click', () => {
        this._showScreen('tuner');
        // Lazy-init tuner on first open
        if (!tunerInstance) initTuner();
      });
    }
    if (this.dom['btn-back-tuner']) {
      this.dom['btn-back-tuner'].addEventListener('click', () => {
        if (tunerInstance) tunerInstance.stop();
        this._showScreen(State.MENU);
      });
    }

    // Start game (screen transition handled inside _startGame)
    if (this.dom['btn-start-game']) {
      this.dom['btn-start-game'].addEventListener('click', () => {
        this._startGame();
      });
    }

    // Try again / back from results
    if (this.dom['btn-try-again']) {
      this.dom['btn-try-again'].addEventListener('click', () => this._startGame());
    }
    if (this.dom['btn-back-songs']) {
      this.dom['btn-back-songs'].addEventListener('click', () => {
        this._cancelGame();
        this._showScreen(State.MENU);
      });
    }

    // Resume from pause
    if (this.dom['btn-resume']) {
      this.dom['btn-resume'].addEventListener('click', () => this._resumeGame());
    }

    // Keyboard strum (SPACE) and pause (P / Escape)
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        this._handleStrum();
      }
      if ((e.code === 'KeyP' || e.code === 'Escape') && this.state === State.PLAYING) {
        this._pauseGame();
      } else if ((e.code === 'KeyP' || e.code === 'Escape') && this.state === State.PAUSED) {
        this._resumeGame();
      }
    });

    // Click/tap strum on canvas
    document.addEventListener('click', e => {
      if (this.state === State.PLAYING) {
        const canvas = this.dom['highway-canvas'];
        if (canvas && canvas.contains(e.target)) {
          this._handleStrum();
        }
      }
    });

    // Touch strum
    document.addEventListener('touchstart', e => {
      if (this.state === State.PLAYING) {
        e.preventDefault();
        this._handleStrum();
      }
    }, { passive: false });
  }

  // ---- Pause / Resume ----

  _pauseGame() {
    if (this.state !== State.PLAYING) return;
    this.state = State.PAUSED;
    cancelAnimationFrame(this.animId);
    this._pausedAt = performance.now();
    const po = this.dom['pause-overlay'];
    if (po) po.style.display = 'flex';
  }

  _resumeGame() {
    if (this.state !== State.PAUSED) return;
    const po = this.dom['pause-overlay'];
    if (po) po.style.display = 'none';
    const pausedDuration = performance.now() - this._pausedAt;
    this.startTime += pausedDuration;
    this.state = State.PLAYING;
    this._gameLoop(performance.now());
  }

  _cancelGame() {
    cancelAnimationFrame(this.animId);
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    this.state = State.MENU;
  }

  // ---- End Game ----

  _endGame() {
    cancelAnimationFrame(this.animId);
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    this._showResultsScreen();
  }

  _showResultsScreen() {
    const song = this.currentSong;
    const s    = this.scorer;

    if (this.dom['results-song-name'])  this.dom['results-song-name'].textContent  = `${song.title} — ${song.artist}`;
    if (this.dom['results-score'])      this.dom['results-score'].textContent      = s.score.toLocaleString();
    if (this.dom['results-accuracy'])   this.dom['results-accuracy'].textContent   = `${s.getAccuracy()}%`;
    if (this.dom['results-streak'])     this.dom['results-streak'].textContent     = `${s.maxStreak}x`;
    if (this.dom['results-grade'])      this.dom['results-grade'].textContent      = s.getGrade();

    this._showScreen(State.RESULTS);
  }

  // ---- Helpers ----

  _roundRect(ctx, x, y, w, h, r) {
    if (h < r * 2) r = h / 2;
    if (w < r * 2) r = w / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  _hexAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

// ---- Bootstrap ----

let game;
document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
  game.init();
});
