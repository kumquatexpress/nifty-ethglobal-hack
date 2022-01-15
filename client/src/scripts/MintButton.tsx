import React, { useState } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";

type Props = { className?: ClassNamesArg; readyToMint: boolean } & ButtonProps;
export default function MintButton({ readyToMint, ...props }: Props) {
  return (
    <Button {...props} onClick={() => {}} disabled={!readyToMint}>
      {readyToMint ? "Mint" : "Not yet ready to mint!"}
    </Button>
  );
}
