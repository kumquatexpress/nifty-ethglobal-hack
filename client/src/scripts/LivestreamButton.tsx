import React, { useState, useCallback } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";
import web3 from "../web3";
import { startLivestream } from "@scripts/utils";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  let config: any;
  const onClickLivestream = useCallback(async () => {
    // if it's a creator, just start a stream, with the given collection id's
    if (creator) {
      if (collectionIds && collectionIds.length > 0) {
        const stream = await startLivestream(streamName, collectionIds);
        console.log(stream.id);
        navigate(`/livestream/${stream.id}`);
      } else {
        alert("No collections selected to stream!");
      }
    } else {
      // viewer
      if (streamId != null) {
        navigate(`/livestream/${streamId}`);
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
