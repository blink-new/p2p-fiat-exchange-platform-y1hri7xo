import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

interface Order {
  id: string
  userId: string
  userEmail: string
  type: 'buy' | 'sell'
  fromCurrency: string
  toCurrency: string
  amount: number
  rate: number
  totalAmount: number
  status: 'active' | 'completed' | 'cancelled' | 'disputed'
  paymentMethod: string
  createdAt: string
  updatedAt: string
  matchedWith?: string
}

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      userId: '1',
      userEmail: 'john.doe@email.com',
      type: 'sell',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 1500,
      rate: 0.85,
      totalAmount: 1275,
      status: 'active',
      paymentMethod: 'Bank Transfer',
      createdAt: '2024-01-15 14:30',
      updatedAt: '2024-01-15 14:30'
    },
    {
      id: 'ORD-002',
      userId: '2',
      userEmail: 'jane.smith@email.com',
      type: 'buy',
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      amount: 2000,
      rate: 1.18,
      totalAmount: 2360,
      status: 'completed',
      paymentMethod: 'PayPal',
      createdAt: '2024-01-15 12:15',
      updatedAt: '2024-01-15 16:45',
      matchedWith: 'ORD-003'
    },
    {
      id: 'ORD-003',
      userId: '4',
      userEmail: 'sarah.jones@email.com',
      type: 'sell',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 2360,
      rate: 0.847,
      totalAmount: 2000,
      status: 'disputed',
      paymentMethod: 'Bank Transfer',
      createdAt: '2024-01-15 11:20',
      updatedAt: '2024-01-15 17:30',
      matchedWith: 'ORD-002'
    },
    {
      id: 'ORD-004',
      userId: '5',
      userEmail: 'alex.brown@email.com',
      type: 'buy',
      fromCurrency: 'GBP',
      toCurrency: 'USD',
      amount: 800,
      rate: 1.25,
      totalAmount: 1000,
      status: 'active',
      paymentMethod: 'Wise',
      createdAt: '2024-01-15 10:45',
      updatedAt: '2024-01-15 10:45'
    },
    {
      id: 'ORD-005',
      userId: '1',
      userEmail: 'john.doe@email.com',
      type: 'buy',
      fromCurrency: 'CAD',
      toCurrency: 'USD',
      amount: 1200,
      rate: 0.74,
      totalAmount: 888,
      status: 'cancelled',
      paymentMethod: 'Bank Transfer',
      createdAt: '2024-01-14 16:20',
      updatedAt: '2024-01-14 18:15'
    }
  ])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.toCurrency.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      case 'disputed':
        return <Badge className="bg-red-100 text-red-800">Disputed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const handleOrderAction = (orderId: string, action: string) => {
    console.log(`Performing ${action} on order ${orderId}`)
    // Here you would implement the actual order management actions
  }

  const orderStats = {
    total: orders.length,
    active: orders.filter(o => o.status === 'active').length,
    completed: orders.filter(o => o.status === 'completed').length,
    disputed: orders.filter(o => o.status === 'disputed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage currency exchange orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.disputed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order ID, user email, or currency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Manage currency exchange orders and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(order.type)}
                      <span className="capitalize">{order.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.fromCurrency} → {order.toCurrency}</div>
                      <div className="text-gray-500">{order.paymentMethod}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.amount.toLocaleString()} {order.fromCurrency}</div>
                      <div className="text-gray-500">{order.totalAmount.toLocaleString()} {order.toCurrency}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.rate}</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{order.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                            <DialogDescription>
                              View and manage order information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Order ID</label>
                                    <p className="text-sm">{selectedOrder.id}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">User</label>
                                    <p className="text-sm">{selectedOrder.userEmail}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <div className="flex items-center space-x-2">
                                      {getTypeIcon(selectedOrder.type)}
                                      <span className="text-sm capitalize">{selectedOrder.type}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    {getStatusBadge(selectedOrder.status)}
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">From Currency</label>
                                    <p className="text-sm">{selectedOrder.fromCurrency}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">To Currency</label>
                                    <p className="text-sm">{selectedOrder.toCurrency}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount</label>
                                    <p className="text-sm">{selectedOrder.amount.toLocaleString()} {selectedOrder.fromCurrency}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Exchange Rate</label>
                                    <p className="text-sm">{selectedOrder.rate}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Amount</label>
                                    <p className="text-sm">{selectedOrder.totalAmount.toLocaleString()} {selectedOrder.toCurrency}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <p className="text-sm">{selectedOrder.paymentMethod}</p>
                                  </div>
                                </div>
                                {selectedOrder.matchedWith && (
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900">Matched Order</h4>
                                    <p className="text-sm text-blue-700">This order is matched with {selectedOrder.matchedWith}</p>
                                  </div>
                                )}
                              </TabsContent>
                              <TabsContent value="timeline" className="space-y-4">
                                <div className="space-y-4">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                      <p className="text-sm font-medium">Order Created</p>
                                      <p className="text-xs text-gray-500">{selectedOrder.createdAt}</p>
                                    </div>
                                  </div>
                                  {selectedOrder.status === 'completed' && (
                                    <div className="flex items-start space-x-3">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                      <div>
                                        <p className="text-sm font-medium">Order Completed</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.updatedAt}</p>
                                      </div>
                                    </div>
                                  )}
                                  {selectedOrder.status === 'disputed' && (
                                    <div className="flex items-start space-x-3">
                                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                      <div>
                                        <p className="text-sm font-medium">Dispute Raised</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.updatedAt}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                              <TabsContent value="actions" className="space-y-4">
                                <div className="space-y-3">
                                  {selectedOrder.status === 'disputed' && (
                                    <>
                                      <Button 
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => handleOrderAction(selectedOrder.id, 'resolve_dispute')}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Resolve Dispute
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => handleOrderAction(selectedOrder.id, 'escalate_dispute')}
                                      >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Escalate Dispute
                                      </Button>
                                    </>
                                  )}
                                  {selectedOrder.status === 'active' && (
                                    <Button 
                                      variant="destructive" 
                                      className="w-full"
                                      onClick={() => handleOrderAction(selectedOrder.id, 'cancel')}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Order
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleOrderAction(selectedOrder.id, 'contact_user')}
                                  >
                                    Contact User
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'view_user')}>
                            View User Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'view_transactions')}>
                            View Transactions
                          </DropdownMenuItem>
                          {order.status === 'disputed' && (
                            <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'resolve_dispute')}>
                              Resolve Dispute
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}