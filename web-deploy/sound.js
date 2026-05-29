'use strict';

const SoundEngine = (() => {
  let _ctx = null;
  let _masterGain = null;
  let _muted = false;
  let _volume = 0.6;
  let _currentBgm = null;
  let _bgmNodes = [];
  let _bgmTimeout = null;
  let _prevSceneBgm = null;

  // Note frequencies (Hz)
  const N = {
    C2:65.41, D2:73.42, E2:82.41, F2:87.31, G2:98.00, A2:110.00, B2:123.47,
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, Bb3:233.08, B3:246.94,
    C4:261.63, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, G4:392.00, Ab4:415.30, A4:440.00, Bb4:466.16, B4:493.88,
    C5:523.25, D5:587.33, Eb5:622.25, E5:659.25, F5:698.46, G5:783.99, Ab5:830.61, A5:880.00, B5:987.77,
    C6:1046.50,
    R: 0,
  };

  // ============================================================
  //  BGM Definitions
  //  tracks: [{ type, gain, notes: [[freq, beats], ...] }]
  // ============================================================
  const BGM_DEFS = {
    title: {
      bpm: 80,
      tracks: [
        { type:'triangle', gain:0.26, notes:[
          [N.G4,1],[N.G4,0.5],[N.A4,0.5],[N.G4,1],[N.E4,1],
          [N.C5,1],[N.B4,0.5],[N.A4,0.5],[N.G4,2],
          [N.A4,1],[N.A4,0.5],[N.B4,0.5],[N.A4,1],[N.F4,1],
          [N.G4,2],[N.E4,1],[N.R,1],
          [N.E4,1],[N.F4,0.5],[N.G4,0.5],[N.A4,1],[N.B4,1],
          [N.C5,2],[N.G4,2],
          [N.D5,1],[N.C5,0.5],[N.B4,0.5],[N.A4,1],[N.G4,1],
          [N.C5,4],
        ]},
        { type:'sine', gain:0.16, notes:[
          [N.C3,4],[N.G3,4],[N.F3,4],[N.G3,4],
          [N.C3,4],[N.G3,4],[N.F3,4],[N.C3,4],
        ]},
        { type:'sine', gain:0.11, notes:[
          [N.E4,2],[N.G4,2],[N.D4,2],[N.E4,2],
          [N.C4,2],[N.E4,2],[N.D4,2],[N.C4,2],
          [N.E4,2],[N.G4,2],[N.D4,2],[N.E4,2],
          [N.F4,2],[N.E4,2],[N.D4,2],[N.C4,2],
        ]},
      ],
    },

    village: {
      bpm: 104,
      tracks: [
        { type:'triangle', gain:0.20, notes:[
          [N.G4,1],[N.A4,1],[N.B4,1],[N.D5,1],
          [N.B4,1],[N.A4,1],[N.G4,2],
          [N.D5,1],[N.B4,1],[N.A4,1],[N.G4,1],
          [N.A4,2],[N.D4,2],
          [N.E4,1],[N.F4,1],[N.G4,1],[N.A4,1],
          [N.G4,1],[N.F4,1],[N.E4,2],
          [N.D4,1],[N.E4,1],[N.F4,1],[N.G4,1],
          [N.G4,4],
        ]},
        { type:'sine', gain:0.13, notes:[
          [N.G3,2],[N.D3,2],[N.G3,2],[N.D3,2],
          [N.G3,2],[N.D3,2],[N.G3,2],[N.G3,2],
          [N.C3,2],[N.G3,2],[N.C3,2],[N.G3,2],
          [N.G3,2],[N.D3,2],[N.G3,4],
        ]},
        { type:'sine', gain:0.09, notes:[
          [N.D4,2],[N.B3,2],[N.D4,2],[N.B3,2],
          [N.G3,2],[N.A3,2],[N.G3,4],
          [N.E3,2],[N.C3,2],[N.D3,2],[N.G3,2],
          [N.G3,4],[N.R,4],
        ]},
      ],
    },

    dungeon: {
      bpm: 68,
      tracks: [
        { type:'sawtooth', gain:0.13, notes:[
          [N.A4,1],[N.R,0.5],[N.G4,0.5],[N.F4,1],[N.E4,1],
          [N.A4,1.5],[N.G4,0.5],[N.E4,2],
          [N.F4,1],[N.E4,0.5],[N.D4,0.5],[N.C4,1],[N.B3,1],
          [N.A3,4],
          [N.E4,1],[N.R,0.5],[N.D4,0.5],[N.C4,1],[N.B3,1],
          [N.A3,1.5],[N.B3,0.5],[N.E4,2],
          [N.G4,1],[N.F4,1],[N.E4,1],[N.D4,1],
          [N.A3,4],
        ]},
        { type:'sine', gain:0.18, notes:[
          [N.A2,4],[N.A2,4],[N.E3,4],[N.A2,4],
          [N.F2,4],[N.E2,4],[N.A2,4],[N.A2,4],
        ]},
        { type:'triangle', gain:0.07, notes:[
          [N.C4,2],[N.R,2],[N.B3,2],[N.R,2],
          [N.A3,2],[N.R,2],[N.G3,2],[N.R,2],
          [N.F3,2],[N.R,2],[N.E3,2],[N.R,2],
          [N.A3,2],[N.R,2],[N.A3,2],[N.R,2],
        ]},
      ],
    },

    battle: {
      bpm: 148,
      tracks: [
        { type:'sawtooth', gain:0.16, notes:[
          [N.D5,0.5],[N.C5,0.5],[N.B4,0.5],[N.A4,0.5],[N.G4,1],[N.F4,0.5],[N.G4,0.5],
          [N.A4,0.5],[N.B4,0.5],[N.C5,0.5],[N.D5,0.5],[N.E5,2],
          [N.D5,0.5],[N.C5,0.5],[N.A4,0.5],[N.G4,0.5],[N.F4,1],[N.E4,0.5],[N.F4,0.5],
          [N.G4,0.5],[N.A4,0.5],[N.G4,0.5],[N.F4,0.5],[N.D4,2],
          [N.A4,0.5],[N.R,0.5],[N.A4,0.5],[N.R,0.5],[N.G4,1],[N.R,1],
          [N.F4,0.5],[N.G4,0.5],[N.A4,0.5],[N.G4,0.5],[N.F4,2],
          [N.G4,0.5],[N.A4,0.5],[N.B4,0.5],[N.A4,0.5],[N.G4,1],[N.F4,1],
          [N.D4,4],
        ]},
        { type:'square', gain:0.08, notes:[
          [N.D4,1],[N.A3,1],[N.G3,1],[N.D4,1],
          [N.C4,1],[N.G3,1],[N.A3,1],[N.D4,1],
          [N.D4,1],[N.A3,1],[N.G3,1],[N.F3,1],
          [N.G3,1],[N.D3,1],[N.A3,1],[N.D4,1],
          [N.D4,1],[N.A3,1],[N.G3,1],[N.D4,1],
          [N.C4,1],[N.G3,1],[N.A3,1],[N.F3,1],
          [N.G3,1],[N.F3,1],[N.G3,1],[N.A3,1],
          [N.D3,2],[N.D3,2],
        ]},
        { type:'sine', gain:0.22, notes:[
          [N.D3,0.5],[N.R,0.5],[N.D3,0.5],[N.R,0.5],
          [N.A2,0.5],[N.R,0.5],[N.G2,0.5],[N.A2,0.5],
          [N.G2,0.5],[N.R,0.5],[N.G2,0.5],[N.R,0.5],
          [N.A2,0.5],[N.R,0.5],[N.D3,0.5],[N.R,0.5],
          [N.D3,0.5],[N.R,0.5],[N.D3,0.5],[N.R,0.5],
          [N.C3,0.5],[N.R,0.5],[N.A2,0.5],[N.R,0.5],
          [N.G2,0.5],[N.R,0.5],[N.F2,0.5],[N.R,0.5],
          [N.D2,1],[N.R,1],
        ]},
      ],
    },

    boss: {
      bpm: 118,
      tracks: [
        { type:'sawtooth', gain:0.18, notes:[
          [N.B4,0.5],[N.A4,0.5],[N.G4,1],[N.B4,1],[N.A4,0.5],[N.G4,0.5],
          [N.E4,1],[N.D4,0.5],[N.E4,0.5],[N.G4,2],
          [N.E5,0.5],[N.D5,0.5],[N.C5,1],[N.B4,1],[N.A4,0.5],[N.G4,0.5],
          [N.B4,2],[N.A4,2],
          [N.B4,0.5],[N.C5,0.5],[N.D5,0.5],[N.C5,0.5],[N.B4,1],[N.A4,1],
          [N.G4,4],
          [N.D5,0.5],[N.C5,0.5],[N.B4,1],[N.A4,1],[N.G4,1],
          [N.E4,0.5],[N.G4,0.5],[N.A4,4],
        ]},
        { type:'sawtooth', gain:0.08, notes:[
          [N.G4,2],[N.D4,2],[N.E4,2],[N.D4,2],
          [N.C4,2],[N.B3,2],[N.G3,2],[N.A3,2],
          [N.G4,2],[N.E4,2],[N.D4,2],[N.C4,2],
          [N.B3,2],[N.A3,2],[N.G3,4],
        ]},
        { type:'sine', gain:0.24, notes:[
          [N.B2,2],[N.A2,2],[N.G2,2],[N.A2,2],
          [N.E3,2],[N.D3,2],[N.C3,2],[N.B2,2],
          [N.B2,2],[N.C3,2],[N.D3,2],[N.G2,2],
          [N.D3,2],[N.C3,2],[N.B2,2],[N.A2,2],
        ]},
      ],
    },

    demon_king: {
      bpm: 132,
      tracks: [
        { type:'sawtooth', gain:0.17, notes:[
          [N.A4,0.5],[N.G4,0.5],[N.E4,1],[N.A4,1],[N.G4,0.5],[N.A4,0.5],
          [N.C5,2],[N.B4,2],
          [N.G5,0.5],[N.F5,0.5],[N.E5,1],[N.D5,1],[N.C5,0.5],[N.B4,0.5],
          [N.A4,4],
          [N.E5,0.5],[N.D5,0.5],[N.C5,0.5],[N.B4,0.5],[N.A4,1],[N.G4,1],
          [N.F4,0.5],[N.G4,0.5],[N.A4,1],[N.E4,1],[N.A4,1],
          [N.D5,0.5],[N.C5,0.5],[N.B4,1],[N.A4,1],[N.G4,0.5],[N.E4,0.5],
          [N.A3,4],
        ]},
        { type:'square', gain:0.10, notes:[
          [N.A3,2],[N.E3,2],[N.G3,2],[N.D3,2],
          [N.A3,2],[N.E3,2],[N.G3,2],[N.E3,2],
          [N.A3,2],[N.G3,2],[N.F3,2],[N.E3,2],
          [N.D3,2],[N.C3,2],[N.A2,4],
        ]},
        { type:'sine', gain:0.26, notes:[
          [N.A2,1],[N.R,0.5],[N.A2,0.5],[N.E2,1],[N.R,0.5],[N.G2,0.5],
          [N.A2,2],[N.G2,2],
          [N.A2,1],[N.R,0.5],[N.A2,0.5],[N.G2,1],[N.R,0.5],[N.E2,0.5],
          [N.A2,4],
          [N.A2,1],[N.R,0.5],[N.E2,0.5],[N.G2,1],[N.R,1],
          [N.F2,1],[N.G2,1],[N.A2,2],
          [N.D3,1],[N.R,0.5],[N.C3,0.5],[N.B2,1],[N.A2,1],
          [N.A2,4],
        ]},
      ],
    },

    victory: {
      bpm: 126,
      oneShot: true,
      tracks: [
        { type:'triangle', gain:0.30, notes:[
          [N.C4,0.5],[N.E4,0.5],[N.G4,0.5],[N.C5,1],
          [N.G4,0.5],[N.E4,0.5],[N.C5,1],[N.R,0.5],
          [N.G4,0.5],[N.A4,0.5],[N.B4,0.5],[N.C5,1.5],[N.R,0.5],
          [N.C5,0.5],[N.B4,0.5],[N.A4,0.5],[N.G4,0.5],[N.E4,0.5],[N.C4,0.5],[N.G3,0.5],[N.C4,2],
        ]},
        { type:'sine', gain:0.16, notes:[
          [N.C3,2],[N.G3,2],[N.F3,2],[N.C3,2],[N.G2,2],[N.C3,4],
        ]},
      ],
    },

    gameover: {
      bpm: 56,
      oneShot: true,
      tracks: [
        { type:'sine', gain:0.26, notes:[
          [N.A4,1.5],[N.G4,0.5],[N.F4,1],[N.E4,1],[N.R,1],
          [N.A3,1.5],[N.G3,0.5],[N.F3,1],[N.E3,1],[N.R,1],
          [N.A2,2],[N.E3,2],[N.A2,3],[N.R,2],
        ]},
        { type:'triangle', gain:0.11, notes:[
          [N.E4,2],[N.D4,2],[N.C4,4],
          [N.E3,2],[N.D3,2],[N.A2,4],
          [N.R,9],
        ]},
      ],
    },

    ending: {
      bpm: 70,
      tracks: [
        { type:'triangle', gain:0.22, notes:[
          [N.G4,1],[N.E4,1],[N.C4,2],[N.G4,1],[N.A4,1],[N.B4,1],[N.C5,1],
          [N.D5,2],[N.B4,1],[N.G4,1],[N.A4,4],
          [N.C5,1],[N.B4,1],[N.A4,1],[N.G4,1],[N.F4,2],[N.G4,2],
          [N.E4,2],[N.G4,2],[N.C4,4],
          [N.E4,1],[N.G4,1],[N.A4,1],[N.B4,1],[N.C5,2],[N.D5,2],
          [N.E5,2],[N.C5,1],[N.D5,1],[N.B4,4],
          [N.G4,1],[N.A4,1],[N.B4,1],[N.A4,1],[N.G4,1],[N.F4,1],[N.E4,1],[N.G4,1],
          [N.C4,8],
        ]},
        { type:'sine', gain:0.14, notes:[
          [N.C3,4],[N.G3,4],[N.F3,4],[N.C3,4],
          [N.G2,4],[N.G3,4],[N.C3,4],[N.C3,4],
          [N.G3,4],[N.A3,4],[N.G3,4],[N.F3,4],
          [N.G3,4],[N.G2,4],[N.C2,8],
        ]},
        { type:'sine', gain:0.10, notes:[
          [N.E4,2],[N.D4,2],[N.A3,2],[N.E4,2],
          [N.D4,2],[N.B3,2],[N.C4,2],[N.G3,2],
          [N.C4,2],[N.E4,2],[N.D4,2],[N.B3,2],
          [N.C4,2],[N.G3,2],[N.C3,4],[N.R,4],
        ]},
      ],
    },
  };

  // ============================================================
  //  Scene → BGM mapping
  // ============================================================
  const SCENE_BGM = {
    village:'village', village_inn:'village', village_shop:'village',
    village_smith:'village', village_elder:'village', village_stable:'village',
    desert_oasis:'village', desert_oasis_heal:'village',
    snow_village:'village', snow_inn:'village', snow_shop:'village',
    sea_harbor:'village', sea_return:'village',
    post_clear_hub:'village', airship_dealer:'village',
    grasslands_spot:'village', south_island_spot:'village',
    sky_island_hub:'village', sky_island_spot:'village',
    leveling_hub:'village',
    forest:'dungeon', forest_depth:'dungeon',
    cave:'dungeon', cave_b2:'dungeon', cave_b3:'dungeon',
    ruins:'dungeon', ruins_b2:'dungeon', ruins_b3:'dungeon',
    sea:'dungeon',
    underwater_temple:'dungeon', underwater_temple_b2:'dungeon',
    volcano:'dungeon', volcano_b2:'dungeon',
    demon_castle:'boss', demon_castle_b2:'boss', demon_castle_b3:'boss',
    tower_of_gods:'boss', tower_of_gods_b2:'boss', tower_of_gods_b3:'boss',
    endless_trial:'boss',
    final_boss:'demon_king',
    ending_scene:'ending',
  };

  // ============================================================
  //  Audio utilities
  // ============================================================
  function _ensure() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _masterGain = _ctx.createGain();
      _masterGain.gain.value = _muted ? 0 : _volume;
      _masterGain.connect(_ctx.destination);
    }
    if (_ctx.state === 'suspended') _ctx.resume();
  }

  function _note(freq, start, dur, type, gain, bus) {
    if (!_ctx || freq <= 0) return null;
    const osc = _ctx.createOscillator();
    const g = _ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(bus || _masterGain);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.025);
    g.gain.setValueAtTime(gain, start + dur * 0.75);
    g.gain.linearRampToValueAtTime(0, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
    return { osc, g };
  }

  function _sweep(f1, f2, start, dur, type, gain) {
    if (!_ctx) return;
    const osc = _ctx.createOscillator();
    const g = _ctx.createGain();
    osc.type = type || 'sawtooth';
    osc.frequency.setValueAtTime(f1, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(f2, 10), start + dur);
    osc.connect(g);
    g.connect(_masterGain);
    g.gain.setValueAtTime(gain, start);
    g.gain.linearRampToValueAtTime(0, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function _noise(start, dur, gain, filterFreq) {
    if (!_ctx) return;
    const bufLen = Math.ceil(_ctx.sampleRate * (dur + 0.05));
    const buf = _ctx.createBuffer(1, bufLen, _ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource();
    src.buffer = buf;
    const flt = _ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.value = filterFreq || 400;
    flt.Q.value = 0.5;
    const g = _ctx.createGain();
    src.connect(flt);
    flt.connect(g);
    g.connect(_masterGain);
    g.gain.setValueAtTime(gain, start);
    g.gain.linearRampToValueAtTime(0, start + dur);
    src.start(start);
    src.stop(start + dur + 0.05);
  }

  // ============================================================
  //  BGM scheduler
  // ============================================================
  function _calcDur(name) {
    const d = BGM_DEFS[name];
    if (!d) return 4;
    const beat = 60 / d.bpm;
    let max = 0;
    d.tracks.forEach(t => {
      let b = 0; t.notes.forEach(([,nb]) => b += nb); max = Math.max(max, b);
    });
    return max * beat;
  }

  function _scheduleBgm(name, startTime, bus) {
    const d = BGM_DEFS[name];
    if (!d) return 0;
    const beat = 60 / d.bpm;
    let maxBeats = 0;
    d.tracks.forEach(track => {
      let t = startTime, beats = 0;
      track.notes.forEach(([freq, nb]) => {
        const dur = nb * beat;
        if (freq > 0) {
          const pair = _note(freq, t, dur * 0.9, track.type, track.gain, bus);
          if (pair) { _bgmNodes.push(pair.osc, pair.g); }
        }
        t += dur; beats += nb;
      });
      maxBeats = Math.max(maxBeats, beats);
    });
    return maxBeats * beat;
  }

  function _startBgmLoop(name) {
    _ensure();
    if (!_ctx) return;
    const bus = _ctx.createGain();
    bus.gain.value = 1;
    bus.connect(_masterGain);
    _bgmNodes.push(bus);

    const t0 = _ctx.currentTime + 0.05;
    const dur = _scheduleBgm(name, t0, bus);
    const data = BGM_DEFS[name];
    if (!data.oneShot) {
      const waitMs = Math.max(100, (dur - 0.2) * 1000);
      _bgmTimeout = setTimeout(() => {
        if (_currentBgm === name) { _stopNodes(); _startBgmLoop(name); }
      }, waitMs);
    }
  }

  function _stopNodes() {
    if (_bgmTimeout) { clearTimeout(_bgmTimeout); _bgmTimeout = null; }
    _bgmNodes.forEach(n => {
      try { n.stop && n.stop(0); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    });
    _bgmNodes = [];
  }

  // ============================================================
  //  SFX Definitions
  // ============================================================
  const SFX = {
    attack(t) {
      _sweep(320, 80, t, 0.13, 'sawtooth', 0.32);
      _noise(t, 0.09, 0.18, 900);
    },
    magic_fire(t) {
      _sweep(200, 900, t, 0.18, 'sawtooth', 0.22);
      _sweep(350, 1400, t + 0.06, 0.14, 'triangle', 0.15);
      _noise(t, 0.22, 0.12, 500);
    },
    magic_ice(t) {
      [900, 1300, 1700, 2100].forEach((f, i) => {
        _note(f, t + i * 0.045, 0.18, 'triangle', 0.13, null);
      });
      _sweep(2000, 400, t + 0.05, 0.22, 'triangle', 0.10);
    },
    magic_thunder(t) {
      for (let i = 0; i < 3; i++) {
        _noise(t + i * 0.055, 0.04, 0.28, 1100 + i * 250);
        _sweep(1200, 150, t + i * 0.055, 0.05, 'sawtooth', 0.22);
      }
    },
    magic_light(t) {
      [N.C5, N.E5, N.G5, N.C5].forEach((f, i) => {
        _note(f, t + i * 0.07, 0.22, 'sine', 0.20, null);
      });
      _sweep(1000, 4000, t + 0.12, 0.22, 'triangle', 0.08);
    },
    magic_dark(t) {
      _note(60, t, 0.35, 'sawtooth', 0.20, null);
      _sweep(220, 55, t, 0.28, 'sawtooth', 0.16);
      _noise(t, 0.18, 0.12, 80);
    },
    damage(t) {
      _note(120, t, 0.10, 'square', 0.30, null);
      _sweep(450, 90, t, 0.22, 'sawtooth', 0.22);
      _noise(t, 0.14, 0.22, 220);
    },
    heal(t) {
      [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => {
        _note(f, t + i * 0.09, 0.28, 'sine', 0.18, null);
      });
      _sweep(600, 1800, t + 0.18, 0.22, 'triangle', 0.10);
    },
    levelUp(t) {
      [N.C4, N.E4, N.G4, N.C5, N.E5, N.G5].forEach((f, i) => {
        _note(f, t + i * 0.09, 0.28, 'triangle', 0.22, null);
      });
      _note(N.C6, t + 0.56, 0.55, 'sine', 0.18, null);
    },
    itemGet(t) {
      [N.G4, N.A4, N.B4, N.G5].forEach((f, i) => {
        _note(f, t + i * 0.08, 0.20, 'triangle', 0.20, null);
      });
    },
    click(t) {
      _note(900, t, 0.04, 'square', 0.10, null);
    },
    titleGet(t) {
      [N.C4, N.E4, N.G4, N.C5].forEach((f, i) => {
        _note(f, t + i * 0.11, 0.32, 'triangle', 0.24, null);
      });
      _note(N.G5, t + 0.48, 0.55, 'triangle', 0.20, null);
      _note(N.C5, t + 0.52, 0.65, 'sine', 0.14, null);
    },
  };

  // ============================================================
  //  Settings persistence
  // ============================================================
  function _loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('rpg_sound') || '{}');
      if (typeof s.volume === 'number') _volume = Math.max(0, Math.min(1, s.volume));
      if (typeof s.muted  === 'boolean') _muted = s.muted;
    } catch(e) {}
  }

  function _saveSettings() {
    try { localStorage.setItem('rpg_sound', JSON.stringify({ volume: _volume, muted: _muted })); } catch(e) {}
  }

  _loadSettings();

  // ============================================================
  //  Public API
  // ============================================================
  const api = {
    playBGM(name) {
      if (_currentBgm === name) return;
      _stopNodes();
      _currentBgm = name;
      if (!name) return;
      _ensure();
      _startBgmLoop(name);
    },

    stopBGM() {
      _stopNodes();
      _currentBgm = null;
    },

    playSFX(name) {
      if (_muted) return;
      _ensure();
      if (!_ctx) return;
      const fn = SFX[name];
      if (fn) fn(_ctx.currentTime + 0.01);
    },

    updateBGMForScene(sceneId) {
      const bgm = SCENE_BGM[sceneId];
      if (bgm) {
        _prevSceneBgm = bgm;
        api.playBGM(bgm);
      }
    },

    startBattleBGM(isBoss, isFinal) {
      if (isFinal) api.playBGM('demon_king');
      else if (isBoss) api.playBGM('boss');
      else api.playBGM('battle');
    },

    playVictory() {
      _stopNodes();
      _currentBgm = 'victory';
      _ensure();
      _startBgmLoop('victory');
      const victoryDur = _calcDur('victory');
      setTimeout(() => {
        const restore = _prevSceneBgm;
        if (restore) api.playBGM(restore);
        else api.stopBGM();
      }, (victoryDur + 0.5) * 1000);
    },

    playGameover() {
      _stopNodes();
      _currentBgm = 'gameover';
      _ensure();
      _startBgmLoop('gameover');
    },

    setVolume(v) {
      _volume = Math.max(0, Math.min(1, v));
      if (_masterGain) _masterGain.gain.value = _muted ? 0 : _volume;
      _saveSettings();
    },

    getVolume() { return _volume; },
    isMuted()   { return _muted; },

    toggleMute() {
      _muted = !_muted;
      if (_masterGain) _masterGain.gain.value = _muted ? 0 : _volume;
      _saveSettings();
      return _muted;
    },

    getCurrentBGM() { return _currentBgm; },
  };

  return api;
})();

// ============================================================
//  Sound Control UI helpers (called from index.html buttons)
// ============================================================
function soundToggleMute() {
  const muted = SoundEngine.toggleMute();
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
}

function soundSetVolume(val) {
  SoundEngine.setVolume(parseFloat(val));
}
