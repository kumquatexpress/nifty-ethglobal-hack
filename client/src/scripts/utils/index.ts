import detectEthereumProvider from "@metamask/detect-provider";
import { RGBAColor } from "scripts/types";

export async function isMetaMaskInstalled() {
  const provider = await detectEthereumProvider();
  return Boolean(provider);
}

export function RGBAColorToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

const uncommonRatio = 3 / 4;
const rareRatio = (1 - uncommonRatio) * 0.5 + uncommonRatio;
const legendaryRatio = 1 - rareRatio;

export function getPercentagesBasedOffCommon(percentCommon: number) {
  const percentUncommon = (100 - percentCommon) * uncommonRatio || 0;
  const percentRare = (100 - percentCommon - percentUncommon) * rareRatio || 0;
  const percentLegendary =
    (100 - percentCommon - percentUncommon) * legendaryRatio || 0;
  return {
    percentCommon,
    percentUncommon,
    percentRare,
    percentLegendary,
  };
}
