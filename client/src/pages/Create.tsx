import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import Text from "@scripts/lib/Text";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import UploadButton from "@scripts/UploadButton";
import { useNavigate } from "react-router-dom";
import { CreateCollection as CreateCollectionType } from "@gqlt/CreateCollection";
import { useAppSelector } from "@scripts/redux/hooks";
import MetaMaskButton from "@scripts/MetaMaskButton";
import { selectUserId } from "@scripts/redux/slices/ethSlice";

function Create() {
  const userId = useAppSelector(selectUserId);
  const navigate = useNavigate();
  const onUploadSuccess = useCallback(
    (createCollectionResp: CreateCollectionType["createCollection"]) => {
      navigate(`/collection/${createCollectionResp!.id}/mint`);
    },
    []
  );
  return userId ? (
    <>
      <CreateCollection />
      <PreviewCollection />
      <UploadButton size="large" onSuccess={onUploadSuccess} />
    </>
  ) : (
    <>
      <div className={cx(styles.text)}>
        <Text type="h3">Sign in to see this!</Text>
      </div>
      <MetaMaskButton></MetaMaskButton>
    </>
  );
}

const styles = {
  text: css`
    margin-bottom: 32px;
  `,
};

export default Create;
