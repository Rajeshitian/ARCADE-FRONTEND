import { gql } from '@apollo/client'
import { EMPLOYEE_FRAGMENT } from '../queries/employees'

export const EMPLOYEE_EVENTS_SUBSCRIPTION = gql`
  ${EMPLOYEE_FRAGMENT}
  subscription EmployeeEvents {
    employeeEvents {
      ...EmployeeFields
    }
  }
`
