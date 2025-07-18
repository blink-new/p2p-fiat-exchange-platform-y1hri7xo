import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  CreditCard, 
  Building2,
  DollarSign,
  Euro,
  PoundSterling,
  History
} from 'lucide-react'

export function Wallet() {
  const [walletBalances] = useState([
    { currency: 'USD', balance: 1250.50, symbol: '$', icon: DollarSign },
    { currency: 'EUR', balance: 890.25, symbol: '€', icon: Euro },
    { currency: 'GBP', balance: 650.75, symbol: '£', icon: PoundSterling },
  ])

  const [bankAccounts] = useState([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      currency: 'USD',
      isVerified: true
    },
    {
      id: '2',
      bankName: 'HSBC',
      accountNumber: '****5678',
      currency: 'GBP',
      isVerified: true
    }
  ])

  const [transactions] = useState([
    {
      id: '1',
      type: 'deposit',
      amount: 500,
      currency: 'USD',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      description: 'Bank deposit from Chase'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 200,
      currency: 'EUR',
      status: 'pending',
      date: '2024-01-14T15:45:00Z',
      description: 'Withdrawal to HSBC'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <div className="flex space-x-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
          <Button variant="outline">
            <Minus className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {walletBalances.map((balance) => (
          <Card key={balance.currency} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {balance.currency} Wallet
              </CardTitle>
              <balance.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {balance.symbol}{balance.balance.toLocaleString()}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Minus className="mr-1 h-3 w-3" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="add-account">Add Account</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Linked Bank Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{account.bankName}</p>
                        <p className="text-sm text-gray-600">
                          {account.accountNumber} • {account.currency}
                        </p>
                      </div>
                    </div>
                    <Badge variant={account.isVerified ? 'default' : 'secondary'}>
                      {account.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <Plus className="h-5 w-5" /> : 
                          <Minus className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="font-medium capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {transaction.amount} {transaction.currency}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Add Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" placeholder="Enter bank name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="Enter account number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input id="routingNumber" placeholder="Enter routing number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input id="accountHolder" placeholder="Enter account holder name" />
              </div>
              <Button className="w-full">
                Add Bank Account
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Your account will be verified within 1-2 business days
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}