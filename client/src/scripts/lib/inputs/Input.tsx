import React from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import { Icon } from "react-feather";

type InputType = "text" | "password" | "email" | "tel" | "number";

type InputColor =
  | "primary"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "danger";

type InputState = "normal" | "hover" | "focus" | "loading";

enum InputSize {
  small = "small",
  normal = "normal",
  medium = "medium",
  large = "large",
}

type InputSizeString = keyof typeof InputSize;

type Props = {
  className?: ClassNamesArg;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  type?: InputType;
  color?: InputColor;
  placeholder?: string;
  round?: boolean;
  state?: InputState;
  size?: InputSizeString;
  disabled?: boolean;
  readonly?: boolean;
  isStatic?: boolean;
  LeftIcon?: Icon;
  RightIcon?: Icon;
  name?: string;
  id?: string;
  value?: string | number;
};

function Input({
  type = "text",
  color,
  state,
  name,
  value,
  id,
  size = "normal",
  round = false,
  isStatic = false,
  placeholder,
  LeftIcon,
  RightIcon,
  className,
  onChange,
  step,
  ...props
}: Props) {
  let featherIconSize = 16;
  switch (size) {
    case InputSize.small:
      featherIconSize = 12;
      break;
    case InputSize.normal:
      break;
    case InputSize.medium:
      featherIconSize = 20;
      break;
    case InputSize.large:
      featherIconSize = 24;
      break;
  }

  return (
    <div
      className={cx(
        "control",
        size && `is-${size}`,
        state && `is-${state}`,
        LeftIcon && "has-icons-left",
        RightIcon && "has-icons-right"
      )}
    >
      <input
        className={cx(
          "input",
          size && `is-${size}`,
          color && `is-${color}`,
          round && "is-rounded",
          isStatic && "is-static",
          className
        )}
        onChange={onChange}
        step={step}
        id={id}
        value={value}
        name={name}
        placeholder={placeholder}
        type={type}
        {...props}
      />
      {LeftIcon ? (
        <span className="icon is-left">
          {<LeftIcon size={featherIconSize} />}
        </span>
      ) : null}
      {RightIcon ? (
        <span className="icon is-left">
          {<RightIcon size={featherIconSize} />}
        </span>
      ) : null}
    </div>
  );
}

const styles = {};

export default Input;
