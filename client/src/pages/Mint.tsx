import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import MintButton from "@scripts/MintButton";
import CanvasImage from "@scripts/CanvasImage";
import Text from "@lib/Text";

import { COLLECTION } from "@graphql/collections.graphql";

import {
  Collection as CollectionType,
  CollectionVariables,
} from "@gqlt/Collection";

function Mint() {
  let { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    CollectionType,
    CollectionVariables
  >(COLLECTION, {
    variables: {
      id: id!,
    },
  });

  const collection = data?.collection;
  console.log("collection", collection);
  if (collection == null && !loading) {
    return <div>No collection found with id: {id}</div>;
  }
  if (error) {
    return (
      <div>
        Error loading collection with id: {id}, error: {error}
      </div>
    );
  }

  // TODO: TEMP DEFAULTS
  let metadata = collection?.metadata;

  const hugImage = metadata?.hugImage || true;
  const fontStroke = metadata?.fontStroke || {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  };
  const fontFill = metadata?.fontFill || {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };
  const background = metadata?.background || {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  };
  const common = metadata?.background || {
    r: 224,
    g: 224,
    b: 224,
    a: 1,
  };
  const uncommon = metadata?.background || {
    r: 51,
    g: 166,
    b: 255,
    a: 1,
  };
  const rare = metadata?.background || {
    r: 255,
    g: 238,
    b: 46,
    a: 1,
  };
  return (
    <div className={cx("container", styles.container)}>
      <div className={cx(styles.badgeImage)}>
        <CanvasImage
          fontStrokeColor={fontStroke}
          size={300}
          hugImage={hugImage}
          customImgSrc={collection?.template_s3_url}
          fontFillColor={fontFill}
          bgColor={background}
          imgNumber={1}
        />
        <MintButton size="large" className={cx(styles.mintButton)} />
      </div>

      <div className={cx(styles.badgeMetadata)}>
        <Text type="h1" className={cx(styles.title)}>
          {" "}
          Collection Name{" "}
        </Text>
        <div className={cx(styles.subMetadata)}>
          <div className={cx(styles.pricing)}>
            <Text>Mint Price: </Text>
            <Text type="h3">0.8 MATIC</Text>
          </div>
          <div className={cx(styles.owner)}>
            <Text>Creator </Text>
            <Text type="h3">kumquatexpress</Text>
          </div>
        </div>
        <div className={cx(styles.remainder)}>
          <Text type="subtitle" className="badger-mint-remainder">
            12 out of 100 remaining
          </Text>
          <div className={cx(styles.breakdown)}>
            <div>
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={100}
                hugImage={hugImage}
                customImgSrc={collection?.template_s3_url}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={common}
                imgNumber={1}
              />
              <Text>30 common</Text>
            </div>
            <div>
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={100}
                hugImage={hugImage}
                customImgSrc={collection?.template_s3_url}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={uncommon}
                imgNumber={1}
              />
              <Text>8 uncommon</Text>
            </div>
            <div>
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={100}
                hugImage={hugImage}
                customImgSrc={collection?.template_s3_url}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={rare}
                imgNumber={1}
              />
              <Text>3 rare</Text>
            </div>
            <div>
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={100}
                hugImage={hugImage}
                customImgSrc={collection?.template_s3_url}
                fontFillColor={fontFill}
                bgColor={background}
                imgNumber={1}
              />
              <Text>0 legendary</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: css`
    display: flex;
  `,
  badgeImage: css`
    margin-right: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  mintButton: css`
    width: 100%;
    margin-top: 24px;
  `,
  badgeMetadata: css`
    display: flex;
    flex-direction: column;
  `,
  title: css`
    display: flex;
    align-items: flex-start;
    margin-bottom: 32px;
  `,
  subMetadata: css`
    display: flex;
    & > * {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  `,
  owner: css``,
  pricing: css`
    padding-right: 24px;
    margin-right: 24px;
    border-right: 1px solid black;
  `,
  remainder: css`
    & > .badger-mint-remainder {
      margin: 18px 0;
    }
  `,
  breakdown: css`
    display: flex;
    justify-content: space-between;
  `,
};

export default Mint;
