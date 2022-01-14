import { RGBAColor } from "scripts/types";
export function isMetaMaskInstalled() {
  // @ts-ignore
  return Boolean(ethereum && ethereum.isMetaMask);
}

export function RGBAColorToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
