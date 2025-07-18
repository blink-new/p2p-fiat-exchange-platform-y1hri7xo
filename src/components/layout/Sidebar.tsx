import { 
  Home, 
  Wallet, 
  Plus, 
  ShoppingCart, 
  Settings, 
  Bell,
  User,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: any
}

export function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Plus, label: 'Create Order', path: '/create-order' },
    { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={user?.kycStatus === 'approved' ? 'default' : 'secondary'}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                {user?.kycStatus === 'approved' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-blue-600 text-white hover:bg-blue-700'
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}