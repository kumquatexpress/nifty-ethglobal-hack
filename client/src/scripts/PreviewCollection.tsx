import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { cx, css } from "@emotion/css/macro";
import Text from "@lib/Text";
import CanvasImage from "./CanvasImage";
import ColorPicker, { RGBAColor } from "@lib/ColorPicker";
import InlineInput from "@lib/inputs/InlineInput";
import Checkbox from "@lib/inputs/Checkbox";
import { useAppSelector, useAppDispatch } from "@scripts/redux/hooks";
import {
  selectCollection,
  setPercentCommon,
  setColor,
  setHugImage,
} from "@scripts/redux/slices/collectionSlice";

import { until } from "@styles/mediaQueries";
import { BadgeDataType } from "@scripts/types";
type Props = {};

function draw(context: CanvasRenderingContext2D, frameCount: number) {}

function CollectionPreview() {
  const collection = useAppSelector(selectCollection);
  const dispatch = useAppDispatch();
  const onPercentCommonChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPercentCommon(Math.min(e.target.valueAsNumber, 50)));
    },
    []
  );
  const canvasSize = 150;

  const { fontStroke, fontFill, background, rare, common, uncommon } =
    collection.badgeData.colors;
  const hugImage = collection.badgeData.hugImage;
  const percentCommon = collection.percentCommon;
  const percentUncommon = (100 - percentCommon) / 2 || 0;
  const percentRare = ((100 - percentCommon - percentUncommon) * 3) / 4 || 0;
  const percentLegendary = (100 - percentCommon - percentUncommon) / 4 || 0;
  const numBadges = collection.numBadges;

  const numberCommon = Math.floor((numBadges * percentCommon) / 100) || 0;
  const numberUncommon = Math.floor((numBadges * percentUncommon) / 100);
  const numberRare = Math.floor((numBadges * percentRare) / 100);
  const numberLegendary =
    numberCommon > 0
      ? numBadges - numberRare - numberUncommon - numberCommon
      : 0;

  return (
    <div className={cx(styles.card)}>
      <div className={cx(styles.rarityShelf)}>
        <div className={cx(styles.imageCarousel, styles.imageCarouselMobile)}>
          <div className="imgDisplay-row">
            <div className="imgDisplay">
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={canvasSize}
                hugImage={hugImage}
                customImgSrc={collection.badgeData.imgSrc}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={common}
                imgNumber={1}
              />
              <div className="customColor">
                <ColorPicker
                  pickerSize="small"
                  color={common}
                  onChange={(color: RGBAColor) => {
                    dispatch(setColor({ key: "common", color }));
                  }}
                />
                <Text>Common</Text>
              </div>
            </div>
            <div className="imgDisplay">
              <CanvasImage
                fontStrokeColor={fontStroke}
                size={canvasSize}
                hugImage={hugImage}
                customImgSrc={collection.badgeData.imgSrc}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={uncommon}
                imgNumber={numberCommon + 1}
              />
              <div className="customColor">
                <ColorPicker
                  pickerSize="small"
                  color={uncommon}
                  onChange={(color: RGBAColor) => {
                    dispatch(setColor({ key: "uncommon", color }));
                  }}
                />
                <Text>Uncommon</Text>
              </div>
            </div>
          </div>
          <div className="imgDisplay-row">
            <div className="imgDisplay">
              <CanvasImage
                fontStrokeColor={fontStroke}
                hugImage={hugImage}
                size={canvasSize}
                customImgSrc={collection.badgeData.imgSrc}
                fontFillColor={fontFill}
                bgColor={background}
                paddingColor={rare}
                imgNumber={numberUncommon + numberCommon + 1}
              />
              <div className="customColor">
                <ColorPicker
                  pickerSize="small"
                  color={rare}
                  onChange={(color: RGBAColor) => {
                    dispatch(setColor({ key: "rare", color }));
                  }}
                />
                <Text>Rare</Text>
              </div>
            </div>
            <div className="imgDisplay">
              <CanvasImage
                fontStrokeColor={fontStroke}
                hugImage={hugImage}
                size={canvasSize}
                customImgSrc={collection.badgeData.imgSrc}
                fontFillColor={fontFill}
                bgColor={background}
                imgNumber={numberCommon + numberUncommon + numberRare + 1}
              />
              <div className="customColor">
                <Text>Legendary</Text>
              </div>
            </div>
          </div>
        </div>
        <div className={cx(styles.rarityControls)}>
          <div className={cx(styles.colorControls)}>
            {/* <div className={cx(styles.pickers)}>
                <ColorPicker
                  color={fontStroke}
                  onChange={setFontStrokeColor}
                />
                <Text> Font stroke color </Text>
              </div> */}
            <div className={cx(styles.pickers)}>
              <ColorPicker
                color={fontFill}
                onChange={(color: RGBAColor) => {
                  dispatch(setColor({ key: "fontFill", color }));
                }}
              />
              <Text> Font color </Text>
            </div>
            {/* <div className={cx(styles.pickers)}>
                <ColorPicker color={background} onChange={setBgColor} />
                <Text> Background color </Text>
              </div> */}
            <Checkbox
              checked={hugImage}
              onChange={(e) => {
                dispatch(setHugImage(e.currentTarget.checked));
              }}
              className={cx(styles.pickers)}
            >
              <Text>Hug Image</Text>
            </Checkbox>
          </div>
          <div className={cx(styles.percentages)}>
            <Text>
              <InlineInput
                value={percentCommon}
                onChange={onPercentCommonChanged}
                min={0}
                max={50}
                afterContent="%"
              />
              of your fans ({numberCommon}) will get <b>common</b> badges
            </Text>
            <Text>
              <b>{percentUncommon.toFixed(2).replace(/[.,]00$/, "")}%</b> of
              your fans ({numberUncommon}) will get <b>uncommon</b> badges
            </Text>
            <Text>
              <b>{percentRare.toFixed(2).replace(/[.,]00$/, "")}%</b> of your
              fans ({numberRare}) will get <b>rare</b> badges
            </Text>
            <Text>
              <b>{percentLegendary.toFixed(2).replace(/[.,]00$/, "")}%</b> of
              your fans ({numberLegendary}) will get <b>legendary</b> badges
            </Text>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
const styles = {
  card: css`
    margin-bottom: 24px;
  `,
  imageCarousel: css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 48px 0;

    & > .imgDisplay-row {
      display: flex;
      flex-grow: 1;
      & > .imgDisplay {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .imgDisplay-row {
          display: flex;
        }
      }
    }
    & .customColor {
      font-weight: 500;
      display: flex;
      align-items: center;
      margin-top: 12px;
      & > .badger-colorPicker {
        margin-right: 8px;
      }
    }
  `,
  imageCarouselMobile: until(
    "tablet",
    css`
      justify-content: center;
      margin: 24px 0;
      & > .imgDisplay-row {
        display: block;
        & > .imgDisplay {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
      }
    `
  ),
  rarityShelf: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
  `,
  pickers: css`
    display: flex;

    & > div,
    & > input[type="checkbox"] {
      margin-right: 12px;
    }
    flex-direction: row;
    align-items: center;

    &.checkbox {
      display: flex;
      margin-left: 15px;
    }
    font-weight: 500;
  `,
  percentages: css`
    display: flex;
    flex-direction: column;
    & b {
      font-weight: 500;
    }
    & .badger-text {
      margin-bottom: 8px;
    }
  `,
  rarityControls: css`
    display: flex;
  `,
  colorControls: css`
    display: flex;
    flex-direction: column;
    margin-right: 24px;
    & > div {
      margin-bottom: 12px;
    }
  `,
};

export default CollectionPreview;
