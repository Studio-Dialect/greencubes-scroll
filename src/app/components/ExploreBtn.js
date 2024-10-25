export default function ExploreBtn({ onExploreClick }) {
    return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-[80vh]">
        <div className="relative w-[80vw]">

        {/* Concentric Circles */}
        <div className="animate animate-pulse absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 border-2 border-white rounded-full"></div>
        </div>
        <div className="animate animate-pulse absolute inset-0 flex items-center justify-center">
            <div className="w-60 h-60 border-2 border-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-44 border-2 border-white rounded-full bg-black/60" onClick={onExploreClick}></div>
        </div>

        {/* Text "Explore" */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div 
            className="text-white text-2xl font-bold"
            onClick={onExploreClick}
            >
                EXPLORE
            </div>
        </div>
        </div>
    </div>
    );
}