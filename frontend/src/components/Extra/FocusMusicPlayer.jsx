import React, { useState, useEffect, useRef } from 'react';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiClock,
  FiMusic,
  FiSliders,
  FiRadio,
  FiCheckCircle,
} from 'react-icons/fi';
import { GlassCard } from '../Common/GlassCard';
import toast from 'react-hot-toast';

// Sound Variety Catalogue
export const FOCUS_TRACKS = [
  {
    id: 'lofi',
    title: 'Lofi Study Beats',
    category: 'Lofi & Piano',
    emoji: '🎧',
    desc: 'Chill lofi hip-hop rhythms for productive study sessions',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    fallbackType: 'synth',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'rain',
    title: 'Cozy Heavy Rain',
    category: 'Nature & Ambient',
    emoji: '🌧️',
    desc: 'Deep relaxing rainfall with gentle ambient thunder',
    type: 'rain',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'binaural',
    title: '432Hz Alpha Waves',
    category: 'Binaural & Synth',
    emoji: '🌌',
    desc: 'Deep concentration brainwave entrainment for focus',
    type: 'binaural',
    color: 'from-purple-500 to-indigo-700',
  },
  {
    id: 'ocean',
    title: 'Calming Ocean Waves',
    category: 'Nature & Ambient',
    emoji: '🌊',
    desc: 'Peaceful sea waves crashing gently on a quiet shore',
    type: 'ocean',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'piano',
    title: 'Peaceful Classical Piano',
    category: 'Lofi & Piano',
    emoji: '🎹',
    desc: 'Elegant acoustic piano melodies for reading & studying',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73427.mp3',
    fallbackType: 'zen',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cafe',
    title: 'Cozy Coffee Shop',
    category: 'Cozy',
    emoji: '☕',
    desc: 'Warm coffeehouse chatter & subtle espresso machines',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_496c1ed2bd.mp3',
    fallbackType: 'pink_noise',
    color: 'from-amber-700 to-stone-800',
  },
  {
    id: 'forest',
    title: 'Forest & Morning Birds',
    category: 'Nature & Ambient',
    emoji: '🌲',
    desc: 'Soothing woodland breeze and morning birdsong',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844888e28.mp3',
    fallbackType: 'rain',
    color: 'from-emerald-500 to-green-700',
  },
  {
    id: 'fire',
    title: 'Crackling Fireplace',
    category: 'Cozy',
    emoji: '🔥',
    desc: 'Comforting hearth wood fire crackling ambiance',
    type: 'fire',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'synth',
    title: 'Cosmic Synthwave Ambient',
    category: 'Binaural & Synth',
    emoji: '🔮',
    desc: 'Futuristic atmospheric space pads for deep coding',
    type: 'synth',
    color: 'from-fuchsia-600 to-purple-800',
  },
  {
    id: 'zen',
    title: 'Tibetan Zen Bowls',
    category: 'Binaural & Synth',
    emoji: '🧘',
    desc: 'Meditative singing bowls & calming resonance',
    type: 'zen',
    color: 'from-violet-500 to-amber-600',
  },
  {
    id: 'pink_noise',
    title: 'Pink Noise Focus Filter',
    category: 'Nature & Ambient',
    emoji: '⚪',
    desc: 'Smooth frequency curve to block out all background noise',
    type: 'pink_noise',
    color: 'from-slate-500 to-gray-700',
  },
];

const CATEGORIES = ['All', 'Lofi & Piano', 'Nature & Ambient', 'Binaural & Synth', 'Cozy'];

// Web Audio API Procedural Audio Engine
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
      case 'binaural':
        this.createBinauralBeats();
        break;
      case 'rain':
        this.createRainSound();
        break;
      case 'ocean':
        this.createOceanWaves();
        break;
      case 'fire':
        this.createFireplaceSound();
        break;
      case 'synth':
        this.createCosmicSynth();
        break;
      case 'zen':
        this.createZenBowls();
        break;
      case 'pink_noise':
        this.createPinkNoise();
        break;
      default:
        this.createPinkNoise();
        break;
    }
  }

  // 1. Binaural Alpha Beats (432Hz Base + 10Hz Alpha Delta)
  createBinauralBeats() {
    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    oscLeft.type = 'sine';
    oscLeft.frequency.value = 216; // 432 / 2

    oscRight.type = 'sine';
    oscRight.frequency.value = 226; // 10Hz Alpha difference

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, merger);
  }

  // 2. Realistic Rain Sound
  createRainSound() {
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
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  // 3. Ocean Waves Modulation
  createOceanWaves() {
    const bufferSize = this.ctx.sampleRate * 3;
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
    filter.frequency.value = 400;

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // 12-second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);

    lfo.start();
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  // 4. Crackling Fireplace
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

    // Crackle bursts generator
    this.intervalId = setInterval(() => {
      if (Math.random() > 0.4 && this.ctx) {
        const osc = this.ctx.createOscillator();
        const crackleGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 2000 + Math.random() * 3000;
        crackleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(crackleGain);
        crackleGain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }
    }, 150);

    this.activeNodes.push(noise, filter);
  }

  // 5. Cosmic Synth Atmosphere
  createCosmicSynth() {
    const freqs = [130.81, 164.81, 196.00, 246.94]; // C chord pad
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = f;

      filter.type = 'lowpass';
      filter.frequency.value = 350;

      osc.connect(filter);
      filter.connect(this.gainNode);
      osc.start();
      this.activeNodes.push(osc, filter);
    });
  }

  // 6. Tibetan Zen Bowls
  createZenBowls() {
    const playBowl = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const bowlGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 432;

      bowlGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      bowlGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

      osc.connect(bowlGain);
      bowlGain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + 4.6);
    };

    playBowl();
    this.intervalId = setInterval(() => {
      playBowl();
    }, 5000);
  }

  // 7. Pink Noise
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
}

const audioEngine = new WebAudioEngine();

export const FocusMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(FOCUS_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sleepTimer, setSleepTimer] = useState(0); // in minutes
  const [overlayAmbience, setOverlayAmbience] = useState(null); // optional ambient layer (e.g. Rain)

  const audioRef = useRef(null);
  const overlayEngineRef = useRef(new WebAudioEngine());
  const timerRef = useRef(null);

  // Filter tracks by category
  const filteredTracks =
    selectedCategory === 'All'
      ? FOCUS_TRACKS
      : FOCUS_TRACKS.filter((t) => t.category === selectedCategory);

  // Handle Play/Pause
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
      // Use HTML5 audio stream with Web Audio fallback
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
          console.warn('Stream failed, launching procedural audio fallback:', err);
          // Fallback to web audio engine
          audioEngine.playType(track.fallbackType || 'synth', isMuted ? 0 : volume);
          setIsPlaying(true);
          toast.success(`Playing ${track.emoji} ${track.title} (Ambient Engine)`);
        });
    } else {
      // Web Audio API procedural track
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

  // Handle Volume change
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

  // Handle Secondary Overlay Ambience (e.g. add rain to lofi)
  const toggleOverlayAmbience = (type) => {
    if (overlayAmbience === type) {
      overlayEngineRef.current.stop();
      setOverlayAmbience(null);
      toast('Ambient overlay turned off', { icon: '🔇' });
    } else {
      overlayEngineRef.current.playType(type, 0.4);
      setOverlayAmbience(type);
      toast.success(`Layered ${type.toUpperCase()} sound overlay! 🎧`);
    }
  };

  // Sleep Timer countdown
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

  // Clean up on unmount
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
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${currentTrack.color} opacity-20 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FiMusic className="text-indigo-600 dark:text-indigo-400 text-xl" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Focus Music & Soundscapes
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Curated sound varieties & brainwave frequencies for deep study, coding & focus
          </p>
        </div>

        {/* Sleep Timer Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <FiClock className="text-indigo-600 dark:text-indigo-400" />
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Track Info & Visualizer */}
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
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-indigo-200">
                  {currentTrack.category}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Playing
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
                className="w-1 rounded-full bg-indigo-400/80 transition-all duration-300"
                style={{
                  height: isPlaying ? `${h * 100}%` : '20%',
                  animation: isPlaying ? `pulse 1.${i + 2}s infinite alternate` : 'none',
                }}
              />
            ))}
          </div>

          {/* Center/Right: Play Controls & Volume */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            {/* Volume Control */}
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
                className="w-20 sm:w-24 accent-indigo-400 cursor-pointer"
              />
            </div>

            {/* Big Play / Pause Button */}
            <button
              onClick={togglePlay}
              className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-2xl transition-all transform active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/40'
              }`}
            >
              {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="text-lg fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Music'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layering Sound Mixer (Overlay Ambience) */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiSliders className="text-indigo-600 dark:text-indigo-400" />
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Sound Layering Mixer</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Mix background ambience over your active track</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'rain', label: '🌧️ Rain Overlay' },
            { id: 'fire', label: '🔥 Fireplace Overlay' },
            { id: 'ocean', label: '🌊 Ocean Overlay' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => toggleOverlayAmbience(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                overlayAmbience === item.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sound Variety Catalogue Grid */}
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
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 hover:bg-slate-100 dark:hover:bg-slate-850'
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
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {track.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{track.category}</span>
                  </div>
                </div>

                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    isThisPlaying
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-glow'
                      : 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}
                >
                  {isThisPlaying ? <FiPause /> : <FiPlay className="ml-0.5" />}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {track.desc}
              </p>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle /> Selected
                  </span>
                  <span>{isThisPlaying ? 'Playing Now' : 'Click to Resume'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
