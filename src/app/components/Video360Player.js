'use client';
import React, { useEffect } from 'react';
import View360, { EquirectProjection, GyroControl } from '@egjs/view360';
import "@egjs/view360/css/view360.min.css";


const Video360Player = () => {
    useEffect(() => {
    const initializeViewer = async () => {
        // Check if we need to ask for permission to access gyroscope
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function';

        if (shouldQueryPermission) {
        try {
            const permissionGranted = await DeviceMotionEvent.requestPermission();
            if (permissionGranted !== 'granted') {
            console.warn('Gyroscope permission was denied.');
            return; // Exit if the user denies permission
            }
        } catch (error) {
            console.error('Error requesting gyroscope permission', error);
            return; // Exit if there was an error
        }
        }

        // Initialize View360 with gyro enabled after permission is granted
        const viewer = new View360('#viewer', {
        projection: new EquirectProjection({
            src: '/360Cam_sm.mp4', // Path to your 360 video
            video: true,
        }),
        gyro: true, // Enable gyro controls
        });

        // Clean up the viewer when the component is unmounted
        return () => {
        viewer.destroy();
        };
    };

    initializeViewer();
    }, []);
    return (
        <div id="viewer" style={{ width: '100%', height: '100vh' }}>
            <canvas className="view360-canvas" />
        </div>
    );
};

export default Video360Player;
