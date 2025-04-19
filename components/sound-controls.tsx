"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export interface SoundControlsProps {
  className?: string
  defaultTrack?: string
  tracks?: {
    id: string
    src: string
    title: string
    type: "theme" | "battle" | "ambient" | "effect"
  }[]
  autoPlay?: boolean
  loop?: boolean
  showTitle?: boolean
  variant?: "minimal" | "full" | "icon"
  onTrackChange?: (trackId: string) => void
}

export function SoundControls({
  className,
  defaultTrack,
  tracks = [],
  autoPlay = false,
  loop = true,
  showTitle = false,
  variant = "minimal",
  onTrackChange,
}: SoundControlsProps) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(defaultTrack || null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume
    audioRef.current.loop = loop

    // Set initial track if provided
    if (defaultTrack && tracks.length > 0) {
      const track = tracks.find((t) => t.id === defaultTrack)
      if (track) {
        audioRef.current.src = track.src
        if (autoPlay) {
          audioRef.current.play().catch((e) => console.error("Auto-play prevented:", e))
        }
      }
    }

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return

    if (currentTrack) {
      // Find the track
      const track = tracks.find((t) => t.id === currentTrack)
      if (track) {
        audioRef.current.src = track.src
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play().catch((e) => console.error("Play prevented:", e))
        }

        // Notify parent component
        if (onTrackChange) {
          onTrackChange(currentTrack)
        }
      }
    }
  }, [currentTrack, tracks, onTrackChange])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.play().catch((e) => console.error("Play prevented:", e))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack])

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!currentTrack && tracks.length > 0) {
      // If no track is selected, play the first one
      setCurrentTrack(tracks[0].id)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Change track
  const changeTrack = (trackId: string) => {
    setCurrentTrack(trackId)
    setIsPlaying(true)
  }

  // Get current track title
  const getCurrentTrackTitle = () => {
    if (!currentTrack) return "No track selected"
    const track = tracks.find((t) => t.id === currentTrack)
    return track ? track.title : "Unknown track"
  }

  // Render based on variant
  if (variant === "icon") {
    return (
      <Button
        variant={isPlaying ? "default" : "outline"}
        size="icon"
        onClick={togglePlayPause}
        className={cn("h-10 w-10 rounded-full", className)}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
      </Button>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="icon"
          onClick={togglePlayPause}
          className="h-8 w-8 rounded-full"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button variant="outline" size="icon" onClick={toggleMute} className="h-8 w-8 rounded-full">
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        {showTitle && <span className="text-sm">{getCurrentTrackTitle()}</span>}
      </div>
    )
  }

  // Full variant
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="icon"
          onClick={togglePlayPause}
          className="h-8 w-8 rounded-full"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

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

        {showTitle && <span className="text-sm font-medium">{getCurrentTrackTitle()}</span>}
      </div>

      {tracks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tracks.map((track) => (
            <Button
              key={track.id}
              variant={currentTrack === track.id ? "default" : "outline"}
              size="sm"
              onClick={() => changeTrack(track.id)}
              className={currentTrack === track.id && isPlaying ? "animate-pulse" : ""}
            >
              {track.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

