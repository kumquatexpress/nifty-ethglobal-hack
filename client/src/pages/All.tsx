import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import AllCollections from "@scripts/AllCollections";
import Button from "@lib/button";

import { useNavigate } from "react-router-dom";
function All() {
  const navigate = useNavigate();
  const onClickCreate = useCallback(() => {
    navigate(`/collection/create`);
  }, []);
  return (
    <div>
      <AllCollections />
      <Button onClick={onClickCreate}>Create new Collection</Button>
    </div>
  );
}

const styles = {};

export default All;
