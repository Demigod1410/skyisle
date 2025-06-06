'use client';

import { Scene } from '@/components/canvas/Scene';
import { Leva } from 'leva';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CameraIcon,
  SunIcon,
  MoonIcon,
  CubeTransparentIcon,
  SparklesIcon,
  ViewfinderCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';

const MotionButton = motion(Button);

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  
  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    // Theme change is now passed to the Scene component
  }, []);

  const handleResetView = useCallback(() => {
    // This would reset the camera view - we'll leave this for future implementation
    console.log("Reset view clicked");
  }, []);

  const handleScreenshot = useCallback(() => {
    // This would take a screenshot - we'll leave this for future implementation
    console.log("Screenshot clicked");
  }, []);

  return (
    <main className="w-full h-screen relative overflow-hidden">
      <Leva collapsed />
      
      {/* Pass isDark prop to Scene component */}
      <Scene isDarkMode={isDark} />
      
      {/* Help Overlay */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">How to Navigate</h2>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-2">
                <ViewfinderCircleIcon className="w-5 h-5" />
                Click and drag to orbit around the island
              </li>
              <li className="flex items-center gap-2">
                <CubeTransparentIcon className="w-5 h-5" />
                Scroll to zoom in/out
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Hover over elements to see details
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}

      {/* Scene */}
      <Scene />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className={`text-4xl font-bold mb-2 tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Floating Island
              <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>
                {' '}Showcase
              </span>
            </h1>
            <p className={`text-base ${
              isDark ? 'text-white/70' : 'text-gray-600'
            }`}>
              Explore this magical 3D environment
            </p>
          </motion.div>

          <div className="flex gap-3">
            <MotionButton
              variant="glow"
              size="icon"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowHelp(true)}
            >
              <SparklesIcon className="h-5 w-5" />
            </MotionButton>
            <MotionButton
              variant="glow"
              size="icon"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleScreenshot}
            >
              <CameraIcon className="h-5 w-5" />
            </MotionButton>
            <MotionButton
              variant="glow"
              className={`relative overflow-hidden transition-all duration-500 ${
                isDark 
                  ? "bg-indigo-900/50 border-indigo-600/50" 
                  : "bg-amber-50/70 border-amber-200/70"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleToggleTheme}
            >
              <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                  background: isDark 
                    ? "linear-gradient(to bottom, #0f172a, #1e2d52)" 
                    : "linear-gradient(to bottom, #fdba74, #fde68a)"
                }}
              />
              <motion.div 
                className="relative z-10 flex items-center gap-2 px-3"
                initial={false}
                animate={{ color: isDark ? "#e3e8ff" : "#b45309" }}
              >
                {isDark ? (
                  <>
                    <MoonIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Night</span>
                  </>
                ) : (
                  <>
                    <SunIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Day</span>
                  </>
                )}
              </motion.div>
            </MotionButton>
          </div>
        </motion.div>

        {/* Bottom Controls */}
        <motion.div
          className="absolute bottom-0 left-0 w-full p-6 flex justify-center pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className={`${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/60 border-gray-200'
          } backdrop-blur-md rounded-full px-8 py-4 flex gap-4 items-center border`}>
            <p className={`text-sm ${
              isDark ? 'text-white/90' : 'text-gray-700'
            }`}>
              Use mouse or touch to explore
            </p>
            <div className={`w-px h-4 ${
              isDark ? 'bg-white/20' : 'bg-gray-300'
            }`} />
            <button
              className={`text-sm transition-colors ${
                isDark 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={handleResetView}
            >
              Reset View
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
