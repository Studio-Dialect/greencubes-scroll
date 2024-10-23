'use client'
import { useState, useRef, useEffect } from 'react';
import ExploreBtn from './components/ExploreBtn';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const videoRef = useRef(null); // Reference to the video element

  const handleExploreClick = () => {    
    if (videoRef.current) {
      videoRef.current.play(); // Play the video when "Explore" is clicked
    }
    setBtnVisible(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Video Player (Visible, but play on click) */}
        <div className="fixed inset-0 flex items-center justify-center bg-black z-0">
          <video
            ref={videoRef} // Attach the reference to the video element
            src="/Intro_flight.mp4" // Add your video path here
            className="w-full max-w-3xl"
            muted
            // Video will not autoplay, only play on click
          />
        </div>  
        {/* Explore Button */}
        <motion.div
          animate={btnVisible ? { opacity: 100 } : { opacity: 0 }} // Move left when hovered
          transition={{ duration: 1 }}
        >
          <ExploreBtn onExploreClick={handleExploreClick} />
        </motion.div>
    </div>
  );
}