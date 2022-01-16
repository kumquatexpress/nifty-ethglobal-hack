import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import Button from "@lib/button";
import BadgerIcon from "@lib/icons/BadgerIcon";

import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import {
  selectAddress,
  setAddressTo,
  setUserIdTo,
} from "@scripts/redux/slices/ethSlice";
import web3 from "../web3";
import { isMetaMaskInstalled } from "@scripts/utils";
import eth from "@scripts/utils/eth";
import { getOrCreateUser, currentUser } from "../utils/users_api";

export default function MetaMaskButton() {
  return (
    <Button
      color="discord"
      className={cx(styles.button)}
      icon={<BadgerIcon inverted />}
      href={process.env.REACT_APP_DISCORD_OAUTH_URI}
    >
      Add to Discord
    </Button>
  );
}

const styles = {
  button: css`
    margin-right: 12px;
  `,
};
