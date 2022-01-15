import React, { useState } from "react";
import Button from "@lib/button";

import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import { selectAddress, setAddressTo } from "@scripts/redux/slices/ethSlice";
import styles from "./Counter.module.css";
import web3 from "../web3";
import { isMetaMaskInstalled } from "@scripts/utils";
import eth from "@scripts/utils/eth";
import { getOrCreateUser } from "../utils/users_api";

export default function MetaMaskButton() {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();

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
            const signature = await web3.eth.personal.sign(
              "Open sesame!",
              accounts[0]
            );
            await getOrCreateUser(accounts[0], signature);

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
