/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * ============================================================================
 * DONS LEATHER ATELIER - LUXURY SPLASH SCREEN
 * ============================================================================
 * 
 * HOW TO CUSTOMIZE THIS SPLASH SCREEN LATER:
 * 
 * 1. ANIMATION TIME:
 *    - To change the total duration before the dashboard is shown, modify the
 *      `DISPLAY_DURATION` constant below (defined in milliseconds).
 *      Currently set to 2500ms (2.5 seconds) as requested.
 * 
 * 2. BACKGROUND COLOR:
 *    - To change the background color of the splash screen, modify the Tailwind 
 *      classes on the motion.div master container in the return block below.
 *      Currently uses "bg-brand-wine-dark" (deep bordeaux burgundy).
 *      You can change it to any color (e.g. "bg-slate-950" or custom color).
 * 
 * 3. LOGO:
 *    - To use a custom image logo like "/logo.png", toggle the state or replace the
 *      SVG structure inside the "Logo Section" code block under `logoAvailable`.
 *      You can modify the width, height, and SVG paths as desired.
 * 
 * 4. TAGLINE:
 *    - To change the sub-heading, edit the text inside the sub-heading <h2> tag below:
 *      “Premium Leather Invoice Manager”
 */

// Total splash screen view duration in milliseconds (2.5 seconds default)
const DISPLAY_DURATION = 3500; 

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [logoAvailable, setLogoAvailable] = useState<boolean>(true);

  useEffect(() => {
    // Run timer to transition into the main dashboard view automatically
    const timer = setTimeout(() => {
      onComplete();
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -15, 
        scale: 1.02,
        filter: "blur(4px)" 
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-wine-dark text-white select-none overflow-hidden"
    >
      
      {/* 
        ELEGANT AMBIENT BACKGROUND GLOW 
        A slow, soft pulsing gold light behind the logo to create depth and a luxurious aura.
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-brand-gold/5 blur-[80px] sm:blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* 
        MAIN CENTERING HOLDER 
        Contains the Logo Mark, Brand Name and Tagline with elegant staggered animations.
      */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">
        
        {/* LOGO CONTAINER: Smooth entry with elegant scale, fade-in & hover effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // Custom premium ease-out bezier curve
            delay: 0.2
          }}
          className="relative mb-6 sm:mb-8"
        >
          {/* Subtle spinning circular border matching general workshop design */}
          <motion.div 
            className="absolute -inset-4 sm:-inset-5 rounded-full border border-brand-gold/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Golden Outer Decorative Emblem Frame */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-brand-wine border border-brand-gold/30 flex items-center justify-center shadow-2xl relative z-10">
            {logoAvailable ? (
              <img 
                src="/logo.png" 
                alt="Dons Leather Atelier"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                onError={() => setLogoAvailable(false)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg 
                className="w-14 h-14 sm:w-18 sm:h-18 text-brand-gold" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Visual custom stylish 'D' brand representation */}
                <path 
                  d="M 28,15 H 56 C 50,15 45,19 45,26 V 63 C 45,72 50,81 63,81 H 28 V 74 C 28,74 35,75 35,65 V 26 C 35,19 28,15 28,15 Z" 
                  fill="currentColor"
                />
                <path 
                  d="M 54,18 C 69,18 77.5,31 77.5,49.5 C 77.5,68 69,81 60,81 C 66.5,77.5 71,65 71,49.5 C 71,34 66.5,21.5 54,18 Z" 
                  fill="currentColor"
                />
              </svg>
            )}
          </div>
        </motion.div>

        {/* BRAND IDENTITY LABELS */}
        <div className="space-y-3 sm:space-y-4">
          
          {/* Main Title: Letter-spacing animation */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: 0.4
            }}
            className="font-serif text-2xl sm:text-3xl lg:text-4.5xl font-bold text-brand-gold tracking-widest leading-none"
          >
            DONS LEATHER ATELIER
          </motion.h1>

          {/* Premium Thin Separator Line */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
            className="h-[1px] w-28 bg-brand-gold/35 mx-auto origin-center"
          />

          {/* Luxury Tagline / Slogan Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-xs sm:text-sm font-sans italic text-brand-gold-light/90 tracking-wide"
          >
            Invoice Manager App
          </motion.p>
        </div>

        {/* 
          LUXURIOUS MINIMALIST LOADING INDICATOR 
          A single silent thin golden line tracking progress elegantly.
        */}
        <div className="mt-12 sm:mt-16 w-32 sm:w-40 h-[2px] bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: (DISPLAY_DURATION - 200) / 1000, // Sync perfectly to total duration minus lead buffer
              ease: "easeInOut",
              delay: 0.1
            }}
            className="h-full w-full bg-gradient-to-r from-brand-gold/40 via-brand-gold to-brand-gold/45 rounded-full"
          />
        </div>

      </div>

      {/* 
        DEDICATED CREDIT / ATTRIBUTION WATERMARK
        Perfect, balanced alignment inside the safe padding at the very bottom.
      */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute bottom-8 left-6 right-6 text-center text-[10px] sm:text-xs font-sans text-brand-gold-light/60 tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1.5"
      >
        <span>Exquisitely created by R.M.R.Rasanjala to my loving </span>
        <span className="font-semibold text-brand-gold-light font-serif">Mr. Gayan Mayadunna</span>
      </motion.div>

    </motion.div>
  );
}
