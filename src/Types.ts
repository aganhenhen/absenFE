export interface UserData {
  username: string;
  fullName: string;
  position: string;
  role: 'ADMIN' | 'STAFF';
}

export interface AttendanceData {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  notes: string;
  check_in_addr: string;
  checkin_date: string;
}

export interface AttendanceStatusResponse {
  status: string;
  data: AttendanceData | null;
}

export interface RegisterEmployee {
  username: string;
  password?: string;
  fullName: string;
  position: string;
  shiftCode: string;
}