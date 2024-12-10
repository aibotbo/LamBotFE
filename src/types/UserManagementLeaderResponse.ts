// Generated by https://quicktype.io

export default interface UserManagementLeaderResponse {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: UserManagementLeaderResponseResult[];
}

export interface UserManagementLeaderResponseResult {
  // Custom
  checkbox?: string;
  actions?: string;
  setup?: string;

  id: number | string;
  follower_name: string;
  email: string;
  role: string;
  status: string;
  multiply_per_session: number;
  multiply: number;
}
