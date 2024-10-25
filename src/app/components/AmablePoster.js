import Image from "next/image";

export default function AmablePoster() {
    return (
    <div className="absolute top-0 left-0 w-full h-full bg-transparent">
            <div className="flex justify-center items-end h-full pb-[20vh]">
                <Image src="/amable-forest.svg" alt="Green Cubes Footer" width={288} height={96} className="w-72"/>
            </div>
        </div>
    );
}