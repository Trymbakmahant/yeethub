'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: '🔐',
    title: 'Connect Wallet',
    description: 'Connect your Solana wallet to manage your API wrappers and track revenue',
  },
  {
    icon: '🌐',
    title: 'Auto Subdomains',
    description: 'Get professional subdomain URLs automatically - no DNS configuration needed',
  },
  {
    icon: '💻',
    title: 'Wrap Any API',
    description: 'Wrap any existing API endpoint with x402 payment functionality',
  },
  {
    icon: '💰',
    title: 'Pay-per-Request',
    description: 'Monetize your APIs with native SOL or any SPL token payments',
  },
];

export function AboutProject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: -50,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate cards sequentially
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          // Hover animation
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              y: -10,
              duration: 0.3,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
        >
          About YeetHub
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          A decentralized platform that wraps your existing APIs with x402 payment functionality. 
          Monetize your APIs instantly with pay-per-request pricing, automatic subdomain assignment, 
          and seamless Solana payments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#FF6B35] transition-all cursor-pointer shadow-lg"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <p className="text-gray-300 leading-relaxed">
                Connect your Solana wallet to create and manage your API wrappers
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <p className="text-gray-300 leading-relaxed">
                Create an API wrapper by providing your original API URL and pricing
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <p className="text-gray-300 leading-relaxed">
                Get an auto-assigned professional subdomain URL for your wrapped API
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <p className="text-gray-300 leading-relaxed">
                Users access your API via the subdomain and pay automatically per request
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <p className="text-gray-300 leading-relaxed">
                Track revenue and analytics in your dashboard
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Your wallet address is your identity</strong> - all your API wrappers 
              and revenue are tied to your wallet, so you can easily manage them whenever you return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}