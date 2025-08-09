import React from 'react'
import { Wallet, Copy, ExternalLink, RefreshCw } from 'lucide-react'
import Button from './Button'
import GlassCard from './GlassCard'
import { useWallet } from '../hooks/useWallet'

interface WalletConnectProps {
  onTransactionClick: () => void
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onTransactionClick }) => {
  const { wallet, error, connectWallet, disconnectWallet, refreshBalance, clearError } = useWallet()

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet'
      case 11155111: return 'Sepolia Testnet'
      case 137: return 'Polygon Mainnet'
      case 80001: return 'Polygon Mumbai'
      default: return `Chain ID: ${chainId}`
    }
  }

  if (!wallet.isConnected) {
    return (
      <GlassCard>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start sending transactions
          </p>

          {error && (
            <div className="bg-red-100/80 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
              <button 
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-xs mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          <Button 
            onClick={connectWallet}
            isLoading={wallet.isConnecting}
            className="w-full"
          >
            {wallet.isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Make sure you have MetaMask installed in your browser
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Wallet Connected</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Address</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyAddress}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://etherscan.io/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <p className="font-mono text-sm text-gray-800">
              {wallet.address && formatAddress(wallet.address)}
            </p>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Balance</span>
              <button
                onClick={refreshBalance}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
            </p>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <span className="text-sm text-gray-600">Network</span>
            <p className="text-sm font-medium text-gray-800">
              {wallet.chainId ? getNetworkName(wallet.chainId) : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onTransactionClick} className="w-full">
            Send Transaction
          </Button>
          
          <Button 
            onClick={disconnectWallet}
            variant="secondary"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

export default WalletConnect
