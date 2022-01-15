import React, { useCallback, useRef, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import { RgbaColorPicker } from "react-colorful";

import { useClickOutside } from "@scripts/utils/hooks";
import { RGBAColorToString } from "@scripts/utils/index";

type size = "small" | "normal";

type Props = { color: RGBAColor; onChange: any; pickerSize?: size };
export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const ColorPicker = ({ color, onChange, pickerSize }: Props) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className={cx(styles.picker, "badger-colorPicker")}>
      <div
        className={cx(styles.swatch, pickerSize === "small" && styles.small)}
        style={{
          backgroundColor: RGBAColorToString(color),
        }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className={cx(styles.popover)} ref={popover}>
          <RgbaColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
export default ColorPicker;

const styles = {
  picker: css`
    position: relative;
  `,

  swatch: css`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  `,
  small: css`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  `,

  popover: css`
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    border-radius: 9px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    z-index: 99999;
  `,
};
