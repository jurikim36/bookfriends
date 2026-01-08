
import { BookRecord, Group, UserProfile, Session } from '../types';

const RECORDS_KEY = 'book_records_v2';
const GROUPS_KEY = 'book_groups';
const SESSION_KEY = 'book_session';
const JOINED_GROUPS_KEY = 'book_joined_groups';
const DRAFT_KEY = 'book_record_draft';

// Records
export const getRecords = (groupId: string): BookRecord[] => {
  const data = localStorage.getItem(RECORDS_KEY);
  const allRecords: BookRecord[] = data ? JSON.parse(data) : [];
  return allRecords.filter(r => r.groupId === groupId);
};

export const getAllUserRecords = (userName: string): BookRecord[] => {
  const data = localStorage.getItem(RECORDS_KEY);
  const allRecords: BookRecord[] = data ? JSON.parse(data) : [];
  // Since we don't have a global unique user ID, we match by name
  // In a real app, we'd use a unique user ID across groups
  return allRecords.filter(r => r.authorName === userName);
};

export const saveRecord = (record: BookRecord) => {
  const data = localStorage.getItem(RECORDS_KEY);
  const records: BookRecord[] = data ? JSON.parse(data) : [];
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const deleteRecord = (id: string) => {
  const data = localStorage.getItem(RECORDS_KEY);
  const records: BookRecord[] = data ? JSON.parse(data) : [];
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
};

// Groups
export const getGroups = (): Group[] => {
  const data = localStorage.getItem(GROUPS_KEY);
  return data ? JSON.parse(data) : [];
};

export const createGroup = (group: Group) => {
  const groups = getGroups();
  groups.push(group);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

export const findGroup = (code: string): Group | undefined => {
  return getGroups().find(g => g.code === code);
};

// Joined Groups (Multiple groups support)
export const getJoinedGroups = (): Session[] => {
  const data = localStorage.getItem(JOINED_GROUPS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addJoinedGroup = (session: Session) => {
  const joined = getJoinedGroups();
  if (!joined.some(s => s.group.code === session.group.code)) {
    joined.push(session);
    localStorage.setItem(JOINED_GROUPS_KEY, JSON.stringify(joined));
  }
};

// Session (Current active group)
export const getSession = (): Session | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const setSession = (session: Session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  addJoinedGroup(session); // Also ensure it's in the joined list
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Drafts
export const getDraft = (): Partial<BookRecord> | null => {
  const data = localStorage.getItem(DRAFT_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveDraft = (draft: Partial<BookRecord>) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

// Utils
export const generateGroupCode = (): string => {
  const groups = getGroups();
  let code = '';
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (groups.some(g => g.code === code));
  return code;
};
