import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import '@rainbow-me/rainbowkit/styles.css';

import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);