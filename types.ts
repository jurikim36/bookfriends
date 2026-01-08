
export type Genre = 
  | '소설' | '에세이' | '컴퓨터/IT' | '취미/실용/스포츠' | '여행' 
  | '희곡' | '경제/경영' | '역사/문화' | '예술/대중문화' | '종교' 
  | '시' | '자기계발' | '인문/철학/심리학' | '과학/기술' | '정치/사회/환경';

export interface BookRecord {
  id: string;
  groupId: string; // Linked to a specific group
  title: string;
  authorName: string; // 기록가 이름
  writer: string; // 책 저자
  publisher: string;
  genre: Genre;
  pages: number;
  startDate: string;
  endDate: string;
  recordDate: string; // 기록된 날짜 (캘린더 표시 기준)
  coverImage: string; // Base64
  rating: number; // 0.5 step, max 5.0
  review: string; // Max 500 chars
  timestamp: number;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface Group {
  code: string; // 5-digit random
  name: string;
  leaderName: string;
  maxMembers: number;
  description: string;
  password?: string; // Group password for security
}

export interface UserProfile {
  groupId: string;
  name: string;
  profileImage: string;
  password?: string;
}

export interface Session {
  group: Group;
  user: UserProfile;
}
