import React, { useState } from "react";
import Button from "@lib/button";

import { useAppSelector, useAppDispatch } from "scripts/redux/hooks";
import { selectAddress, setAddressTo } from "scripts/redux/slices/ethSlice";
import styles from "./Counter.module.css";
import { isMetaMaskInstalled } from "scripts/utils";
import eth from "@utils/eth";

export default function MetaMaskButton() {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
  console.log(address);

  return (
    <Button
      onClick={async () => {
        if (isMetaMaskInstalled()) {
          try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            const accounts = await eth.request({
              method: "eth_requestAccounts",
            });
            console.log(accounts);

            //We take the first address in the array of addresses and display it
            dispatch(setAddressTo(accounts[0]));
          } catch (error) {
            console.error(error);
          }
        } else {
        }
      }}
    >
      {address !== ""
        ? address
        : isMetaMaskInstalled()
        ? "Connect to MetaMask"
        : "Install MetaMask"}
    </Button>
  );
}
