import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  TrendingUp,
  TrendingDown,
  User,
  Clock,
  Trash2,
  Mail,
  Filter
} from 'lucide-react'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Order Matched!',
    message: 'Your sell order for 1000 USD has been matched with John Smith.',
    type: 'success',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    actionUrl: '/marketplace'
  },
  {
    id: '2',
    userId: 'user1',
    title: 'KYC Verification Approved',
    message: 'Your identity verification has been approved. You can now trade with higher limits.',
    type: 'success',
    isRead: false,
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message regarding your EUR exchange order.',
    type: 'info',
    isRead: true,
    createdAt: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Order Expired',
    message: 'Your buy order for 500 EUR has expired due to no matches found.',
    type: 'warning',
    isRead: true,
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '5',
    userId: 'user1',
    title: 'Transaction Completed',
    message: 'Your exchange of 750 GBP to USD has been completed successfully.',
    type: 'success',
    isRead: true,
    createdAt: '2024-01-14T12:10:00Z'
  },
  {
    id: '6',
    userId: 'user1',
    title: 'Security Alert',
    message: 'New login detected from a different device. If this wasn\'t you, please secure your account.',
    type: 'error',
    isRead: false,
    createdAt: '2024-01-14T08:30:00Z'
  }
]

export function Notifications() {
  const { toast } = useToast()
  
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Load user and notifications
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        await loadNotifications(state.user.id)
      }
    })
    return unsubscribe
  }, [loadNotifications])

  // Set up real-time notification updates
  useEffect(() => {
    if (!user) return

    let unsubscribe: (() => void) | null = null

    const setupRealtime = async () => {
      try {
        // Subscribe to general notifications
        unsubscribe = await blink.realtime.subscribe('user-notifications', (message) => {
          if (message.data.userId === user.id) {
            const newNotification: Notification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId: user.id,
              title: message.data.title,
              message: message.data.message,
              type: message.data.type || 'info',
              isRead: false,
              createdAt: new Date().toISOString(),
              actionUrl: message.data.actionUrl
            }
            
            setNotifications(prev => [newNotification, ...prev])
            
            // Save to database
            blink.db.notifications.create(newNotification).catch(console.error)
            
            toast({
              title: newNotification.title,
              description: newNotification.message,
            })
          }
        })
      } catch (error) {
        console.error('Failed to setup realtime notifications:', error)
      }
    }

    setupRealtime()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user, toast])

  const loadNotifications = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      
      // Load user notifications from database
      const userNotifications = await blink.db.notifications.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      // Fallback to mock data if database fails
      setNotifications(mockNotifications)
      toast({
        title: "Loading Error",
        description: "Using sample data. Some features may be limited.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getFilteredNotifications = () => {
    let filtered = notifications

    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead)
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.isRead)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  const markAsUnread = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: false } : n
      )
    )
  }

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    })
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read.",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = getFilteredNotifications()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark All as Read
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            <div className="flex space-x-2">
              {['all', 'unread', 'read'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption as any)}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex space-x-2">
              {['all', 'info', 'success', 'warning', 'error'].map((typeOption) => (
                <Button
                  key={typeOption}
                  variant={typeFilter === typeOption ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(typeOption as any)}
                >
                  {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all hover:shadow-md ${
              !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <Badge className={getNotificationBadgeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {notification.actionUrl && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = notification.actionUrl!}
                    >
                      View
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                  >
                    {notification.isRead ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "No notifications match your current filters."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Real-time Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time notifications enabled</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}