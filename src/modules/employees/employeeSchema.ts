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
  email:        z.string().trim().email('Enter a valid email address'),
  phoneNumber:  z.string().trim().min(7, 'Enter a valid phone number'),
  salary:       z.string().min(1, 'Salary is required'),
  joiningDate:  z.string().min(1, 'Joining date is required'),
  status:       z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']).default('ACTIVE'),
  departmentId: z.string().min(1, 'Department is required'),
  projectIds:   z.array(z.string()).optional(),
  roleIds:      z.array(z.string()).optional(),
  address: addressSchema,
}).superRefine((data, context) => {
  const country = data.address.country.trim().toLowerCase()
  const digits = data.phoneNumber.replace(/\D/g, '')
  const phoneDigits = country === 'india' || country === 'in'
    ? digits.replace(/^91/, '')
    : country === 'united states' || country === 'usa' || country === 'us' || country === 'canada' || country === 'ca'
      ? digits.replace(/^1/, '')
      : country === 'united kingdom' || country === 'uk' || country === 'gb'
        ? digits.replace(/^44/, '').replace(/^0/, '')
        : country === 'australia' || country === 'au'
          ? digits.replace(/^61/, '').replace(/^0/, '')
          : digits

  const isValid = country === 'india' || country === 'in'
    ? /^[6-9]\d{9}$/.test(phoneDigits)
    : country === 'united states' || country === 'usa' || country === 'us' || country === 'canada' || country === 'ca'
      ? /^[2-9]\d{9}$/.test(phoneDigits)
      : country === 'united kingdom' || country === 'uk' || country === 'gb'
        ? /^\d{10,11}$/.test(phoneDigits)
        : country === 'australia' || country === 'au'
          ? /^\d{9}$/.test(phoneDigits)
          : /^\d{7,15}$/.test(phoneDigits)

  if (!isValid) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['phoneNumber'],
      message: `Enter a valid ${data.address.country} phone number`,
    })
  }
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
