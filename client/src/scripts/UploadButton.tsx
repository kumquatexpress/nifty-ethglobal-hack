import React, { useState } from "react";
import Button from "@lib/button";

import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import { selectAddress, setAddressTo } from "@scripts/redux/slices/ethSlice";
import styles from "./Counter.module.css";
import web3 from "../web3";
import { isMetaMaskInstalled } from "@scripts/utils";
import eth from "@utils/eth";
import { getOrCreateUser } from "../utils/users_api";
import { selectCollection } from "@scripts/redux/slices/collectionSlice";
import {
  CreateCollection,
  CreateCollectionVariables,
} from "@gqlt/CreateCollection";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECTION } from "@graphql/collections.graphql";

export default function UploadButton() {
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
          const collectionResp = await createCollection({
            variables: {
              name: collection.name,
              maxCount: collection.numBadges,
              symbol: "TEMP",
              royalty: collection.royalties,
              templateImage: imageFile,
              price: collection.cost,
              mintDate: new Date(),
            },
          });
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
