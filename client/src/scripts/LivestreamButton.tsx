import React, { useState, useCallback } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";
import web3 from "../web3";

type Props = {
  className?: ClassNamesArg;
  creator: boolean;
  readyToLivestream: boolean;
} & ButtonProps;
export default function LiveStream({
  readyToLivestream,
  creator,
  ...props
}: Props) {
  let config: any;
  const onClickLivestream = useCallback(async () => {}, []);
  return (
    <Button
      color="twitch"
      {...props}
      onClick={onClickLivestream}
      disabled={!readyToLivestream}
    >
      {readyToLivestream
        ? creator
          ? "Go live"
          : "Join stream"
        : "Collection still loading!"}
    </Button>
  );
}
