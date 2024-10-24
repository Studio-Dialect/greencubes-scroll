'use client'
import React, { useEffect } from 'react';
import View360, { EquirectProjection, ControlBar } from '@egjs/view360';
import "@egjs/view360/css/view360.min.css";
import "@egjs/view360/css/control-bar.min.css";

const Video360Player = () => {
    useEffect(() => {
        const initializeViewer = async () => {
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
                        gyroButton: true, 
                        showBackground: false,
                        progressBar: false,
                        videoTime: false, 
                        volumeButton: false
                    })
                ],
            });

            // Clean up the viewer when the component is unmounted
            return () => {
                viewer.destroy();
            };
        };

        initializeViewer();
    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '100vh', backgroundColor: 'black' }} className='overflow-hidden'>
            <canvas className="view360-canvas" />
        </div>
    );
};

export default Video360Player;
