import React, { useState } from "react";
import Button, { ButtonProps } from "@lib/button";
import { ClassNamesArg } from "@emotion/css";

import { getPercentagesBasedOffCommon } from "./utils";
import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import { selectAddress, setAddressTo } from "@scripts/redux/slices/ethSlice";
import styles from "./Counter.module.css";
import web3 from "../web3";
import { isMetaMaskInstalled } from "@scripts/utils";
import eth from "@scripts/utils/eth";
import { getOrCreateUser } from "@utils/users_api";
import { selectCollection } from "@scripts/redux/slices/collectionSlice";
import {
  CreateCollection,
  CreateCollectionVariables,
} from "@gqlt/CreateCollection";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECTION } from "@graphql/collections.graphql";

type Props = {
  className?: ClassNamesArg;
  onSuccess: (mutationResp: CreateCollection["createCollection"]) => void;
} & ButtonProps;
export default function UploadButton({ onSuccess, ...props }: Props) {
  const collection = useAppSelector(selectCollection);
  const dispatch = useAppDispatch();

  const [
    createCollection,
    { loading: isCreatingCollection, error: errorCreatingCollection },
  ] = useMutation<CreateCollection, CreateCollectionVariables>(
    CREATE_COLLECTION
  );

  return (
    <Button
      {...props}
      onClick={async () => {
        if (collection.badgeData.imgFile != null && collection.cost > 0) {
          const imageFile = await fetch(collection.badgeData.imgFile)
            .then((r) => r.blob())
            .then(
              (blobFile) =>
                new File([blobFile], `${collection.name}`, {
                  type: "image/png",
                })
            );
          const {
            percentCommon,
            percentUncommon,
            percentRare,
            percentLegendary,
          } = getPercentagesBasedOffCommon(collection.percentCommon);
          const collectionResp = await createCollection({
            variables: {
              name: collection.name,
              maxCount: collection.numBadges,
              symbol: "TEMP",
              royalty: collection.royalties,
              templateImage: imageFile,
              price: collection.cost,
              mintDate: new Date(),
              badgeMetadata: {
                hugImage: collection.badgeData.hugImage,
                bgColor: collection.badgeData.colors.background,
                fontStrokeColor: collection.badgeData.colors.fontStroke,
                fontFillColor: collection.badgeData.colors.fontFill,
                rarityMapping: {
                  common: {
                    color: collection.badgeData.colors.common,
                    pct: percentCommon,
                  },
                  uncommon: {
                    color: collection.badgeData.colors.rare,
                    pct: percentUncommon,
                  },
                  rare: {
                    color: collection.badgeData.colors.uncommon,
                    pct: percentRare,
                  },
                  legendary: {
                    pct: percentLegendary,
                  },
                },
              },
            },
          });
          if (collectionResp?.data?.createCollection) {
            onSuccess(collectionResp?.data?.createCollection);
          }
          console.log("coll", collectionResp);
          // call onsuccess
        } else {
          // TODO: handle errors
          alert(`Invalid inputs!`);
        }
      }}
    >
      Upload
    </Button>
  );
}
