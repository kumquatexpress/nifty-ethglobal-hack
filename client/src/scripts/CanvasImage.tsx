import React, { forwardRef, useEffect, useRef, useState } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";
import { until } from "@styles/mediaQueries";
import { RGBAColor } from "@lib/ColorPicker";
import { RGBAColorToString } from "@scripts/utils/index";

type Props = {
  customImgSrc?: string | null;
  previewImgSrc?: string;
  size: number;
  fontFillColor?: RGBAColor;
  fontStrokeColor?: RGBAColor;
  bgColor?: RGBAColor;
  paddingColor?: RGBAColor;
  imgNumber?: number;
  customBorderSVGUrl?: string;
  hugImage?: boolean;
};

var dpr = window.devicePixelRatio || 1;

export default function CanvasImage({
  customBorderSVGUrl,
  previewImgSrc,
  customImgSrc,
  size,
  fontFillColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
  paddingColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
  bgColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
  fontStrokeColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
  imgNumber,
  hugImage = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [svgBorder, setSVGBorder] = useState<HTMLImageElement | null>(null);
  const [renderedImg, setRenderedImg] = useState<HTMLImageElement | null>(null);

  // setup preview img
  useEffect(() => {
    if (customImgSrc != null) {
      const img = new Image();
      img.addEventListener("load", () => {
        setRenderedImg(img);
      });
      img.src = customImgSrc;
    }
  }, [customImgSrc]);

  // setup preview img
  useEffect(() => {
    if (previewImgSrc != null && customImgSrc == null) {
      const img = new Image();
      img.addEventListener("load", () => {
        setRenderedImg(img);
      });
      img.src = previewImgSrc;
    }
  }, [previewImgSrc]);

  // setup border svg
  useEffect(() => {
    if (customBorderSVGUrl != null) {
      const img = new Image();
      img.addEventListener("load", () => {
        setSVGBorder(img);
      });
      img.src = customBorderSVGUrl;
    }
  }, [customBorderSVGUrl]);

  useEffect(() => {
    const sizeOfPaddingPerSide = 0.8 / 10;
    const canvas = canvasRef.current;

    // we need to account for the border
    const sizeOfImage = hugImage ? (8 / 10) * size : (6.4 / 10) * size;
    const borderRadius = (1 / 10) * size;
    const paddingRadius = (1 / 15) * size;
    const borderSize = (1 / 50) * size;
    const innerBorderRadius = (1 / 30) * size;
    const paddingSize = (1 / 10) * size;
    const sizeOfNumber = (1.5 / 10) * size;
    const sizeOfNumberMargin = (0.3 / 10) * size;
    const sizeOfHash = (0.8 / 10) * size;
    const sizeOfHashMargin = (0.1 / 10) * size;
    const calculatedSizeOfPaddingPerSide = hugImage ? 0 : (0.8 / 10) * size;
    const renderedImgDrawPosX = paddingSize + calculatedSizeOfPaddingPerSide;
    const renderedImgDrawPosY = renderedImgDrawPosX;

    if (canvas) {
      // Get the device pixel ratio, falling back to 1.
      // Get the size of the canvas in CSS pixels.
      var rect = canvas.getBoundingClientRect();
      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = RGBAColorToString(bgColor);

        ctx.fillRect(
          paddingSize / 2,
          paddingSize / 2,
          size - paddingSize,
          size - paddingSize
        );

        if (renderedImg != null) {
          ctx.drawImage(
            renderedImg,
            renderedImgDrawPosX,
            renderedImgDrawPosY,
            sizeOfImage,
            sizeOfImage
          );
        }
        console.log(svgBorder == null);
        if (svgBorder != null) {
          ctx.drawImage(svgBorder, 0, 0, size, size);
        } else {
          console.log("rendering border");
          if (paddingColor != null) {
            roundRect(
              ctx,
              paddingSize / 2,
              paddingSize / 2,
              size - paddingSize,
              size - paddingSize,
              paddingRadius
            );
            ctx.lineWidth = paddingSize;
            ctx.strokeStyle = RGBAColorToString(paddingColor);
            ctx.stroke();
          }
          roundRect(
            ctx,
            borderSize / 2,
            borderSize / 2,
            size - borderSize,
            size - borderSize,
            borderRadius
          );
          ctx.lineWidth = borderSize;
          ctx.strokeStyle = "black";
          ctx.stroke();
        }

        roundRect(
          ctx,
          paddingSize,
          paddingSize,
          size - paddingSize * 2,
          size - paddingSize * 2,
          innerBorderRadius
        );
        ctx.lineWidth = borderSize;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.shadowColor = "transparent";

        ctx.font = `bold ${sizeOfNumber}px Itim`;
        var num = `${imgNumber != null ? imgNumber : ""}`;
        var blur = 1;
        var widthOfText = ctx.measureText(num).width;
        var width = ctx.measureText(num).width;

        const numDrawPosX = size - width - paddingSize - sizeOfNumberMargin;
        const numDrawPosY = size - paddingSize - sizeOfNumber;
        ctx.textBaseline = "top";
        ctx.shadowColor = "pink";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = RGBAColorToString(fontStrokeColor);
        ctx.strokeText(num, numDrawPosX, numDrawPosY);
        ctx.fillStyle = RGBAColorToString(fontFillColor);
        ctx.fillText(num, numDrawPosX, numDrawPosY);

        ctx.font = `bold ${sizeOfHash}px Itim`;
        var hash = `#`;
        var widthOfHash = ctx.measureText(hash).width;
        ctx.strokeStyle = RGBAColorToString(fontStrokeColor);
        ctx.strokeText(
          hash,
          numDrawPosX - widthOfHash - sizeOfHashMargin,
          numDrawPosY
        );
        ctx.fillText(
          hash,
          numDrawPosX - widthOfHash - sizeOfHashMargin,
          numDrawPosY
        );
        ctx.scale(-dpr, -dpr);
      }
    }
  }, [
    size,
    canvasRef,
    svgBorder,
    renderedImg,
    size,
    fontFillColor,
    paddingColor,
    bgColor,
    imgNumber,
    hugImage,
    fontStrokeColor,
  ]);

  return (
    <canvas
      className={cx(
        "badger-canvasImage",
        css`
          width: ${size}px;
          height: ${size}px;
          opacity: ${renderedImg == null ? 0.2 : 1};
        `
      )}
      ref={canvasRef}
      width={size}
      height={size}
    />
  );
}
const styles = {
  canvasTablet: until("tablet", css``),
};

// @ts-ignore
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = {
      tl: radius,
      tr: radius,
      br: radius,
      bl: radius,
    };
  } else {
    var defaultRadius = {
      tl: 0,
      tr: 0,
      br: 0,
      bl: 0,
    };
    for (var side in defaultRadius) {
      // @ts-ignore
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}
