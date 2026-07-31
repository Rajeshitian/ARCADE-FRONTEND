import { gql } from '@apollo/client'

// ─── Fragments ────────────────────────────────────────────────────────────────

export const ADDRESS_FRAGMENT = gql`
  fragment AddressFields on Address {
    id
    houseNumber
    street
    city
    state
    country
    zipCode
  }
`

export const DEPARTMENT_FRAGMENT = gql`
  fragment DepartmentFields on Department {
    id
    departmentCode
    departmentName
    location
  }
`

export const PROJECT_FRAGMENT = gql`
  fragment ProjectFields on Project {
    id
    projectCode
    projectName
    startDate
    endDate
    budget
  }
`

export const ROLE_FRAGMENT = gql`
  fragment RoleFields on Role {
    id
    roleCode
    roleName
    description
  }
`

export const EMPLOYEE_FRAGMENT = gql`
  ${ADDRESS_FRAGMENT}
  ${DEPARTMENT_FRAGMENT}
  ${PROJECT_FRAGMENT}
  ${ROLE_FRAGMENT}
  fragment EmployeeFields on Employee {
    id
    employeeCode
    firstName
    lastName
    fullName
    email
    phoneNumber
    salary
    joiningDate
    status
    department {
      ...DepartmentFields
    }
    address {
      ...AddressFields
    }
    projects {
      ...ProjectFields
    }
    roles {
      ...RoleFields
    }
    createdBy
    createdDate
    updatedBy
    updatedDate
  }
`

// ─── Employee Queries ─────────────────────────────────────────────────────────

export const GET_ALL_EMPLOYEES = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetAllEmployees(
    $page: Int
    $size: Int
    $filter: EmployeeFilterInput
    $sort: SortInput
  ) {
    getAllEmployees(page: $page, size: $size, filter: $filter, sort: $sort) {
      content {
        ...EmployeeFields
      }
      pageInfo {
        page
        size
        totalElements
        totalPages
        hasNext
        hasPrevious
      }
    }
  }
`

export const GET_EMPLOYEE_BY_ID = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployeeById($id: ID!) {
    getEmployeeById(id: $id) {
      ...EmployeeFields
    }
  }
`

export const GET_EMPLOYEE_BY_EMAIL = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployeeByEmail($email: String!) {
    getEmployeeByEmail(email: $email) {
      ...EmployeeFields
    }
  }
`

export const GET_EMPLOYEES_BY_DEPARTMENT = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployeesByDepartment($departmentId: ID!) {
    getEmployeesByDepartment(departmentId: $departmentId) {
      ...EmployeeFields
    }
  }
`

export const GET_EMPLOYEES_BY_STATUS = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployeesByStatus($status: EmployeeStatus!) {
    getEmployeesByStatus(status: $status) {
      ...EmployeeFields
    }
  }
`

// ─── Department Queries ───────────────────────────────────────────────────────

export const GET_ALL_DEPARTMENTS = gql`
  query GetAllDepartments {
    getAllDepartments {
      id
      departmentCode
      departmentName
      location
      employees {
        id
        fullName
        status
      }
    }
  }
`

export const GET_DEPARTMENT_BY_ID = gql`
  query GetDepartmentById($id: ID!) {
    getDepartmentById(id: $id) {
      id
      departmentCode
      departmentName
      location
    }
  }
`

// ─── Project Queries ──────────────────────────────────────────────────────────

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      id
      projectCode
      projectName
      startDate
      endDate
      budget
    }
  }
`

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      projectCode
      projectName
      startDate
      endDate
      budget
    }
  }
`

// ─── Role Queries ─────────────────────────────────────────────────────────────

export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    getAllRoles {
      id
      roleCode
      roleName
      description
    }
  }
`

export const GET_ROLE_BY_ID = gql`
  query GetRoleById($id: ID!) {
    getRoleById(id: $id) {
      id
      roleCode
      roleName
      description
    }
  }
`
