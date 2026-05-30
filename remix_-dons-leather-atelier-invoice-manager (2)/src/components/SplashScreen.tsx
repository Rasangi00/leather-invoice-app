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

// Total splash screen view duration in milliseconds (3.5 seconds)
const DISPLAY_DURATION = 3500; 

export default function SplashScreen({ onComplete }: SplashScreenProps) {

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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#5c0f22] text-white select-none overflow-hidden"
    >
      
      {/* 
        ELEGANT AMBIENT BACKGROUND GLOW 
        A slow, soft pulsing gold light behind the logo to create depth and a luxurious aura.
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-brand-gold/10 blur-[80px] sm:blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
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
        
        {/* LOGO CONTAINER: Smooth entry with elegant scale, fade-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1
          }}
          className="relative mb-10 sm:mb-12 flex items-center justify-center animate-pulse-subtle"
        >
          {/* Elegant Inline SVG Monogram with animated golden drawing circle & gorgeous ambient shimmer */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-40 h-40 sm:w-48 sm:h-48 relative z-10 pointer-events-none"
            animate={{
              filter: [
                "drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 2px rgba(223,183,80,0.15))",
                "drop-shadow(0 4px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 16px rgba(223,183,80,0.5))",
                "drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 2px rgba(223,183,80,0.15))"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Elegant luxury circular border that "draws itself" to create a premium feel */}
            <motion.circle
              cx="256"
              cy="256"
              r="170"
              stroke="#dfb750"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0.8, 0] }}
              transition={{
                pathLength: { duration: 2.2, ease: [0.25, 1, 0.5, 1], delay: 0.3 },
                opacity: { duration: 3.2, times: [0, 0.1, 0.65, 0.85, 1], ease: "easeInOut" },
                rotate: { duration: 2.2, ease: "easeOut", delay: 0.3 }
              }}
              style={{ transformOrigin: "256px 256px" }}
            />

            {/* The gold LD Monogram */}
            <g transform="translate(256, 256) scale(1.3)" strokeLinejoin="round" strokeLinecap="round">
              {/* THE SERIF "L" */}
              <path 
                d="M -80, -110 L -15, -110 C -25, -95 -25, -80 -25, -60 L -25, 70 C -25, 80 -30, 95 -45, 95 L 50, 95 C 65, 95 75, 90 75, 75 H 85 V 110 H -95 V 75 H -85 C -70, 75 -65, 70 -65, 55 L -65, -55 C -65, -75 -70, -78 -85, -78 H -95 V -110 Z" 
                fill="#dfb750" 
              />
              
              {/* THE SERIF "D" Crescent Bow */}
              <path 
                d="M -25, -90 C 35, -90 100, -50 100, 10 C 100, 70 35, 110 -25, 110 C 5, 110 75, 75 75, 10 C 75, -50 5, -90 -25, -90 Z" 
                fill="#dfb750" 
              />
            </g>
          </motion.svg>
        </motion.div>

        {/* BRAND IDENTITY LABELS */}
        <div className="space-y-4">
          
          {/* Main Title: Letter-spacing elegant entry */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.25em", y: 8 }}
            animate={{ opacity: 1, letterSpacing: "0.4em", y: 0 }}
            transition={{
              duration: 1.6,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4
            }}
            className="font-serif text-3xl sm:text-4xl lg:text-4.5xl font-light text-brand-gold uppercase tracking-[0.4em] leading-none text-center"
          >
            Dons Leather
          </motion.h1>

          {/* Luxury thin line separator */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.35 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-24 bg-brand-gold mx-auto origin-center mt-3"
          />

          {/* Luxury Tagline / Slogan Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] sm:text-xs font-sans font-medium uppercase text-brand-gold-light/95 tracking-[0.45em] text-center"
          >
            Atelier Ledger
          </motion.p>
        </div>

        {/* 
          LUXURIOUS MINIMALIST LOADING INDICATOR 
          A single silent thin golden line tracking progress elegantly.
        */}
        <div className="mt-12 sm:mt-16 w-36 sm:w-44 h-[2px] bg-[#3a0410] rounded-full overflow-hidden border border-brand-gold/5">
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
