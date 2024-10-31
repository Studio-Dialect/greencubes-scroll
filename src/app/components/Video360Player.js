'use client';
import React, { useState, useEffect, useRef } from 'react';
import View360, { EquirectProjection, ControlBar } from '@egjs/view360';
import "@egjs/view360/css/view360.min.css";
import "@egjs/view360/css/control-bar.min.css";
import Image from 'next/image';
import { SlArrowDown } from "react-icons/sl";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { sendEvent } from '../../../utils/analytics';


const Video360Player = () => {
    const [showGyroButton, setShowGyroButton] = useState(false); // State to show/hide the button
    const [gyroEnabled, setGyroEnabled] = useState(false); // Track if gyro permission is granted
    const [viewer, setViewer] = useState(null); // Store the viewer instance
    const [volumeOn, setVolumeOn] = useState(false); // Volume controls
    const audioRef = useRef(null); // Ref for audio element

    const initializeViewer = (enableGyro = false) => {
        if (viewer) {
            viewer.destroy(); // Destroy existing viewer if any
        }

        const newViewer = new View360('#viewer', {
            projection: new EquirectProjection({
                src: '/360Cam_sm.mp4', // Path to your 360 video
                video: {
                    autoplay: true,
                    muted: true,
                },
            }),
            gyro: enableGyro, // Enable gyro if permission is granted
            zoom: false,
            plugins: [
                new ControlBar({
                    gyroButton: false,
                    showBackground: false,
                    progressBar: false,
                    videoTime: false, 
                    volumeButton: false,
                }),
            ],
        });

        setViewer(newViewer); // Store the new viewer instance
    };

    useEffect(() => {
        // Initialize the viewer without gyro by default
        initializeViewer(false);
        

        // Clean up the viewer when the component is unmounted
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, []);

    const handleGyroPermission = async () => {
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        if (shouldQueryPermission) {
            try {
                const permissionStatus = await DeviceMotionEvent.requestPermission();
                if (permissionStatus === 'granted') {
                    setGyroEnabled(true);
                    setShowGyroButton(false);
                    localStorage.setItem('gyroPermission', 'granted'); // Store permission status for session
    
                    initializeViewer(true); // Reinitialize with gyro enabled
                    console.log('Gyro permission granted');
                    sendEvent({
                        action: 'gyro_click',
                        value: "Gyro Permissions Allowed",
                    });
                } else {
                    console.log('Gyro permission denied');
                    sendEvent({
                        action: 'gyro_denied',
                        value: "Gyro Permissions Denied",
                    });
                }
            } catch (error) {
                console.log('Error requesting gyro permission:', error);
            }
        }
    };

    // Check local storage and request permission as necessary
useEffect(() => {
    const storedPermission = localStorage.getItem('gyroPermission');
    const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";

    // Reset gyro state on mount to handle fresh sessions
    setGyroEnabled(false);
    
    // If permission was granted in previous session, attempt to initialize with gyro
    if (storedPermission === 'granted') {
        DeviceMotionEvent.requestPermission().then((status) => {
            if (status === 'granted') {
                setGyroEnabled(true);
                setShowGyroButton(false);
                initializeViewer(true);
            } else {
                setShowGyroButton(true); // Show button if permission is denied or revoked
            }
        }).catch(error => {
            console.log("Error re-checking gyro permission:", error);
            setShowGyroButton(true); // Show button if an error occurs
        });
    } else if (shouldQueryPermission) {
        // Show button if permission is required and hasn't been requested yet
        setShowGyroButton(true);
    }
}, []);



    useEffect(() => {
        if (audioRef.current) {
            if (volumeOn) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [volumeOn]);

    const handleVolumeClick = () => {
        setVolumeOn(!volumeOn)
        console.log('clicked')
    }

    return (
        <div id="viewer" style={{ width: '100%', height: '90vh', backgroundColor: 'black' }} className='relative overflow-hidden'>
            <canvas className="view360-canvas" />
            <audio ref={audioRef} src="/forestBackground.mp3" loop />

            <div className="absolute top-3 left-3 w-full inset-0 flex flex-col items-start justify-start text-white z-30 bg-transparent">
                <div className='text-xl bg-black/50 rounded-full border border-white p-2' onClick={handleVolumeClick}>{volumeOn ? <FaVolumeHigh/> : <FaVolumeXmark /> }
                </div>
            </div>
            {/* Show an overlay button if gyro permission is required */}
            {showGyroButton && !gyroEnabled && (
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1, delay: 0.5}}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-30">
                    <Image
                        src="/look-around.svg"
                        alt="Look Around"
                        width={200}
                        height={200}
                        className='mb-5'
                    />
                    <button
                        className="px-4 py-2 bg-lime-500 text-black font-semibold rounded-lg text-sm"
                        onClick={handleGyroPermission}
                    >
                        Enable Gyroscope
                    </button>
                </motion.div>
            )}
            <div className="absolute bottom-[7vh] left-0 w-full inset-0 flex flex-col items-center justify-end text-white z-30 bg-transparent pointer-events-none">
                <div className='text-4xl animate animate-pulse'><SlArrowDown />
                </div>
            </div>
        </div>
    );
};

export default Video360Player;