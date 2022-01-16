import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useAppSelector } from "@scripts/redux/hooks";
import { selectUserId } from "@scripts/redux/slices/ethSlice";
import { GET_BADGES } from "@graphql/users.graphql";
import { useQuery } from "@apollo/client";

function Stash() {
  const { data, loading, error } = useQuery(GET_BADGES);

  console.log("data", data);
  return (
    <div>
      {data.getBadges?.map((b: any) => {
        return (
          <>
            <div>Name: {b.name}</div>
            <div>Symbol: {b.symbol}</div>
            <div>Token URI: {b.token_uri}</div>
          </>
        );
      })}
    </div>
  );
}

const styles = {};

export default Stash;
