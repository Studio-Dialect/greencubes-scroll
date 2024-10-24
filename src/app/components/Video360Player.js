'use client';
import React, { useState, useEffect } from 'react';
import View360, { EquirectProjection, ControlBar, GyroControl } from '@egjs/view360';
import "@egjs/view360/css/view360.min.css";
import "@egjs/view360/css/control-bar.min.css";
import Image from 'next/image';

const Video360Player = () => {
    const [showGyroButton, setShowGyroButton] = useState(false); // State to show/hide the button
    const [gyroEnabled, setGyroEnabled] = useState(false); // Track if gyro permission is granted

    useEffect(() => {
        const initializeViewer = async () => {
            // Initialize the viewer
            const viewer = new View360('#viewer', {
                projection: new EquirectProjection({
                    src: '/360Cam_sm.mp4', // Path to your 360 video
                    video: {
                        autoplay: true,
                        muted: true,
                    },
                }),
                gyro: true, // Gyro functionality directly enabled
                zoom: false,
                plugins: [
                    new ControlBar({
                        gyroButton: {
                            position: ControlBar.POSITION.TOP_RIGHT,
                            order: 0,
                        },
                        showBackground: false,
                        progressBar: false,
                        videoTime: false, 
                        volumeButton: false,
                    }),
                ],
            });

            // Clean up the viewer when the component is unmounted
            return () => {
                viewer.destroy();
            };
        };

        initializeViewer();
    }, []);

    const handleGyroPermission = async () => {
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        if (shouldQueryPermission) {
            try {
                const permissionStatus = await DeviceMotionEvent.requestPermission();
                if (permissionStatus === 'granted') {
                    setGyroEnabled(true); // Gyro permission granted
                    setShowGyroButton(false); // Hide the button
                    console.log('Gyro permission granted');
                } else {
                    console.log('Gyro permission denied');
                }
            } catch (error) {
                console.log('Error requesting gyro permission:', error);
            }
        }
    };

    // Show the gyro permission button if the permission hasn't been granted
    useEffect(() => {
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        if (shouldQueryPermission) {
            setShowGyroButton(true);
        }
    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '90vh', backgroundColor: 'black' }} className='relative overflow-hidden'>
            <canvas className="view360-canvas" />

            {/* Show an overlay button if gyro permission is required */}
            {showGyroButton && !gyroEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-20">
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
                </div>
            )}
        </div>
    );
};

export default Video360Player;
