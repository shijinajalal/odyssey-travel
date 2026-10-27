'use client'

import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const VIDEO_SRC = '/videos/Miniature_car_driving_on_map_20261026174302.mp4'
const POSTER_SRC = '/images/hero-video-poster.jpg'

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  function handleMetadata(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget
    video.pause()
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration)
      if (video.currentTime > 0) video.currentTime = 0
    }
  }

  function handleLoadedData(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget
    video.pause()
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration)
      setVideoReady(true)
    }
  }

  useLayoutEffect(() => {
    const video = videoRef.current
    if (video && !videoReady && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && Number.isFinite(video.duration) && video.duration > 0) {
      video.pause()
      setDuration(video.duration)
      setVideoReady(true)
      return
    }
    const section = sectionRef.current
    const copy = copyRef.current
    if (!video || !section || !copy || !videoReady || !duration || videoFailed) return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()

    media.add({
      mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      tablet: '(min-width: 768px) and (max-width: 1100px) and (prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1101px) and (prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const conditions = context.conditions as { mobile: boolean; tablet: boolean; desktop: boolean; reduced: boolean }
      if (conditions.reduced) return
      const isMobile = conditions.mobile
      const isTablet = conditions.tablet
      const fps = 24
      // Stop at the final encoded frame, rather than the timestamp at the end
      // of the file (which can render as black in some browsers).
      const lastFrame = Math.max(0, duration - 1 / fps)
      const playhead = { time: 0 }
      let lastRequested = -1
      let slowSeekTimer: number | undefined

      const handleSeeking = () => {
        window.clearTimeout(slowSeekTimer)
        slowSeekTimer = window.setTimeout(() => {
          if (video.seeking) setVideoFailed(true)
        }, isMobile ? 1000 : 1800)
      }
      const renderVideoFrame = () => {
        if (video.error || video.readyState < HTMLMediaElement.HAVE_METADATA) return
        const target = Math.max(0, Math.min(lastFrame, playhead.time))
        if (video.seeking) return
        if (lastRequested >= 0 && Math.abs(lastRequested - target) < 1 / fps * 0.45) return
        if (Math.abs(video.currentTime - target) < 1 / fps * 0.45) return
        try {
          video.currentTime = target
          lastRequested = target
        } catch {
          setVideoFailed(true)
        }
      }

      const handleSeeked = () => {
        window.clearTimeout(slowSeekTimer)
        // Scroll can move while a frame is decoding. Once the active seek
        // completes, immediately catch up to the latest scroll position.
        lastRequested = -1
        if (Math.abs(video.currentTime - playhead.time) >= 1 / fps * 0.45) {
          renderVideoFrame()
        }
      }
      video.addEventListener('seeking', handleSeeking)
      video.addEventListener('seeked', handleSeeked)

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (isMobile ? 1.25 : isTablet ? 1.7 : 2.15))}`,
          pin: section,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: renderVideoFrame,
        },
      })

      timeline.to(playhead, {
        time: lastFrame,
        duration: 0.9,
        ease: 'none',
        onUpdate: renderVideoFrame,
      }, 0)
      // Spend the final tenth of the pinned journey on the film’s last frame.
      timeline.to(playhead, {
        time: lastFrame,
        duration: 0.1,
        ease: 'none',
        onUpdate: renderVideoFrame,
      }, 0.9)
      timeline.to(copy, {
        autoAlpha: 0,
        duration: 0.16,
        ease: 'none',
      }, 0.1)

      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        cancelAnimationFrame(refreshFrame)
        window.clearTimeout(slowSeekTimer)
        video.removeEventListener('seeking', handleSeeking)
        video.removeEventListener('seeked', handleSeeked)
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    }, section)

    // Reduced-motion users still get the real poster frame and all hero
    // content, but no pinning or scroll-driven motion is forced on them.
    return () => media.revert()
  }, [duration, videoReady, videoFailed])

  return (
    <section ref={sectionRef} className={`cinematic-hero${videoFailed ? ' cinematic-hero-fallback' : ''}`} aria-label="Odyssey Travel cinematic journey">
      <div className="cinematic-poster" aria-hidden="true" />
      <video
        ref={videoRef}
        className="cinematic-video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        tabIndex={-1}
        onLoadedMetadata={handleMetadata}
        onLoadedData={handleLoadedData}
        onError={() => setVideoFailed(true)}
      />
      <div className="cinematic-shade" aria-hidden="true" />
      <div className="cinematic-copy" ref={copyRef}>
        <span className="cinematic-kicker"><i /> A JOURNEY IN MOTION</span>
        <h1>The world is<br /><em>yours to explore.</em></h1>
        <p>Discover extraordinary destinations and turn every journey into an unforgettable story.</p>
        <div className="cinematic-actions">
          <Link href="/destinations" className="button button-light">Explore destinations <ArrowRight size={17} /></Link>
          <Link href="/plan-your-trip" className="cinematic-secondary">Plan your journey <ArrowRight size={16} /></Link>
        </div>
      </div>
      <div className="cinematic-scroll-cue" aria-hidden="true">
        <span>{videoFailed || reducedMotion ? 'SCROLL TO DISCOVER' : 'SCROLL TO TRAVEL'}</span>
        <ArrowDown size={15} />
      </div>
      <span className="cinematic-caption" aria-hidden="true">A LITTLE FURTHER. A WORLD AWAY.</span>
      {videoFailed && <p className="cinematic-fallback-message" role="status">The interactive film isn’t available right now. Explore the destinations below to continue your journey.</p>}
    </section>
  )
}
