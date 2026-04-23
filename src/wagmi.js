import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Wallet Dashboard',
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [sepolia],
});