'use client';

import { useState } from 'react';
import { WalletChainContext } from './context';

import { Chain } from '@/types/chain';

import type { ConnectedWallets } from '@/app/(app)/_hooks/use-connected-wallets';
import type { SupportedWalletChain } from '@/types/chain';

interface Props {
  children: React.ReactNode;
  connectedWallets?: ConnectedWallets;
  initialChain?: SupportedWalletChain;
  isFixed?: boolean;
}

export const WalletChainProvider: React.FC<Props> = ({
  children,
  connectedWallets,
  initialChain,
  isFixed = false,
}) => {
  const [chain, setChainState] = useState<SupportedWalletChain>(
    initialChain ??
      (!connectedWallets || connectedWallets.evmAddress
        ? Chain.BASE
        : Chain.SOLANA)
  );

  const setChain = (chain: SupportedWalletChain) => {
    setChainState(chain);
  };

  return (
    <WalletChainContext.Provider value={{ chain, setChain, isFixed }}>
      {children}
    </WalletChainContext.Provider>
  );
};
