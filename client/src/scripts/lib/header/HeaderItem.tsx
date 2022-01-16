import React, { PropsWithChildren } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";

type Props = PropsWithChildren<{
  className?: ClassNamesArg;
  href?: string;
  onClick: () => void;
}>;

function HeaderItem({ children, className, onClick, href }: Props) {
  return (
    <a
      href={href || "#"}
      className={cx(styles.view, className)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

const styles = {
  view: css`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px 0 0;
  `,
};

export default HeaderItem;
