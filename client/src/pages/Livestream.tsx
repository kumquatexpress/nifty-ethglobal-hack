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
  const [collections, setCollections] = useState<any[]>([]);
  const [canJoin, setCanJoin] = useState<boolean>(false);

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
    if (!isLive && canJoin) {
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
          if (!isLive && canJoin) {
            // basic exponential backoff
            timeToCheck *= 1.1;
            timeout = setTimeout(pollStreamStatus, timeToCheck);
          }
        });
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isLive, playbackId, streamId, streamKey, canJoin]);

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

  useEffect(() => {
    const collections = canJoinLiveStream?.joinLivestream?.collections;
    if (canJoinLiveStream?.joinLivestream != null) {
      setCollections(collections);
      setCanJoin(canJoinLiveStream?.joinLivestream?.canJoin);
    }
  }, [canJoinLiveStream]);
  console.log(collections);
  return streamKey ? (
    <>
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
    </>
  ) : canJoin ? (
    <div className="">
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
      <div className="">
        <div
          className={`animate-pulse ${
            isLive ? "bg-green-700" : "bg-yellow-600"
          } h-2 w-2 mr-2 rounded-full`}
        ></div>
        {isLive ? "Live" : "Waiting for stream to begin..."}
      </div>
    </div>
  ) : !loading ? (
    <div className={cx("container", styles.sorry)}>
      <Text type="h1">Sorry! &#128542;</Text>

      <Text className="badger-livestream-sorry2" type="h3">
        To join this stream, you need to be a badgeholder of{" "}
        {collections.length > 1 ? (
          <>
            one of these collections:
            {collections.map((collection, idx) => {
              if (collections.length - 1 !== idx) {
                return (
                  <a href={`/collection/${collections[0]?.id}/mint`}>
                    {collection.name},
                  </a>
                );
              } else {
                return (
                  <a href={`/collection/${collections[0]?.id}/mint`}>
                    collection.name.
                  </a>
                );
              }
            })}
          </>
        ) : (
          <>
            this collection:{" "}
            <a href={`/collection/${collections[0]?.id}/mint`}>
              {collections[0]?.name}
            </a>
          </>
        )}
      </Text>
    </div>
  ) : (
    <Text type="h2">Loading...</Text>
  );
}
const styles = {
  videoPlayer: css`
    width: 720px;
    height: 100%;
  `,
  sorry: css`
    & .badger-livestream-sorry2 {
      margin-top: 32px;
      line-height: 56px;
    }
    & a {
      text-decoration: underline;
    }
  `,
};
