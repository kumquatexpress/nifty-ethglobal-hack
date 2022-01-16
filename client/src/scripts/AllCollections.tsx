import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useQuery } from "@apollo/client";
import { COLLECTIONS } from "@graphql/collections.graphql";

import CanvasImage from "@scripts/CanvasImage";
import Text from "@lib/Text";
import { BADGER_BLUE_RGBA } from "@utils/constants";
import { useNavigate } from "react-router-dom";
import { Collections } from "@graphql/__generated__/Collections";

function AllCollections() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<Collections>(COLLECTIONS, {
    fetchPolicy: "network-only",
  });
  console.log(data);

  return (
    <div className={cx(styles.grid)}>
      {data?.collections?.map((collection) => {
        console.log(collection);
        const {
          fontStrokeColor: fontStroke,
          hugImage,
          fontFillColor: fontFill,
          bgColor: background,
        } = collection?.badge_metadata || {};
        return (
          <div className={styles.gridItem} key={collection?.id}>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate(`/collection/${collection?.id}/mint`);
              }}
            >
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={200}
                hugImage={hugImage}
                customImgSrc={collection?.template_s3_url}
                fontFillColor={fontFill}
                bgColor={background}
                imgNumber={1}
                paddingColor={BADGER_BLUE_RGBA}
              />
              <Text type="subtitle">{collection?.name}</Text>
            </a>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: css`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  `,
  gridItem: css`
    margin-right: 24px;
    margin-bottom: 24px;
  `,
};

export default AllCollections;
