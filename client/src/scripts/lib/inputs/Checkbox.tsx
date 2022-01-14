import React from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";

type Props = {
  className?: ClassNamesArg;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
};

function Checkbox({
  children,
  className,
  checked,
  disabled,
  onChange,
  ...props
}: React.PropsWithChildren<Props>) {
  return (
    <label className={cx("checkbox", className)}>
      <input checked={checked} onChange={onChange} type="checkbox" {...props} />
      {children}
    </label>
  );
}

export default Checkbox;
