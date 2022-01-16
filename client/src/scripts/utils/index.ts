import detectEthereumProvider from "@metamask/detect-provider";
import { RGBAColor } from "scripts/types";
import { APIClient } from "@utils/api_client";

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

export async function startLivestream(
  name: string,
  collectionIds: string[]
): Promise<any> {
  const profiles = [
    {
      name: "720p",
      bitrate: 2000000,
      fps: 30,
      width: 1280,
      height: 720,
    },
    {
      name: "480p",
      bitrate: 1000000,
      fps: 30,
      width: 854,
      height: 480,
    },
    {
      name: "360p",
      bitrate: 500000,
      fps: 30,
      width: 640,
      height: 360,
    },
  ];

  const resp = await APIClient().post("/livepeerStream", {
    name: name,
    profiles: profiles,
    collectionIds,
  });
  return resp.data;
}
