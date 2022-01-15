import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import UploadButton from "@scripts/UploadButton";
import { useNavigate } from "react-router-dom";
import { CreateCollection as CreateCollectionType } from "@gqlt/CreateCollection";

function Create() {
  const navigate = useNavigate();
  const onUploadSuccess = useCallback(
    (createCollectionResp: CreateCollectionType["createCollection"]) => {
      navigate(`/collection/${createCollectionResp!.id}/mint`);
    },
    []
  );
  return (
    <>
      <CreateCollection />
      <PreviewCollection />
      <UploadButton size="large" onSuccess={onUploadSuccess} />
    </>
  );
}

const styles = {};

export default Create;
