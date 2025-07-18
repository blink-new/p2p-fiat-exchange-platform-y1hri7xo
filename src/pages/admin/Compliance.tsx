import React, { useState } from 'react'
import { Shield, AlertTriangle, Download, Settings, FileText, Users, Eye, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ComplianceAlert {
  id: string
  type: 'aml' | 'kyc' | 'transaction' | 'suspicious'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  userId?: string
  transactionId?: string
  timestamp: string
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
}

interface ComplianceMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'thresholds' | 'reports' | 'alerts'>('monitoring')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  const complianceMetrics: ComplianceMetric[] = [
    { label: 'Suspicious Transactions', value: '23', change: '-12%', trend: 'down', status: 'good' },
    { label: 'AML Alerts', value: '8', change: '+3%', trend: 'up', status: 'warning' },
    { label: 'KYC Pending', value: '156', change: '+8%', trend: 'up', status: 'warning' },
    { label: 'Compliance Score', value: '94.2%', change: '+2.1%', trend: 'up', status: 'good' },
    { label: 'CTR Filed', value: '12', change: '0%', trend: 'stable', status: 'good' },
    { label: 'SAR Filed', value: '3', change: '+1', trend: 'up', status: 'critical' }
  ]

  const recentAlerts: ComplianceAlert[] = [
    {
      id: 'alert-001',
      type: 'transaction',
      severity: 'high',
      title: 'Large Transaction Alert',
      description: 'Transaction exceeds $10,000 threshold',
      userId: 'user-123',
      transactionId: 'tx-456',
      timestamp: '2024-01-18T10:30:00Z',
      status: 'investigating'
    },
    {
      id: 'alert-002',
      type: 'aml',
      severity: 'critical',
      title: 'Potential Money Laundering',
      description: 'Rapid succession of transactions with pattern matching',
      userId: 'user-789',
      timestamp: '2024-01-18T09:15:00Z',
      status: 'open'
    },
    {
      id: 'alert-003',
      type: 'kyc',
      severity: 'medium',
      title: 'KYC Document Expired',
      description: 'User ID document requires renewal',
      userId: 'user-456',
      timestamp: '2024-01-18T08:45:00Z',
      status: 'open'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'investigating': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const downloadReport = (reportType: string) => {
    // Simulate report download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`
    link.click()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600">Monitor transactions, manage thresholds, and generate regulatory reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {complianceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-full ${
                metric.status === 'good' ? 'bg-green-100' :
                metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`w-4 h-4 ${
                  metric.status === 'good' ? 'text-green-600' :
                  metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'monitoring', label: 'Transaction Monitoring', icon: Eye },
            { id: 'thresholds', label: 'Threshold Settings', icon: Settings },
            { id: 'reports', label: 'Regulatory Reports', icon: FileText },
            { id: 'alerts', label: 'Compliance Alerts', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Transaction Monitoring</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monitoring Rules */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Active Monitoring Rules</h4>
                <div className="space-y-3">
                  {[
                    { rule: 'Large Transaction Detection', threshold: '$10,000+', status: 'active' },
                    { rule: 'Velocity Monitoring', threshold: '5+ transactions/hour', status: 'active' },
                    { rule: 'Cross-border Tracking', threshold: 'All international', status: 'active' },
                    { rule: 'Suspicious Pattern Detection', threshold: 'ML Algorithm', status: 'active' },
                    { rule: 'PEP Screening', threshold: 'All users', status: 'active' }
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{rule.rule}</p>
                        <p className="text-sm text-gray-600">{rule.threshold}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {rule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Flagged Transactions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recently Flagged Transactions</h4>
                <div className="space-y-3">
                  {[
                    { id: 'TX001', amount: '$15,000', user: 'john.doe@email.com', flag: 'Large Amount', time: '2 min ago' },
                    { id: 'TX002', amount: '$8,500', user: 'jane.smith@email.com', flag: 'Velocity', time: '5 min ago' },
                    { id: 'TX003', amount: '$12,000', user: 'bob.wilson@email.com', flag: 'Cross-border', time: '8 min ago' }
                  ].map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{tx.id}</p>
                        <p className="text-sm text-gray-600">{tx.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{tx.amount}</p>
                        <p className="text-xs text-red-600">{tx.flag}</p>
                        <p className="text-xs text-gray-500">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Thresholds</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AML Thresholds */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">AML Thresholds</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CTR Threshold (Currency Transaction Report)
                    </label>
                    <input
                      type="number"
                      defaultValue="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">USD equivalent for single transaction</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SAR Threshold (Suspicious Activity Report)
                    </label>
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">USD equivalent for suspicious patterns</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Transaction Limit
                    </label>
                    <input
                      type="number"
                      defaultValue="50000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum daily volume per user</p>
                  </div>
                </div>
              </div>

              {/* KYC Thresholds */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">KYC Requirements</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Basic KYC Threshold
                    </label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum transaction requiring basic KYC</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enhanced KYC Threshold
                    </label>
                    <input
                      type="number"
                      defaultValue="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum transaction requiring enhanced KYC</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Expiry Alert (days)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days before document expiry to alert</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Thresholds
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Reports</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Reports */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Reports</h4>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'Currency Transaction Report (CTR)', 
                      description: 'Transactions over $10,000',
                      frequency: 'Daily',
                      lastGenerated: '2024-01-18 09:00'
                    },
                    { 
                      name: 'Suspicious Activity Report (SAR)', 
                      description: 'Flagged suspicious transactions',
                      frequency: 'As needed',
                      lastGenerated: '2024-01-17 14:30'
                    },
                    { 
                      name: 'Cross-border Report', 
                      description: 'International transactions',
                      frequency: 'Weekly',
                      lastGenerated: '2024-01-15 10:00'
                    },
                    { 
                      name: 'KYC Compliance Report', 
                      description: 'User verification status',
                      frequency: 'Monthly',
                      lastGenerated: '2024-01-01 08:00'
                    },
                    { 
                      name: 'Transaction Volume Report', 
                      description: 'Platform transaction statistics',
                      frequency: 'Monthly',
                      lastGenerated: '2024-01-01 08:00'
                    }
                  ].map((report, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{report.name}</h5>
                        <button
                          onClick={() => downloadReport(report.name.toLowerCase().replace(/\s+/g, '_'))}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Frequency: {report.frequency}</span>
                        <span>Last: {report.lastGenerated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Generation */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Generate Custom Report</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Transaction Summary</option>
                      <option>User Activity</option>
                      <option>Compliance Violations</option>
                      <option>Risk Assessment</option>
                      <option>Audit Trail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>PDF</option>
                      <option>Excel (XLSX)</option>
                      <option>CSV</option>
                      <option>JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filters</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Include flagged transactions only</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Cross-border transactions only</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">High-risk users only</span>
                      </label>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Alerts</option>
                  <option>Open</option>
                  <option>Investigating</option>
                  <option>Resolved</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Severity</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(alert.status)}
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {alert.userId && <span>User: {alert.userId}</span>}
                        {alert.transactionId && <span>Transaction: {alert.transactionId}</span>}
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Compliance