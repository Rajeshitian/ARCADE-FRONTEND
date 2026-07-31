import { z } from 'zod'

export const addressSchema = z.object({
  houseNumber: z.string().min(1, 'House number is required'),
  street:      z.string().min(1, 'Street is required'),
  city:        z.string().min(1, 'City is required'),
  state:       z.string().min(1, 'State is required'),
  country:     z.string().min(1, 'Country is required'),
  zipCode:     z.string().min(1, 'Zip code is required'),
})

export const employeeSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  firstName:    z.string().min(2, 'First name must be at least 2 characters'),
  lastName:     z.string().min(2, 'Last name must be at least 2 characters'),
  email:        z.string().email('Invalid email address'),
  phoneNumber:  z.string().min(1, 'Phone number is required'),
  salary:       z.string().min(1, 'Salary is required'),
  joiningDate:  z.string().min(1, 'Joining date is required'),
  status:       z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']).default('ACTIVE'),
  departmentId: z.string().min(1, 'Department is required'),
  projectIds:   z.array(z.string()).optional(),
  roleIds:      z.array(z.string()).optional(),
  address: addressSchema,
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
