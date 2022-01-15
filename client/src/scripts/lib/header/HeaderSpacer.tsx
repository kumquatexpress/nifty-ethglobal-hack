import React, { PropsWithChildren } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";

type Props = { className?: ClassNamesArg };

function HeaderSpacer({ className }: Props) {
  return <div className={cx(className, styles.view)}></div>;
}

const styles = {
  view: css`
    flex-grow: 1;
  `,
};

export default HeaderSpacer;
