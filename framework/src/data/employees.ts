export interface EmployeeName {
  firstName: string;
  lastName: string;
}

export function makeUniqueName(base="abc"): EmployeeName {
    const suffix = new Date().getTime().toString().slice(-6);
    return {
        firstName: base,
        lastName: suffix
    };
}

export function displayName(name: EmployeeName): string {
  return `${name.firstName} ${name.lastName}`;
}

export interface JobUpdate {
  effectiveDate?: string;
  jobTitle?: string;
  jobCategory?: string;
  subUnit?: string;
  employmentStatus?: string;
}

export interface ContactUpdate {
  street1?: string;
  city?: string;
  country?: string;
  email?: string;
}