import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Clock,
  User,
  Star,
  MessageCircle,
  DollarSign,
  Euro,
  PoundSterling,
  RefreshCw
} from 'lucide-react'

interface Order {
  id: string
  userId: string
  userName: string
  userRating: number
  type: 'buy' | 'sell'
  fromCurrency: string
  toCurrency: string
  amount: number
  rate: number
  totalAmount: number
  status: 'active' | 'matched' | 'completed'
  createdAt: string
  notes?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userRating: 4.8,
    type: 'sell',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: 1000,
    rate: 0.85,
    totalAmount: 850,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    notes: 'Quick transaction preferred'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userRating: 4.9,
    type: 'buy',
    fromCurrency: 'EUR',
    toCurrency: 'GBP',
    amount: 500,
    rate: 0.86,
    totalAmount: 430,
    status: 'active',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Chen',
    userRating: 4.7,
    type: 'sell',
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    amount: 750,
    rate: 1.37,
    totalAmount: 1027.5,
    status: 'active',
    createdAt: '2024-01-15T08:45:00Z',
    notes: 'Bank transfer only'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emma Wilson',
    userRating: 5.0,
    type: 'buy',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: 2000,
    rate: 0.84,
    totalAmount: 1680,
    status: 'active',
    createdAt: '2024-01-15T07:20:00Z'
  }
]

const currencies = ['USD', 'EUR', 'GBP']

const getCurrencyIcon = (currency: string) => {
  switch (currency) {
    case 'USD': return DollarSign
    case 'EUR': return Euro
    case 'GBP': return PoundSterling
    default: return DollarSign
  }
}

export function Marketplace() {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all')
  const [filterCurrency, setFilterCurrency] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'rate' | 'amount'>('newest')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Load active orders from database
      const activeOrders = await blink.db.orders.list({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        limit: 100
      })
      
      setOrders(activeOrders)
    } catch (error) {
      console.error('Failed to load orders:', error)
      // Fallback to mock data if database fails
      setOrders(mockOrders)
      toast({
        title: "Loading Error",
        description: "Using sample data. Some features may be limited.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Load user and orders
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        await loadOrders()
      }
    })
    return unsubscribe
  }, [loadOrders, toast])

  // Set up real-time order updates
  useEffect(() => {
    if (!user) return

    let unsubscribe: (() => void) | null = null

    const setupRealtime = async () => {
      try {
        unsubscribe = await blink.realtime.subscribe('marketplace-orders', (message) => {
          if (message.type === 'new-order') {
            const newOrder = message.data.order
            setOrders(prev => [newOrder, ...prev])
            
            toast({
              title: "New Order Available",
              description: message.data.message,
            })
          } else if (message.type === 'order-matched') {
            const { orderId, matchedBy } = message.data
            setOrders(prev => prev.map(order => 
              order.id === orderId 
                ? { ...order, status: 'matched' as const }
                : order
            ))
            
            if (matchedBy !== user.id) {
              toast({
                title: "Order Matched",
                description: "An order has been matched in the marketplace",
              })
            }
          }
        })
      } catch (error) {
        console.error('Failed to setup realtime:', error)
      }
    }

    setupRealtime()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [toast, user])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.toCurrency.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(order => order.type === filterType)
    }

    // Filter by currency
    if (filterCurrency !== 'all') {
      filtered = filtered.filter(order => 
        order.fromCurrency === filterCurrency || order.toCurrency === filterCurrency
      )
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'rate':
          return b.rate - a.rate
        case 'amount':
          return b.amount - a.amount
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, filterType, filterCurrency, sortBy])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Marketplace Updated",
      description: "Latest orders have been loaded",
    })
  }

  const handleMatchOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    toast({
      title: "Order Matched!",
      description: `You've been matched with ${order.userName} for ${order.amount} ${order.fromCurrency}`,
    })

    // Update order status
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'matched' as const } : o
    ))
  }

  const handleContactUser = (order: Order) => {
    toast({
      title: "Chat Initiated",
      description: `Starting conversation with ${order.userName}`,
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/create-order')}>
            Create Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: 'all' | 'buy' | 'sell') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="buy">Buy Orders</SelectItem>
                <SelectItem value="sell">Sell Orders</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCurrency} onValueChange={setFilterCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'newest' | 'rate' | 'amount') => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rate">Best Rate</SelectItem>
                <SelectItem value="amount">Highest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => {
          const FromIcon = getCurrencyIcon(order.fromCurrency)
          const ToIcon = getCurrencyIcon(order.toCurrency)
          
          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      order.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {order.type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <Badge variant={order.type === 'buy' ? 'default' : 'secondary'}>
                        {order.type.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {getTimeAgo(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{order.userName}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{order.userRating}</span>
                    </div>
                  </div>
                </div>

                {/* Exchange Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FromIcon className="h-4 w-4" />
                      <span className="font-medium">{order.amount} {order.fromCurrency}</span>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center space-x-2">
                      <ToIcon className="h-4 w-4" />
                      <span className="font-medium">{order.totalAmount} {order.toCurrency}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">Rate: {order.rate}</span>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Note:</strong> {order.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleMatchOrder(order.id)}
                    disabled={order.status !== 'active'}
                  >
                    {order.status === 'active' ? 'Match Order' : 'Matched'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleContactUser(order)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or create a new order to get started.
            </p>
            <Button onClick={() => navigate('/create-order')}>
              Create Your First Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}