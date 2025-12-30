"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { PrimaryButton } from "@workspace/ui/components/primary-button"
import { IconUser, IconBuilding, IconUsers, IconBriefcase } from "@tabler/icons-react"

export interface ClientFormData {
  name: string
  entityType: "S-Corp" | "Individual" | "Partnership" | "C-Corp" | "LLC"
  status: "Active" | "Pending" | "Review"
}

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: ClientFormData) => void | Promise<void>
}

const entityTypes = [
  { value: "S-Corp", label: "S-Corp", icon: IconBuilding },
  { value: "Individual", label: "Individual", icon: IconUser },
  { value: "Partnership", label: "Partnership", icon: IconUsers },
  { value: "C-Corp", label: "C-Corp", icon: IconBuilding },
  { value: "LLC", label: "LLC", icon: IconBriefcase },
] as const

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Review", label: "Review" },
] as const

export function AddClientDialog({ open, onOpenChange, onSubmit }: AddClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    entityType: "Individual",
    status: "Active"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      await onSubmit?.(formData)

      // Reset form
      setFormData({ name: "", entityType: "Individual", status: "Active" })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add client:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              placeholder="Enter client name..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-type">Entity Type</Label>
            <Select
              value={formData.entityType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value as ClientFormData["entityType"] }))}
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
                      {entity.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ClientFormData["status"] }))}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <PrimaryButton type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? "Adding..." : "Add Client"}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing dialog state
export function useAddClientDialog() {
  const [open, setOpen] = useState(false)
  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
  }
}
