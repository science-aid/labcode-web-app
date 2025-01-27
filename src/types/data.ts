export type Status = '完了' | '進行中' | '未開始' | 'キャンセル';

export interface DataItem {
  readonly projectId: string;
  readonly projectName: string;
  readonly id: string;
  readonly protocolName: string;
  readonly registeredAt: string;
  readonly startAt: string;
  readonly endAt: string;
  readonly status: Status;
  readonly contentMd5: string;
  readonly protocolUrl: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}