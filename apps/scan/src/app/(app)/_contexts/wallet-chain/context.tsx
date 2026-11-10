'use client';

import { createContext } from 'react';

import type { SupportedWalletChain } from '@/types/chain';

interface WalletChainContextType {
  chain: SupportedWalletChain;
  setChain: (chain: SupportedWalletChain) => void;
  isFixed: boolean;
}

export const WalletChainContext = createContext<
  WalletChainContextType | undefined
>(undefined);
