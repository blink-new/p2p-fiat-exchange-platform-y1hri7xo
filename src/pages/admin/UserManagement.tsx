import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'

interface User {
  id: string
  email: string
  displayName: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  isVerified: boolean
  isActive: boolean
  country: string
  phoneNumber: string
  totalOrders: number
  totalVolume: number
  lastLogin: string
  createdAt: string
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'john.doe@email.com',
      displayName: 'John Doe',
      kycStatus: 'approved',
      isVerified: true,
      isActive: true,
      country: 'United States',
      phoneNumber: '+1-555-0123',
      totalOrders: 15,
      totalVolume: 45000,
      lastLogin: '2024-01-15 14:30',
      createdAt: '2023-12-01'
    },
    {
      id: '2',
      email: 'jane.smith@email.com',
      displayName: 'Jane Smith',
      kycStatus: 'pending',
      isVerified: false,
      isActive: true,
      country: 'Canada',
      phoneNumber: '+1-416-555-0456',
      totalOrders: 3,
      totalVolume: 8500,
      lastLogin: '2024-01-15 12:15',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      email: 'mike.wilson@email.com',
      displayName: 'Mike Wilson',
      kycStatus: 'rejected',
      isVerified: false,
      isActive: false,
      country: 'United Kingdom',
      phoneNumber: '+44-20-7946-0958',
      totalOrders: 0,
      totalVolume: 0,
      lastLogin: '2024-01-12 09:45',
      createdAt: '2024-01-08'
    },
    {
      id: '4',
      email: 'sarah.jones@email.com',
      displayName: 'Sarah Jones',
      kycStatus: 'approved',
      isVerified: true,
      isActive: true,
      country: 'Australia',
      phoneNumber: '+61-2-9876-5432',
      totalOrders: 28,
      totalVolume: 125000,
      lastLogin: '2024-01-15 16:20',
      createdAt: '2023-11-15'
    },
    {
      id: '5',
      email: 'alex.brown@email.com',
      displayName: 'Alex Brown',
      kycStatus: 'pending',
      isVerified: false,
      isActive: true,
      country: 'Germany',
      phoneNumber: '+49-30-12345678',
      totalOrders: 7,
      totalVolume: 22000,
      lastLogin: '2024-01-15 11:30',
      createdAt: '2023-12-20'
    }
  ])

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Performing ${action} on user ${userId}`)
    // Here you would implement the actual user management actions
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, KYC verification, and account status</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} />
                        <AvatarFallback>{user.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getKycStatusBadge(user.kycStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{user.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.totalOrders}</TableCell>
                  <TableCell>${user.totalVolume.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              View and manage user information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <Tabs defaultValue="profile" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="kyc">KYC</TabsTrigger>
                              </TabsList>
                              <TabsContent value="profile" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-gray-400" />
                                      <span>{selectedUser.email}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-gray-400" />
                                      <span>{selectedUser.phoneNumber}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4 text-gray-400" />
                                      <span>{selectedUser.country}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Member Since</label>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      <span>{selectedUser.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction(selectedUser.id, 'suspend')}
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleUserAction(selectedUser.id, 'verify')}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Verify
                                  </Button>
                                </div>
                              </TabsContent>
                              <TabsContent value="activity" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-lg">Total Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedUser.totalOrders}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-lg">Total Volume</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">${selectedUser.totalVolume.toLocaleString()}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Recent Activity</h4>
                                  <div className="space-y-2">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm">Created sell order for $1,500 USD → EUR</p>
                                      <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm">Completed transaction #TX123456</p>
                                      <p className="text-xs text-gray-500">1 day ago</p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="kyc" className="space-y-4">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">KYC Verification Status</h4>
                                    {getKycStatusBadge(selectedUser.kycStatus)}
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Submitted Documents</label>
                                    <div className="space-y-2">
                                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <span className="text-sm">Government ID (Front)</span>
                                        <Button variant="outline" size="sm">View</Button>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <span className="text-sm">Government ID (Back)</span>
                                        <Button variant="outline" size="sm">View</Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 pt-4">
                                    <Button 
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleUserAction(selectedUser.id, 'approve_kyc')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve KYC
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleUserAction(selectedUser.id, 'reject_kyc')}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject KYC
                                    </Button>
                                  </div>
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
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'send_message')}>
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view_orders')}>
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                            Suspend Account
                          </DropdownMenuItem>
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