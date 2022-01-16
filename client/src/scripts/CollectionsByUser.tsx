import React, { useEffect, useState } from "react";
import Input from "@lib/inputs/Input";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useQuery } from "@apollo/client";
import { COLLECTIONS_BY_USER } from "@graphql/collections.graphql";
import { BORDER_LEGENDARY_SVG_URL } from "@utils/constants";
import { currentUser } from "@utils/users_api";
import CanvasImage from "@scripts/CanvasImage";
import Text from "@lib/Text";
import { BADGER_BLUE_RGBA } from "@utils/constants";
import { useNavigate } from "react-router-dom";

import {
  CollectionsByUser as CollectionsByUserType,
  CollectionsByUserVariables,
  CollectionsByUser_collections_by_user,
} from "@gqlt/CollectionsByUser";
import LivestreamButton from "./LivestreamButton";
import Checkbox from "@lib/inputs/Checkbox";

type Props = {
  userId: string;
};

function CollectionsByUser({ userId }: Props) {
  const [streamName, setStreamName] = useState<string>("");
  const [selectedCollections, setSelectedCollections] = useState<
    CollectionsByUser_collections_by_user[]
  >([]);
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<
    CollectionsByUserType,
    CollectionsByUserVariables
  >(COLLECTIONS_BY_USER, {
    fetchPolicy: "network-only",
    variables: {
      id: userId,
    },
  });
  console.log(selectedCollections);

  return (
    <div className={cx(styles.grid)}>
      {data?.collections_by_user?.map((collection) => {
        const {
          fontStrokeColor: fontStroke,
          hugImage,
          fontFillColor: fontFill,
          bgColor: background,
        } = collection?.badge_metadata || {};
        return (
          <div className={styles.gridItem} key={collection?.id}>
            <a
              href="#"
              onClick={() => {
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
            <Checkbox
              onChange={(e) => {
                console.log(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  setSelectedCollections([collection!, ...selectedCollections]);
                } else {
                  setSelectedCollections(
                    selectedCollections.filter(
                      (coll) => coll.id !== collection?.id
                    )
                  );
                }
              }}
            />
          </div>
        );
      })}
      {data?.collections_by_user && data?.collections_by_user?.length > 0 ? (
        <div className={styles.buttonContainer}>
          <div className={styles.collectionList}>
            {selectedCollections.length > 0 && (
              <>
                <Text>
                  Any members from these collections can join your stream:
                </Text>
                <Text>
                  {selectedCollections.map((collection, idx) => {
                    if (selectedCollections.length - 1 !== idx) {
                      return (
                        <a href={`/collection/${collection}/mint`} key={idx}>
                          {collection.name},{" "}
                        </a>
                      );
                    } else {
                      return (
                        <a
                          href={`/collection/${selectedCollections[0]?.id}/mint`}
                          key={idx}
                        >
                          {collection.name}
                        </a>
                      );
                    }
                  })}
                </Text>
              </>
            )}
          </div>
          <Input
            className={cx(styles.streamNameInput)}
            size="large"
            placeholder="Name your stream:"
            onChange={(e) => setStreamName(e.currentTarget.value)}
            value={streamName}
            id="badgeCreate-name"
          />
          <LivestreamButton
            disabled={streamName === "" || selectedCollections.length === 0}
            streamName={streamName}
            collectionIds={data?.collections_by_user
              .map((coll) => coll!.id)
              .filter((x) => !!x)}
            readyToLivestream={true}
            creator={true}
            size="large"
            className={cx(styles.streamButton)}
          />
        </div>
      ) : null}
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
  streamNameInput: css`
    width: 100%;
    margin-bottom: 12px;
  `,
  streamButton: css`
    width: 100%;
    margin-bottom: 12px;
  `,
  buttonContainer: css`
    width: 100%;
    margin-top: 24px;
  `,
  collectionList: css`
    margin-bottom: 12px;
  `,
};

export default CollectionsByUser;
