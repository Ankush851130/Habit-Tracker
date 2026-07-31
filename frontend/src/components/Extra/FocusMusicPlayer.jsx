import React, { useState, useEffect, useRef } from 'react';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiClock,
  FiMusic,
  FiSliders,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';
import { GlassCard } from '../Common/GlassCard';
import toast from 'react-hot-toast';

// Expanded Sound Variety Catalogue featuring Nature & Forest Sanctuary
export const FOCUS_TRACKS = [
  // 1. Nature & Forest Sanctuary (Primary Focus for Deep Calm)
  {
    id: 'nature_forest_birds',
    title: 'Morning Forest & Songbirds',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🌲',
    desc: 'Soothing mountain pine forest breeze with gentle birdsong in morning sunlight',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844888e28.mp3',
    fallbackType: 'forest_birds',
    color: 'from-emerald-600 to-green-800',
  },
  {
    id: 'nature_river_stream',
    title: 'Mountain River & Babbling Stream',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🏞️',
    desc: 'Pure freshwater stream bubbling softly over stones surrounded by woodland',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_51bf3e07f2.mp3',
    fallbackType: 'river_stream',
    color: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'nature_rain_leaves',
    title: 'Forest Rain on Canopy Leaves',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🌧️',
    desc: 'Gentle summer rainfall dripping through green canopy leaves in a quiet woods',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_6d20392ef4.mp3',
    fallbackType: 'rain_forest',
    color: 'from-blue-600 to-teal-800',
  },
  {
    id: 'nature_forest_breeze',
    title: 'Autumn Wind & Rustling Leaves',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🍃',
    desc: 'Calming wind whistling through oak trees with gentle leaf rustling soundscape',
    type: 'forest_breeze',
    color: 'from-emerald-700 to-stone-800',
  },
  {
    id: 'nature_night_crickets',
    title: 'Summer Night Forest Crickets',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🦗',
    desc: 'Peaceful nocturnal forest ambience with crickets & subtle night breeze',
    type: 'night_forest',
    color: 'from-slate-800 to-emerald-950',
  },
  {
    id: 'nature_bamboo_zen',
    title: 'Bamboo Forest & Zen Chimes',
    category: 'Nature & Forest Sanctuary 🌿',
    emoji: '🎋',
    desc: 'Tranquil bamboo grove with wooden wind chimes & trickling water',
    type: 'bamboo_zen',
    color: 'from-teal-600 to-emerald-800',
  },

  // 2. Pure Real Rain
  {
    id: 'rain_pure_window',
    title: 'Pure Window Raindrops',
    category: 'Pure Real Rain 🌧️',
    emoji: '☔',
    desc: 'Authentic steady rain pattering softly against a glass window pane',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844888e28.mp3',
    fallbackType: 'rain_window',
    color: 'from-blue-600 to-cyan-700',
  },
  {
    id: 'rain_heavy_downpour',
    title: 'Heavy Downpour & Thunder',
    category: 'Pure Real Rain 🌧️',
    emoji: '⚡',
    desc: 'Deep monsoon rainfall with distant rolling thunder acoustics',
    type: 'rain_heavy_thunder',
    color: 'from-slate-700 to-cyan-900',
  },
  {
    id: 'rain_cozy_roof',
    title: 'Cozy Roof Rainstorm',
    category: 'Pure Real Rain 🌧️',
    emoji: '🏠',
    desc: 'Rhythmic heavy rain pouring on a tin & wooden attic roof',
    type: 'rain_roof',
    color: 'from-blue-700 to-indigo-900',
  },

  // 3. Lofi & Chillhop
  {
    id: 'lofi_study',
    title: 'Lofi Study Beats',
    category: 'Lofi & Chillhop',
    emoji: '🎧',
    desc: 'Chill lofi hip-hop rhythms for productive study & work sessions',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    fallbackType: 'lofi_synth',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'lofi_tokyo',
    title: 'Midnight Tokyo Lofi',
    category: 'Lofi & Chillhop',
    emoji: '🌃',
    desc: 'Relaxing nocturnal lofi beats with subtle city ambience',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792e7.mp3',
    fallbackType: 'binaural_alpha',
    color: 'from-purple-600 to-slate-900',
  },

  // 4. Piano & Acoustic
  {
    id: 'piano_peaceful',
    title: 'Peaceful Solo Piano',
    category: 'Piano & Acoustic',
    emoji: '🎹',
    desc: 'Soft classical acoustic piano melodies for deep reading',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73427.mp3',
    fallbackType: 'zen',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'acoustic_guitar',
    title: 'Soft Acoustic Guitar',
    category: 'Piano & Acoustic',
    emoji: '🎸',
    desc: 'Warm fingerpicked acoustic guitar chords for relaxed focus',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_65be1b8969.mp3',
    fallbackType: 'zen',
    color: 'from-emerald-600 to-teal-800',
  },

  // 5. Binaural & Brainwaves
  {
    id: 'binaural_alpha',
    title: '432Hz Deep Alpha Waves',
    category: 'Binaural & Brainwaves',
    emoji: '🌌',
    desc: '10Hz Alpha frequency tuned for calm alertness & mental clarity',
    type: 'binaural_alpha',
    color: 'from-purple-500 to-indigo-700',
  },
  {
    id: 'binaural_theta',
    title: '528Hz Theta Wave Memory',
    category: 'Binaural & Brainwaves',
    emoji: '🧠',
    desc: '6Hz Theta frequency tuned for deep memory retrieval & creativity',
    type: 'binaural_theta',
    color: 'from-indigo-600 to-violet-800',
  },

  // 6. Cozy & Coffee Shop
  {
    id: 'cafe_paris',
    title: 'Cozy Paris Coffee Shop',
    category: 'Cozy & Coffee Shop',
    emoji: '☕',
    desc: 'Warm Parisian coffeehouse chatter, espresso steam & gentle ambient vibes',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_496c1ed2bd.mp3',
    fallbackType: 'pink_noise',
    color: 'from-amber-700 to-stone-800',
  },
  {
    id: 'fire_hearth',
    title: 'Crackling Hearth Fireplace',
    category: 'Cozy & Coffee Shop',
    emoji: '🔥',
    desc: 'Comforting hearth wood fire crackles and glowing ember soundscape',
    type: 'fire',
    color: 'from-orange-500 to-red-600',
  },

  // 7. White & Colored Noise
  {
    id: 'pink_noise',
    title: 'Pink Noise Focus Filter',
    category: 'White & Colored Noise',
    emoji: '⚪',
    desc: 'Smooth 1/f frequency noise curve to block out background distractions',
    type: 'pink_noise',
    color: 'from-slate-500 to-gray-700',
  },
  {
    id: 'brown_noise',
    title: 'Deep Brown Brownian Noise',
    category: 'White & Colored Noise',
    emoji: '🟤',
    desc: 'Deep bass-heavy brownian noise mimicking airplane cabin & heavy fan',
    type: 'brown_noise',
    color: 'from-stone-600 to-amber-950',
  },
];

const CATEGORIES = [
  'All',
  'Nature & Forest Sanctuary 🌿',
  'Pure Real Rain 🌧️',
  'Lofi & Chillhop',
  'Piano & Acoustic',
  'Binaural & Brainwaves',
  'Cozy & Coffee Shop',
  'White & Colored Noise',
];

// Advanced Web Audio API Procedural Engine with Nature Soundscape Synthesis
class WebAudioEngine {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.activeNodes = [];
    this.intervalId = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(volume) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  playType(type, volume = 0.5) {
    this.init();
    this.stop();
    this.setVolume(volume);

    switch (type) {
      case 'forest_birds':
        this.createForestBirds();
        break;
      case 'river_stream':
        this.createRiverStream();
        break;
      case 'rain_forest':
        this.createForestRain();
        break;
      case 'forest_breeze':
        this.createForestBreeze();
        break;
      case 'night_forest':
        this.createNightForest();
        break;
      case 'bamboo_zen':
        this.createBambooZen();
        break;
      case 'rain_window':
        this.createWindowRain();
        break;
      case 'rain_heavy_thunder':
        this.createHeavyThunderRain();
        break;
      case 'rain_roof':
        this.createRoofRain();
        break;
      case 'binaural_alpha':
        this.createBinauralBeats(216, 226);
        break;
      case 'binaural_theta':
        this.createBinauralBeats(264, 270);
        break;
      case 'fire':
        this.createFireplaceSound();
        break;
      case 'lofi_synth':
        this.createLofiWarmSynth();
        break;
      case 'pink_noise':
        this.createPinkNoise();
        break;
      case 'brown_noise':
        this.createBrownNoise();
        break;
      default:
        this.createForestBirds();
        break;
    }
  }

  // 1. Forest & Songbirds Synthesizer
  createForestBirds() {
    // Pink noise background wind breeze
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    // Random natural bird chirping generator
    this.intervalId = setInterval(() => {
      if (Math.random() > 0.3 && this.ctx) {
        const birdOsc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();
        birdOsc.type = 'sine';

        const startFreq = 2200 + Math.random() * 1200;
        birdOsc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        birdOsc.frequency.exponentialRampToValueAtTime(startFreq + 600, this.ctx.currentTime + 0.08);

        birdGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        birdGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        birdOsc.connect(birdGain);
        birdGain.connect(this.gainNode);
        birdOsc.start();
        birdOsc.stop(this.ctx.currentTime + 0.13);
      }
    }, 180);

    this.activeNodes.push(noise, filter);
  }

  // 2. Mountain River Stream Synthesizer
  createRiverStream() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1400;
    bandpass.Q.value = 1.5;

    noise.connect(bandpass);
    bandpass.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, bandpass);
  }

  // 3. Forest Breeze
  createForestBreeze() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  // 4. Forest Rain Drops on Canopy Leaves
  createForestRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;

    noise.connect(lowpass);
    lowpass.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, lowpass);
  }

  // 5. Night Forest Crickets
  createNightForest() {
    this.intervalId = setInterval(() => {
      if (this.ctx) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 4500;

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      }
    }, 120);
  }

  // 6. Bamboo Zen Chimes
  createBambooZen() {
    const freqs = [528, 639, 741, 852];
    const playChime = () => {
      if (!this.ctx) return;
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    };

    playChime();
    this.intervalId = setInterval(playChime, 3500);
  }

  // Pure Window Raindrops
  createWindowRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 950;

    noise.connect(lowpass);
    lowpass.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, lowpass);
  }

  // Heavy Thunder Rainstorm
  createHeavyThunderRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  // Roof Rain
  createRoofRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1100;
    bandpass.Q.value = 2.0;

    noise.connect(bandpass);
    bandpass.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, bandpass);
  }

  // Binaural Beats Generator
  createBinauralBeats(freqL, freqR) {
    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    oscLeft.type = 'sine';
    oscLeft.frequency.value = freqL;

    oscRight.type = 'sine';
    oscRight.frequency.value = freqR;

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, merger);
  }

  // Crackling Fireplace
  createFireplaceSound() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 3;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  // Lofi Warm Synth Chord
  createLofiWarmSynth() {
    const freqs = [174.61, 220.00, 261.63, 329.63];
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.value = f;

      filter.type = 'lowpass';
      filter.frequency.value = 600;

      osc.connect(filter);
      filter.connect(this.gainNode);
      osc.start();
      this.activeNodes.push(osc, filter);
    });
  }

  // Pink Noise
  createPinkNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(this.gainNode);
    noise.start();
    this.activeNodes.push(noise);
  }

  // Brown Noise
  createBrownNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(this.gainNode);
    noise.start();
    this.activeNodes.push(noise);
  }
}

const audioEngine = new WebAudioEngine();

export const FocusMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(FOCUS_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Nature & Forest Sanctuary 🌿');
  const [searchQuery, setSearchQuery] = useState('');
  const [sleepTimer, setSleepTimer] = useState(0);
  const [overlayAmbience, setOverlayAmbience] = useState(null);

  const audioRef = useRef(null);
  const overlayEngineRef = useRef(new WebAudioEngine());
  const timerRef = useRef(null);

  const filteredTracks = FOCUS_TRACKS.filter((t) => {
    const categoryMatch = selectedCategory === 'All' || t.category === selectedCategory;
    const searchMatch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startTrack(currentTrack);
    }
  };

  const startTrack = (track) => {
    setCurrentTrack(track);

    if (track.type === 'stream' && track.url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioEngine.stop();

      const audio = new Audio(track.url);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;

      audio
        .play()
        .then(() => {
          audioRef.current = audio;
          setIsPlaying(true);
          toast.success(`Playing ${track.emoji} ${track.title}`);
        })
        .catch((err) => {
          console.warn('Stream failed, launching procedural fallback:', err);
          audioEngine.playType(track.fallbackType || 'forest_birds', isMuted ? 0 : volume);
          setIsPlaying(true);
          toast.success(`Playing ${track.emoji} ${track.title} (Nature Sound Engine)`);
        });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioEngine.playType(track.type, isMuted ? 0 : volume);
      setIsPlaying(true);
      toast.success(`Playing ${track.emoji} ${track.title}`);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);

    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    audioEngine.setVolume(newVol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      handleVolumeChange(volume || 0.7);
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
      audioEngine.setVolume(0);
    }
  };

  const toggleOverlayAmbience = (type) => {
    if (overlayAmbience === type) {
      overlayEngineRef.current.stop();
      setOverlayAmbience(null);
      toast('Ambient overlay turned off', { icon: '🔇' });
    } else {
      overlayEngineRef.current.playType(type, 0.4);
      setOverlayAmbience(type);
      toast.success(`Layered ${type.toUpperCase()} sound overlay! 🌿`);
    }
  };

  useEffect(() => {
    if (sleepTimer > 0 && isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        stopAudio();
        if (overlayEngineRef.current) overlayEngineRef.current.stop();
        setOverlayAmbience(null);
        setSleepTimer(0);
        toast('⏱️ Sleep timer finished! Music paused.', { icon: '🌙' });
      }, sleepTimer * 60 * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sleepTimer, isPlaying]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (overlayEngineRef.current) overlayEngineRef.current.stop();
    };
  }, []);

  return (
    <GlassCard className="relative overflow-hidden space-y-6">
      {/* Background Subtle Gradient Glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br ${currentTrack.color} opacity-20 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* Header & Sleep Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FiMusic className="text-emerald-500 dark:text-emerald-400 text-xl" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Nature & Forest Soundscapes Sanctuary
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immersive natural forest birdsong, mountain streams, gentle leaves & rain to cool and calm your mind
          </p>
        </div>

        {/* Sleep Timer */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <FiClock className="text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Sleep Timer:</span>
          <select
            value={sleepTimer}
            onChange={(e) => setSleepTimer(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
          >
            <option value={0}>Off</option>
            <option value={15}>15 mins</option>
            <option value={30}>30 mins</option>
            <option value={45}>45 mins</option>
            <option value={60}>60 mins</option>
          </select>
        </div>
      </div>

      {/* Now Playing Active Hero Player */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Track Details */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div
              className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center text-3xl shadow-glow transition-transform ${
                isPlaying ? 'scale-105 animate-pulse' : ''
              }`}
            >
              {currentTrack.emoji}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-emerald-200">
                  {currentTrack.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">
                  {currentTrack.type === 'stream' ? '🌿 Natural Stream HD' : '⚡ Nature Synthesizer'}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Playing Nature
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">{currentTrack.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-1">{currentTrack.desc}</p>
            </div>
          </div>

          {/* Sound Wave Animation Visualizer */}
          <div className="flex items-center gap-1 h-8 px-4">
            {[0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 1.0, 0.6, 0.4, 0.85].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-emerald-400/80 transition-all duration-300"
                style={{
                  height: isPlaying ? `${h * 100}%` : '20%',
                  animation: isPlaying ? `pulse 1.${i + 2}s infinite alternate` : 'none',
                }}
              />
            ))}
          </div>

          {/* Controls & Volume */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <FiVolumeX className="text-lg text-red-400" /> : <FiVolume2 className="text-lg" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-24 accent-emerald-400 cursor-pointer"
              />
            </div>

            <button
              onClick={togglePlay}
              className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-2xl transition-all transform active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/40'
              }`}
            >
              {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="text-lg fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Nature'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layering Sound Mixer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiSliders className="text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Nature Layering Mixer</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Layer forest birds, river stream or rain over any track</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'forest_birds', label: '🐦 Forest Birds' },
            { id: 'river_stream', label: '🏞️ River Stream' },
            { id: 'rain_window', label: '🌧️ Forest Rain' },
            { id: 'bamboo_zen', label: '🎋 Zen Chimes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => toggleOverlayAmbience(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                overlayAmbience === item.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search nature music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Sound Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTracks.map((track) => {
          const isSelected = currentTrack.id === track.id;
          const isThisPlaying = isSelected && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => startTrack(track)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-xl text-white shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    {track.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {track.title}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                      {track.category}
                    </span>
                  </div>
                </div>

                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    isThisPlaying
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-glow'
                      : 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}
                >
                  {isThisPlaying ? <FiPause /> : <FiPlay className="ml-0.5" />}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {track.desc}
              </p>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle /> Selected
                  </span>
                  <span>{isThisPlaying ? 'Playing Nature' : 'Click to Play'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
