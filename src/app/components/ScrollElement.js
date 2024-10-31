'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from 'next/navigation';
import { sendEvent } from '../../../utils/analytics';

const ScrollElement = () => {
    const { scrollYProgress } = useScroll();
    const [userName, setUserName] = useState(''); // Store the user's name
    const router = useRouter(); // Use Next.js router to navigate to Certificate

     // Image Sequence Setup
     const totalFrames = 97; // Adjust this based on your number of images
     const images = Array.from({ length: totalFrames }, (_, i) => `/sequence/zoom_${i + 1}.png`);
     const frame = useTransform(scrollYProgress, [0, 0.4], [0, totalFrames - 1]);
     const [currentFrame, setCurrentFrame] = useState(0);
     const [imagesLoaded, setImagesLoaded] = useState(false); // Track if images are fully loaded

     // Preload images function
    useEffect(() => {
        let loadedCount = 0;
        images.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount += 1;
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true); // Set as loaded when all images are cached
                }
            };
            img.onerror = () => console.error(`Failed to load image: ${src}`);
        });
    }, [images]);

     // Update the current frame based on scroll position
    useEffect(() => {
        if (!imagesLoaded) return; // Only track the frame once images are loaded
        const unsubscribe = frame.on("change", (latestFrame) => {
            setCurrentFrame(Math.round(latestFrame));
        });
        return () => unsubscribe();
    }, [frame, imagesLoaded]);

    // Step 3: Key messages animation (slide in)
    const message1X = useTransform(scrollYProgress, [0.05, 0.08, 0.15, 0.2], ['100%', '0%', '0%', '-100%']);
    const message1Opacity = useTransform(scrollYProgress, [0.05, 0.09, 0.15, 0.2], [0, 1, 1, 0]);
    const message1Bg = useTransform(scrollYProgress, [0.05, 0.15], ['linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))', 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))'])

    const message2X = useTransform(scrollYProgress, [0.2, 0.23, 0.3, 0.35], ['100%', '0%', '0%', '-100%']);
    const message2Opacity = useTransform(scrollYProgress, [0.2, 0.23, 0.3, 0.35], [0, 1, 1, 0]);
    const message2Bg = useTransform(scrollYProgress, [0.2, 0.3], ['linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))', 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))'])


    const message3X = useTransform(scrollYProgress, [0.35, 0.38, 0.45, 0.55], ['100%', '0%', '0%', '-100%']);
    const message3Opacity = useTransform(scrollYProgress, [0.35, 0.38, 0.45, 0.55], [0, 1, 1, 0]);
    const message3Bg = useTransform(scrollYProgress, [0.35, 0.45], ['linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))', 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))'])


    // Step 4: Final section scroll for call to action
    const callToActionY = useTransform(scrollYProgress, [0.5, 0.7], [800, 0]);
    const callToActionOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);


    // Handle form submission
    const handleSubmit = (e) => {
        sendEvent({
            action: 'form_submit',
            value: "Form Submit",
        });
        e.preventDefault();
        // Manually construct the URL with query parameters
        router.push(`/certificate?name=${encodeURIComponent(userName)}`);
    };

    return (
        <div style={{ height: '1000vh' }} className='bg-black'> {/* Tall container for scrolling */}
            
           {/* Image Sequence */}
            {imagesLoaded ? (
                <motion.img
                    src={images[currentFrame]}
                    alt="Scroll Sequence"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        objectFit: "cover",
                    }}
                    priority 
                />
            ) : (
                <div className="fixed inset-0 flex items-center justify-center text-white">
                    Loading...
                </div>
            )}

            {/* Step 3: Key messages slide in */}
            <div className="fixed top-0 left-0 w-full h-screen flex items-end justify-center">
                <motion.div 
                    style={{ x: message1X, 
                            opacity: message1Opacity,
                            background: message1Bg
                        }} 
                    className=" absolute text-white text-xl bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
                >
                    Your Green Cube protects a cubic meter of rainforest in a critical passage of the COBIGA wildlife corridor.
                </motion.div>
                <motion.div 
                    style={{ x: message2X, 
                            opacity: message2Opacity,
                            background: message2Bg
                        }} 
                    className="absolute text-white text-xl bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
                >
                    The corridor connects two of Costa Rica’s oldest National parks, in one of the richest biodiversity hot spots on earth.
                </motion.div>
                <motion.div 
                    style={{ x: message3X, 
                            opacity: message3Opacity,
                            background: message3Bg 
                        }} 
                    className="absolute text-white text-xl bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
                >
                    enabling animal movement to expand distribution, promote genetic diversity, and increase wildlife resilience.
                </motion.div>
            </div>

            {/* Step 4: Final section with Call to Action */}
            <motion.div 
                style={{ opacity: callToActionOpacity, y: callToActionY }}
                className="w-full h-screen bg-[url('/frog.jpg')] bg-cover bg-center flex items-center justify-center fixed top-0"
            >
                <div className="text-center text-white flex flex-col items-between justify-around h-full px-12">
                    <h1 className="text-4xl capitalize font-semibold">ACTIVATE YOUR GREEN CUBE</h1>
                    <form className="mt-4 space-y-4 flex flex-col justify-center items-center px-5" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)} // Capture the name input
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                        />
                        <button 
                            type="submit" 
                            className="w-full p-2 bg-lime-500 hover:bg-green-500 text-white text-lg rounded"
                        >
                            Activate
                        </button>
                    </form>
                </div> 
            </motion.div>
        </div>
    );
};

export default ScrollElement;
