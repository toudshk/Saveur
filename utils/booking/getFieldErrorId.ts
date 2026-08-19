const ERROR_ELEMENT_SUFFIX = 'error'

export function getFieldErrorId(fieldId: string): string {
  return `${fieldId}-${ERROR_ELEMENT_SUFFIX}`
}
