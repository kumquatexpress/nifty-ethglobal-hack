import React, { useEffect, useState } from "react";
import Text from "@lib/Text";
import videojs from "video.js";
import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
import { APIClient } from "../utils/api_client";
import { useParams } from "react-router-dom";
import { cx, css } from "@emotion/css/macro";
import { useQuery, useLazyQuery } from "@apollo/client";
import { JOIN_LIVESTREAM } from "@graphql/users.graphql";
import {
  JoinLivestream,
  JoinLivestreamVariables,
} from "@graphql/__generated__/JoinLivestream";

export default function Livestream() {
  let { streamId } = useParams<{ streamId: string }>();
  const [videoEl, setVideoEl] = useState(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  const onVideo = React.useCallback((el) => {
    setVideoEl(el);
  }, []);
  const {
    data: canJoinLiveStream,
    loading,
    error,
  } = useQuery<JoinLivestream, JoinLivestreamVariables>(JOIN_LIVESTREAM, {
    variables: {
      streamId: streamId!,
    },
  });

  // query for status
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!isLive) {
      pollStreamStatus();
    }
    let timeToCheck = 1000;
    function pollStreamStatus() {
      APIClient()
        .post("/livepeerStream/fetch", { streamId })
        .then((resp) => {
          if (playbackId == null) {
            setPlaybackId(resp.data.playbackId);
          }
          if (streamKey == null) {
            setStreamKey(resp.data.streamKey);
          }
          if (resp.data.isActive) {
            setIsLive(resp.data.isActive);
          }
        })
        .catch((error) => {
          console.error("Error fetching stream status:", error);
        })
        .finally(() => {
          if (!isLive) {
            // basic exponential backoff
            timeToCheck *= 1.1;
            timeout = setTimeout(pollStreamStatus, timeToCheck);
          }
        });
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isLive, playbackId, streamId, streamKey]);

  useEffect(() => {
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
  }, [isLive, playbackId, videoEl]);

  return !canJoinLiveStream ? (
    <div className="w-full flex flex-col items-center overflow-auto">
      <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
        <div data-vjs-player>
          <video
            id="video"
            ref={onVideo}
            className={cx(
              "h-full w-full video-js vjs-theme-city",
              styles.videoPlayer
            )}
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
          {isLive ? "Live" : "Waiting for stream to begin..."}
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
        <div className="flex items-center justify-between mt-2 break-all">
          <span>
            Stream Key:
            <br />
            {streamKey}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className={cx("container")}>
      <Text type="h1">Sorry!</Text>
      <Text type="h3">
        You need to be a badgeholder of COLLECTION to join this stream &#128542;
      </Text>
    </div>
  );
}
const styles = {
  videoPlayer: css`
    width: 100%;
    height: 100%;
  `,
};
