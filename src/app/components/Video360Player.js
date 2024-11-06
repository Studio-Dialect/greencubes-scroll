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
    const [showGyroButton, setShowGyroButton] = useState(false);
    const [gyroEnabled, setGyroEnabled] = useState(false);
    const [viewer, setViewer] = useState(null);
    const [volumeOn, setVolumeOn] = useState(false);
    const audioRef = useRef(null);
    const playerRef = useRef(null);

    const initializeViewer = (enableGyro = false) => {
        if (viewer) {
            viewer.destroy();
        }

        const newViewer = new View360('#viewer', {
            projection: new EquirectProjection({
                src: '/360Cam_sm.mp4',
                video: {
                    autoplay: true,
                    muted: true,
                },
            }),
            gyro: enableGyro,
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

        setViewer(newViewer);
    };

    useEffect(() => {
        initializeViewer(false);

        // Clean up viewer when the component is unmounted
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            volumeOn ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [volumeOn]);

    useEffect(() => {
        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (audioRef.current) {
                    if (entry.isIntersecting) {
                        volumeOn && audioRef.current.play(); // Play if in view and volume is on
                    } else {
                        audioRef.current.pause(); // Pause if out of view
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1, // Adjust based on when you want to pause the audio (e.g., 0.1 for 10% visibility)
        });

        if (playerRef.current) {
            observer.observe(playerRef.current);
        }

        return () => {
            if (playerRef.current) {
                observer.unobserve(playerRef.current);
            }
        };
    }, [volumeOn]);

    const handleGyroPermission = async () => {
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        if (shouldQueryPermission) {
            try {
                const permissionStatus = await DeviceMotionEvent.requestPermission();
                if (permissionStatus === 'granted') {
                    setGyroEnabled(true);
                    setShowGyroButton(false);
                    localStorage.setItem('gyroPermission', 'granted');
                    initializeViewer(true);
                    sendEvent({
                        action: 'gyro_click',
                        value: "Gyro Permissions Allowed",
                    });
                } else {
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

    useEffect(() => {
        const storedPermission = localStorage.getItem('gyroPermission');
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        setGyroEnabled(false);

        if (storedPermission === 'granted') {
            DeviceMotionEvent.requestPermission().then((status) => {
                if (status === 'granted') {
                    setGyroEnabled(true);
                    setShowGyroButton(false);
                    initializeViewer(true);
                } else {
                    setShowGyroButton(true);
                }
            }).catch(error => {
                console.log("Error re-checking gyro permission:", error);
                setShowGyroButton(true);
            });
        } else if (shouldQueryPermission) {
            setShowGyroButton(true);
        }
    }, []);

    const handleVolumeClick = () => {
        setVolumeOn(!volumeOn);
    };

    return (
        <div id="viewer" ref={playerRef} style={{ width: '100%', height: '90vh', backgroundColor: 'black' }} className='relative overflow-hidden'>
            <canvas className="view360-canvas" />
            <audio ref={audioRef} src="/forestBackground.mp3" loop />

            <div className="absolute top-3 left-3 w-full inset-0 flex flex-col items-start justify-start text-white z-30 bg-transparent">
                <div className='text-xl bg-black/50 rounded-full border border-white p-2' onClick={handleVolumeClick}>
                    {volumeOn ? <FaVolumeHigh/> : <FaVolumeXmark />}
                </div>
            </div>
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
                <div className='text-4xl animate animate-pulse'><SlArrowDown /></div>
            </div>
        </div>
    );
};

export default Video360Player;
