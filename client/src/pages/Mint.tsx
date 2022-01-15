import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import CreateCollection from "@scripts/CreateCollection";
import PreviewCollection from "@scripts/PreviewCollection";
import { useParams } from "react-router-dom";

function Mint() {
  let { id } = useParams();
  return (
    <div className="container">
      This is actuallly mint page for collection with id: {id}
      <CreateCollection />
      <PreviewCollection />
    </div>
  );
}

const styles = {};

export default Mint;
