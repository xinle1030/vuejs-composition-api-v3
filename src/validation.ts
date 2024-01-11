export interface Status {
  valid: boolean
  message?: string
}

// Rule: a function that complies to a specific interface, where input is String type and output is Status type
type Rule = (value: string) => Status

export function length ({ min, max }: { min: number, max: number }): Rule {
  return function (value: string): Status {
    const result = Boolean(value.length >= min && value.length <= max)

    return {
      valid: result,
      message: result ? undefined : `This field must be between ${min} and ${max}`
    }
  }
}

export const required: Rule = (value: string): Status => {
  const result = Boolean(value) // if empty string or undefined, return false; else true

  return {
    valid: result,
    message: result ? undefined : 'This field is required'
  }
}

export function validate (value: string, rules: Rule[]): Status {
  for (const rule of rules) {
    const result = rule(value)
    if (!result.valid) {
      return result
    }
  }

  return {
    valid: true
  }
}
