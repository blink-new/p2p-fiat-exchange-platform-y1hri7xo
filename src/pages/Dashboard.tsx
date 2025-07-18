import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight,
  DollarSign,
  Euro,
  PoundSterling
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'

export function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [walletBalances] = useState([
    { currency: 'USD', balance: 1250.50, symbol: '$', icon: DollarSign },
    { currency: 'EUR', balance: 890.25, symbol: '€', icon: Euro },
    { currency: 'GBP', balance: 650.75, symbol: '£', icon: PoundSterling },
  ])

  const [recentOrders] = useState([
    {
      id: '1',
      type: 'buy',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 500,
      rate: 0.85,
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'sell',
      fromCurrency: 'GBP',
      toCurrency: 'USD',
      amount: 300,
      rate: 1.25,
      status: 'completed',
      createdAt: '2024-01-14T15:45:00Z'
    }
  ])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.displayName || 'User'}!</h1>
        <p className="text-blue-100">Manage your currency exchanges and track your portfolio</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={() => navigate('/create-order')}
          className="h-16 bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Order
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketplace')}
          className="h-16"
        >
          <ArrowUpRight className="mr-2 h-5 w-5" />
          Browse Marketplace
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/wallet')}
          className="h-16"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Manage Wallet
        </Button>
      </div>

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {walletBalances.map((balance) => (
          <Card key={balance.currency}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {balance.currency} Balance
              </CardTitle>
              <balance.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balance.symbol}{balance.balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for trading
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    order.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {order.type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {order.type.toUpperCase()} {order.fromCurrency} → {order.toCurrency}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: {order.amount} {order.fromCurrency} @ {order.rate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/marketplace')}>
            View All Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}