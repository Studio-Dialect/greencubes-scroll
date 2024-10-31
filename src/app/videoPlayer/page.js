import AmablePoster from "../components/AmablePoster";
import ScrollElement from "../components/ScrollElement";
import Video360Player from "../components/Video360Player";
import ScrollTest from "../components/ScrollTest";

export default function VideoPlayer() {
    return (
        <div>
        {/* Show the Video360Player first */}
        <div className="w-full h-screen relative z-10"> {/* Add a higher z-index */}
            <Video360Player />
        </div>

        {/* Below Video360Player is the scroll interaction */}
        <div className="relative z-0"> {/* Ensure ScrollElement is below */}
            <ScrollElement />
        </div>
    </div>
    )
}