import React, { useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
import { APIClient } from "../utils/api_client";
import { useParams } from "react-router-dom";

export async function startLivestream(
  name: string,
  collectionIds: string[]
): Promise<any> {
  const profiles = [
    {
      name: "720p",
      bitrate: 2000000,
      fps: 30,
      width: 1280,
      height: 720,
    },
    {
      name: "480p",
      bitrate: 1000000,
      fps: 30,
      width: 854,
      height: 480,
    },
    {
      name: "360p",
      bitrate: 500000,
      fps: 30,
      width: 640,
      height: 360,
    },
  ];

  const resp = await APIClient().post("/livepeerStream", {
    name: name,
    profiles: profiles,
    collectionIds,
  });
  return resp.data;
}

export default function Livestream() {
  let { streamId } = useParams<{ streamId: string }>();
  const [videoEl, setVideoEl] = useState(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  const onVideo = React.useCallback((el) => {
    setVideoEl(el);
  }, []);

  const interval = setInterval(() => {
    if (isLive) {
      clearInterval(interval);
      return;
    }
    APIClient()
      .get("/livepeerStream/" + streamId)
      .then((resp) => {
        if (resp.data.isActive) {
          setIsLive(resp.data.isActive);
          setPlaybackId(resp.data.playbackId);
          setStreamKey(resp.data.streamKey);
          clearInterval(interval);
        }
      });
  }, 3000);

  useEffect(() => {
    startLivestream("hi", ["7caf3863-aef8-4334-945d-12971322beb8"]);
    if (videoEl == null) return;
    if (playbackId && isLive) {
      const player = videojs(videoEl, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
          },
        ],
      });

      player.on("error", () => {
        player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      });
    }
  }, [isLive]);

  return (
    <div className="container w-full flex flex-col items-center overflow-auto pb-14">
      <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
        <div data-vjs-player>
          <video
            id="video"
            ref={onVideo}
            className="h-full w-full video-js vjs-theme-city"
            controls
            playsInline
          />
        </div>
        <div className="bg-white rounded-xl flex items-center justify-center absolute right-2 top-2 p-1 text-xs">
          <div
            className={`animate-pulse ${
              isLive ? "bg-green-700" : "bg-yellow-600"
            } h-2 w-2 mr-2 rounded-full`}
          ></div>
          {isLive ? "Live" : "Waiting for Video"}
        </div>
      </div>

      <div className="w-11/12 lg:w-full xl:w-3/5 lg:p-0 mt-2 text-red-500 text-left text-sm">
        <span className="font-bold">Note:&nbsp;</span> To start a video stream,
        please use a broadcaster software like OBS/Streamyard on desktop, or
        Larix on mobile
      </div>
      <div className="w-11/12 lg:w-full xl:w-3/5 border border-dashed p-2 m-4 flex flex-col text-sm">
        <div className="flex items-center justify-between mt-2 break-all">
          <span>
            Ingest URL:
            <br />
            rtmp://rtmp.livepeer.com/live/
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 break-all mb-6">
          <span>
            Stream Key:
            <br />
            {streamKey}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 break-all">
          <span>
            Playback URL:
            <br />
            https://cdn.livepeer.com/hls/{playbackId}/index.m3u8
          </span>
        </div>
      </div>
    </div>
  );
}
