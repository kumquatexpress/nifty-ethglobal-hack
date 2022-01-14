import { MachineData } from "./collections";

export function createMachine(data: MachineData): { machineAddress: string } {
  // TODO call create machine
  return {
    machineAddress: "",
  };
}
export function getTokensOwnedByAccount(address: string): string[] {
  // TODO call something to get the tokens for this public key
  return [];
}
export function getTokensFromMachine(address: string): string[] {
  // TODO call something to get the tokens for this machine
  return [];
}

export function getMetadataForToken(address: string): any {
  // TODO call something to get metadata for this NFT
  return {};
}
