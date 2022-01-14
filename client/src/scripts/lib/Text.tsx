import React, { PropsWithChildren } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";

enum TextType {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  logo = "logo",
  subtitle = "subtitle",
  body = "body",
}

type TextTypeString = keyof typeof TextType;

type Props = PropsWithChildren<{
  type?: TextTypeString;
  className?: ClassNamesArg;
}>;
function Text({
  type = TextType.body,
  className,
  children,
}: Props): JSX.Element {
  switch (type) {
    case TextType.h1:
      return (
        <h1 className={cx("badger-text", styles.h1, className)}>{children}</h1>
      );
    case TextType.h2:
      return (
        <h2 className={cx("badger-text", styles.h2, className)}>{children}</h2>
      );
    case TextType.h3:
      return (
        <h3 className={cx("badger-text", styles.h3, className)}>{children}</h3>
      );
    case TextType.logo:
      return (
        <p className={cx("badger-text", styles.logo, className)}>{children}</p>
      );
    case TextType.subtitle:
      return (
        <p className={cx("badger-text", styles.subtitle, className)}>
          {children}
        </p>
      );
    case TextType.body:
      return (
        <p className={cx("badger-text", styles.body, className)}>{children}</p>
      );
    default:
      throw new Error(`Improper string used for text type: ${type}`);
  }
}

const styles = {
  h1: css`
    font-size: 60px;
    line-height: 72px;
    font-family: ;
    font-family: "Averia Sans Libre", cursive;
  `,
  h2: css`
    font-size: 48px;
    line-height: 60px;
    font-family: "Itim", cursive;
  `,
  h3: css`
    font-size: 36px;
    line-height: 46px;
    font-family: "Itim", cursive;
  `,
  logo: css`
    font-size: 28px;
    line-height: 36px;
    font-family: "Averia Sans Libre", cursive;
  `,
  subtitle: css`
    font-size: 20px;
    line-height: 30px;
    font-family: "Itim", cursive;
  `,
  body: css`
    font-size: 16px;
    line-height: 24px;
    font-family: "Maven Pro", sans-serif;
    a {
      font-weight: 600;
    }
  `,
};

export default Text;
