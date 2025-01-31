// Generated by https://quicktype.io

export default interface UserManagementAdminResponse {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: UserManagementAdminResponseResult[];
}

export interface UserManagementAdminResponseResult {
  // Custom
  checkbox?: string;
  actions?: string;

  id: number | string;
  follower_name: string;
  email: string;
  role: string;
  status: string;
}
