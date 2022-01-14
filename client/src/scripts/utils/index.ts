export function isMetaMaskInstalled() {
  // @ts-ignore
  return Boolean(ethereum && ethereum.isMetaMask);
}
