import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import UploadButton from "@scripts/UploadButton";

function Create() {
  return (
    <div className="container badger-page">
      <CreateCollection />
      <PreviewCollection />
      <UploadButton size="large" />
    </div>
  );
}

const styles = {};

export default Create;
