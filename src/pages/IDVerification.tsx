import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Camera,
  Shield,
  Clock,
  User,
  MapPin,
  Phone
} from 'lucide-react'

type VerificationStep = 'personal' | 'document' | 'review' | 'complete'

interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumber: string
  address: string
  city: string
  country: string
  postalCode: string
}

const countries = [
  'United States',
  'United Kingdom', 
  'Germany',
  'France',
  'Canada',
  'Australia',
  'Japan',
  'Other'
]

const documentTypes = [
  { value: 'passport', label: 'Passport', description: 'Government issued passport' },
  { value: 'drivers_license', label: "Driver's License", description: 'Valid driver\'s license' },
  { value: 'national_id', label: 'National ID Card', description: 'Government issued ID card' }
]

export function IDVerification() {
  const { toast } = useToast()
  
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<VerificationStep>('personal')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  })
  const [documentType, setDocumentType] = useState('')
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [selfieImage, setSelfieImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const getStepProgress = () => {
    switch (currentStep) {
      case 'personal': return 25
      case 'document': return 50
      case 'review': return 75
      case 'complete': return 100
      default: return 0
    }
  }

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'address', 'city', 'country']
    const missingFields = requiredFields.filter(field => !personalInfo[field as keyof PersonalInfo])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setCurrentStep('document')
  }

  const handleFileUpload = async (file: File, type: 'front' | 'back' | 'selfie') => {
    try {
      setUploadProgress(0)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive"
        })
        return
      }
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      const { publicUrl } = await blink.storage.upload(
        file,
        `kyc-documents/${user?.id}/${type}-${Date.now()}`,
        { 
          upsert: true,
          onProgress: (percent) => setUploadProgress(percent)
        }
      )

      // Store both file and URL for later use
      const fileData = { file, url: publicUrl }
      
      switch (type) {
        case 'front':
          setFrontImage(file)
          break
        case 'back':
          setBackImage(file)
          break
        case 'selfie':
          setSelfieImage(file)
          break
      }

      toast({
        title: "Upload Successful",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} document uploaded successfully`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadProgress(0)
    }
  }

  const handleDocumentSubmit = () => {
    if (!documentType || !frontImage || !selfieImage) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents",
        variant: "destructive"
      })
      return
    }

    if (documentType === 'drivers_license' && !backImage) {
      toast({
        title: "Missing Document",
        description: "Please upload the back of your driver's license",
        variant: "destructive"
      })
      return
    }

    setCurrentStep('review')
  }

  const handleFinalSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit verification",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Save verification data to database
      const verificationData = {
        id: `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        userEmail: user.email,
        status: 'pending',
        personalInfo,
        documentType,
        documentsUploaded: {
          front: !!frontImage,
          back: !!backImage,
          selfie: !!selfieImage
        },
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        notes: null
      }

      await blink.db.kycVerifications.create(verificationData)
      
      // Send notification about new KYC submission
      await blink.realtime.publish('kyc-submissions', 'new-submission', {
        userId: user.id,
        userEmail: user.email,
        submittedAt: verificationData.submittedAt
      })
      
      setCurrentStep('complete')
      
      toast({
        title: "Verification Submitted!",
        description: "Your documents have been submitted for review. You'll receive an update within 24-48 hours.",
      })
    } catch (error) {
      console.error('KYC submission error:', error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const FileUploadCard = ({ 
    title, 
    description, 
    file, 
    onUpload, 
    required = true 
  }: {
    title: string
    description: string
    file: File | null
    onUpload: (file: File) => void
    required?: boolean
  }) => (
    <Card className="border-dashed border-2 hover:border-blue-300 transition-colors">
      <CardContent className="p-6 text-center">
        {file ? (
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            <p className="font-medium text-green-600">{file.name}</p>
            <p className="text-sm text-gray-600">Uploaded successfully</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
              {required && <Badge variant="destructive" className="mt-1">Required</Badge>}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file)
              }}
              className="cursor-pointer"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
        <p className="text-gray-600">Complete your KYC verification to start trading</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verification Progress</span>
              <span>{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Personal Information */}
      {currentStep === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={personalInfo.country} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={personalInfo.postalCode}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Continue to Document Upload
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Document Upload */}
      {currentStep === 'document' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Document Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documentTypes.map((doc) => (
                  <Card 
                    key={doc.value}
                    className={`cursor-pointer transition-colors ${
                      documentType === doc.value ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setDocumentType(doc.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <h3 className="font-medium">{doc.label}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {documentType && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FileUploadCard
                title="Front of Document"
                description="Clear photo of the front side"
                file={frontImage}
                onUpload={(file) => handleFileUpload(file, 'front')}
              />
              
              {documentType === 'drivers_license' && (
                <FileUploadCard
                  title="Back of Document"
                  description="Clear photo of the back side"
                  file={backImage}
                  onUpload={(file) => handleFileUpload(file, 'back')}
                />
              )}
              
              <FileUploadCard
                title="Selfie Photo"
                description="Take a selfie holding your document"
                file={selfieImage}
                onUpload={(file) => handleFileUpload(file, 'selfie')}
              />
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setCurrentStep('personal')}>
              Back
            </Button>
            <Button onClick={handleDocumentSubmit} className="flex-1">
              Continue to Review
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 'review' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Review Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{personalInfo.firstName} {personalInfo.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="ml-2 font-medium">{personalInfo.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{personalInfo.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Country:</span>
                    <span className="ml-2 font-medium">{personalInfo.country}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Documents</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Document Type: {documentTypes.find(d => d.value === documentType)?.label}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Front Image: {frontImage?.name}</span>
                  </div>
                  {backImage && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Back Image: {backImage.name}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Selfie: {selfieImage?.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setCurrentStep('document')}>
              Back
            </Button>
            <Button 
              onClick={handleFinalSubmit} 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 'complete' && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your documents have been submitted for review. Our team will verify your identity within 24-48 hours.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">What happens next?</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will review your documents</li>
                <li>• You'll receive an email notification with the result</li>
                <li>• Once approved, you can start trading immediately</li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}