import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Download, X, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { EmployeeTable } from './components/EmployeeTable'
import { EmployeeDrawer } from './components/EmployeeDrawer'
import { DeleteDialog } from './components/DeleteDialog'
import { useToast } from '@/components/ui/toast'
import {
  useAllEmployees, useAllDepartments,
  useAllProjects, useAllRoles,
  useCreateEmployee, useUpdateEmployee, useDeleteEmployee,
} from '@/hooks/useEmployees'
import type { Department, Employee, EmployeeFilterInput, SortInput, SortDirection } from '@/constants/types'
import type { EmployeeFormData } from '@/modules/employees/employeeSchema'

const PAGE_SIZE = 10

export function EmployeesPage() {
  const [searchParams] = useSearchParams()
  const { success, error: toastError } = useToast()

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search,           setSearch]           = useState('')
  const [departmentId,     setDepartmentId]     = useState('all')
  const [statusFilter,     setStatusFilter]     = useState('all')
  const [page,             setPage]             = useState(0)
  const [sortField,        setSortField]        = useState('firstName')
  const [sortDir,          setSortDir]          = useState<SortDirection>('ASC')

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectedIds,      setSelectedIds]      = useState<string[]>([])
  const [drawerOpen,       setDrawerOpen]       = useState(searchParams.get('new') === 'true')
  const [drawerMode,       setDrawerMode]       = useState<'create' | 'edit'>('create')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [deleteOpen,       setDeleteOpen]       = useState(false)
  const [deleteTarget,     setDeleteTarget]     = useState<Employee | null>(null)
  const [deleteLoading,    setDeleteLoading]    = useState(false)

  // ── GraphQL — live data only ─────────────────────────────────────────────
  const filter: EmployeeFilterInput = {
    ...(search                 ? { search }                      : {}),
    ...(departmentId !== 'all' ? { departmentId }                : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter as any }  : {}),
  }
  const sort: SortInput = { field: sortField, direction: sortDir }

  const { data: empData,  loading: empLoading, error: empError } = useAllEmployees(page, PAGE_SIZE, filter, sort)
  const { data: deptData, loading: departmentsLoading, error: departmentsError } = useAllDepartments()
  const { data: projData } = useAllProjects()
  const { data: roleData } = useAllRoles()

  const [createEmployee] = useCreateEmployee()
  const [updateEmployee] = useUpdateEmployee()
  const [deleteEmployee] = useDeleteEmployee()

  const employees   = (empData?.getAllEmployees?.content ?? []) as Employee[]
  const departmentResult = deptData?.getAllDepartments
  const departments = (Array.isArray(departmentResult)
    ? departmentResult
    : departmentResult?.content ?? departmentResult?.items ?? []) as Department[]
  const projects     = projData?.getAllProjects ?? []
  const roles         = roleData?.getAllRoles ?? []

  const pageInfo   = empData?.getAllEmployees?.pageInfo
  const totalPages = pageInfo?.totalPages   ?? 0
  const totalElems = pageInfo?.totalElements ?? 0

  const handleSort = useCallback((field: string) => {
    setSortDir((prev) => (sortField === field && prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortField(field)
    setPage(0)
  }, [sortField])

  // ── CRUD handlers — all go straight to the live backend ───────────────────
  const openCreate = () => {
    setDrawerMode('create')
    setSelectedEmployee(null)
    setDrawerOpen(true)
  }

  const openEdit = (emp: Employee) => {
    setDrawerMode('edit')
    setSelectedEmployee(emp)
    setDrawerOpen(true)
  }

  const openDelete = (emp: Employee) => {
    setDeleteTarget(emp)
    setDeleteOpen(true)
  }

  const handleSave = async (data: EmployeeFormData) => {
    try {
      const input = {
        ...data,
        salary: Number(data.salary),
        projectIds: data.projectIds ?? [],
        roleIds:    data.roleIds    ?? [],
      }

      if (drawerMode === 'create') {
        await createEmployee({ variables: { input } })
        success('Employee added', `${data.firstName} ${data.lastName} has been added.`)
      } else if (selectedEmployee) {
        const { employeeCode: _ec, ...updateInput } = input
        await updateEmployee({ variables: { id: selectedEmployee.id, input: updateInput } })
        success('Changes saved', `${data.firstName} ${data.lastName} updated.`)
      }
      setDrawerOpen(false)
    } catch (err: unknown) {
      toastError('Save failed', err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteEmployee({ variables: { id: deleteTarget.id } })
      success('Employee removed', `${deleteTarget.fullName} has been deleted.`)
      setDeleteOpen(false)
      setDeleteTarget(null)
    } catch (err: unknown) {
      toastError('Delete failed', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteEmployee({ variables: { id } })))
      success(`${selectedIds.length} employees removed`)
      setSelectedIds([])
    } catch (err: unknown) {
      toastError('Bulk delete failed', err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const hasFilters = search || departmentId !== 'all' || statusFilter !== 'all'

  if (empError) {
    return (
      <div className="flex items-center justify-center min-h-full py-24">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-foreground">Couldn't load employees</p>
          <p className="text-xs text-muted-foreground">{empError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 min-h-full">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalElems} team members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button
            onClick={openCreate}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs hover:from-blue-500 hover:to-violet-500 shadow-lg"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Employee
          </Button>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Search */}
        <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search employees..."
            leftIcon={<Search className="h-3.5 w-3.5" />}
            rightIcon={
              search
                ? <button onClick={() => setSearch('')}><X className="h-3.5 w-3.5" /></button>
                : undefined
            }
          />
        </div>

        {/* Department filter */}
        <Select
          value={departmentId}
          onValueChange={(v) => { setDepartmentId(v); setPage(0) }}
        >
          <SelectTrigger className="w-full sm:w-44 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.departmentName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v); setPage(0) }}
        >
          <SelectTrigger className="w-full sm:w-32 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="ON_LEAVE">On Leave</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost" size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              setSearch(''); setDepartmentId('all')
              setStatusFilter('all'); setPage(0)
            }}
          >
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}

        {/* Bulk delete */}
        {selectedIds.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedIds.length} selected</span>
            <Button
              size="sm"
              className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        )}
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="overflow-hidden">
          {empLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Loading live employee data…</p>
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-foreground">No employees found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasFilters ? 'Try adjusting your filters.' : 'Add your first employee to get started.'}
              </p>
            </div>
          ) : (
            <EmployeeTable
              employees={employees}
              loading={false}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={openDelete}
              selectedIds={selectedIds}
              onSelectId={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                )
              }
              onSelectAll={(checked) =>
                setSelectedIds(checked ? employees.map((e) => e.id) : [])
              }
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.05]">
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages} · {totalElems} total
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm" className="text-xs h-7 px-2"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i ? 'default' : 'ghost'}
                    size="sm" className="text-xs h-7 w-7 p-0"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline" size="sm" className="text-xs h-7 px-2"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Drawer ── */}
      <EmployeeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        employee={selectedEmployee}
        mode={drawerMode}
        departments={departments}
        departmentsLoading={departmentsLoading}
        departmentsError={departmentsError?.message}
        projects={projects}
        roles={roles}
      />

      {/* ── Delete dialog ── */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        employee={deleteTarget}
        loading={deleteLoading}
      />
    </div>
  )
}
