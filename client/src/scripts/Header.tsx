import React, { PropsWithChildren, useRef } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";
import StickyHeader from "@lib/header/StickyHeader";
import HeaderItem from "@lib/header/HeaderItem";
import HeaderSpacer from "@lib/header/HeaderSpacer";
import Logo from "@lib/logo/Logo";

type Props = PropsWithChildren<{
  className?: ClassNamesArg;
}>;

const baseHeaderClickEvent = "base-header-click";

function BaseHeader({ children, className }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <StickyHeader ref={headerRef} className={className}>
      <HeaderItem
        onClick={() => {
          window.history.pushState({}, "", "/");
        }}
      >
        <Logo type="dynamic" />
      </HeaderItem>
      <HeaderSpacer />
      {children}
    </StickyHeader>
  );
}

export default BaseHeader;
