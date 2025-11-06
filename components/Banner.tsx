'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate title with split text effect
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 100,
          scale: 0.8,
          duration: 1.2,
          ease: 'power3.out',
        });

        // Add a pulsing glow effect to the gradient text
        gsap.to(titleRef.current, {
          backgroundPosition: '200% center',
          duration: 3,
          repeat: -1,
          ease: 'linear',
        });
      }

      // Animate subtitle
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.4,
          ease: 'power2.out',
        });
      }

      // Animate button with bounce
      if (buttonRef.current) {
        // Set initial state
        gsap.set(buttonRef.current, {
          opacity: 0,
          scale: 0.5,
          rotation: -180,
          transformOrigin: 'center center',
        });

        // Entrance animation
        gsap.to(buttonRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          delay: 0.6,
          ease: 'back.out(1.7)',
          onComplete: () => {
            // Floating animation (starts after entrance completes)
            gsap.to(buttonRef.current, {
              y: -10,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: 'power1.inOut',
            });
          },
        });

        // Hover animation
        buttonRef.current.addEventListener('mouseenter', () => {
          gsap.to(buttonRef.current, {
            scale: 1.1,
            boxShadow: '0 10px 40px rgba(255, 107, 53, 0.5)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        buttonRef.current.addEventListener('mouseleave', () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            boxShadow: '0 0 0px rgba(255, 107, 53, 0)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-black h-[calc(100vh-200px)] flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Animated background gradient circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center relative z-10">
        <h1
          ref={titleRef}
          className="bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-[length:200%_auto]"
          style={{
            backgroundImage: 'linear-gradient(90deg, #ff8c42, #ffffff, #ff6b35, #ff8c42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          the official deployment platform
        </h1>
        <div className="text-center mb-8">
          <p
            ref={subtitleRef}
            className="text-white text-lg md:text-xl font-mono mb-6"
          >
            Deploy Hugging Face Spaces • Use Docker • Pay with x402
          </p>
          <Link
            ref={buttonRef}
            href="/create"
            className="inline-block bg-[#FF6B35] hover:bg-[#ff5722] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all cursor-pointer"
          >
            Create New App
          </Link>
        </div>
      </div>
    </div>
  );
}