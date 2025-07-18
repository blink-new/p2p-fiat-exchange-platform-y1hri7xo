import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { blink } from '@/blink/client'

export function Landing() {
  const handleLogin = () => {
    blink.auth.login('/dashboard')
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Bank-level security with ID verification and encrypted transactions'
    },
    {
      icon: Zap,
      title: 'Fast Exchanges',
      description: 'Quick peer-to-peer currency exchanges with competitive rates'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Trade with users worldwide across multiple fiat currencies'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of verified users in our secure marketplace'
    }
  ]

  const benefits = [
    'No hidden fees or commissions',
    'Real-time exchange rates',
    'Instant order matching',
    'Secure escrow system',
    '24/7 customer support',
    'Mobile-friendly platform'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">P2P Exchange</h1>
          <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
            Sign In with Gmail
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Trade Currencies
            <span className="text-blue-600"> Peer-to-Peer</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect directly with other users to exchange fiat currencies at the best rates. 
            Secure, fast, and transparent trading platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Trading?</h3>
              <p className="text-blue-100 mb-6">
                Join our community of traders and start exchanging currencies with confidence.
              </p>
              <Button 
                onClick={handleLogin}
                className="bg-white text-blue-600 hover:bg-gray-100 w-full"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">P2P Exchange</h3>
          <p className="text-gray-400 mb-6">
            Secure peer-to-peer currency trading platform
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="/admin/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Admin Panel
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 P2P Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}