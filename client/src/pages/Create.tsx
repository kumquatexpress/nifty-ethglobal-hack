import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";

function Create() {
  return (
    <div className="container">
      <CreateCollection />
      <PreviewCollection />
    </div>
  );
}

const styles = {};

export default Create;
