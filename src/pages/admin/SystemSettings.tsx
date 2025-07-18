import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Textarea } from '../../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { 
  Settings, 
  DollarSign, 
  Shield, 
  Globe, 
  Bell, 
  Database,
  Save,
  AlertTriangle,
  CheckCircle,
  Wrench
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

interface SystemSetting {
  key: string
  value: string
  description: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea'
  options?: string[]
}

export function SystemSettings() {
  const [settings, setSettings] = useState<Record<string, SystemSetting>>({
    platform_fee_percentage: {
      key: 'platform_fee_percentage',
      value: '2.5',
      description: 'Platform fee percentage for transactions',
      type: 'number'
    },
    min_order_amount: {
      key: 'min_order_amount',
      value: '10',
      description: 'Minimum order amount in USD',
      type: 'number'
    },
    max_order_amount: {
      key: 'max_order_amount',
      value: '10000',
      description: 'Maximum order amount in USD',
      type: 'number'
    },
    kyc_required: {
      key: 'kyc_required',
      value: 'true',
      description: 'Whether KYC verification is required for trading',
      type: 'boolean'
    },
    maintenance_mode: {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Enable maintenance mode to restrict platform access',
      type: 'boolean'
    },
    auto_match_orders: {
      key: 'auto_match_orders',
      value: 'true',
      description: 'Automatically match compatible buy/sell orders',
      type: 'boolean'
    },
    max_daily_volume: {
      key: 'max_daily_volume',
      value: '50000',
      description: 'Maximum daily trading volume per user in USD',
      type: 'number'
    },
    supported_currencies: {
      key: 'supported_currencies',
      value: 'USD,EUR,GBP,CAD,AUD,JPY,CNY,INR',
      description: 'Comma-separated list of supported currencies',
      type: 'textarea'
    },
    email_notifications: {
      key: 'email_notifications',
      value: 'true',
      description: 'Enable email notifications for users',
      type: 'boolean'
    },
    dispute_timeout_hours: {
      key: 'dispute_timeout_hours',
      value: '72',
      description: 'Hours before a transaction can be disputed',
      type: 'number'
    }
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setHasChanges(false)
    console.log('Settings saved:', settings)
  }

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value === 'true'}
            onCheckedChange={(checked) => updateSetting(setting.key, checked.toString())}
          />
        )
      case 'textarea':
        return (
          <Textarea
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            placeholder={setting.description}
            rows={3}
          />
        )
      case 'select':
        return (
          <Select value={setting.value} onValueChange={(value) => updateSetting(setting.key, value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            type={setting.type}
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            placeholder={setting.description}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and parameters</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Trading Settings
              </CardTitle>
              <CardDescription>
                Configure trading parameters and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform_fee">Platform Fee (%)</Label>
                  {renderSettingInput(settings.platform_fee_percentage)}
                  <p className="text-sm text-gray-500">{settings.platform_fee_percentage.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto_match">Auto Match Orders</Label>
                  <div className="flex items-center space-x-2">
                    {renderSettingInput(settings.auto_match_orders)}
                    <span className="text-sm text-gray-600">
                      {settings.auto_match_orders.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{settings.auto_match_orders.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_order">Minimum Order Amount (USD)</Label>
                  {renderSettingInput(settings.min_order_amount)}
                  <p className="text-sm text-gray-500">{settings.min_order_amount.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_order">Maximum Order Amount (USD)</Label>
                  {renderSettingInput(settings.max_order_amount)}
                  <p className="text-sm text-gray-500">{settings.max_order_amount.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_daily">Max Daily Volume per User (USD)</Label>
                  {renderSettingInput(settings.max_daily_volume)}
                  <p className="text-sm text-gray-500">{settings.max_daily_volume.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispute_timeout">Dispute Timeout (Hours)</Label>
                  {renderSettingInput(settings.dispute_timeout_hours)}
                  <p className="text-sm text-gray-500">{settings.dispute_timeout_hours.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and verification requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">KYC Verification Required</h4>
                    <p className="text-sm text-gray-500">{settings.kyc_required.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderSettingInput(settings.kyc_required)}
                    <Badge variant={settings.kyc_required.value === 'true' ? 'default' : 'secondary'}>
                      {settings.kyc_required.value === 'true' ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 mb-4">Require 2FA for all admin accounts</p>
                  <div className="flex items-center space-x-2">
                    <Switch checked={true} disabled />
                    <span className="text-sm text-gray-600">Enabled (Required)</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Session Timeout</h4>
                  <p className="text-sm text-gray-500 mb-4">Automatic logout after inactivity</p>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">{settings.email_notifications.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderSettingInput(settings.email_notifications)}
                    <Badge variant={settings.email_notifications.value === 'true' ? 'default' : 'secondary'}>
                      {settings.email_notifications.value === 'true' ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Admin Alert Thresholds</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="dispute_threshold">Dispute Alert Threshold</Label>
                      <Input type="number" defaultValue="5" placeholder="Number of disputes" />
                    </div>
                    <div>
                      <Label htmlFor="volume_threshold">High Volume Alert (USD)</Label>
                      <Input type="number" defaultValue="100000" placeholder="Volume threshold" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Alerts</span>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Alerts</span>
                      <Switch checked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slack Integration</span>
                      <Switch checked={false} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Currency Settings
              </CardTitle>
              <CardDescription>
                Manage supported currencies and exchange rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supported_currencies">Supported Currencies</Label>
                  {renderSettingInput(settings.supported_currencies)}
                  <p className="text-sm text-gray-500 mt-1">{settings.supported_currencies.description}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">Exchange Rate Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rate_provider">Rate Provider</Label>
                      <Select defaultValue="fixer">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixer">Fixer.io</SelectItem>
                          <SelectItem value="exchangerate">ExchangeRate-API</SelectItem>
                          <SelectItem value="currencylayer">CurrencyLayer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="update_frequency">Update Frequency</Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Rate Spread Settings</h4>
                  <p className="text-sm text-gray-500 mb-4">Additional spread added to market rates</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="buy_spread">Buy Spread (%)</Label>
                      <Input type="number" defaultValue="0.5" step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="sell_spread">Sell Spread (%)</Label>
                      <Input type="number" defaultValue="0.5" step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="max_spread">Max Spread (%)</Label>
                      <Input type="number" defaultValue="2.0" step="0.1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>
                Platform maintenance and system configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500">{settings.maintenance_mode.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderSettingInput(settings.maintenance_mode)}
                    <Badge variant={settings.maintenance_mode.value === 'true' ? 'destructive' : 'default'}>
                      {settings.maintenance_mode.value === 'true' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Database Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Backup</span>
                      <div className="flex items-center space-x-2">
                        <Switch checked={true} />
                        <Badge variant="default">Daily</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Query Logging</span>
                      <Switch checked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Performance Monitoring</span>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rate_limit">Rate Limit (requests/minute)</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">System Health</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Database: Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API: Healthy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Cache: Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}