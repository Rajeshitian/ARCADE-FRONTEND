import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  X, User, Mail, Phone, Hash,
  DollarSign, Calendar, MapPin
} from 'lucide-react'
import { employeeSchema, EmployeeFormData } from '@/modules/employees/employeeSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { drawerVariants, overlayVariants } from '@/animations/variants'
import type { Employee, Department, Project, Role } from '@/constants/types'
import { cn } from '@/utils'

interface EmployeeDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (data: EmployeeFormData) => Promise<void>
  employee?: Employee | null
  mode: 'create' | 'edit'
  departments: Department[]
  projects: Project[]
  roles: Role[]
}

const STATUSES = [
  { value: 'ACTIVE',     label: 'Active' },
  { value: 'INACTIVE',   label: 'Inactive' },
  { value: 'ON_LEAVE',   label: 'On Leave' },
  { value: 'TERMINATED', label: 'Terminated' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.05] mb-3">
      {children}
    </p>
  )
}

export function EmployeeDrawer({
  open, onClose, onSave, employee, mode,
  departments, projects, roles,
}: EmployeeDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'ACTIVE',
      joiningDate: new Date().toISOString().split('T')[0],
      address: { houseNumber: '', street: '', city: '', state: '', country: '', zipCode: '' },
    },
  })

  useEffect(() => {
    if (!open) return
    if (employee && mode === 'edit') {
      reset({
        employeeCode: employee.employeeCode,
        firstName:    employee.firstName,
        lastName:     employee.lastName,
        email:        employee.email,
        phoneNumber:  employee.phoneNumber,
        salary:       String(employee.salary),
        joiningDate:  employee.joiningDate,
        status:       employee.status,
        departmentId: employee.department.id,
        projectIds:   employee.projects?.map((p) => p.id) ?? [],
        roleIds:      employee.roles?.map((r) => r.id) ?? [],
        address: {
          houseNumber: employee.address?.houseNumber ?? '',
          street:      employee.address?.street ?? '',
          city:        employee.address?.city ?? '',
          state:       employee.address?.state ?? '',
          country:     employee.address?.country ?? '',
          zipCode:     employee.address?.zipCode ?? '',
        },
      })
    } else {
      reset({
        status: 'ACTIVE',
        joiningDate: new Date().toISOString().split('T')[0],
        address: { houseNumber: '', street: '', city: '', state: '', country: '', zipCode: '' },
      })
    }
  }, [employee, mode, reset, open])

  const onSubmit = async (data: EmployeeFormData) => {
    await onSave(data)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-[520px] z-50 flex flex-col bg-zinc-950/98 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/[0.06] flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">
                  {mode === 'create' ? 'Add Employee' : 'Edit Employee'}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {mode === 'create'
                    ? 'Fill in the details to add a new employee'
                    : `Editing ${employee?.fullName ?? employee?.firstName}`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto custom-scroll">
              <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5">

                {/* ── Basic Info ── */}
                <SectionTitle>Basic Information</SectionTitle>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Employee Code <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...register('employeeCode')}
                    placeholder="EMP-001"
                    leftIcon={<Hash className="h-3.5 w-3.5" />}
                    error={errors.employeeCode?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('firstName')}
                      placeholder="Alex"
                      leftIcon={<User className="h-3.5 w-3.5" />}
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('lastName')}
                      placeholder="Chen"
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="alex@company.com"
                    leftIcon={<Mail className="h-3.5 w-3.5" />}
                    error={errors.email?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...register('phoneNumber')}
                    placeholder="+1 (555) 000-0000"
                    leftIcon={<Phone className="h-3.5 w-3.5" />}
                    error={errors.phoneNumber?.message}
                  />
                </div>

                {/* ── Employment ── */}
                <SectionTitle>Employment Details</SectionTitle>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="departmentId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.departmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.departmentId && (
                    <p className="text-xs text-red-400">{errors.departmentId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Salary <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('salary')}
                      type="number"
                      placeholder="85000"
                      leftIcon={<DollarSign className="h-3.5 w-3.5" />}
                      error={errors.salary?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joining Date <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...register('joiningDate')}
                    type="date"
                    leftIcon={<Calendar className="h-3.5 w-3.5" />}
                    error={errors.joiningDate?.message}
                  />
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Projects
                    </label>
                    <Controller
                      control={control}
                      name="projectIds"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-white/10 bg-white/5 min-h-[44px]">
                          {projects.map((p) => {
                            const selected = field.value?.includes(p.id)
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  const current = field.value ?? []
                                  field.onChange(
                                    selected
                                      ? current.filter((id) => id !== p.id)
                                      : [...current, p.id]
                                  )
                                }}
                                className={cn(
                                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                                  selected
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                                )}
                              >
                                {p.projectName}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Roles */}
                {roles.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Roles
                    </label>
                    <Controller
                      control={control}
                      name="roleIds"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-white/10 bg-white/5 min-h-[44px]">
                          {roles.map((r) => {
                            const selected = field.value?.includes(r.id)
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                  const current = field.value ?? []
                                  field.onChange(
                                    selected
                                      ? current.filter((id) => id !== r.id)
                                      : [...current, r.id]
                                  )
                                }}
                                className={cn(
                                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                                  selected
                                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-400'
                                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                                )}
                              >
                                {r.roleName}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* ── Address ── */}
                <SectionTitle>Address</SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      House No. <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.houseNumber')}
                      placeholder="42A"
                      leftIcon={<MapPin className="h-3.5 w-3.5" />}
                      error={errors.address?.houseNumber?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Street <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.street')}
                      placeholder="Oak Avenue"
                      error={errors.address?.street?.message}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      City <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.city')}
                      placeholder="San Francisco"
                      error={errors.address?.city?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      State <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.state')}
                      placeholder="CA"
                      error={errors.address?.state?.message}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.country')}
                      placeholder="USA"
                      error={errors.address?.country?.message}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Zip Code <span className="text-red-400">*</span>
                    </label>
                    <Input
                      {...register('address.zipCode')}
                      placeholder="94102"
                      error={errors.address?.zipCode?.message}
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-4 py-4 sm:px-6 border-t border-white/[0.06] bg-zinc-950/50 flex-shrink-0">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="employee-form"
                loading={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500"
              >
                {mode === 'create' ? 'Add Employee' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
