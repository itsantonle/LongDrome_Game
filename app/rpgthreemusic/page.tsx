"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

// Define our music tracks
const musicTracks = [
  {
    id: "main-theme",
    title: "Main Theme",
    description: "Epic orchestral theme for the game's title screen",
    src: "https://audio-samples.github.io/samples/mp3/blizzard-of-stars.mp3", // Sample audio
    type: "theme",
    duration: "2:42",
  },
  {
    id: "battle",
    title: "Guardian Battle",
    description: "Intense battle music when facing the Ancient Guardian",
    src: "https://audio-samples.github.io/samples/mp3/star-wars-theme-song.mp3", // Sample audio
    type: "battle",
    duration: "1:15",
  },
  {
    id: "temple",
    title: "Ancient Temple",
    description: "Mysterious ambient music for the temple scenes",
    src: "https://audio-samples.github.io/samples/mp3/blizzard-of-stars.mp3", // Sample audio
    type: "ambient",
    duration: "3:30",
  },
  {
    id: "home",
    title: "Home Theme",
    description: "Peaceful melody for the player's home",
    src: "https://audio-samples.github.io/samples/mp3/star-wars-theme-song.mp3", // Sample audio
    type: "ambient",
    duration: "2:10",
  },
  {
    id: "victory",
    title: "Victory Fanfare",
    description: "Triumphant music for when the player wins",
    src: "https://audio-samples.github.io/samples/mp3/blizzard-of-stars.mp3", // Sample audio
    type: "theme",
    duration: "0:45",
  },
]

export default function RPGThreeMusicPage() {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [trackProgress, setTrackProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return

    // Stop current track
    audioRef.current.pause()
    setTrackProgress(0)

    if (currentTrack) {
      // Find the track
      const track = musicTracks.find((t) => t.id === currentTrack)
      if (track) {
        audioRef.current.src = track.src
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play()
          startProgressTracking()
        }
      }
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.play()
      startProgressTracking()
    } else {
      audioRef.current.pause()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // Start tracking progress
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
        setTrackProgress(progress)

        // If track ended
        if (audioRef.current.ended) {
          setIsPlaying(false)
          setTrackProgress(0)
          clearInterval(progressIntervalRef.current as NodeJS.Timeout)
          progressIntervalRef.current = null
        }
      }
    }, 1000)
  }

  // Play a track
  const playTrack = (trackId: string) => {
    if (currentTrack === trackId) {
      // Toggle play/pause if it's the current track
      setIsPlaying(!isPlaying)
    } else {
      // Play a new track
      setCurrentTrack(trackId)
      setIsPlaying(true)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Play next track
  const playNextTrack = () => {
    if (!currentTrack) return

    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack)
    if (currentIndex >= 0 && currentIndex < musicTracks.length - 1) {
      setCurrentTrack(musicTracks[currentIndex + 1].id)
      setIsPlaying(true)
    }
  }

  // Play previous track
  const playPreviousTrack = () => {
    if (!currentTrack) return

    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack)
    if (currentIndex > 0) {
      setCurrentTrack(musicTracks[currentIndex - 1].id)
      setIsPlaying(true)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Palindrome Guardian Music</h1>

      {/* Music Player */}
      <Card className="mb-8 border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Music Player</CardTitle>
              <CardDescription>Click on a track to play</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleMute} className="h-8 w-8 rounded-full">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  disabled={isMuted}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Now Playing */}
          {currentTrack && (
            <div className="mb-6 rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Now Playing: {musicTracks.find((t) => t.id === currentTrack)?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {musicTracks.find((t) => t.id === currentTrack)?.description}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {musicTracks.find((t) => t.id === currentTrack)?.type}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${trackProgress}%` }} />
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={playPreviousTrack} className="h-8 w-8 rounded-full">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => setIsPlaying(!isPlaying)} className="h-10 w-10 rounded-full">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={playNextTrack} className="h-8 w-8 rounded-full">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Track List */}
          <div className="space-y-2">
            {musicTracks.map((track) => (
              <div
                key={track.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                  currentTrack === track.id ? "bg-primary/20 hover:bg-primary/30" : "hover:bg-muted"
                }`}
                onClick={() => playTrack(track.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      currentTrack === track.id && isPlaying
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted"
                    }`}
                  >
                    {currentTrack === track.id && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{track.type}</Badge>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Click on any track to play. Click again to pause.</p>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Back to Game
          </Button>
        </CardFooter>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
          <CardDescription>How to add music to your RPG game</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">Adding the Music Component</h3>
              <p className="mb-2 text-sm">
                To add background music to your game, you can create a Music context that manages audio playback across
                different scenes:
              </p>
              <pre className="overflow-x-auto rounded bg-muted-foreground/10 p-2 text-xs">
                {`// Create a MusicProvider component
const MusicContext = createContext({});

export function MusicProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Play a specific track
  const playTrack = (trackId) => {
    const track = musicTracks.find(t => t.id === trackId);
    if (track && audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.play();
      setCurrentTrack(trackId);
    }
  };

  // Other methods: pause, setVolume, etc.

  return (
    <MusicContext.Provider value={{ 
      currentTrack, 
      playTrack,
      // other methods 
    }}>
      {children}
    </MusicContext.Provider>
  );
}`}
              </pre>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">Using the Music Component</h3>
              <p className="mb-2 text-sm">
                In your game components, you can use the music context to control playback based on game state:
              </p>
              <pre className="overflow-x-auto rounded bg-muted-foreground/10 p-2 text-xs">
                {`// In your game component
function RPGGame() {
  const { playTrack, pauseMusic } = useMusicContext();
  
  // Play different tracks based on game state
  useEffect(() => {
    if (gameState === "battle") {
      playTrack("battle");
    } else if (gameState === "home") {
      playTrack("home");
    }
  }, [gameState, playTrack]);

  // Rest of your game component
}`}
              </pre>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">Sound Effects</h3>
              <p className="mb-2 text-sm">For one-off sound effects, you can create a utility function:</p>
              <pre className="overflow-x-auto rounded bg-muted-foreground/10 p-2 text-xs">
                {`// Sound effects utility
export function playSoundEffect(effectName) {
  const effects = {
    "click": "/sounds/click.mp3",
    "success": "/sounds/success.mp3",
    "failure": "/sounds/failure.mp3",
    // Add more effects as needed
  };
  
  if (effects[effectName]) {
    const audio = new Audio(effects[effectName]);
    audio.volume = 0.5; // Adjust as needed
    audio.play();
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

