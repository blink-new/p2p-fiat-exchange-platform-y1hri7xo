import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Wallet } from './pages/Wallet'
import { CreateOrder } from './pages/CreateOrder'
import { Marketplace } from './pages/Marketplace'
import { IDVerification } from './pages/IDVerification'
import { Settings } from './pages/Settings'
import { Notifications } from './pages/Notifications'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { UserManagement } from './pages/admin/UserManagement'
import { OrderManagement } from './pages/admin/OrderManagement'
import { Analytics } from './pages/admin/Analytics'
import { SystemSettings } from './pages/admin/SystemSettings'
import Compliance from './pages/admin/Compliance'
import RolesManagement from './pages/admin/RolesManagement'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <Landing />} 
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/wallet"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <Wallet />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-order"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <CreateOrder />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/marketplace"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <Marketplace />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <Notifications />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <Settings />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/id-verification"
            element={
              user ? (
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1">
                    <Header user={user} />
                    <main className="p-6">
                      <IDVerification />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="roles" element={<RolesManagement />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App