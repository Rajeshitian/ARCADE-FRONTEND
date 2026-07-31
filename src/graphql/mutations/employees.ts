import { gql } from '@apollo/client'
import { EMPLOYEE_FRAGMENT } from '../queries/employees'

// ─── Auth Mutations ───────────────────────────────────────────────────────────

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      tokenType
      expiresIn
      user {
        id
        username
        email
        roles
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      tokenType
      expiresIn
      user {
        id
        username
        email
        roles
      }
    }
  }
`

// ─── Employee Mutations ───────────────────────────────────────────────────────

export const CREATE_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      ...EmployeeFields
    }
  }
`

export const UPDATE_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
      ...EmployeeFields
    }
  }
`

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`

export const CHANGE_EMPLOYEE_STATUS = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation ChangeEmployeeStatus($employeeId: ID!, $status: EmployeeStatus!) {
    changeEmployeeStatus(employeeId: $employeeId, status: $status) {
      ...EmployeeFields
    }
  }
`

export const UPDATE_EMPLOYEE_SALARY = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation UpdateEmployeeSalary($employeeId: ID!, $salary: BigDecimal!) {
    updateEmployeeSalary(employeeId: $employeeId, salary: $salary) {
      ...EmployeeFields
    }
  }
`

export const ASSIGN_PROJECT_TO_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation AssignProjectToEmployee($employeeId: ID!, $projectId: ID!) {
    assignProjectToEmployee(employeeId: $employeeId, projectId: $projectId) {
      ...EmployeeFields
    }
  }
`

export const REMOVE_PROJECT_FROM_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation RemoveProjectFromEmployee($employeeId: ID!, $projectId: ID!) {
    removeProjectFromEmployee(employeeId: $employeeId, projectId: $projectId) {
      ...EmployeeFields
    }
  }
`

export const ASSIGN_ROLE_TO_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation AssignRoleToEmployee($employeeId: ID!, $roleId: ID!) {
    assignRoleToEmployee(employeeId: $employeeId, roleId: $roleId) {
      ...EmployeeFields
    }
  }
`

export const REMOVE_ROLE_FROM_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation RemoveRoleFromEmployee($employeeId: ID!, $roleId: ID!) {
    removeRoleFromEmployee(employeeId: $employeeId, roleId: $roleId) {
      ...EmployeeFields
    }
  }
`

// ─── Department Mutations ─────────────────────────────────────────────────────

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: DepartmentInput!) {
    createDepartment(input: $input) {
      id
      departmentCode
      departmentName
      location
    }
  }
`

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $input: DepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      departmentCode
      departmentName
      location
    }
  }
`

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`

// ─── Project Mutations ────────────────────────────────────────────────────────

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      projectCode
      projectName
      startDate
      endDate
      budget
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      projectCode
      projectName
      startDate
      endDate
      budget
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`

// ─── Role Mutations ───────────────────────────────────────────────────────────

export const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      roleCode
      roleName
      description
    }
  }
`

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: RoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      roleCode
      roleName
      description
    }
  }
`

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`
