import React, { useState } from 'react'
import { Send, ArrowLeft, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import GlassCard from './GlassCard'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'

interface TransactionFormProps {
  onBack: () => void
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onBack }) => {
  const { wallet, sendTransaction, refreshBalance } = useWallet()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    hash: string
    amount: string
    recipient: string
  } | null>(null)

  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address)
    } catch {
      return false
    }
  }

  const validateAmount = (amount: string) => {
    try {
      const parsed = parseFloat(amount)
      return parsed > 0 && parsed <= parseFloat(wallet.balance || '0')
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!validateAddress(recipientAddress)) {
      setError('Please enter a valid Ethereum address')
      return
    }

    if (!validateAmount(amount)) {
      setError('Please enter a valid amount (must be greater than 0 and not exceed your balance)')
      return
    }

    if (recipientAddress.toLowerCase() === wallet.address?.toLowerCase()) {
      setError('Cannot send transaction to yourself')
      return
    }

    setIsLoading(true)

    try {
      const tx = await sendTransaction(recipientAddress, amount)
      
      setSuccess({
        hash: tx.hash,
        amount,
        recipient: recipientAddress
      })

      // Clear form
      setRecipientAddress('')
      setAmount('')
      
      // Refresh balance after a short delay
      setTimeout(() => {
        refreshBalance()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (success) {
    return (
      <GlassCard>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Sent!</h2>
          <p className="text-gray-600 mb-6">
            Your transaction has been submitted to the network
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white/20 rounded-lg p-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Transaction Hash</span>
                <a
                  href={`https://etherscan.io/tx/${success.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="font-mono text-sm text-gray-800 break-all">
                {success.hash}
              </p>
            </div>

            <div className="bg-white/20 rounded-lg p-4 text-left">
              <span className="text-sm text-gray-600">Amount Sent</span>
              <p className="text-lg font-semibold text-gray-800">
                {success.amount} ETH
              </p>
            </div>

            <div className="bg-white/20 rounded-lg p-4 text-left">
              <span className="text-sm text-gray-600">Recipient</span>
              <p className="font-mono text-sm text-gray-800">
                {formatAddress(success.recipient)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setSuccess(null)}
              className="w-full"
            >
              Send Another Transaction
            </Button>
            
            <Button 
              onClick={onBack}
              variant="secondary"
              className="w-full"
            >
              Back to Wallet
            </Button>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wallet
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Transaction</h2>
          <p className="text-gray-600">
            Send ETH to another wallet address
          </p>
        </div>
      </div>

      <div className="bg-white/20 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Available Balance</span>
          <span className="text-lg font-semibold text-gray-800">
            {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100/80 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className={`${
              recipientAddress && !validateAddress(recipientAddress) 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' 
                : ''
            }`}
            required
          />
          {recipientAddress && !validateAddress(recipientAddress) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid Ethereum address</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <Input
            type="number"
            step="0.0001"
            min="0"
            max={wallet.balance || '0'}
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${
              amount && !validateAmount(amount) 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' 
                : ''
            }`}
            required
          />
          {amount && !validateAmount(amount) && (
            <p className="text-red-500 text-xs mt-1">
              Amount must be greater than 0 and not exceed your balance
            </p>
          )}
          
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setAmount((parseFloat(wallet.balance || '0') * 0.25).toString())}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => setAmount((parseFloat(wallet.balance || '0') * 0.5).toString())}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setAmount((parseFloat(wallet.balance || '0') * 0.75).toString())}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => setAmount((parseFloat(wallet.balance || '0') * 0.95).toString())}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Max
            </button>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!recipientAddress || !amount || !validateAddress(recipientAddress) || !validateAmount(amount)}
          className="w-full"
        >
          {isLoading ? 'Sending Transaction...' : 'Send Transaction'}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-yellow-100/80 border border-yellow-300 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Important:</strong> Double-check the recipient address before sending. 
          Transactions on the blockchain are irreversible.
        </p>
      </div>
    </GlassCard>
  )
}

export default TransactionForm
