import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useAppSelector } from "@scripts/redux/hooks";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import { selectUserId } from "@scripts/redux/slices/ethSlice";
import CollectionsByUser from "@scripts/CollectionsByUser";
import Button from "@lib/button";

import { useNavigate } from "react-router-dom";
function Home() {
  const userId = useAppSelector(selectUserId);
  const navigate = useNavigate();
  const onClickCreate = useCallback(() => {
    navigate(`/collection/create`);
  }, []);
  return (
    <div>
      {userId ? (
        <>
          <CollectionsByUser userId={userId} />
          <Button className={cx(styles.create)} onClick={onClickCreate}>
            Create your next Collection
          </Button>
        </>
      ) : null}
    </div>
  );
}

const styles = {
  create: css`
    font-weight: 500;
    font-size: 18px;
  `,
};

export default Home;
