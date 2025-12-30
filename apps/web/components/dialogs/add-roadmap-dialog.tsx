"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { PrimaryButton } from "@workspace/ui/components/primary-button"

export interface RoadmapFormData {
  name: string
  client: string
  startDate: string
  endDate: string
}

interface AddRoadmapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: RoadmapFormData) => void | Promise<void>
  clients?: Array<{ id: string; name: string }>
}

// Default clients for demo - replace with actual data
const defaultClients = [
  { id: "1", name: "Johnson Holdings LLC" },
  { id: "2", name: "Rivera Family Trust" },
  { id: "3", name: "Apex Medical Group" },
  { id: "4", name: "Coastal Properties Inc" },
  { id: "5", name: "Summit Consulting" },
]

export function AddRoadmapDialog({ open, onOpenChange, onSubmit, clients = defaultClients }: AddRoadmapDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RoadmapFormData>({
    name: "",
    client: "",
    startDate: "",
    endDate: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.client) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      await onSubmit?.(formData)

      // Reset form
      setFormData({ name: "", client: "", startDate: "", endDate: "" })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add roadmap:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Roadmap</DialogTitle>
          <DialogDescription>
            Set up a new tax planning timeline for a client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="roadmap-name">Roadmap Name</Label>
            <Input
              id="roadmap-name"
              placeholder="e.g., Q1 Tax Optimization"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-select">Client</Label>
            <Select
              value={formData.client}
              onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
              disabled={isLoading}
            >
              <SelectTrigger id="client-select">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
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
            <PrimaryButton type="submit" disabled={isLoading || !formData.name.trim() || !formData.client}>
              {isLoading ? "Creating..." : "Create Roadmap"}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing dialog state
export function useAddRoadmapDialog() {
  const [open, setOpen] = useState(false)
  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
  }
}
