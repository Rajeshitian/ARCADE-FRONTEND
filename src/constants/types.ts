// ─── Enums ────────────────────────────────────────────────────────────────────

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
export type SecurityRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
export type SortDirection = 'ASC' | 'DESC'

// ─── Core Types ───────────────────────────────────────────────────────────────

export interface Address {
  id: string
  houseNumber: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface Department {
  id: string
  departmentCode: string
  departmentName: string
  location: string
  employees?: Employee[]
}

export interface Project {
  id: string
  projectCode: string
  projectName: string
  startDate: string
  endDate?: string
  budget: number
  employees?: Employee[]
}

export interface Role {
  id: string
  roleCode: string
  roleName: string
  description?: string
  employees?: Employee[]
}

export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  salary: number
  joiningDate: string
  status: EmployeeStatus
  department: Department
  address: Address
  projects: Project[]
  roles: Role[]
  createdBy?: string
  createdDate?: string
  updatedBy?: string
  updatedDate?: string
}

export interface PageInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface EmployeePage {
  content: Employee[]
  pageInfo: PageInfo
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  username: string
  email: string
  roles: SecurityRole[]
}

export interface AuthPayload {
  token: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

// ─── Inputs ───────────────────────────────────────────────────────────────────

export interface AddressInput {
  houseNumber: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface EmployeeInput {
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  salary: number
  joiningDate: string
  status?: EmployeeStatus
  departmentId: string
  address: AddressInput
  projectIds?: string[]
  roleIds?: string[]
}

export interface EmployeeUpdateInput {
  employeeCode?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  salary?: number
  joiningDate?: string
  status?: EmployeeStatus
  departmentId?: string
  address?: AddressInput
  projectIds?: string[]
  roleIds?: string[]
}

export interface EmployeeFilterInput {
  search?: string
  departmentId?: string
  status?: EmployeeStatus
  minSalary?: number
  maxSalary?: number
  joinedAfter?: string
  joinedBefore?: string
}

export interface SortInput {
  field?: string
  direction?: SortDirection
}

export interface DepartmentInput {
  departmentCode: string
  departmentName: string
  location: string
}

export interface ProjectInput {
  projectCode: string
  projectName: string
  startDate: string
  endDate?: string
  budget: number
}

export interface RoleInput {
  roleCode: string
  roleName: string
  description?: string
}

export interface LoginInput {
  usernameOrEmail: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  roles?: SecurityRole[]
}
