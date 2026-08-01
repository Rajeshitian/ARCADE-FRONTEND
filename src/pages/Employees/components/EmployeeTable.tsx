import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Edit, Trash2
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SkeletonTable } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, getStatusBg, cn } from '@/utils'
import type { Employee, SortDirection } from '@/constants/types'

interface EmployeeTableProps {
  employees: Employee[]
  loading: boolean
  sortField: string
  sortDir: SortDirection
  onSort: (field: string) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  selectedIds: string[]
  onSelectId: (id: string) => void
  onSelectAll: (checked: boolean) => void
}

interface Column {
  key: string
  label: string
  sortable: boolean
  width: string
}

const columns: Column[] = [
  { key: 'firstName',   label: 'Employee',    sortable: true,  width: 'flex-1 min-w-[220px]' },
  { key: 'employeeCode',label: 'Code',         sortable: true,  width: 'w-28' },
  { key: 'department',  label: 'Department',  sortable: false, width: 'w-36' },
  { key: 'salary',      label: 'Salary',      sortable: true,  width: 'w-28' },
  { key: 'status',      label: 'Status',      sortable: true,  width: 'w-28' },
  { key: 'joiningDate', label: 'Joined',      sortable: true,  width: 'w-28' },
  { key: 'actions',     label: '',            sortable: false, width: 'w-12' },
]

export function EmployeeTable({
  employees, loading, sortField, sortDir, onSort,
  onEdit, onDelete, selectedIds, onSelectId, onSelectAll,
}: EmployeeTableProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (event.target.closest('[data-row-menu]')) return
      setMenuOpen(null)
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
    return sortDir === 'ASC'
      ? <ChevronUp className="h-3.5 w-3.5 text-blue-400" />
      : <ChevronDown className="h-3.5 w-3.5 text-blue-400" />
  }

  if (loading) return <SkeletonTable rows={8} />

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-white/[0.05]">
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-blue-500"
                checked={selectedIds.length === employees.length && employees.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-3 py-3 text-left', col.width)}>
                {col.label && (
                  <button
                    onClick={() => col.sortable && onSort(col.key)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                      col.sortable && 'hover:text-foreground transition-colors cursor-pointer'
                    )}
                  >
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                onMouseEnter={() => setHovered(emp.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'border-b border-white/[0.04] transition-colors duration-150',
                  hovered === emp.id && 'bg-white/[0.03]',
                  selectedIds.includes(emp.id) && 'bg-blue-500/[0.04]'
                )}
              >
                {/* Checkbox */}
                <td className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-blue-500"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => onSelectId(emp.id)}
                  />
                </td>

                {/* Employee name + email */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{emp.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
                    </div>
                  </div>
                </td>

                {/* Employee code */}
                <td className="px-3 py-3 w-28">
                  <span className="text-xs font-mono text-muted-foreground bg-white/[0.05] px-2 py-0.5 rounded">
                    {emp.employeeCode}
                  </span>
                </td>

                {/* Department */}
                <td className="px-3 py-3 w-36">
                  <span className="text-sm text-foreground/80">{emp.department?.departmentName}</span>
                </td>

                {/* Salary */}
                <td className="px-3 py-3 w-28">
                  <span className="text-sm font-medium text-foreground">{formatCurrency(emp.salary)}</span>
                </td>

                {/* Status */}
                <td className="px-3 py-3 w-28">
                  <Badge className={cn('text-[11px] border', getStatusBg(emp.status))}>
                    {emp.status.replace('_', ' ')}
                  </Badge>
                </td>

                {/* Joining date */}
                <td className="px-3 py-3 w-28">
                  <span className="text-sm text-muted-foreground">{formatDate(emp.joiningDate)}</span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3 w-12">
                  <div className="relative" data-row-menu>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)}
                      className={cn(
                        'transition-opacity opacity-80 hover:opacity-100',
                        hovered === emp.id && 'opacity-100'
                      )}
                      aria-label="Open actions menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    <AnimatePresence>
                      {menuOpen === emp.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-white/[0.1] bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => { onEdit(emp); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-white/[0.06] transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <div className="h-px bg-white/[0.05] mx-1" />
                          <button
                            type="button"
                            onClick={() => { onDelete(emp); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {employees.length === 0 && !loading && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-sm">No employees found.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
