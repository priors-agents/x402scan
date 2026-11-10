import { base, optimism, polygon } from 'wagmi/chains';

export enum Chain {
  BASE = 'base',
  SOLANA = 'solana',
  POLYGON = 'polygon',
  OPTIMISM = 'optimism',
  ROBINHOOD = 'robinhood',
}

export const SUPPORTED_CHAINS = [
  Chain.BASE,
  Chain.SOLANA,
  Chain.ROBINHOOD,
] as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

// Chains the embedded and server wallets can hold funds and pay on. Other
// supported chains are registered and listed, but not payable from x402scan.
export const SUPPORTED_WALLET_CHAINS = [Chain.BASE, Chain.SOLANA] as const;

export type SupportedWalletChain = (typeof SUPPORTED_WALLET_CHAINS)[number];

export type SupportedEVMChain = Exclude<SupportedWalletChain, Chain.SOLANA>;

export const CHAIN_LABELS = {
  [Chain.BASE]: 'Base',
  [Chain.SOLANA]: 'Solana',
  [Chain.POLYGON]: 'Polygon',
  [Chain.OPTIMISM]: 'Optimism',
  [Chain.ROBINHOOD]: 'Robinhood Chain',
} satisfies Record<Chain, string>;

export const CHAIN_ICONS = {
  [Chain.BASE]: '/base.png',
  [Chain.SOLANA]: '/solana.png',
  [Chain.POLYGON]: '/polygon.png',
  [Chain.OPTIMISM]: '/optimism.png',
  [Chain.ROBINHOOD]: '/robinhood.png',
} satisfies Record<Chain, string>;

export const CHAIN_ID = {
  [Chain.BASE]: base.id,
  [Chain.POLYGON]: polygon.id,
  [Chain.OPTIMISM]: optimism.id,
  [Chain.SOLANA]: 0,
  [Chain.ROBINHOOD]: 4663,
} satisfies Record<Chain, number>;
