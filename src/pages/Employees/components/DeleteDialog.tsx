import { AlertTriangle } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/constants/types'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  employee: Employee | null
  loading?: boolean
}

export function DeleteDialog({ open, onClose, onConfirm, employee, loading }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <DialogTitle>Delete Employee</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">
              {employee?.fullName ?? `${employee?.firstName} ${employee?.lastName}`}
            </span>
            {employee?.employeeCode && (
              <span className="text-muted-foreground"> ({employee.employeeCode})</span>
            )}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
          >
            Delete Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
