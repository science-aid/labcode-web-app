export type Status = '完了' | '進行中' | '未開始' | 'キャンセル';

export interface DataItem {
  id: string;
  registeredAt: string;
  startAt: string;
  endAt: string;
  status: Status;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}