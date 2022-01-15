import detectEthereumProvider from "@metamask/detect-provider";
import { RGBAColor } from "scripts/types";

export async function isMetaMaskInstalled() {
  const provider = await detectEthereumProvider();
  return Boolean(provider);
}

export function RGBAColorToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
