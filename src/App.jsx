import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  useAccount, 
  useBalance, 
  useSignMessage, 
  useSendTransaction 
} from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';

function App() {
  const { address, isConnected } = useAccount();
  const { data } = useBalance({ address });

  const { signMessage, data: signature } = useSignMessage();

  const { sendTransaction, data: txHash } = useSendTransaction();

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div style={{ padding: 40 }}>
      <h1>Web3 Wallet Dashboard</h1>

      <ConnectButton />

      {isConnected && (
        <div style={{ marginTop: 20 }}>
          <p><b>Address:</b> {address}</p>
          <p><b>Balance:</b> {data?.formatted} {data?.symbol}</p>

          {/* SIGN MESSAGE */}
          <button
            onClick={() =>
              signMessage({ message: 'Hello from Web3 Dashboard 👋' })
            }
            style={{ marginTop: 20 }}
          >
            Sign Message
          </button>

          {signature && (
            <p style={{ wordBreak: 'break-all' }}>
              <b>Signature:</b> {signature}
            </p>
          )}

          {/* SEND TRANSACTION */}
          <div style={{ marginTop: 30 }}>
            <h3>Send ETH</h3>

            <input
              type="text"
              placeholder="Recipient Address"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ display: 'block', marginBottom: 10 }}
            />

            <input
              type="text"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ display: 'block', marginBottom: 10 }}
            />

            <button
              onClick={() =>
                sendTransaction({
                  to,
                  value: parseEther(amount || '0'),
                })
              }
            >
              Send
            </button>

            {txHash && (
              <p style={{ marginTop: 10 }}>
                <b>Transaction Hash:</b> {txHash}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;