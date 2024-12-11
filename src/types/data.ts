export type Status = '完了' | '進行中' | '未開始' | 'キャンセル';

export interface DataItem {
  projectId: string;
  projectName: string;
  id: string;
  protocolName: string;
  registeredAt: string;
  startAt: string;
  endAt: string;
  status: Status;
  contentMd5: string;
  protocolUrl: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}