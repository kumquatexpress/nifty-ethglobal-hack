import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import { selectUserId } from "@scripts/redux/slices/userSlice";
import CollectionsByUser from "@scripts/CollectionsByUser";
import Button from "@lib/button";
import Text from "@lib/Text";
import { useAppSelector } from "@scripts/redux/hooks";

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
          <Text type="h3">or</Text>
          <Button
            color="badger"
            className={cx(styles.create)}
            onClick={onClickCreate}
            size="large"
          >
            Create your next Collection
          </Button>
        </>
      ) : null}
    </div>
  );
}

const styles = {
  create: css`
    margin-top: 24px;
    font-weight: 500;
    font-size: 18px;
  `,
};

export default Home;
