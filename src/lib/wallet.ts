import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Neon Secrecy Farm',
  projectId: '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia],
  ssr: false,
});

export const chainId = 11155111; // Sepolia
export const rpcUrl = 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990';
