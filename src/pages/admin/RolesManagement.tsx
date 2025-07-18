import React, { useState } from 'react'
import { Users, Shield, Edit, Trash2, Plus, Eye, Settings, UserCheck, UserX, Crown, Key } from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
  isSystem: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
}

interface Permission {
  id: string
  name: string
  category: string
  description: string
}

const RolesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles')
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showEditRole, setShowEditRole] = useState<string | null>(null)

  const roles: Role[] = [
    {
      id: 'role-1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 2,
      createdAt: '2024-01-01',
      isSystem: true
    },
    {
      id: 'role-2',
      name: 'Compliance Officer',
      description: 'Access to compliance monitoring, reporting, and investigations',
      permissions: ['compliance.view', 'compliance.investigate', 'reports.generate', 'users.view'],
      userCount: 5,
      createdAt: '2024-01-01',
      isSystem: false
    },
    {
      id: 'role-3',
      name: 'Operations Manager',
      description: 'Manage day-to-day operations, user support, and order management',
      permissions: ['orders.manage', 'users.manage', 'support.access', 'analytics.view'],
      userCount: 8,
      createdAt: '2024-01-01',
      isSystem: false
    },
    {
      id: 'role-4',
      name: 'Customer Support',
      description: 'Handle customer inquiries and basic account management',
      permissions: ['users.view', 'orders.view', 'support.access', 'tickets.manage'],
      userCount: 12,
      createdAt: '2024-01-01',
      isSystem: false
    },
    {
      id: 'role-5',
      name: 'Risk Analyst',
      description: 'Monitor transactions for risk and fraud detection',
      permissions: ['transactions.monitor', 'risk.assess', 'alerts.manage', 'reports.view'],
      userCount: 3,
      createdAt: '2024-01-01',
      isSystem: false
    },
    {
      id: 'role-6',
      name: 'Auditor',
      description: 'Read-only access for audit and compliance review',
      permissions: ['audit.view', 'reports.view', 'logs.view'],
      userCount: 2,
      createdAt: '2024-01-01',
      isSystem: false
    }
  ]

  const users: User[] = [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john.smith@peersfx.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-01-18T10:30:00Z',
      createdAt: '2024-01-01'
    },
    {
      id: 'user-2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@peersfx.com',
      role: 'Compliance Officer',
      status: 'active',
      lastLogin: '2024-01-18T09:15:00Z',
      createdAt: '2024-01-02'
    },
    {
      id: 'user-3',
      name: 'Mike Wilson',
      email: 'mike.wilson@peersfx.com',
      role: 'Operations Manager',
      status: 'active',
      lastLogin: '2024-01-18T08:45:00Z',
      createdAt: '2024-01-03'
    },
    {
      id: 'user-4',
      name: 'Lisa Chen',
      email: 'lisa.chen@peersfx.com',
      role: 'Customer Support',
      status: 'active',
      lastLogin: '2024-01-17T16:20:00Z',
      createdAt: '2024-01-05'
    },
    {
      id: 'user-5',
      name: 'David Brown',
      email: 'david.brown@peersfx.com',
      role: 'Risk Analyst',
      status: 'inactive',
      lastLogin: '2024-01-15T14:10:00Z',
      createdAt: '2024-01-10'
    }
  ]

  const permissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', category: 'User Management', description: 'View user profiles and information' },
    { id: 'users.manage', name: 'Manage Users', category: 'User Management', description: 'Create, edit, suspend, and delete users' },
    { id: 'users.kyc', name: 'KYC Management', category: 'User Management', description: 'Review and approve KYC documents' },
    
    // Order Management
    { id: 'orders.view', name: 'View Orders', category: 'Order Management', description: 'View all platform orders' },
    { id: 'orders.manage', name: 'Manage Orders', category: 'Order Management', description: 'Cancel, modify, and resolve order disputes' },
    
    // Compliance
    { id: 'compliance.view', name: 'View Compliance', category: 'Compliance', description: 'Access compliance dashboard and metrics' },
    { id: 'compliance.investigate', name: 'Investigate Alerts', category: 'Compliance', description: 'Investigate and resolve compliance alerts' },
    { id: 'compliance.configure', name: 'Configure Compliance', category: 'Compliance', description: 'Modify compliance thresholds and rules' },
    
    // Reporting
    { id: 'reports.view', name: 'View Reports', category: 'Reporting', description: 'Access and view generated reports' },
    { id: 'reports.generate', name: 'Generate Reports', category: 'Reporting', description: 'Create and download regulatory reports' },
    
    // Analytics
    { id: 'analytics.view', name: 'View Analytics', category: 'Analytics', description: 'Access platform analytics and metrics' },
    
    // System
    { id: 'system.settings', name: 'System Settings', category: 'System', description: 'Modify system configuration and settings' },
    { id: 'audit.view', name: 'View Audit Logs', category: 'System', description: 'Access system audit logs' },
    
    // Support
    { id: 'support.access', name: 'Customer Support', category: 'Support', description: 'Access customer support tools' },
    { id: 'tickets.manage', name: 'Manage Tickets', category: 'Support', description: 'Create and resolve support tickets' },
    
    // Risk Management
    { id: 'transactions.monitor', name: 'Monitor Transactions', category: 'Risk Management', description: 'Monitor transactions for suspicious activity' },
    { id: 'risk.assess', name: 'Risk Assessment', category: 'Risk Management', description: 'Assess and score user and transaction risk' },
    { id: 'alerts.manage', name: 'Manage Alerts', category: 'Risk Management', description: 'Handle risk and compliance alerts' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'suspended': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super admin': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'compliance officer': return <Shield className="w-4 h-4 text-blue-600" />
      case 'operations manager': return <Settings className="w-4 h-4 text-purple-600" />
      case 'customer support': return <Users className="w-4 h-4 text-green-600" />
      case 'risk analyst': return <Eye className="w-4 h-4 text-orange-600" />
      case 'auditor': return <UserCheck className="w-4 h-4 text-gray-600" />
      default: return <Key className="w-4 h-4 text-gray-600" />
    }
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles, permissions, and access control</p>
        </div>
        <button
          onClick={() => setShowCreateRole(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'roles', label: 'Roles', icon: Shield },
            { id: 'users', label: 'User Assignments', icon: Users },
            { id: 'permissions', label: 'Permissions', icon: Key }
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
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(role.name)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      {role.isSystem && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">System Role</span>
                      )}
                    </div>
                  </div>
                  {!role.isSystem && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setShowEditRole(role.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Users assigned:</span>
                    <span className="font-medium text-gray-900">{role.userCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Permissions:</span>
                    <span className="font-medium text-gray-900">
                      {role.permissions.includes('all') ? 'All' : role.permissions.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Role Assignments</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Roles</option>
                    {roles.map(role => (
                      <option key={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className="text-sm text-gray-900">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit Role</button>
                          <button className="text-red-600 hover:text-red-900">
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Permissions</h3>
            
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{permission.name}</h5>
                          <Key className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
                        <div className="text-xs text-gray-500">
                          Permission ID: <code className="bg-gray-100 px-1 rounded">{permission.id}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Role</h3>
              <button
                onClick={() => setShowCreateRole(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category}>
                      <h5 className="font-medium text-gray-900 mb-2">{category}</h5>
                      <div className="space-y-2 ml-4">
                        {categoryPermissions.map((permission) => (
                          <label key={permission.id} className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowCreateRole(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RolesManagement