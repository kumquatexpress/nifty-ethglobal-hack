import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import Button from "@lib/button";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";

export default function StashButton() {
  const navigate = useNavigate();
  return (
    <Button
      color="badger"
      className={cx(styles.button)}
      icon={<Icon.ShoppingBag />}
      onClick={(e) => {
        e.preventDefault();
        navigate(`/stash`);
      }}
      size="large"
      inverted
      href={"/stash"}
    >
      Badges
    </Button>
  );
}

const styles = {
  button: css`
    margin-left: 8px;
  `,
};
