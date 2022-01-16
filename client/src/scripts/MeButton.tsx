import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import Button from "@lib/button";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";

export default function MetaMaskButton() {
  const navigate = useNavigate();
  return (
    <Button
      color="badger"
      className={cx(styles.button)}
      icon={<Icon.Home />}
      onClick={(e) => {
        console.log("hh");
        navigate("/me");
      }}
      size="large"
      inverted
      href="/me"
    >
      Collections
    </Button>
  );
}

const styles = {
  button: css`
    margin-left: 24px;
  `,
};
