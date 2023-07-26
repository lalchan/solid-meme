import { useEffect, useState } from "react";

import "plyr-react/plyr.css";
import axios from "axios";
import CustomPlyr from "../lib/custom-plyr2";


const HLSPlyr = () => {
    const BASE_URL = "https://test.techclinch11.workers.dev"

    const videoURL = `${BASE_URL}/course/1.1/out.m3u8`

   
    return (
        <CustomPlyr hlsSource={videoURL} options={{
            disableContextMenu: true,
            keyboard: {
                focused: true,
                global: true,
            },
            resetOnEnd: true,
        }}
            onEnded={() => {
                alert("video ended🚀")
            }}

        />
    );
};

export default HLSPlyr
