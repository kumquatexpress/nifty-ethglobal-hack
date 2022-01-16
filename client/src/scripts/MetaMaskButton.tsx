import React, { useEffect, useState } from "react";
import Button from "@lib/button";

import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import {
  selectAddress,
  setAddressTo,
  setUserIdTo,
} from "@scripts/redux/slices/ethSlice";
import styles from "./Counter.module.css";
import web3 from "../web3";
import { isMetaMaskInstalled } from "@scripts/utils";
import eth from "@scripts/utils/eth";
import { getOrCreateUser, currentUser } from "../utils/users_api";

export default function MetaMaskButton() {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
  const [hasProvider, setHasProvider] = useState(false);

  useEffect(() => {
    async function updateAddressAndUserIfAvailable() {
      // @ts-ignore
      const accounts = await eth!.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        dispatch(setAddressTo(accounts[0]));
        const user = await currentUser();
        //We take the first address in the array of addresses and display it
        dispatch(setUserIdTo(user?.id));
      }
    }
    isMetaMaskInstalled().then(async (i) => {
      let ethListener: EventListener;
      if (i) {
        setHasProvider(i);
        await updateAddressAndUserIfAvailable();
      } else {
        // @ts-ignore
        ethListener = async () => {
          setHasProvider(true);
          await updateAddressAndUserIfAvailable();
        };
        window.addEventListener("ethereum#initialized", ethListener, {
          once: true,
        });
      }
      return () => {
        window.removeEventListener("ethereum#initialized", ethListener);
      };
    });
  }, [hasProvider]);

  return (
    <Button
      onClick={async () => {
        if (hasProvider) {
          try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            // @ts-ignore
            const accounts = await eth!.request({
              method: "eth_requestAccounts",
            });
            const signature = await web3.eth.personal.sign(
              "Open sesame!",
              accounts[0]
            );
            await getOrCreateUser(accounts[0], signature);

            const user = await currentUser();

            //We take the first address in the array of addresses and display it
            dispatch(setAddressTo(accounts[0]));
            dispatch(setUserIdTo(user?.id));
          } catch (error) {
            console.error(error);
          }
        } else {
        }
      }}
    >
      {address !== ""
        ? address
        : hasProvider
        ? "Connect to MetaMask"
        : "Install MetaMask"}
    </Button>
  );
}
