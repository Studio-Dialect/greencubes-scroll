// components/ScrollImageSequence.js
'use client'
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const ScrollTest = () => {
    const totalFrames = 97; // Adjust this based on your number of images
    const images = Array.from({ length: totalFrames }, (_, i) => `/sequence/zoom_${i + 1}.png`);
    
    // Get scroll position
    const { scrollYProgress } = useScroll();
    
    // Map scroll position to frame number
    const frame = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);
    
    const [currentFrame, setCurrentFrame] = useState(0);

    // Update the current frame based on scroll position
    useEffect(() => {
        const unsubscribe = frame.on("change", (latestFrame) => {
        setCurrentFrame(Math.round(latestFrame));
        });

        // Clean up event listener
        return () => unsubscribe();
    }, [frame]);

    return (
        <div style={{ height: "1000vh" }}> {/* Adjust for desired scroll length */}
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
        />
        </div>
    );
};

export default ScrollTest;
