import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const previousVolumeRef = useRef(0.8);
  const [draggedTrackId, setDraggedTrackId] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerMode, setVisualizerMode] =
  useState("spectrum");
  
  const [audioLevel, setAudioLevel] = useState(0);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleAddAudio = () => {
    fileInputRef.current.click();
  };

   const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    const audioFiles = files.filter((file) =>
      file.type.startsWith("audio/")
    );

    if (audioFiles.length === 0) {
      return;
    }

    const newTracks = audioFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      file,
      url: URL.createObjectURL(file),
    }));

    setPlaylist((currentPlaylist) => [
      ...currentPlaylist,
      ...newTracks,
    ]);

    if (!selectedTrack) {
      setSelectedTrack(newTracks[0]);
    }

    event.target.value = "";
  };


    const handleRemoveTrack = (trackId) => {
    const trackToRemove = playlist.find(
          (track) => track.id === trackId
        );

        if (!trackToRemove) {
          return;
        }

        const remainingTracks = playlist.filter(
          (track) => track.id !== trackId
        );

        if (trackToRemove.url?.startsWith("blob:")) {
          URL.revokeObjectURL(trackToRemove.url);
        }

        setPlaylist(remainingTracks);

        if (selectedTrack?.id === trackId) {
          if (remainingTracks.length === 0) {
            setSelectedTrack(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);

            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.src = "";
            }
          } else {
            const removedIndex = playlist.findIndex(
              (track) => track.id === trackId
            );

            const newIndex = Math.min(
              removedIndex,
              remainingTracks.length - 1
            );

            setSelectedTrack(remainingTracks[newIndex]);
            setCurrentTime(0);
            setDuration(0);
          }
        }
      };

      const getRandomTrack = () => {
      if (playlist.length <= 1) {
        return selectedTrack;
      }

      const availableTracks = playlist.filter(
        (track) => track.id !== selectedTrack?.id
      );

      const randomIndex = Math.floor(
        Math.random() * availableTracks.length
      );

      return availableTracks[randomIndex];
    };

    const handleSelectTrack = (track, autoPlay = false) => {
      setSelectedTrack(track);
      setCurrentTime(0);
      setDuration(0);

      if (!autoPlay) {
        setIsPlaying(false);
      }
  };

  const setupAudioContext = () => {
    if (!audioRef.current) {
      return;
    }

    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContext();

      sourceNodeRef.current =
        audioContextRef.current.createMediaElementSource(
          audioRef.current
        );

      analyserRef.current =
        audioContextRef.current.createAnalyser();

      analyserRef.current.fftSize = 2048;

      sourceNodeRef.current.connect(
        analyserRef.current
      );

      analyserRef.current.connect(
        audioContextRef.current.destination
      );
    }
  };

  const updateAudioLevel = () => {
  const analyser = analyserRef.current;

  if (!analyser) {
    return;
  }

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const update = () => {
    if (!audioRef.current || audioRef.current.paused) {
      setAudioLevel(0);
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    let total = 0;

    for (let i = 0; i < bufferLength; i++) {
      total += dataArray[i];
    }

    const average = total / bufferLength;

    const level = average / 255;

    setAudioLevel(level);

    requestAnimationFrame(update);
  };

  update();
};


const togglePlay = async () => {
  if (!audioRef.current || !selectedTrack) {
    return;
  }

  setupAudioContext();

  if (audioContextRef.current?.state === "suspended") {
    await audioContextRef.current.resume();
  }

  if (isPlaying) {
    audioRef.current.pause();
    setIsPlaying(false);
  } else {
    try {
      console.log("Attempting to play:", selectedTrack.url);

      console.log(
        "Audio readyState:",
        audioRef.current.readyState
      );

      console.log(
        "Audio networkState:",
        audioRef.current.networkState
      );

      console.log(
        "Audio source:",
        audioRef.current.src
      );

      await audioRef.current.play();

      console.log("Playback started successfully");

      setIsPlaying(true);
      updateAudioLevel();

      if (visualizerMode === "spectrum") {
        drawVisualizer();
      } else if (visualizerMode === "waveform") {
        drawWaveform();
      } else if (visualizerMode === "circular") {
        drawCircularVisualizer();
      }

    } catch (error) {
      console.error(
        "Unable to play audio:",
        error
      );

      console.error(
        "Error name:",
        error.name
      );

      console.error(
        "Error message:",
        error.message
      );
    }
  }
};

  const stopVisualizer = () => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(
      animationFrameRef.current
    );

    animationFrameRef.current = null;
  }
};

  const drawVisualizer = () => {
  const canvas = canvasRef.current;
  const analyser = analyserRef.current;

  if (!canvas || !analyser) {
    return;
  }

  const canvasContext = canvas.getContext("2d");

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;

    canvasContext.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );
  };

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const smoothedValues = new Array(80).fill(0);
  
  const draw = () => {
    animationFrameRef.current =
      requestAnimationFrame(draw);
  
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, width, height);

    const centerY = height / 2;

      canvasContext.beginPath();

      canvasContext.moveTo(
        0,
        centerY
      );

      canvasContext.lineTo(
        width,
        centerY
      );

      canvasContext.strokeStyle =
        "rgba(139, 124, 255, 0.18)";

      canvasContext.lineWidth = 1;

      canvasContext.stroke();

    const barCount = 80;
    const step = Math.floor(bufferLength / barCount);

    const gap = 3;
    const barWidth = width / barCount - gap;

    const gradient = canvasContext.createLinearGradient(
      0,
      height,
      0,
      0
    );

    gradient.addColorStop(0, "#685dfc");
    gradient.addColorStop(0.5, "#8b7cff");
    gradient.addColorStop(1, "#c4bdff");

    canvasContext.fillStyle = gradient;
    canvasContext.shadowColor = "#6d5dfc";
    canvasContext.shadowBlur = 12;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step;

      const value = dataArray[dataIndex] || 0;

      const targetHeight =
        (value / 255) * height * 0.85;

      smoothedValues[i] +=
        (targetHeight - smoothedValues[i]) * 0.15;

      const barHeight = smoothedValues[i];

      const x =
        i * (barWidth + gap) + gap / 2;

      const centerY = height / 2;

const topHeight = barHeight / 2;
const bottomHeight = barHeight / 2;

const topY = centerY - topHeight;

const radius = Math.min(
  barWidth / 2,
  6
);

// Top bar
canvasContext.beginPath();

canvasContext.roundRect(
  x,
  topY,
  barWidth,
  topHeight,
  radius
);

canvasContext.fill();

// Bottom reflection
canvasContext.globalAlpha = 0.35;

canvasContext.beginPath();

canvasContext.roundRect(
  x,
  centerY,
  barWidth,
  bottomHeight,
  radius
);

canvasContext.fill();

canvasContext.globalAlpha = 1;
    }

        canvasContext.shadowBlur = 0;
  };

  draw();
};

  const drawWaveform = () => {
  const canvas = canvasRef.current;
  const analyser = analyserRef.current;

  if (!canvas || !analyser) {
    return;
  }

  const canvasContext = canvas.getContext("2d");

  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    requestAnimationFrame(draw);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    analyser.getByteTimeDomainData(dataArray);

    canvasContext.clearRect(
      0,
      0,
      width,
      height
    );

    const centerY = height / 2;

    canvasContext.beginPath();

    canvasContext.strokeStyle = "#c4bdff";
    canvasContext.lineWidth = 3;

    canvasContext.shadowColor = "#6d5dfc";
    canvasContext.shadowBlur = 12;

    const sliceWidth =
      width / bufferLength;

    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] / 128.0;

      const y =
        centerY +
        (value - 1) *
          centerY *
          0.85;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.stroke();

    canvasContext.shadowBlur = 0;
  };

  draw();
};

const drawCircularVisualizer = () => {
  const canvas = canvasRef.current;
  const analyser = analyserRef.current;

  if (!canvas || !analyser) {
    return;
  }

  const canvasContext = canvas.getContext("2d");

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;

    canvasContext.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );
  };

  resizeCanvas();

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barCount = 100;
  const step = Math.floor(bufferLength / barCount);

  const smoothedValues = new Array(barCount).fill(0);

  const draw = () => {
    animationFrameRef.current =
      requestAnimationFrame(draw);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const centerX = width / 2;
    const centerY = height / 2;

    const radius =
      Math.min(width, height) * 0.19;

    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(
      0,
      0,
      width,
      height
    );

    /*
      --------------------------------
      AUDIO LEVEL
      --------------------------------
    */

    let total = 0;

    for (let i = 0; i < bufferLength; i++) {
      total += dataArray[i];
    }

    const average =
      total / bufferLength / 255;

    /*
      --------------------------------
      OUTER ATMOSPHERIC GLOW
      --------------------------------
    */

    const glowGradient =
      canvasContext.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 2.5
      );

    glowGradient.addColorStop(
      0,
      `rgba(109, 93, 252, ${
        0.18 + average * 0.2
      })`
    );

    glowGradient.addColorStop(
      0.45,
      `rgba(109, 93, 252, ${
        0.08 + average * 0.12
      })`
    );

    glowGradient.addColorStop(
      1,
      "rgba(109, 93, 252, 0)"
    );

    canvasContext.beginPath();

    canvasContext.arc(
      centerX,
      centerY,
      radius * 2.4,
      0,
      Math.PI * 2
    );

    canvasContext.fillStyle =
      glowGradient;

    canvasContext.fill();

    /*
      --------------------------------
      INNER RING
      --------------------------------
    */

    canvasContext.beginPath();

    canvasContext.arc(
      centerX,
      centerY,
      radius,
      0,
      Math.PI * 2
    );

    canvasContext.strokeStyle =
      `rgba(196, 189, 255, ${
        0.35 + average * 0.45
      })`;

    canvasContext.lineWidth = 2;

    canvasContext.shadowColor =
      "#6d5dfc";

    canvasContext.shadowBlur =
      12 + average * 18;

    canvasContext.stroke();

    /*
      --------------------------------
      FREQUENCY BARS
      --------------------------------
    */

    for (let i = 0; i < barCount; i++) {
      const dataIndex =
        i * step;

      const value =
        dataArray[dataIndex] || 0;

      const normalized =
        value / 255;

      const targetHeight =
        normalized *
        Math.min(width, height) *
        0.25;

      smoothedValues[i] +=
        (targetHeight -
          smoothedValues[i]) *
        0.18;

      const barHeight =
        smoothedValues[i];

      const angle =
        (i / barCount) *
        Math.PI *
        2;

      const innerRadius =
        radius + 8;

      const outerRadius =
        innerRadius + barHeight;

      const x1 =
        centerX +
        Math.cos(angle) *
          innerRadius;

      const y1 =
        centerY +
        Math.sin(angle) *
          innerRadius;

      const x2 =
        centerX +
        Math.cos(angle) *
          outerRadius;

      const y2 =
        centerY +
        Math.sin(angle) *
          outerRadius;

      /*
        Purple frequency gradient
      */

      const barGradient =
        canvasContext.createLinearGradient(
          x1,
          y1,
          x2,
          y2
        );

      barGradient.addColorStop(
        0,
        "#6d5dfc"
      );

      barGradient.addColorStop(
        0.5,
        "#8b7cff"
      );

      barGradient.addColorStop(
        1,
        "#c4bdff"
      );

      canvasContext.beginPath();

      canvasContext.moveTo(x1, y1);

      canvasContext.lineTo(x2, y2);

      canvasContext.strokeStyle =
        barGradient;

      canvasContext.lineWidth = 3;

      canvasContext.lineCap =
        "round";

      canvasContext.shadowColor =
        "#6d5dfc";

      canvasContext.shadowBlur =
        6 + normalized * 14;

      canvasContext.stroke();
    }

    /*
      --------------------------------
      CENTRAL AUDIO ORB
      --------------------------------
    */

    const orbRadius =
      radius *
      (0.72 + average * 0.12);

    const orbGradient =
      canvasContext.createRadialGradient(
        centerX - orbRadius * 0.3,
        centerY - orbRadius * 0.3,
        orbRadius * 0.1,
        centerX,
        centerY,
        orbRadius
      );

    orbGradient.addColorStop(
      0,
      "#c4bdff"
    );

    orbGradient.addColorStop(
      0.35,
      "#8b7cff"
    );

    orbGradient.addColorStop(
      0.7,
      "#6d5dfc"
    );

    orbGradient.addColorStop(
      1,
      "#4033b8"
    );

    canvasContext.beginPath();

    canvasContext.arc(
      centerX,
      centerY,
      orbRadius,
      0,
      Math.PI * 2
    );

    canvasContext.fillStyle =
      orbGradient;

    canvasContext.shadowColor =
      "#6d5dfc";

    canvasContext.shadowBlur =
      20 + average * 30;

    canvasContext.fill();

    /*
      --------------------------------
      ORB HIGHLIGHT
      --------------------------------
    */

    canvasContext.beginPath();

    canvasContext.arc(
      centerX -
        orbRadius * 0.25,
      centerY -
        orbRadius * 0.25,
      orbRadius * 0.18,
      0,
      Math.PI * 2
    );

    canvasContext.fillStyle =
      `rgba(255,255,255,${
        0.18 + average * 0.25
      })`;

    canvasContext.fill();

    canvasContext.shadowBlur = 0;
  };

  draw();
};

const switchVisualizerMode = (mode) => {
  setVisualizerMode(mode);

  stopVisualizer();

  if (!isPlaying) {
    return;
  }

  if (mode === "spectrum") {
    drawVisualizer();
  } else if (mode === "waveform") {
    drawWaveform();
  } else if (mode === "circular") {
    drawCircularVisualizer();
  }
};

  const handleTimeUpdate = () => {

    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

const handleEnded = () => {
  if (!selectedTrack || playlist.length === 0) {
    setIsPlaying(false);
    setCurrentTime(0);
    return;
  }

  if (repeatMode === "one") {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch((error) => {
        console.error(
          "Unable to repeat track:",
          error
        );
      });
    }

    return;
  }

  let nextTrack;

  if (isShuffling) {
    nextTrack = getRandomTrack();
  } else {
    const currentIndex = playlist.findIndex(
      (track) => track.id === selectedTrack.id
    );

    const nextIndex =
      currentIndex === playlist.length - 1
        ? 0
        : currentIndex + 1;

    if (
      currentIndex === playlist.length - 1 &&
      repeatMode === "off"
    ) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    nextTrack = playlist[nextIndex];
  }

  if (!nextTrack) {
    setIsPlaying(false);
    return;
  }

  setSelectedTrack(nextTrack);
  setCurrentTime(0);
  setIsPlaying(true);
};

const toggleShuffle = () => {
  setIsShuffling((currentValue) => !currentValue);
};

const toggleRepeat = () => {
  setRepeatMode((currentMode) => {
    if (currentMode === "off") {
      return "all";
    }

    if (currentMode === "all") {
      return "one";
    }

    return "off";
  });
};

const toggleMute = () => {
  if (!audioRef.current) {
    return;
  }

  if (isMuted) {
    const restoredVolume =
      previousVolumeRef.current || 0.8;

    audioRef.current.volume = restoredVolume;
    setVolume(restoredVolume);
    setIsMuted(false);
  } else {
    previousVolumeRef.current = volume;

    audioRef.current.volume = 0;
    setVolume(0);
    setIsMuted(true);
  }
};

  const handleDragStart = (trackId) => {
  setDraggedTrackId(trackId);
};

  const handleDragOver = (event) => {
  event.preventDefault();
};

  const handleDrop = (targetTrackId) => {
  if (
    !draggedTrackId ||
    draggedTrackId === targetTrackId
  ) {
    setDraggedTrackId(null);
    return;
  }

  setPlaylist((currentPlaylist) => {
    const newPlaylist = [...currentPlaylist];

    const draggedIndex = newPlaylist.findIndex(
      (track) => track.id === draggedTrackId
    );

    const targetIndex = newPlaylist.findIndex(
      (track) => track.id === targetTrackId
    );

    if (
      draggedIndex === -1 ||
      targetIndex === -1
    ) {
      return currentPlaylist;
    }

    const [draggedTrack] =
      newPlaylist.splice(draggedIndex, 1);

    newPlaylist.splice(
      targetIndex,
      0,
      draggedTrack
    );

    return newPlaylist;
  });

  setDraggedTrackId(null);
};

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value) / 100;

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

    const handleProgressChange = (event) => {
    const newTime = Number(event.target.value);

    setCurrentTime(newTime);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePrevious = () => {
  if (!selectedTrack || playlist.length === 0) {
    return;
  }

  const currentIndex = playlist.findIndex(
    (track) => track.id === selectedTrack.id
  );

  const previousIndex =
    currentIndex === 0
      ? playlist.length - 1
      : currentIndex - 1;

  const wasPlaying = isPlaying;

  handleSelectTrack(
    playlist[previousIndex],
    wasPlaying
  );

  if (wasPlaying) {
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  }
};

  const handleNext = () => {
    if (!selectedTrack || playlist.length === 0) {
      return;
    }

    const currentIndex = playlist.findIndex(
      (track) => track.id === selectedTrack.id
    );

    const nextIndex =
      currentIndex === playlist.length - 1
        ? 0
        : currentIndex + 1;

    const wasPlaying = isPlaying;

    handleSelectTrack(
      playlist[nextIndex],
      wasPlaying
    );

    if (wasPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

useEffect(() => {
  if (!audioRef.current || !selectedTrack) {
    return;
  }

  audioRef.current.src = selectedTrack.url;
  audioRef.current.volume = volume;
  audioRef.current.load();

  if (isPlaying) {
    const playNextTrack = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error(
          "Unable to automatically play next track:",
          error
        );
        setIsPlaying(false);
      }
    };

    playNextTrack();
  }
}, [selectedTrack]);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎧</span>

          <div>
            <h1>J-Climax AudioLab</h1>
            <p>
              Interactive Audio Visualizer & Playlist Manager
            </p>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <aside className="sidebar">
          <h2>Playlist</h2>

          <button
            className="add-button"
            onClick={handleAddAudio}
          >
            + Add Audio
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {playlist.length === 0 ? (
            <div className="empty-playlist">
              <div className="music-icon">🎵</div>

              <p>Your playlist is empty</p>

              <span>
                Add an MP3 track to get started.
              </span>
            </div>
          ) : (
            <div className="playlist">
              {playlist.map((track, index) => (
                
         <button
            key={track.id}
            draggable={true}
            className={`playlist-track ${
              selectedTrack?.id === track.id
                ? "active"
                : ""
            }`}
            onClick={() => handleSelectTrack(track)}
            onDragStart={() => handleDragStart(track.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(track.id)}
          >

                  <span className="track-number">
                    {index + 1}
                  </span>

                  <span className="track-name">
                    {track.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="main-content">
          <div className="visualizer-container">
            <div className="visualizer-header">
              <div>
                <h2>Audio Visualizer</h2>

                <p>
                  {selectedTrack
                    ? selectedTrack.name
                    : "No track selected"}
                </p>
              </div>
            </div>

          <div className="visualizer-modes">
            <button
              className={
                visualizerMode === "spectrum"
                  ? "mode-button active"
                  : "mode-button"
              }
             onClick={() =>
              switchVisualizerMode("spectrum")
            }
            >
              Spectrum
            </button>

            <button
              className={
                visualizerMode === "waveform"
                  ? "mode-button active"
                  : "mode-button"
              }
             onClick={() =>
              switchVisualizerMode("waveform")
            }
            >
              Waveform
            </button>

            <button
              className={
                visualizerMode === "circular"
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() =>
                switchVisualizerMode("circular")
              }
            >
              Circular
            </button>
          </div>

            <div className="visualizer">

              {/* Permanent JESSE-CLIMAX watermark background */}
              <div className="canvas-watermark"></div>

              {/* Audio visualizer canvas */}
              <canvas ref={canvasRef}></canvas>

              {/* Empty-state branding */}
              {!selectedTrack && (
                <div className="visualizer-branding">
                  <div className="branding-logo">
                    🎧
                  </div>

                  <h2>Jesse-Climax</h2>

                  <p>AudioLab</p>
                </div>
              )}

            </div>

            <div className="timeline">
              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                className="progress-bar"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleProgressChange}
              />

              <span>{formatTime(duration)}</span>
            </div>
          </div>

        <div className={`now-playing ${isPlaying ? "playing" : ""}`}>
          <div className="now-playing-icon">
            🎵
          </div>

          <div className="now-playing-info">
            <span className="now-playing-label">
              NOW PLAYING
            </span>

            <div className="track-title-window">
            <strong className="track-title">
                {selectedTrack
                  ? selectedTrack.name
                  : "No track selected"}
            </strong>
            </div>

          </div>
        </div>

        <div className="player-controls">

            <div className={`audio-status ${isPlaying ? "live" : ""}`}>
              <span className="status-dot"></span>

              <span>
                {isPlaying ? "LIVE" : "READY"}
              </span>
            </div>

           <button
                className={`secondary-control ${
                  repeatMode !== "off" ? "active" : ""
                }`}
                onClick={toggleRepeat}
                title={
                  repeatMode === "off"
                    ? "Repeat Off"
                    : repeatMode === "all"
                    ? "Repeat All"
                    : "Repeat One"
                }
              >
                <span className="repeat-icon-wrapper">
                  <span className="repeat-icon">
                    🔁
                  </span>

                  {repeatMode === "off" && (
                    <span className="repeat-off-x">
                      ×
                    </span>
                  )}

                  {repeatMode === "one" && (
                    <span className="repeat-one-badge">
                      1
                    </span>
                  )}
                </span>
              </button>

           
            <button onClick={handlePrevious}>
              ⏮
            </button>

            <button
              className={`play-button ${isPlaying ? "playing" : ""}`}
              onClick={togglePlay}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <button onClick={handleNext}>
              ⏭
            </button>

             <button
              className={`secondary-control ${
                isShuffling ? "active" : ""
              }`}
              onClick={toggleShuffle}
              title={
                isShuffling
                  ? "Shuffle On"
                  : "Sequential Play"
              }
            >
              {isShuffling ? "🔀" : "↔"}
            </button>

          </div>

          <div className="volume-control">
            <button
              className="volume-button"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
            />
          </div>

          <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />

        </section>
      </main>
    </div>
  );
}

export default App;