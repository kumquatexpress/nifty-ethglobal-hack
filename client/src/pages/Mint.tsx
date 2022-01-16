import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import MintButton from "@scripts/MintButton";
import CanvasImage from "@scripts/CanvasImage";
import Text from "@lib/Text";
import { APIClient } from "../utils/api_client";

import { COLLECTION } from "@graphql/collections.graphql";
import { BORDER_LEGENDARY_SVG_URL } from "@utils/constants";

import mintConfigContract, {
  getBalance,
  getTotalMined,
  getAllCandidates,
  priceWei,
  mintRandom,
} from "../components/config";
import {
  Collection as CollectionType,
  CollectionVariables,
} from "@gqlt/Collection";
import { gweiToMatic } from "@utils/mint";
import { BadgerCollectionStatus } from "@scripts/types";

function Mint() {
  let { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<BadgerCollectionStatus>(0);
  const { data, loading, error } = useQuery<
    CollectionType,
    CollectionVariables
  >(COLLECTION, {
    variables: {
      id: id!,
    },
  });
  const collection = data?.collection;
  let contractAddress = collection?.machine_address;
  let [totalMined, setTotalMined] = useState<number>(0);
  let [remainingUnmined, setRemainingUnmined] = useState<string[]>([]);
  useEffect(() => {
    if (status === 3) {
      async function fetchTotals(config: any) {
        const allRemainingUnmined = await getAllCandidates(config);
        const totalMined = await getTotalMined(config);
        setTotalMined(parseInt(totalMined) || 0);
        setRemainingUnmined(allRemainingUnmined);
        console.log(allRemainingUnmined);
      }
      if (contractAddress) {
        console.log(contractAddress);
        const config = mintConfigContract(contractAddress);
        fetchTotals(config);
      }
    }
  }, [contractAddress, status]);
  // query for status
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (id != null) {
      pollCollectionStatus();
    }
    let timeToCheck = 1000;
    function pollCollectionStatus() {
      APIClient()
        .get(`/collection/${id}/status`)
        .then((resp) => {
          console.log("success", resp.data.status);
          setStatus(resp.data.status);
        })
        .catch((error) => {
          console.error("Error fetching status:", error);
        })
        .finally(() => {
          if (status !== BadgerCollectionStatus.READY_TO_MINT) {
            // basic exponential backoff
            timeToCheck *= 1.1;
            timeout = setTimeout(pollCollectionStatus, timeToCheck);
          }
        });
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [id, setStatus, status]);

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

  if (collection?.badge_metadata == null) {
    return (
      <div>
        Error getting badge metadata for collection with id: {id}, error:{" "}
        {error}
      </div>
    );
  }

  // TODO: TEMP DEFAULTS
  const {
    hugImage,
    bgColor: background,
    fontStrokeColor: fontStroke,
    fontFillColor: fontFill,
    rarityMapping: {
      rare: { pct: rarePercent, color: rare },
      common: { pct: commonPercent, color: common },
      uncommon: { pct: uncommonPercent, color: uncommon },
    },
  } = collection?.badge_metadata || {};

  const readyToMint = status === BadgerCollectionStatus.READY_TO_MINT;

  // calculate the breakdown of item rarities left

  const {
    commonLeft,
    commonTotal,
    uncommonLeft,
    uncommonTotal,
    rareLeft,
    rareTotal,
    legendaryLeft,
    legendaryTotal,
  } = collection?.items?.reduce(
    (memo: any, item) => {
      const rarityAttr = item?.metadata?.attributes?.find((attr: any) => {
        return attr.trait_type === "rarity";
      });
      const matchesUnminted = remainingUnmined.find((ipfsLink) => {
        return ipfsLink === item?.ipfs_metadata?.link;
      });
      switch (rarityAttr?.value) {
        case "rare":
          memo.rareTotal += 1;
          break;
        case "legendary":
          memo.legendaryTotal += 1;
          break;
        case "common":
          memo.commonTotal += 1;
          break;
        case "uncommon":
          memo.uncommonTotal += 1;
          break;
        default:
          break;
      }

      if (matchesUnminted) {
        switch (rarityAttr?.value) {
          case "rare":
            memo.rareLeft += 1;
            break;
          case "legendary":
            memo.legendaryLeft += 1;
            break;
          case "common":
            memo.commonLeft += 1;
            break;
          case "uncommon":
            memo.uncommonLeft += 1;
            break;
          default:
            break;
        }
      }
      return memo;
    },
    {
      commonLeft: 0,
      commonTotal: 0,
      uncommonLeft: 0,
      uncommonTotal: 0,
      rareLeft: 0,
      rareTotal: 0,
      legendaryLeft: 0,
      legendaryTotal: 0,
    }
  );
  console.log({
    commonLeft,
    commonTotal,
    uncommonLeft,
    uncommonTotal,
    rareLeft,
    rareTotal,
    legendaryLeft,
    legendaryTotal,
  });

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.badgeImage)}>
        <CanvasImage
          fontStrokeColor={fontStroke}
          size={300}
          hugImage={hugImage}
          customImgSrc={collection?.template_s3_url}
          fontFillColor={fontFill}
          bgColor={background}
          imgNumber={1}
          customBorderSVGUrl={BORDER_LEGENDARY_SVG_URL}
        />
        <MintButton
          readyToMint={readyToMint}
          contractAddress={contractAddress}
          size="large"
          className={cx(styles.mintButton)}
        />
      </div>

      <div className={cx(styles.badgeMetadata)}>
        <Text type="h1" className={cx(styles.title)}>
          {collection.name}
        </Text>
        <div className={cx(styles.subMetadata)}>
          <div className={cx(styles.pricing)}>
            <Text>Mint Price: </Text>
            <Text type="h3">
              {collection?.price_gwei ? gweiToMatic(collection?.price_gwei) : 0}{" "}
              $MATIC
            </Text>
          </div>
          <div className={cx(styles.owner)}>
            <Text>Creator </Text>
            <Text type="h3">
              {collection?.owner?.profile?.fullname || "Anonymous"}
            </Text>
          </div>
        </div>
        <div className={cx(styles.remainder)}>
          <Text type="subtitle" className="badger-mint-remainder">
            {remainingUnmined.length > 0 && totalMined > 0
              ? "`Collection loading"
              : `${remainingUnmined.length} out of${" "}
              ${remainingUnmined.length + totalMined} remaining`}
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
              <Text>
                {commonLeft > 0 ? (
                  `
                ${commonLeft}/${commonTotal} left
                  `
                ) : (
                  <>0 left &#128542;</>
                )}
              </Text>
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
              <Text>
                {uncommonLeft > 0 ? (
                  `
                ${uncommonLeft}/${uncommonTotal} left
                  `
                ) : (
                  <>0 left &#128542;</>
                )}
              </Text>
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
              <Text>
                {rareLeft > 0 ? (
                  `
                ${rareLeft}/${rareTotal} left
                  `
                ) : (
                  <>0 left &#128542;</>
                )}
              </Text>
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
                customBorderSVGUrl={BORDER_LEGENDARY_SVG_URL}
              />
              <Text>
                {legendaryLeft > 0 ? (
                  `
                ${legendaryLeft}/${legendaryTotal} left
                  `
                ) : (
                  <>0 left &#128542;</>
                )}
              </Text>
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
