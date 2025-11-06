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
    description: 'Connect your Solana wallet to store your deployment history and manage your apps',
  },
  {
    icon: '🚀',
    title: 'Deploy Spaces',
    description: 'Provide a Hugging Face Space URL and we\'ll deploy it as a Docker container for you',
  },
  {
    icon: '💻',
    title: 'Live Instances',
    description: 'Access your deployed apps anytime with a live, running instance of your Space',
  },
  {
    icon: '💰',
    title: 'Pay with x402',
    description: 'Seamless payment using x402 tokens for deployment and usage',
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
          A decentralized platform that allows you to deploy and use Hugging Face Spaces 
          as standalone Docker applications. Simply provide a Hugging Face Space link, and we'll 
          handle the deployment for you.
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
                Connect your Solana wallet to store your deployment history
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <p className="text-gray-300 leading-relaxed">
                Create a new Yeet app by providing your Hugging Face Space URL
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <p className="text-gray-300 leading-relaxed">
                We deploy the Docker container and provide you with a live instance
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <p className="text-gray-300 leading-relaxed">
                Access your deployed apps anytime by connecting your wallet
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <p className="text-gray-300 leading-relaxed">
                Pay for usage seamlessly with x402 tokens
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Your wallet address is your identity</strong> - all your deployments 
              and usage history are tied to your wallet, so you can easily access them whenever you return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}