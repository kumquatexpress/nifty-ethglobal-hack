import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useQuery } from "@apollo/client";
import { COLLECTIONS_BY_USER } from "@graphql/collections.graphql";
import { BORDER_LEGENDARY_SVG_URL } from "@utils/constants";
import { currentUser } from "@utils/users_api";
import CanvasImage from "@scripts/CanvasImage";
import Text from "@lib/Text";
import { BADGER_BLUE_RGBA } from "@utils/constants";

import {
  CollectionsByUser as CollectionsByUserType,
  CollectionsByUserVariables,
} from "@gqlt/CollectionsByUser";

type Props = {
  userId: string;
};

function CollectionsByUser({ userId }: Props) {
  const { data, loading, error } = useQuery<
    CollectionsByUserType,
    CollectionsByUserVariables
  >(COLLECTIONS_BY_USER, {
    variables: {
      id: userId,
    },
  });
  console.log(data);

  return (
    <div className={cx(styles.grid)}>
      {data?.collections_by_user?.map((collection) => {
        console.log(collection);
        const {
          fontStrokeColor: fontStroke,
          hugImage,
          fontFillColor: fontFill,
          bgColor: background,
        } = collection?.badge_metadata || {};
        return (
          <div className={styles.gridItem}>
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
            <Text>{collection?.name}</Text>
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

export default CollectionsByUser;
