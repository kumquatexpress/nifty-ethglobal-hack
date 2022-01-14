import bulma from "styles/modules/bulma.module.scss";
import { css } from "@emotion/css/macro";
console.log(bulma);

enum Device {
  // up to 768px
  mobile = "mobile",
  // up to 1023px
  tablet = "tablet",
  // up to 1215
  desktop = "desktop",
  // up to 1407
  widescreen = "widescreen",
  //  up to 1408
  fullhd = "fullhd",
}

type DeviceTypeString = keyof typeof Device;

export function includeMobile(style: string) {
  return css`
    @media screen and (max-width: ${bulma.tablet} - 1px) {
      ${style}
    }
  `;
}

export function includeTablet(style: string) {
  return css`
    @media screen and (min-width: ${bulma.tablet}), print {
      ${style}
    }
  `;
}

export function includeTabletOnly(style: string) {
  return css`
    @media screen and (min-width: ${bulma.tablet}) and (max-width: ${bulma.desktop} - 1px) {
      ${style}
    }
  `;
}

export function includeTouch(style: string) {
  return css`
    @media screen and (max-width: ${bulma.desktop} - 1px) {
      ${style}
    }
  `;
}

export function includeDesktop(style: string) {
  return css`
    @media screen and (min-width: ${bulma.desktop}) {
      ${style}
    }
  `;
}

export function includeDesktopOnly(style: string) {
  if (!bulma.widescreenEnabled) return "";
  return css`
    @media screen and (min-width: ${bulma.desktop}) and (max-width: ${bulma.widescreen} - 1px) {
      ${style}
    }
  `;
}

export function includeUntilWidescreen(style: string) {
  if (!bulma.widescreenEnabled) return "";
  return css`
    @media screen and (max-width: ${bulma.widescreen} - 1px) {
      ${style}
    }
  `;
}

export function includeWidescreen(style: string) {
  if (!bulma.widescreenEnabled) return "";
  return css`
    @media screen and (min-width: ${bulma.widescreen}) {
      ${style}
    }
  `;
}

export function includeWidescreenOnly(style: string) {
  if (!bulma.widescreenEnabled || !bulma.fullhdEnabled) return "";
  return css`
    @media screen and (min-width: ${bulma.widescreen}) and (max-width: ${bulma.fullhd} - 1px) {
      ${style}
    }
  `;
}

export function includeUntilFullHD(style: string) {
  if (!bulma.fullhdEnabled) return "";
  return css`
    @media screen and (max-width: ${bulma.fullhd} - 1px) {
      ${style}
    }
  `;
}

export function includeFullHD(style: string) {
  if (!bulma.fullhdEnabled) return "";
  return css`
    @media screen and (min-width: ${bulma.fullhd}) {
      ${style}
    }
  `;
}

export function from(device: DeviceTypeString, style: string) {
  let breakpoint = "";
  switch (device) {
    case Device.fullhd:
      breakpoint = bulma.fullhd;
      break;
    case Device.widescreen:
      breakpoint = bulma.widescreen;
      break;
    case Device.desktop:
      breakpoint = bulma.desktop;
      break;
    case Device.tablet:
      breakpoint = bulma.tablet;
      break;
    case Device.mobile:
      breakpoint = bulma.mobile;
      break;
  }
  return css`
    @media screen and (min-width: ${breakpoint}) {
      ${style}
    }
  `;
}

export function until(device: DeviceTypeString, style: string) {
  let breakpoint = "";
  switch (device) {
    case Device.fullhd:
      breakpoint = bulma.fullhd;
      break;
    case Device.widescreen:
      breakpoint = bulma.widescreen;
      break;
    case Device.desktop:
      breakpoint = bulma.desktop;
      break;
    case Device.tablet:
      breakpoint = bulma.tablet;
      break;
    case Device.mobile:
      breakpoint = bulma.mobile;
      break;
  }
  return css`
    @media screen and (max-width: ${breakpoint}) {
      ${style}
    }
  `;
}

export function jsFrom(device: DeviceTypeString): boolean {
  let breakpoint = "";
  switch (device) {
    case Device.fullhd:
      breakpoint = bulma.fullhd;
      break;
    case Device.widescreen:
      breakpoint = bulma.widescreen;
      break;
    case Device.desktop:
      breakpoint = bulma.desktop;
      break;
    case Device.tablet:
      breakpoint = bulma.tablet;
      break;
    case Device.mobile:
      breakpoint = bulma.mobile;
      break;
  }
  return window.matchMedia(`(min-width: ${breakpoint})`).matches;
}

export function jsUntil(device: DeviceTypeString): boolean {
  let breakpoint = "";
  switch (device) {
    case Device.fullhd:
      breakpoint = bulma.fullhd;
      break;
    case Device.widescreen:
      breakpoint = bulma.widescreen;
      break;
    case Device.desktop:
      breakpoint = bulma.desktop;
      break;
    case Device.tablet:
      breakpoint = bulma.tablet;
      break;
    case Device.mobile:
      breakpoint = bulma.mobile;
      break;
  }
  return window.matchMedia(`(max-width: ${breakpoint})`).matches;
}
