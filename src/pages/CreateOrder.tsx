import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { 
  ArrowLeftRight, 
  Calculator, 
  Clock, 
  DollarSign,
  Euro,
  PoundSterling,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: DollarSign },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: PoundSterling },
]

const exchangeRates = {
  'USD-EUR': 0.85,
  'USD-GBP': 0.73,
  'EUR-USD': 1.18,
  'EUR-GBP': 0.86,
  'GBP-USD': 1.37,
  'GBP-EUR': 1.16,
}

export function CreateOrder() {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [user, setUser] = useState<any>(null)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [customRate, setCustomRate] = useState('')
  const [useMarketRate, setUseMarketRate] = useState(true)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const getCurrentRate = () => {
    if (!fromCurrency || !toCurrency) return 0
    const rateKey = `${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates
    return exchangeRates[rateKey] || 0
  }

  const getEffectiveRate = () => {
    return useMarketRate ? getCurrentRate() : parseFloat(customRate) || 0
  }

  const calculateTotal = () => {
    const rate = getEffectiveRate()
    const amountNum = parseFloat(amount) || 0
    return (amountNum * rate).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an order",
        variant: "destructive"
      })
      return
    }
    
    if (!fromCurrency || !toCurrency || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (fromCurrency === toCurrency) {
      toast({
        title: "Invalid Selection",
        description: "From and To currencies must be different",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const effectiveRate = getEffectiveRate()
      const totalAmount = parseFloat(calculateTotal())
      
      // Create order in database
      const orderData = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userEmail: user.email,
        type: orderType,
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
        rate: effectiveRate,
        totalAmount,
        status: 'active',
        notes: notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await blink.db.orders.create(orderData)
      
      // Publish real-time notification for new order
      await blink.realtime.publish('marketplace-orders', 'new-order', {
        order: orderData,
        message: `New ${orderType} order: ${amount} ${fromCurrency} → ${totalAmount} ${toCurrency}`
      })
      
      toast({
        title: "Order Created Successfully!",
        description: `Your ${orderType} order for ${amount} ${fromCurrency} has been posted to the marketplace.`,
      })
      
      navigate('/marketplace')
    } catch (error) {
      console.error('Order creation error:', error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
        <Badge variant="outline" className="text-sm">
          <Clock className="mr-1 h-3 w-3" />
          Market Open
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Order Type</Label>
                  <RadioGroup 
                    value={orderType} 
                    onValueChange={(value: 'buy' | 'sell') => setOrderType(value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="buy" />
                      <Label htmlFor="buy" className="flex items-center cursor-pointer">
                        <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                        Buy Currency
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell" id="sell" />
                      <Label htmlFor="sell" className="flex items-center cursor-pointer">
                        <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                        Sell Currency
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Currency Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromCurrency">From Currency</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center">
                              <currency.icon className="mr-2 h-4 w-4" />
                              {currency.code} - {currency.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toCurrency">To Currency</Label>
                    <div className="flex items-center space-x-2">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center">
                                <currency.icon className="mr-2 h-4 w-4" />
                                {currency.code} - {currency.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={swapCurrencies}
                        disabled={!fromCurrency || !toCurrency}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({fromCurrency || 'Currency'})</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-lg"
                  />
                </div>

                {/* Exchange Rate */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Exchange Rate</Label>
                  <RadioGroup 
                    value={useMarketRate ? 'market' : 'custom'} 
                    onValueChange={(value) => setUseMarketRate(value === 'market')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="market" id="market" />
                      <Label htmlFor="market" className="cursor-pointer">
                        Use Market Rate ({getCurrentRate().toFixed(4)})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">
                        Set Custom Rate
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {!useMarketRate && (
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder="Enter custom rate"
                    />
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or notes for potential traders..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Order...' : `Create ${orderType.toUpperCase()} Order`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <Badge variant={orderType === 'buy' ? 'default' : 'secondary'}>
                  {orderType.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{amount || '0'} {fromCurrency || '---'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{calculateTotal()} {toCurrency || '---'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{getEffectiveRate().toFixed(4)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{calculateTotal()} {toCurrency || '---'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Trading Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>• Set competitive rates to attract more traders</p>
              <p>• Market rates update in real-time</p>
              <p>• Orders are matched automatically when rates align</p>
              <p>• You can cancel active orders anytime</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}