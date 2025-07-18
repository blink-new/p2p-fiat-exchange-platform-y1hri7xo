export interface User {
  id: string
  email: string
  displayName?: string
  isVerified: boolean
  kycStatus: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface WalletBalance {
  currency: string
  balance: number
  symbol: string
}

export interface Order {
  id: string
  userId: string
  type: 'buy' | 'sell'
  fromCurrency: string
  toCurrency: string
  amount: number
  rate: number
  totalAmount: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  orderId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}