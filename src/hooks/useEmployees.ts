import { useQuery, useMutation, useSubscription } from '@apollo/client'
import {
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  GET_EMPLOYEE_BY_EMAIL,
  GET_EMPLOYEES_BY_DEPARTMENT,
  GET_EMPLOYEES_BY_STATUS,
  GET_ALL_DEPARTMENTS,
  GET_ALL_PROJECTS,
  GET_ALL_ROLES,
} from '@/graphql/queries/employees'
import {
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  CHANGE_EMPLOYEE_STATUS,
  UPDATE_EMPLOYEE_SALARY,
  ASSIGN_PROJECT_TO_EMPLOYEE,
  REMOVE_PROJECT_FROM_EMPLOYEE,
  ASSIGN_ROLE_TO_EMPLOYEE,
  REMOVE_ROLE_FROM_EMPLOYEE,
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from '@/graphql/mutations/employees'
import { EMPLOYEE_EVENTS_SUBSCRIPTION } from '@/graphql/subscriptions/employees'
import type {
  EmployeeFilterInput,
  SortInput,
  EmployeeStatus,
} from '@/constants/types'

// ─── Employee Queries ─────────────────────────────────────────────────────────

export function useAllEmployees(
  page = 0,
  size = 10,
  filter?: EmployeeFilterInput,
  sort?: SortInput
) {
  return useQuery(GET_ALL_EMPLOYEES, {
    variables: { page, size, filter, sort },
    errorPolicy: 'all',
  })
}

export function useEmployeeById(id: string) {
  return useQuery(GET_EMPLOYEE_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  })
}

export function useEmployeeByEmail(email: string) {
  return useQuery(GET_EMPLOYEE_BY_EMAIL, {
    variables: { email },
    skip: !email,
    errorPolicy: 'all',
  })
}

export function useEmployeesByDepartment(departmentId: string) {
  return useQuery(GET_EMPLOYEES_BY_DEPARTMENT, {
    variables: { departmentId },
    skip: !departmentId,
    errorPolicy: 'all',
  })
}

export function useEmployeesByStatus(status: EmployeeStatus) {
  return useQuery(GET_EMPLOYEES_BY_STATUS, {
    variables: { status },
    errorPolicy: 'all',
  })
}

// ─── Department Queries ───────────────────────────────────────────────────────

export function useAllDepartments() {
  return useQuery(GET_ALL_DEPARTMENTS, { errorPolicy: 'all' })
}

// ─── Project Queries ──────────────────────────────────────────────────────────

export function useAllProjects() {
  return useQuery(GET_ALL_PROJECTS, { errorPolicy: 'all' })
}

// ─── Role Queries ─────────────────────────────────────────────────────────────

export function useAllRoles() {
  return useQuery(GET_ALL_ROLES, { errorPolicy: 'all' })
}

// ─── Employee Mutations ───────────────────────────────────────────────────────

export function useCreateEmployee() {
  return useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [GET_ALL_EMPLOYEES],
  })
}

export function useUpdateEmployee() {
  return useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [GET_ALL_EMPLOYEES],
  })
}

export function useDeleteEmployee() {
  return useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [GET_ALL_EMPLOYEES],
    update(cache, { data }, { variables }) {
      if (data?.deleteEmployee && variables?.id) {
        cache.evict({
          id: cache.identify({ __typename: 'Employee', id: variables.id }),
        })
        cache.gc()
      }
    },
  })
}

export function useChangeEmployeeStatus() {
  return useMutation(CHANGE_EMPLOYEE_STATUS, {
    refetchQueries: [GET_ALL_EMPLOYEES],
  })
}

export function useUpdateEmployeeSalary() {
  return useMutation(UPDATE_EMPLOYEE_SALARY, {
    refetchQueries: [GET_ALL_EMPLOYEES],
  })
}

export function useAssignProject() {
  return useMutation(ASSIGN_PROJECT_TO_EMPLOYEE)
}

export function useRemoveProject() {
  return useMutation(REMOVE_PROJECT_FROM_EMPLOYEE)
}

export function useAssignRole() {
  return useMutation(ASSIGN_ROLE_TO_EMPLOYEE)
}

export function useRemoveRole() {
  return useMutation(REMOVE_ROLE_FROM_EMPLOYEE)
}

// ─── Department Mutations ─────────────────────────────────────────────────────

export function useCreateDepartment() {
  return useMutation(CREATE_DEPARTMENT, {
    refetchQueries: [GET_ALL_DEPARTMENTS],
  })
}

export function useUpdateDepartment() {
  return useMutation(UPDATE_DEPARTMENT, {
    refetchQueries: [GET_ALL_DEPARTMENTS],
  })
}

export function useDeleteDepartment() {
  return useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [GET_ALL_DEPARTMENTS],
  })
}

// ─── Project Mutations ────────────────────────────────────────────────────────

export function useCreateProject() {
  return useMutation(CREATE_PROJECT, {
    refetchQueries: [GET_ALL_PROJECTS],
  })
}

export function useUpdateProject() {
  return useMutation(UPDATE_PROJECT, {
    refetchQueries: [GET_ALL_PROJECTS],
  })
}

export function useDeleteProject() {
  return useMutation(DELETE_PROJECT, {
    refetchQueries: [GET_ALL_PROJECTS],
  })
}

// ─── Role Mutations ───────────────────────────────────────────────────────────

export function useCreateRole() {
  return useMutation(CREATE_ROLE, {
    refetchQueries: [GET_ALL_ROLES],
  })
}

export function useUpdateRole() {
  return useMutation(UPDATE_ROLE, {
    refetchQueries: [GET_ALL_ROLES],
  })
}

export function useDeleteRole() {
  return useMutation(DELETE_ROLE, {
    refetchQueries: [GET_ALL_ROLES],
  })
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export function useEmployeeEvents() {
  return useSubscription(EMPLOYEE_EVENTS_SUBSCRIPTION)
}
