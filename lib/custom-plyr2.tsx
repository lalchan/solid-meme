import * as React from "react";
import { APITypes, PlyrProps, usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls, { LoaderContext } from "hls.js";
import { useEffect } from 'react';
import { Options } from "plyr";

const videoOptions = null;
const videoSource = null;
const BASE_URL = "https://test.techclinch11.workers.dev"


/**
 * This is a custom hook in TypeScript React that loads and attaches an HLS video source to a Plyr
 * player, and sets the quality options for the player.
 * @param {string} src - The source URL of the video that will be played.
 * @param {Options | null} options - `options` is an object that contains optional configuration
 * options for the Plyr player. It can include properties such as `autoplay`, `controls`, `loop`,
 * @param {string | null} token - `token` is a string that contains the token for the video authorization.
 * @returns The `useHls` function returns an object with a single property `options`, which is of type
 * `Options | null`. The `options` object contains information about the video quality and any other
 * custom event listeners that may have been added.
 */
const useHls = (src: string, options: Options | null , token: string | null) => {
    const hls = React.useRef<Hls>(new Hls());
    const [plyrOptions, setPlyrOptions] = React.useState<Options | null>(options);


    React.useEffect(() => {
        if (hls.current ) {
            hls.current.destroy();
            hls.current = new Hls({
                // progressive: true,

                // fetchSetup:  function(context: LoaderContext, initParams: any) : Request{
                //     const [url, _url] = [new URL(BASE_URL), new URL(context.url)]
                //     url.pathname= _url.pathname
                //     return new Request(url, {
                //         headers: {
                //             token: token || ''
                //         }
                //     })
                // }

                xhrSetup: function (xhr: XMLHttpRequest) {
                    xhr.setRequestHeader("token", token || '');
                }
            });
        }
        hls.current.loadSource(src);
        hls.current.attachMedia(document.querySelector(".plyr-react")!);
    }, [src ]);


    return { options: plyrOptions, source: {} as PlyrProps["source"] };
};

const CustomPlyrInstance = React.forwardRef<
    APITypes,
    PlyrProps & { hlsSource: string, token?: string, onEnded?: () => void }
>((props, ref) => {
    const { source, options = null, hlsSource, token= null, onEnded } = props;
    const raptorRef = usePlyr(ref, {
        ...useHls(hlsSource, options, token),
        source,
    }) as React.MutableRefObject<HTMLVideoElement>;

    const videoRef = React.useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        videoRef.current = document.querySelector(".plyr-react") as HTMLVideoElement;
        videoRef.current.addEventListener("ended", () => {
            onEnded && onEnded()
        });

        return () => {
            videoRef.current && videoRef.current.removeEventListener("ended", () => {
                onEnded && onEnded()
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <video ref={raptorRef} className="plyr-react plyr" id="plyr" width="100%" height="100%" style={{aspectRatio:"16/9"}} />;

});

CustomPlyrInstance.displayName = "CustomPlyrInstance";

interface ICustomPlyrProps {
    hlsSource: string;
    token?: string;
    options?: Options | null;
    onEnded?: () => void;
}

const CustomPlyr = ({ hlsSource,token,  options = null, onEnded }: ICustomPlyrProps) => {
    const ref = React.useRef<APITypes>(null);
    const supported = Hls.isSupported();
    const [isClientSide, setIsClientSide] = React.useState(false);



    useEffect(() => {
        setIsClientSide(true)
    }, [])

    return (

        <div className="" style={{maxHeight:"100%"}} >

            {isClientSide || supported ? (
                <CustomPlyrInstance
                    ref={ref}
                    token={token} 
                    source={videoSource}
                    options={options}
                    hlsSource={hlsSource}
                    onEnded={onEnded}
                />
            ) : (
                "HLS is not supported in your browser"
            )}
        </div>
    );
};

export default CustomPlyr;