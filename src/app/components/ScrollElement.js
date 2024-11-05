'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from 'next/navigation';
import { sendEvent } from '../../../utils/analytics';

const ScrollElement = () => {
    const { scrollYProgress } = useScroll();
    const [userName, setUserName] = useState(''); // Store the user's name
    const router = useRouter(); // Use Next.js router to navigate to Certificate
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const totalFrames = 138;
    const images = useRef([]);
    const canvasRef = useRef(null);
    const frame = useTransform(scrollYProgress, [0, 0.45], [0, totalFrames - 1]);

    // Preload images in batches
    useEffect(() => {
        const loadImages = async () => {
            let loaded = 0;
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                img.src = `/sequence/zoom_${i}.jpg`;
                img.onload = () => {
                    loaded++;
                    if (loaded === totalFrames) setImagesLoaded(true);
                };
                images.current.push(img);
            }
        };
        loadImages();
    }, []);

    // Use canvas to draw current frame
    useEffect(() => {
        if (typeof window !== "undefined" && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const context = canvas.getContext("2d");

            const renderFrame = (frame) => {
                const img = images.current[frame];
                if (img) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            };

            const unsubscribe = frame.on("change", (latestFrame) => {
                requestAnimationFrame(() => renderFrame(Math.round(latestFrame)));
            });
            return () => unsubscribe();
        }
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        sendEvent({ action: 'form_submit', value: "Form Submit" });
        
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });
            if (res.status === 200) {
                setStatus('ok');
                router.push(`/certificate?name=${encodeURIComponent(userName)}`);
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div style={{ height: '1000vh' }} className='bg-black'> {/* Tall container for scrolling */}
            
           {/* Image Sequence */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                }}
            />

            {/* Step 3: Key messages slide in */}
            <div className="fixed top-0 left-0 w-full h-screen flex items-end justify-center">
                <motion.div 
                    style={{ x: message1X, 
                            opacity: message1Opacity,
                            background: message1Bg
                        }} 
                    className=" absolute text-white text-[1.4em] bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
                >
                    Your Green Cube protects a cubic meter of rainforest in a critical passage of the COBIGA wildlife corridor in Costa Rica.
                </motion.div>
                <motion.div 
                    style={{ x: message2X, 
                            opacity: message2Opacity,
                            background: message2Bg
                        }} 
                    className="absolute text-white text-[1.4em] bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
                >
                    The corridor connects two of Costa Rica’s oldest National parks, in one of the richest biodiversity hot spots on earth.
                </motion.div>
                <motion.div 
                    style={{ x: message3X, 
                            opacity: message3Opacity,
                            background: message3Bg 
                        }} 
                    className="absolute text-white text-[1.4em] bottom-0 pb-[15vh] left-0 pt-6 px-5 w-full text-left"
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
                    <form name='Sign Up' className="mt-4 space-y-4 flex flex-col justify-center items-center px-5" onSubmit={handleSubmit} netlify>
                    <input type="hidden" name="form-name" value="Sign Up" />
                        <input 
                            type="text" 
                            name='name'
                            placeholder="Name" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)} // Capture the name input
                        />
                        <input 
                            type="email" 
                            name='email'
                            placeholder="Email" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                        />
                        <div className="flex gap-2 w-full">
                        <input type="checkbox" id="checkbox" name="checkbox" className="
                            relative peer shrink-0
                            appearance-none w-4 h-4 border-2 border-lime-500 rounded-sm bg-white
                            mt-1
                            checked:bg-lime-500 checked:border-0
                            focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-lime-100
                            disabled:border-steel-400 disabled:bg-steel-400
                            "
                        />
                            <label htmlFor="checkbox" className='text-left'>Send me details on enterprise sponsorship options.</label>
                            <svg
                                className="
                                absolute 
                                w-4 h-4 mt-1
                                hidden peer-checked:block
                                pointer-events-none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
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
