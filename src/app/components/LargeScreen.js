'use client';
import { QRCodeCanvas } from 'qrcode.react';
import Image from 'next/image';

const LargeScreen = () => {

    return (
        <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-between p-20">
            <div></div>
            <div className='flex flex-col items-center'>
                <Image
                        src="/look-around-min.svg"
                        alt="Look Around"
                        width={250}
                        height={250}
                        className='mb-5'
                    />
            <div className='text-3xl font-bold text-center my-5'>Please visit this experience <br/> on mobile </div>

            <QRCodeCanvas value={"https://greencubes-scroll.netlify.app/"} size={120} level={"H"} className='my-5' />
            </div>
            <div className="mt-8">
            <Image src="/greencubes-logo-white.svg" alt="Green Cubes Footer" width={288} height={96} className="w-72"/>
            </div>
        </div>
    );
};

export default LargeScreen;
