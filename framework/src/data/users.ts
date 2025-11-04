export interface Credentials {
  username: string;
  password: string;
}

export const baseURL =
  process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com/';

export const admin: Credentials = {
  username: process.env.ORANGEHRM_USERNAME ?? 'Admin',
  password: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
};

export const invalid: Credentials = {
  username: 'Admin',
  password: 'wrong',
};

export const empty: Credentials = {
  username: '',
  password: '',
};