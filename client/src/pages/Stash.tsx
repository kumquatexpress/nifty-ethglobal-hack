import React, { useEffect, useState, useCallback } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import Text from "@lib/Text";
import { useAppSelector } from "@scripts/redux/hooks";
import { selectUserId } from "@scripts/redux/slices/userSlice";
import { GET_BADGES } from "@graphql/users.graphql";
import { useQuery } from "@apollo/client";

function Stash() {
  const { data, loading, error } = useQuery(GET_BADGES);

  console.log("data", data);
  return data ? (
    <div>
      {data.getBadges?.map((b: any) => {
        return (
          <div className={cx(styles.badge)}>
            <div className={cx(styles.row)}>
              <Text type="subtitle">{b.symbol}</Text>
            </div>
            <img
              className={cx(styles.badgeImg)}
              src={b.image_uri}
              alt="a badge"
            />
          </div>
        );
      })}
    </div>
  ) : null;
}

const styles = {
  badge: css`
    display: flex;
    flex-direction: column;
  `,
  row: css`
    justify-items: space-evenly;
  `,
  badgeImg: css`
    width: 256px;
    height: 256px;
  `,
};

export default Stash;
