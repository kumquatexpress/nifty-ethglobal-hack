import React, { useCallback, useState } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";

type SliderColor = "primary" | "link" | "info" | "info" | "warning" | "danger";

type SliderSize = "normal";

type Props = {
  step: number;
  min: number;
  max: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  disabled?: boolean;
  color?: SliderColor;
  size?: SliderSize;
  round?: boolean;
  vertical?: boolean;

  output?: boolean;
  outputClassname?: ClassNamesArg;

  id?: string;
  name?: string;
};

function Slider({
  // required
  step,
  min,
  max,
  value = min,
  // Optionals
  color,
  name,
  id,
  disabled = false,
  size = "normal",
  round = false,
  vertical = false,
  output = false,
  outputClassname,
  onChange,

  ...props
}: Props) {
  if (output && id == null) {
    throw new Error("You can't have a slider output without an id");
  }

  return (
    <div className={cx("control", size && `is-${size}`)}>
      <input
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={cx()}
        style={{
          filter: `hue-rotate(-"${value}" deg)`,
        }}
        id={id}
        name={name}
        value={value}
        type="range"
        {...props}
      />
      {output && id && (
        <output className={cx(outputClassname)} htmlFor={id}>
          50
        </output>
      )}
    </div>
  );
}

export default Slider;
