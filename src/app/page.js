'use client';
import { useState, useRef, useEffect, Suspense} from 'react';
import ExploreBtn from './components/ExploreBtn';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollElement from './components/ScrollElement';
import Image from 'next/image';
import AmablePoster from './components/AmablePoster';
import Video360Player from './components/Video360Player';
import { sendEvent } from '../../utils/analytics';
import Modal from './components/Modal';
import Link from 'next/link';

//const Video360Player = dynamic(() => import('./components/Video360Player'), { ssr: false });

export default function Home() {
  const [btnVisible, setBtnVisible] = useState(true);
  const [showVideo360, setShowVideo360] = useState(false);
  const [video360Loaded, setVideo360Loaded] = useState(false);
  const [showAmablePoster, setShowAmablePoster] = useState(false);
  const [showMainVideo, setShowMainVideo] = useState(true);
  const videoRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const exploreClicked = useRef(false);

  const handleExploreClick = () => {    
    if (videoRef.current) {
      videoRef.current.play();
    }
    setBtnVisible(false);

    sendEvent({
      action: 'explore_click',
      value: "Explore",
    });

    exploreClicked.current = true; 

    setTimeout(() => {
      setShowAmablePoster(true); // Hide AmablePoster after Video360Player loads
    }, 12000);
    setTimeout(() => {
      setShowVideo360(true);
      setShowAmablePoster(false);
    }, 14500);
  };

  useEffect(() => {
    const modalTimeout = setTimeout(() => {
      if (!exploreClicked.current) {
        // Show modal only if explore button hasn't been clicked
        setShowModal(true);
      }
    }, 4000);

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      clearTimeout(modalTimeout); // Clean up the timeout
      if (videoElement) {
        videoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, []);

  const handleVideoEnd = () => {
     // Show AmablePoster

    setShowAmablePoster(false);
    
    console.log('videoended')
    setTimeout(() => {
       // Hide AmablePoster after Video360Player loads
      // Set showVideo360 after showing AmablePoster
      setShowMainVideo(false);
    }, 200); // Smooth fade-out after Video360Player is ready
  };

  const handleVideo360Loaded = () => {
    setVideo360Loaded(true);
  };

  return (
    <div className="bg-black relative">
    
      {/* Video Player with AmablePoster overlay */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black z-0"
        initial={{ opacity: 1 }}
        animate={showMainVideo ? { opacity: 1 } : { opacity: 0}}
        transition={{ duration: 1 }}
      >
        <video
          ref={videoRef}
          src="https://upcdn.io/W142iUD/raw/greencubes/zoom_05_sm.mp4"
          className="w-full max-w-3xl"
          muted
          playsInline
          preload="auto"
          poster="/intro-flight.jpg"
        />
      </motion.div>
{/*
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="text-white text-center mb-7">
            <p className="pb-8">It looks like the process is taking longer than expected. Please check your connection or click below to proceed.</p>
            <Link href='/form' className="w-full py-2 px-5 bg-lime-500 hover:bg-green-500 text-white text-lg rounded">
              Take me to Certificate
            </Link>
          </div>
        </Modal>
      )}
      */}

      {/* AmablePoster overlay with fade animation */}
      <AnimatePresence>
        {showAmablePoster && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <AmablePoster />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video360Player overlay with fade-in animation */}
        <div>
        <motion.div
          className="w-full h-[90vh] relative z-10"
          initial={{ opacity: 0 }}
          animate={showVideo360 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Video360Player onLoadedData={handleVideo360Loaded} />
        </motion.div>


      {/* Scroll interaction below Video360Player */}

        <motion.div 
          className="relative z-0"
          initial={{ opacity: 0 }}
          animate={showVideo360 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <ScrollElement />
        </motion.div>
      </div>
      {/* Explore Button */}
      <motion.div
        animate={btnVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className={`flex flex-col justify-between items-center h-[96vh] pb-24 pt-12 fixed top-0 left-0 w-screen z-20 ${showVideo360 ? "hidden" : "flex"}`}
      >
        <div className="text-3xl text-white text-center">A CUBIC METER<br/>OF LIFE</div>
        <ExploreBtn onExploreClick={handleExploreClick} />
        <div className="mt-16">
          <Image src="/greencubes-logo-white.svg" alt="Green Cubes Footer" width={288} height={96} className="w-80" />
        </div>
      </motion.div>
    </div>
  );
}


