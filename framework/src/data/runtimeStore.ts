// Module: runtime store utilities (saveEmployee, loadEmployee)
import * as fs from 'fs';
import * as path from 'path';

const runtimeDir = path.join(process.cwd(), 'test-results', 'runtime');
const employeeFile = path.join(runtimeDir, 'employee.json');

export interface EmployeeRecord {
  displayName: string;
  firstName: string;
  lastName: string;
}

export function saveEmployee(record: EmployeeRecord): void {
  if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(employeeFile, JSON.stringify(record, null, 2), 'utf-8');
}

export function loadEmployee(): EmployeeRecord | null {
  if (!fs.existsSync(employeeFile)) return null;
  try {
    const content = fs.readFileSync(employeeFile, 'utf-8');
    return JSON.parse(content) as EmployeeRecord;
  } catch {
    return null;
  }
}