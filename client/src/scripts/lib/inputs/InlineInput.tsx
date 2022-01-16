import React from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";

type Props = {
  className?: ClassNamesArg;
  value: number;
  afterContent?: string;
  max: number;
  min: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function TextArea({
  className,
  value,
  afterContent,
  onChange,
  max,
  min,
  ...props
}: Props) {
  return (
    <>
      <span
        className={
          (cx(styles.inlineAfter),
          css`
            &:after {
              content: "${afterContent}";
              font-weight: 1000;
            }
          `)
        }
      >
        <input
          type="number"
          className={cx(
            styles.inlineInput,
            value < 10 ? styles.inlineInputSmall : styles.inlineInputMedium
          )}
          value={`${value}`}
          max={max}
          min={min}
          onChange={onChange}
        />
      </span>
      &nbsp;
    </>
  );
}

const styles = {
  inlineAfter: css`
    font-weight: 1000;
  `,
  inlineInputSmall: css`
    width: 10px;
  `,
  inlineInputMedium: css`
    width: 20px;
  `,
  inlineInputLarge: css`
    width: 33px;
  `,
  inlineInput: css`
    display: inline;
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-appearance: none;
    outline: none;
    font-weight: 1000;
    padding: 0;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    box-shadow: inset 0 -2px 0 0 black;
  `,
};

export default TextArea;
