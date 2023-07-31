import { useEffect, useState } from "react";

import "plyr-react/plyr.css";
import axios from "axios";
import CustomPlyr from "../lib/custom-plyr2";



const HLSPlyr = () => {

    const [token, setToken] = useState<undefined | string>(undefined);
    const getToken = async () => {
        const response = await axios.get(`${BASE_URL}/token`)

        if (response) {
            console.log(response.data?.token)
            setToken(response.data?.token)
        }
    }

    useEffect(() => {
        getToken()
    }, [])
    
    const BASE_URL = "https://test.techclinch11.workers.dev"

    const videoURL = `${BASE_URL}/course/1.1/out.m3u8`

   
    return (
        token&&<CustomPlyr hlsSource={videoURL} token={token} options={{
            
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
