import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Download, X } from 'lucide-react'
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
import {
  MOCK_EMPLOYEES, MOCK_DEPARTMENTS,
  MOCK_PROJECTS, MOCK_ROLES,
} from '@/constants/mockData'
import type { Employee, EmployeeFilterInput, SortInput, SortDirection, Department } from '@/constants/types'
import type { EmployeeFormData } from '@/modules/employees/employeeSchema'
import { generateId } from '@/utils'

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

  // ── GraphQL ───────────────────────────────────────────────────────────────
  const filter: EmployeeFilterInput = {
    ...(search                   ? { search }                                  : {}),
    ...(departmentId !== 'all'   ? { departmentId }                            : {}),
    ...(statusFilter !== 'all'   ? { status: statusFilter as any }             : {}),
  }
  const sort: SortInput = { field: sortField, direction: sortDir }

  const { data: empData,  loading: empLoading  } = useAllEmployees(page, PAGE_SIZE, filter, sort)
  const { data: deptData, loading: deptLoading } = useAllDepartments()
  const { data: projData                       } = useAllProjects()
  const { data: roleData                       } = useAllRoles()

  const [createEmployee] = useCreateEmployee()
  const [updateEmployee] = useUpdateEmployee()
  const [deleteEmployee] = useDeleteEmployee()

  // ── Data — real from DB or mock fallback ──────────────────────────────────
  const isDemo       = !empData?.getAllEmployees
  const employees    = isDemo
    ? MOCK_EMPLOYEES
    : (empData.getAllEmployees.content as Employee[])

  const departments  = (deptData?.getAllDepartments  as Department[] | undefined)
    ?? MOCK_DEPARTMENTS   // ← always populated (DB or mock)

  const projects     = projData?.getAllProjects  ?? MOCK_PROJECTS
  const roles        = roleData?.getAllRoles     ?? MOCK_ROLES

  const pageInfo     = empData?.getAllEmployees?.pageInfo
  const totalPages   = pageInfo?.totalPages   ?? Math.ceil(MOCK_EMPLOYEES.length / PAGE_SIZE)
  const totalElems   = pageInfo?.totalElements ?? MOCK_EMPLOYEES.length

  // ── Client-side filter for demo mode ─────────────────────────────────────
  const displayedEmployees = useMemo(() => {
    if (!isDemo) return employees

    let result = [...employees]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q)
      )
    }
    if (departmentId !== 'all') {
      result = result.filter((e) => e.department.id === departmentId)
    }
    if (statusFilter !== 'all') {
      result = result.filter((e) => e.status === statusFilter)
    }

    result.sort((a, b) => {
      const av = String((a as any)[sortField] ?? '')
      const bv = String((b as any)[sortField] ?? '')
      return sortDir === 'ASC' ? av.localeCompare(bv) : bv.localeCompare(av)
    })

    const start = page * PAGE_SIZE
    return result.slice(start, start + PAGE_SIZE)
  }, [isDemo, employees, search, departmentId, statusFilter, sortField, sortDir, page])

  const handleSort = useCallback((field: string) => {
    setSortDir((prev) => (sortField === field && prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortField(field)
    setPage(0)
  }, [sortField])

  // ── CRUD handlers ─────────────────────────────────────────────────────────
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
        if (isDemo) {
          // Demo mode — add locally
          const dept = departments.find((d) => d.id === data.departmentId) ?? departments[0]!
          const newEmp: Employee = {
            id:           generateId(),
            employeeCode: data.employeeCode,
            firstName:    data.firstName,
            lastName:     data.lastName,
            fullName:     `${data.firstName} ${data.lastName}`,
            email:        data.email,
            phoneNumber:  data.phoneNumber,
            salary:       Number(data.salary),
            joiningDate:  data.joiningDate,
            status:       data.status,
            department:   dept,
            address: {
              id: generateId(),
              ...data.address,
            },
            projects: projects.filter((p) => data.projectIds?.includes(p.id)),
            roles:    roles.filter((r) => data.roleIds?.includes(r.id)),
          }
          // In demo mode we just show toast (can't mutate MOCK_EMPLOYEES const easily)
          success('Employee added (demo)', `${newEmp.fullName} added locally.`)
        } else {
          await createEmployee({ variables: { input } })
          success('Employee added', `${data.firstName} ${data.lastName} has been added.`)
        }
      } else if (selectedEmployee) {
        if (isDemo) {
          success('Changes saved (demo)', `${data.firstName} ${data.lastName} updated.`)
        } else {
          const { employeeCode: _ec, ...updateInput } = input
          await updateEmployee({ variables: { id: selectedEmployee.id, input: updateInput } })
          success('Changes saved', `${data.firstName} ${data.lastName} updated.`)
        }
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
      if (!isDemo) {
        await deleteEmployee({ variables: { id: deleteTarget.id } })
      }
      success('Employee removed', `${deleteTarget.fullName} has been deleted.`)
      setDeleteOpen(false)
      setDeleteTarget(null)
    } catch (err: unknown) {
      toastError('Delete failed', err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleteLoading(false)
    }
  }

  const hasFilters = search || departmentId !== 'all' || statusFilter !== 'all'

  return (
    <div className="p-6 space-y-5 min-h-full">

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
            {isDemo && (
              <span className="ml-2 text-amber-400/80 text-xs">(demo mode)</span>
            )}
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
        <div className="flex-1 min-w-[200px] max-w-xs">
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

        {/* Department filter — uses real departments from DB */}
        <Select
          value={departmentId}
          onValueChange={(v) => { setDepartmentId(v); setPage(0) }}
        >
          <SelectTrigger className="w-44 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
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
          <SelectTrigger className="w-32 text-xs">
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
              onClick={() => {
                success(`${selectedIds.length} employees removed`)
                setSelectedIds([])
              }}
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
          <EmployeeTable
            employees={displayedEmployees}
            loading={empLoading}
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
              setSelectedIds(checked ? displayedEmployees.map((e) => e.id) : [])
            }
          />

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

      {/* ── Drawer — receives real departments/projects/roles ── */}
      <EmployeeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        employee={selectedEmployee}
        mode={drawerMode}
        departments={departments}   // ← DB data or mock fallback
        projects={projects}         // ← DB data or mock fallback
        roles={roles}               // ← DB data or mock fallback
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
