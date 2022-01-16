import React, { PropsWithChildren, useRef } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css/macro";
import StickyHeader from "@lib/header/StickyHeader";
import HeaderItem from "@lib/header/HeaderItem";
import HeaderSpacer from "@lib/header/HeaderSpacer";
import Logo from "@lib/logo/Logo";
import { useNavigate } from "react-router-dom";
import MeButton from "./MeButton";
import StashButton from "./StashButton";

type Props = PropsWithChildren<{
  className?: ClassNamesArg;
}>;

const baseHeaderClickEvent = "base-header-click";

function BaseHeader({ children, className }: Props) {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <StickyHeader ref={headerRef} className={className}>
      <HeaderItem>
        <a
          href="/"
          onClick={() => {
            navigate("/");
          }}
        >
          <Logo type="dynamic" />
        </a>
        <MeButton />
        <StashButton />
      </HeaderItem>
      <HeaderSpacer />
      {children}
    </StickyHeader>
  );
}

export default BaseHeader;
