import React, { useState } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";

type Props = { className: ClassNamesArg } & ButtonProps;
export default function MintButton(props: Props) {
  return (
    <Button {...props} onClick={() => {}}>
      Mint
    </Button>
  );
}
