import React, { useState, useCallback } from "react";
import { ClassNamesArg } from "@emotion/css";
import Button, { ButtonProps } from "@lib/button";
import web3 from "../web3";

import mintConfigContract, {
  getBalance,
  getTotalMined,
  getAllCandidates,
  priceWei,
  mintRandom,
} from "../components/config";

type Props = {
  className?: ClassNamesArg;
  readyToMint: boolean;
  contractAddress: string | null | undefined;
} & ButtonProps;
export default function MintButton({
  readyToMint,
  contractAddress,
  ...props
}: Props) {
  let config: any;
  const onClickMint = useCallback(async () => {
    const accounts = await web3.eth.getAccounts();
    mintRandom(config, accounts[0])
      .then((val) => {
        alert("Success!");
      })
      .catch((err: Error) => {
        alert(`Something went wrong: ${err.message}`);
      });
  }, [config]);
  if (contractAddress != null) {
    config = mintConfigContract(contractAddress);
  }
  return (
    <Button
      color="badger"
      {...props}
      onClick={onClickMint}
      disabled={!readyToMint}
    >
      {readyToMint ? "Mint" : "Not yet ready to mint!"}
    </Button>
  );
}
