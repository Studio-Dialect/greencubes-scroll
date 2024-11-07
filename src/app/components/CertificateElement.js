'use client'
import { HiDownload } from "react-icons/hi";
import { toJpeg } from 'html-to-image';
import { useEffect, useRef } from 'react';
import Image from 'next/image'; // Import Next.js Image
import { sendEvent } from '../../../utils/analytics';
import * as htmlToImage from 'html-to-image';
import Link from "next/link";


export default function Certificate({ userName }) {
    const certificateRef = useRef(); // Reference to the certificate element

    const waitForFonts = async () => {
        if (document.fonts) {
            await document.fonts.ready;
        }
    };
    
    const waitForImages = async (element) => {
    const images = element.querySelectorAll('img');
    await Promise.all(
        Array.from(images).map((img) => {
        if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            });
        }
        })
    );
    };
    
    const handleDownload = async () => {
        if (certificateRef.current === null) return;
    
        sendEvent({
            action: 'certificate_downloaded',
            value: "Certificate Downloaded",
        });
    
        try {
            await waitForFonts();
            await waitForImages(certificateRef.current);
    
            // Force reflow for reliability
            certificateRef.current.style.display = 'none';
            certificateRef.current.offsetHeight; // Trigger reflow
            certificateRef.current.style.display = '';

            // Capture image and retry up to two more times
                
            await htmlToImage.toJpeg(certificateRef.current, { quality: 0.95 });
            await htmlToImage.toJpeg(certificateRef.current, { quality: 0.95 });
            await htmlToImage.toJpeg(certificateRef.current, { quality: 0.95 });

            const dataUrl = await htmlToImage.toJpeg(certificateRef.current, { quality: 0.95 });

            if (dataUrl) {
                const blob = await fetch(dataUrl).then((res) => res.blob());
                const file = new File([blob], 'certificate.jpg', { type: blob.type });
                
                // Initiate download by creating an anchor element
                const link = document.createElement('a');
                link.download = file.name;
                link.href = URL.createObjectURL(file);
                link.click();
                URL.revokeObjectURL(link.href); // Clean up the object URL
            } else {
                console.error('Failed to capture image after multiple attempts.');
            }
            } catch (err) {
            console.error('Error capturing image:', err);
            }
        };
    
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    return (
        <>
        <div className="relative overflow-hidden">
        <div className="background-diagonal"></div>
        {/* Certificate Section */}
        <div className="h-full flex flex-col justify-start items-center bg-transparent shadow px-5 pt-3.5" ref={certificateRef}>
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-400 to-yellow-300 bg-cover w-full h-36 rounded-t-none rounded-b-[100%] flex items-center justify-center mt-[-4vh]">
                    <img
                        src="/greencubes-logo.svg"
                        alt="Green Cube"
                        style={{ width: '100%', height: '4rem', padding: '0 3rem', marginTop: '-1.5vh' }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative mt-[-7vh] z-10">
                    <div className="flex justify-center">
                        <img
                            src="/cube-image.jpg"
                            alt="Green Cube"
                            style={{ width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </div>

                    <div className="text-center mt-4 px-6">
                        <h2 className="text-black text-3xl font-bold">1 Green Cube</h2>
                        <p className="text-black mt-1 text-xs">Amable forest, Costa Rica</p>
                        <p className="text-black text-xs">8&#176;42&#39;22&#34;N, 83&#176;10&#39;54&#34;W</p>
                        <p className="text-gray-700 mt-4 text-xs text-left">
                            Thank you for your support in helping secure our planet&apos;s environment and biodiversity abundance.
                        </p>
                        <p className="text-gray-900 mt-2 italic text-xl">{userName}</p>
                        <p className="text-gray-700 mt-2 text-xs text-left">
                            Protecting one cubic meter of tropical rainforest and supporting the expansion of the COBIGA biodiversity corridor.
                        </p>
                        <p className="text-gray-700 mt-2 text-right text-xs pr-4">1 Jan 2025 - 31 Dec 2025</p>
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col justify-left items-left mt-3 px-7">
                        <img src="/signature.png" alt="Signature" style={{ width: '40vw' }} />
                        <div className="text-black text-[0.6em] mt-[-5px] mb-2 ml-[19vw]">{formattedDate}</div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-2 mb-5 px-[13vw]">
                        <img src="/hexagon-logo.svg" alt="Hexagon Logo" style={{ width: '25vw' }} />
                    </div>
                </div>
            </div>

            {/* Seal */}
            <div className="flex justify-end items-center mt-[-9.5vh] mb-5 pr-6 w-full">
                <img src="/seal.png" alt="Hexagon Seal" style={{ width: '30vw' }} />
            </div>
        </div>
        </div>

        {/* Download Section */}
        <div className="relative w-full bg-[#0c1b2b]">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/certificate-bg.jpg')" }}></div>

        {/* Dark Overlay to make text more readable */}
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-between pt-[4vh] pb-[6vh] h-screen space-y-16">

            {/* Download Button Section */}
            <div className="text-center">
            <div className="flex justify-center">
                <div className="bg-lime-500 p-5 rounded-full" onClick={handleDownload}> {/* Handle download on click */}
                <HiDownload className="text-5xl"/>
                </div>
            </div>
            <p className="text-white font-semibold mt-4 text-lg leading-tight">DOWNLOAD <br/> CERTIFICATE</p>
            </div>
            <div>
            {/* Corporate Sponsorship Section */}
            <div className="text-center">
            <p className="text-white  font-semibold">Interested in Corporate Sponsorship?</p>
            <Link href='https://r-evolution.com/r-initiatives/forest'><button className="mt-3 px-8 py-2 bg-lime-500 text-black font-semibold text-lg rounded-lg w-full">Learn more</button></Link>
            </div>

            {/* Footer Section with Full Logo Image */}
            <div className="mt-8">
            <Image src="/greencubes-logo-white.svg" alt="Green Cubes Footer" width={288} height={96} className="w-80"/>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}
