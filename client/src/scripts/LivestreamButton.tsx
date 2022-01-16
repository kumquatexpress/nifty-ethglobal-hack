import React, { useState, useCallback } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";
import web3 from "../web3";
import { startLivestream } from "@scripts/utils";

type Props = {
  className?: ClassNamesArg;
  creator: boolean;
  readyToLivestream: boolean;
  streamId?: string;
  collectionIds?: string[];
  streamName: string;
} & ButtonProps;
export default function LiveStream({
  disabled,
  readyToLivestream,
  creator,
  streamId,
  collectionIds,
  streamName,
  ...props
}: Props) {
  let config: any;
  const onClickLivestream = useCallback(async () => {
    // if it's a creator, just start a stream, with the given collection id's
    if (creator) {
      if (collectionIds && collectionIds.length > 0) {
        const streamID = await startLivestream(streamName, collectionIds);
        console.log("stream", streamID);
      } else {
        alert("No collections selected to stream!");
      }
    } else {
      // viewer
      if (streamId != null) {
      } else {
        alert("No stream selected to join!");
      }
    }
  }, [streamId, collectionIds, creator, streamName]);
  return (
    <Button
      color="twitch"
      {...props}
      onClick={onClickLivestream}
      disabled={!readyToLivestream || disabled}
    >
      {readyToLivestream
        ? creator
          ? "Go live"
          : "Join stream"
        : "Collection still loading!"}
    </Button>
  );
}
