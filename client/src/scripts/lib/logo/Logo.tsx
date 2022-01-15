import React, { PropsWithChildren, forwardRef } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";
import LogoSVG from "./LogoSVG";
import Text from "../Text";
import { until } from "@styles/mediaQueries";

enum LogoType {
  icon = "icon",
  text = "text",
  full = "full",
  // it will dynamically only show the icon on the tablet or mobile
  dynamic = "dynamic",
}

type LogoTypeString = keyof typeof LogoType;

type Props = { type: LogoTypeString; className?: ClassNamesArg };

const Logo = ({ type, className }: Props) => {
  switch (type) {
    case LogoType.text:
      return (
        <div className={cx(styles.logo, className)}>
          <Text className={cx(styles.logoText)} type="logo">
            niftybadger
          </Text>
          <sup className={cx(styles.logoSuperscript)}>
            <>&alpha;</>
          </sup>
        </div>
      );
    case LogoType.full:
      return (
        <div className={cx(styles.logo, className)}>
          <LogoSVG className={cx(styles.logoIconWithText)} size={40} />
          <Text className={cx(styles.logoText)} type="logo">
            niftybadger
          </Text>
          <sup className={cx(styles.logoSuperscript)}>
            <>&alpha;</>
          </sup>
        </div>
      );
    case LogoType.dynamic:
      return (
        <div className={cx(styles.logo, className)}>
          <LogoSVG className={cx(styles.logoIconWithText)} size={40} />
          <Text
            className={cx(styles.logoText, styles.dynamicHidden)}
            type="logo"
          >
            niftybadger
          </Text>
          <sup className={cx(styles.logoSuperscript, styles.dynamicHidden)}>
            <>&alpha;</>
          </sup>
        </div>
      );
    case LogoType.icon:
      return (
        <div className={cx(styles.logo, className)}>
          <LogoSVG size={40} />
        </div>
      );
    default:
      throw new Error(`Improper string used for logo type: ${type}`);
  }
};

const styles = {
  logoIconWithText: css`
    margin-right: 8px;
  `,
  logo: css`
    display: flex;
  `,
  logoText: css`
    display: flex;
    align-items: center;
  `,
  logoSuperscript: css`
    vertical-align: super;
    font-size: 100%;
    align-self: baseline;
    margin-left: 4px;
  `,
  dynamicHidden: until(
    "tablet",
    css`
      display: none;
    `
  ),
};

export default Logo;
