import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useBalance,
  useSignMessage,
  useSendTransaction,
  useChainId,
  useSwitchChain
} from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const TARGET_CHAIN_ID = 11155111; // Sepolia
  const isWrongNetwork = chainId !== TARGET_CHAIN_ID;

  // 🔐 Signature
  const { signMessage, data: signature } = useSignMessage();
  const [localSignature, setLocalSignature] = useState(null);

  const [localTxHash, setLocalTxHash] = useState(null);

  // 💸 Transaction
  const {
    sendTransaction,
    data: txHash,
    isPending,
    isSuccess,
    isError,
    error
  } = useSendTransaction();

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  // 🔁 Track changes
  const prevAddress = useRef();

  const txToastRef = useRef(null);

  // 🔁 Account change
  useEffect(() => {
    if (prevAddress.current && prevAddress.current !== address) {
      toast.success("Wallet account changed!");

      setLocalSignature(null);
      setLocalTxHash(null);  
      setTo('');
      setAmount('');
    }

    prevAddress.current = address;
  }, [address]);

  // ✍️ Signature sync
  useEffect(() => {
    if (signature) {
      setLocalSignature(signature);
      toast.success("Message signed successfully");
    }
  }, [signature]);

  useEffect(() => {
  if (txHash) {
    setLocalTxHash(txHash);
  }
}, [txHash]);

  // 💸 Transaction lifecycle
  useEffect(() => {
    if (isSuccess || isError) {
      if (txToastRef.current) {
        toast.dismiss(txToastRef.current);
        txToastRef.current = null;
      }
    }
    if (isSuccess) {
      toast.success("Transaction sent!");
    }

    if (isError) {

      if (error?.message?.toLowerCase().includes("rejected")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error("Transaction failed");
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <div style={{ padding: 40 }}>
      <Toaster position="top-right" />

      <h1>Web3 Wallet Dashboard</h1>

      <ConnectButton />

      {/* 🚨 Wrong Network Warning */}
      {isConnected && isWrongNetwork && (
        <div
          style={{
            background: '#ff4d4f',
            color: 'white',
            padding: 15,
            marginTop: 20
          }}
        >
          ⚠️ You are on the wrong network

          <button
            onClick={() => {
              try {
                switchChain({ chainId: TARGET_CHAIN_ID });
              } catch (err) {
                toast.error("Failed to switch network");
              }
            }}
            style={{ marginLeft: 10 }}
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {isConnected && (
        <div style={{ marginTop: 20 }}>
          <p><b>Address:</b> {address}</p>
          <p><b>Balance:</b> {balance?.formatted} {balance?.symbol}</p>

          {/* 🔐 SIGN MESSAGE */}
          <button
            onClick={() => {
              if (isWrongNetwork) {
                setLocalTxHash(null);
                toast.error("Switch to Sepolia network");
                return;
              }

              signMessage({ message: 'Hello from Web3 Dashboard 👋' });
              toast("Signature request sent 👀");
            }}
            style={{ marginTop: 20 }}
            disabled={isWrongNetwork}
          >
            Sign Message
          </button>

          {localSignature && (
            <div style={{ marginTop: 10 }}>
              <p><b>Signature:</b></p>
              <p style={{ wordBreak: 'break-all' }}>{localSignature}</p>
            </div>
          )}

          {/* 💸 SEND TRANSACTION */}
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
              onClick={() => {
                if (isWrongNetwork) {
                  toast.error("Switch to Sepolia network");
                  return;
                }

                if (!to || !amount) {
                  toast.error("Enter valid address and amount");
                  return;
                }

                try {
                  sendTransaction({
                    to,
                    value: parseEther(amount),
                  });
                  txToastRef.current = toast.loading("Transaction pending...");
                } catch (err) {
                  toast.error("Transaction failed");
                }
              }}
              disabled={isPending || isWrongNetwork}
            >
              {isPending ? "Sending..." : "Send"}
            </button>

            {localTxHash && (
              <div style={{ marginTop: 10 }}>
                <p><b>Transaction Hash:</b> {localTxHash}</p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${localTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
                <p>🚀 Transaction submitted</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;