'use client'
import { HiDownload } from "react-icons/hi";
import { toJpeg } from 'html-to-image';
import { useEffect, useRef } from 'react';
import Image from 'next/image'; // Import Next.js Image
import { sendEvent } from '../../../utils/analytics';

export default function Certificate({ userName }) {
    const certificateRef = useRef(); // Reference to the certificate element

    const handleDownload = () => {
        // Convert the certificate HTML section to a JPEG image
        if (certificateRef.current === null) {
            return;
        }

        sendEvent({
            action: 'certificate_downloaded',
            value: "Certificate Downloaded",
        });

        toJpeg(certificateRef.current, { quality: 0.95 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'certificate.jpg'; // Download file name
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
        {/* Certificate Section */}
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 shadow px-5 pt-4" ref={certificateRef}> {/* Add ref here */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-400 to-yellow-300 bg-cover w-full h-36 rounded-t-none rounded-b-[100%] flex items-center justify-center mt-[-4vh]">
                    <Image
                        src="/greencubes-logo.svg"
                        alt="Green Cube"
                        width={200}
                        height={80}
                        className="w-full h-16 px-12 mt-[-1.5vh]"
                        priority
                    />
                </div>
        
                {/* Main Content */}
                <div className="relative mt-[-7vh] z-10">
                    <div className="flex justify-center">
                    <Image
                        src="/cube-image.jpg"
                        alt="Green Cube"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-full"
                    />
                    </div>
        
                    <div className="text-center mt-4 px-6">
                    <h2 className="text-3xl font-bold">1 Green Cube</h2>
                    <p className="mt-1 text-xs">Amable forest, Costa Rica</p>
                    <p className="text-xs">8&#176;42&#39;22&#34;N, 83&#176;10&#39;54&#34;W</p>
                    <p className="text-gray-700 mt-4 text-xs text-left">
                        Thank you for your support in helping secure our planet&#39;s environment and biodiversity abundance.
                    </p>
                    <p className="text-gray-900 mt-2 italic text-xl">{userName}</p>
                    <p className="text-gray-700 mt-2 text-xs text-left">
                        Protecting one cubic meter of tropical rainforest and supporting the expansion of the COBIGA biodiversity corridor.
                    </p>
                    <p className="text-gray-700 mt-2 text-right text-xs pr-4">1 Jan 2025 - 31 Dec 2025</p>
                    </div>
        
                    {/* Signature */}
                    <div className="flex justify-left items-left mt-3 px-7">
                    <Image src="/signature.png" alt="Signature" width={300} height={100} className="w-[40vw]" />
                    </div>
        
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-2 mb-5 px-[13vw]">
                    <Image src="/hexagon-logo.svg" alt="Hexagon Logo" width={200} height={200} className="w-[25vw]" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center mt-[-8vh] mb-5 pr-6 w-full">
                <Image src="/seal.webp" alt="Hexagon Logo" width={150} height={150} className="w-[35vw]" />
            </div>
        </div>
        {/* Download Section */}
        <div className="relative w-full min-h-screen bg-[#0c1b2b]">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/certificate-bg.jpg')" }}></div>

        {/* Dark Overlay to make text more readable */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-around h-screen space-y-16">

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
            <div className="text-left">
            <p className="text-white text-xl font-semibold">Interested in Corporate <br/> Sponsorship?</p>
            <button className="mt-4 px-8 py-3 bg-lime-500 text-black font-semibold text-lg rounded-lg w-full">Learn more</button>
            </div>

            {/* Footer Section with Full Logo Image */}
            <div className="mt-12">
            <Image src="/greencubes-logo-white.svg" alt="Green Cubes Footer" width={288} height={96} className="w-72"/>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}
