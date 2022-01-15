import React, { forwardRef, useCallback, useState } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";
import Input from "@lib/inputs/Input";
import Slider from "@lib/inputs/Slider";
import DndFileUploader from "@lib/inputs/DndFileUploader";
import InlineInput from "@lib/inputs/InlineInput";
import { until } from "@styles/mediaQueries";
import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import {
  selectCollection,
  setNumBadges,
  setCost,
  setRoyalties,
  setName,
  setImageSrc,
  setImageFile,
} from "@scripts/redux/slices/collectionSlice";
import UploadButton from "@scripts/UploadButton";

type Props = {};
const Royalties = forwardRef<HTMLDivElement, Props>(({}, ref) => {
  const collection = useAppSelector(selectCollection);
  const dispatch = useAppDispatch();
  const onRoyaltyChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRoyalty = Math.min(e.currentTarget.valueAsNumber, 50) || 0;
      dispatch(setRoyalties(newRoyalty));
    },
    [dispatch]
  );

  return (
    <div className={cx(styles.container, styles.containerVertical)}>
      <DndFileUploader
        onImgFileLoaded={(imgFileURL: string) => {
          dispatch(setImageFile(imgFileURL));
        }}
        onImgSrcLoaded={(imgSrc: string) => {
          dispatch(setImageSrc(imgSrc));
        }}
      />
      <div className={cx(styles.uploadControls)}>
        <div className={cx(styles.input)}>
          <label htmlFor="badgeCreate-name">Name</label>
          <div>
            <Input
              className={cx(styles.nameInput)}
              placeholder="the Nifty Badger, 1st edition"
              onChange={(e) => dispatch(setName(e.currentTarget.value))}
              value={collection.name}
              id="badgeCreate-name"
            />
          </div>
        </div>
        <div className={cx(styles.input)}>
          <label># of Badges</label>
          <Input
            placeholder="100 in this collection"
            onChange={(e) =>
              dispatch(setNumBadges(e.currentTarget.valueAsNumber))
            }
            type="number"
            value={collection.numBadges.toString()}
            step={1}
            className={cx(styles.badgeInput)}
          />
        </div>
        <div className={cx(styles.input)}>
          <label>Cost per Badge</label>
          <Input
            placeholder="5"
            onChange={(e) => dispatch(setCost(e.currentTarget.valueAsNumber))}
            type="number"
            value={collection.cost.toString()}
            step={0.25}
            className={cx(styles.badgeInput)}
          />
        </div>
        <div className={cx(styles.input)}>
          <label htmlFor="badgeCreate-royal">Royalties (up to 50%)</label>
          <Slider
            step={1}
            min={0}
            max={50}
            value={collection.royalties}
            id="badgeCreate-royal"
            onChange={onRoyaltyChanged}
          />
          <div>
            You will receive&nbsp;
            <InlineInput
              value={collection.royalties}
              onChange={onRoyaltyChanged}
              min={0}
              max={50}
              afterContent="%"
            />
            of all subsequent sales
          </div>
        </div>
      </div>
      <UploadButton />
    </div>
  );
});

const styles = {
  wrapper: css`
    margin: 12px 0;
  `,
  container: css`
    display: flex;
    width: 100%;
    position: relative;
    align-items: flex-start;
    & > .badger-dndfileuploader {
      margin-right: 36px;
      margin-bottom: 0;
    }
  `,
  containerVertical: until(
    "tablet",
    css`
      flex-direction: column;
      align-items: center;
      & > .badger-dndfileuploader {
        margin-bottom: 12px;
        margin-top: 12px;
        margin-right: 0;
      }
    `
  ),
  uploadImage: css`
    width: 100px;
    height: 100px;
    background-color: red;
  `,
  input: css`
    margin-bottom: 12px;
    width: 100%;
    & label {
      margin-bottom: 8px;
      display: flex;
      font-weight: 600;
    }
  `,
  uploadDrop: css``,
  uploadLabel: css``,
  uploadControls: css`
    flex-shrink: 1;
    flex-grow: 1;
  `,
  nameInput: css`
    max-width: 300px !important;
  `,
  badgeInput: css`
    max-width: 300px !important;
  `,
  royaltyInputSmall: css`
    width: 13px;
  `,
  royaltyInputMedium: css`
    width: 23px;
  `,
  royaltyInputLarge: css`
    width: 33px;
  `,
  royaltyInput: css`
    display: inline;
    border: none;
    border-bottom: 2px solid black;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-appearance: none;
    outline: none;
    font-weight: 1000;
    text-align: right;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,
};

export default Royalties;
