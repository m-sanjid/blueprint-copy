"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { PrimaryButton } from "@workspace/ui/components/primary-button"
import { Textarea } from "@workspace/ui/components/textarea"
import { IconUser, IconBuilding, IconUsers, IconBriefcase, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

// ============================================
// Types - Ready for backend integration
// ============================================

export type EntityType = "S-Corp" | "Individual" | "Partnership" | "C-Corp" | "LLC"
export type ClientStatus = "Active" | "Pending" | "Review"
export type FilingStatus = "Single" | "Married Filing Jointly" | "Married Filing Separately" | "Head of Household" | "Qualifying Widow(er)"

export interface ClientFormData {
  // Basic Information
  name: string
  entityType: EntityType
  status: ClientStatus

  // Contact Information
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string

  // Tax Information
  taxId: string // SSN or EIN
  filingStatus?: FilingStatus
  fiscalYearEnd?: string

  // Business Information (for entities)
  industry?: string
  annualRevenue?: string
  employeeCount?: string

  // Additional Details
  isVip: boolean
  notes?: string
  referralSource?: string
}

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: ClientFormData) => void | Promise<void>
  mode?: 'create' | 'edit'
  initialData?: Partial<ClientFormData>
}

// ============================================
// Constants
// ============================================

const entityTypes = [
  { value: "S-Corp", label: "S-Corporation", icon: IconBuilding, description: "Pass-through taxation" },
  { value: "Individual", label: "Individual", icon: IconUser, description: "Personal tax client" },
  { value: "Partnership", label: "Partnership", icon: IconUsers, description: "Multi-owner business" },
  { value: "C-Corp", label: "C-Corporation", icon: IconBuilding, description: "Corporate taxation" },
  { value: "LLC", label: "LLC", icon: IconBriefcase, description: "Limited liability company" },
] as const

const statusOptions = [
  { value: "Active", label: "Active", color: "bg-emerald-500" },
  { value: "Pending", label: "Pending", color: "bg-yellow-500" },
  { value: "Review", label: "Under Review", color: "bg-orange-500" },
] as const

const filingStatuses = [
  { value: "Single", label: "Single" },
  { value: "Married Filing Jointly", label: "Married Filing Jointly" },
  { value: "Married Filing Separately", label: "Married Filing Separately" },
  { value: "Head of Household", label: "Head of Household" },
  { value: "Qualifying Widow(er)", label: "Qualifying Widow(er)" },
] as const

const industries = [
  "Healthcare",
  "Technology",
  "Real Estate",
  "Retail",
  "Manufacturing",
  "Professional Services",
  "Construction",
  "Financial Services",
  "Food & Beverage",
  "Other"
]

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

const referralSources = [
  "Existing Client",
  "Website",
  "Google Search",
  "LinkedIn",
  "Referral Partner",
  "Conference/Event",
  "Other"
]

const defaultFormData: ClientFormData = {
  name: "",
  entityType: "Individual",
  status: "Active",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  taxId: "",
  filingStatus: "Single",
  fiscalYearEnd: "12/31",
  industry: "",
  annualRevenue: "",
  employeeCount: "",
  isVip: false,
  notes: "",
  referralSource: "",
}

// ============================================
// Component
// ============================================

export function AddClientDialog({
  open,
  onOpenChange,
  onSubmit,
  mode = 'create',
  initialData
}: AddClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ClientFormData>(() => ({
    ...defaultFormData,
    ...initialData
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({})

  const isIndividual = formData.entityType === "Individual"
  const totalSteps = isIndividual ? 3 : 4

  const updateField = useCallback(<K extends keyof ClientFormData>(field: K, value: ClientFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user updates field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {}

    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    }

    if (stepNum === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.state) newErrors.state = "State is required"
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
      else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) newErrors.zipCode = "Invalid ZIP code"
    }

    if (stepNum === 3) {
      if (!formData.taxId.trim()) newErrors.taxId = isIndividual ? "SSN is required" : "EIN is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      await onSubmit?.(formData)

      // Reset form
      setFormData(defaultFormData)
      setStep(1)
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save client:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ ...defaultFormData, ...initialData })
    setStep(1)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update client information' : 'Create a new client profile with complete details'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 py-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={cn(
                "flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium transition-colors",
                step > i + 1 ? "bg-emerald-500 text-white" :
                  step === i + 1 ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
              )}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={cn(
                  "flex-1 h-0.5",
                  step > i + 1 ? "bg-emerald-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Basic Information</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    id="name"
                    placeholder={isIndividual ? "John Smith" : "Company Name LLC"}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    disabled={isLoading}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    disabled={isLoading}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    disabled={isLoading}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entity-type">Entity Type</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) => updateField('entityType', value as EntityType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="entity-type">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((entity) => (
                        <SelectItem key={entity.value} value={entity.value}>
                          <div className="flex items-center gap-2">
                            <entity.icon className="h-4 w-4 text-muted-foreground" />
                            <span>{entity.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => updateField('status', value as ClientStatus)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full", status.color)} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={formData.isVip}
                  onChange={(e) => updateField('isVip', e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isVip" className="text-sm font-normal cursor-pointer">
                  Mark as VIP client
                </Label>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Address Information</p>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  disabled={isLoading}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    disabled={isLoading}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => updateField('state', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    disabled={isLoading}
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tax Information */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Tax Information</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxId">{isIndividual ? "SSN *" : "EIN *"}</Label>
                  <Input
                    id="taxId"
                    placeholder={isIndividual ? "XXX-XX-XXXX" : "XX-XXXXXXX"}
                    value={formData.taxId}
                    onChange={(e) => updateField('taxId', e.target.value)}
                    disabled={isLoading}
                    className={errors.taxId ? "border-red-500" : ""}
                  />
                  {errors.taxId && <p className="text-xs text-red-500">{errors.taxId}</p>}
                </div>

                {isIndividual ? (
                  <div className="space-y-2">
                    <Label htmlFor="filingStatus">Filing Status</Label>
                    <Select
                      value={formData.filingStatus}
                      onValueChange={(value) => updateField('filingStatus', value as FilingStatus)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="filingStatus">
                        <SelectValue placeholder="Select filing status" />
                      </SelectTrigger>
                      <SelectContent>
                        {filingStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                    <Input
                      id="fiscalYearEnd"
                      placeholder="12/31"
                      value={formData.fiscalYearEnd}
                      onChange={(e) => updateField('fiscalYearEnd', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How did they find us?</Label>
                <Select
                  value={formData.referralSource}
                  onValueChange={(value) => updateField('referralSource', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="referralSource">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {referralSources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Business Information (for entities only) */}
          {step === 4 && !isIndividual && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Business Information</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateField('industry', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Select
                    value={formData.annualRevenue}
                    onValueChange={(value) => updateField('annualRevenue', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="annualRevenue">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<100k">Under $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                      <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                      <SelectItem value=">10m">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Select
                    value={formData.employeeCount}
                    onValueChange={(value) => updateField('employeeCount', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="employeeCount">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201-500">201-500</SelectItem>
                      <SelectItem value=">500">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about this client..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Notes for Individuals (show on step 3) */}
          {step === 3 && isIndividual && (
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this client..."
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
          )}

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
              disabled={isLoading}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < totalSteps ? (
              <PrimaryButton type="button" onClick={handleNext} disabled={isLoading}>
                Next
              </PrimaryButton>
            ) : (
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : mode === 'edit' ? "Save Changes" : "Create Client"}
              </PrimaryButton>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Hook for managing dialog state
// ============================================

export function useAddClientDialog() {
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<ClientFormData> | undefined>()

  return {
    open,
    setOpen,
    editData,
    openDialog: () => {
      setEditData(undefined)
      setOpen(true)
    },
    openEditDialog: (data: Partial<ClientFormData>) => {
      setEditData(data)
      setOpen(true)
    },
    closeDialog: () => {
      setEditData(undefined)
      setOpen(false)
    },
  }
}
