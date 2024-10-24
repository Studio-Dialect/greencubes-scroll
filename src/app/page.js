'use client';
import { useState, useRef, useEffect } from 'react';
import ExploreBtn from './components/ExploreBtn';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ScrollElement from './components/ScrollElement';

// Dynamically import the Video360Player component
const Video360Player = dynamic(() => import('./components/Video360Player'), { ssr: false });

export default function Home() {
  const [btnVisible, setBtnVisible] = useState(true);
  const [showVideo360, setShowVideo360] = useState(false); // Track whether to show the Video360Player
  const [video360Loaded, setVideo360Loaded] = useState(false); // Track when the 360 video is fully loaded
  const videoRef = useRef(null); // Reference to the video element

  const handleExploreClick = () => {    
    if (videoRef.current) {
      videoRef.current.play(); // Play the video when "Explore" is clicked
    }
    setBtnVisible(false);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Listen for the 'ended' event on the video
      videoElement.addEventListener('ended', handleVideoEnd);

      // Add 'play' event listener for debugging
      videoElement.addEventListener('play', () => {
        console.log('Video is playing');
      });
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);

  const handleVideoEnd = () => {
    // Switch to the Video360Player component when the video ends
    console.log('Video ended, switching to 360 player...');
    setShowVideo360(true);
  };

  const handleVideo360Loaded = () => {
    console.log('360 video loaded');
    setVideo360Loaded(true); // 360 video is fully loaded
  };

  return (
    <div className="bg-black">
      {/* Conditionally render the Video360Player if the video has finished */}
      {showVideo360 ? (
        <div>
            {/* Show the Video360Player first */}
            <motion.div
              className="w-full h-screen relative z-10"
              initial={{ opacity: 0 }} // Start invisible
              animate={{ opacity: video360Loaded ? 1 : 0 }} // Fade in once loaded
              transition={{ duration: 1 }} // Smooth fade-in
            >
                <Video360Player onLoadedData={handleVideo360Loaded} />
            </motion.div>

            {/* Below Video360Player is the scroll interaction */}
            <div className="relative z-0">
                <ScrollElement />
            </div>
        </div>
      ) : (
        <>
          {/* Video Player (Visible, but play on click) */}
          <div className="fixed inset-0 flex items-center justify-center bg-black z-0">
            <video
              ref={videoRef}
              src="/Intro_flight.mp4"
              className="w-full max-w-3xl"
              muted
              playsInline
              // Video will not autoplay, only play on click
            />
          </div>  
          {/* Explore Button */}
          <motion.div
            animate={btnVisible ? { opacity: 100 } : { opacity: 0 }} // Fade out button when clicked
            transition={{ duration: 1 }}
          >
            <ExploreBtn onExploreClick={handleExploreClick} />
          </motion.div>
        </>
      )}
    </div>
  );
}
