export const mockData = [
  {
    projectId: "P001",
    id: "T001",
    registeredAt: "2024-03-10T09:00:00",
    startAt: "2024-03-11T10:00:00",
    endAt: "2024-03-11T15:30:00",
    status: "完了",
    protocolUrl: "https://example.com/protocols/T001"
  },
  {
    projectId: "P002",
    id: "T002",
    registeredAt: "2024-03-10T11:30:00",
    startAt: "2024-03-12T09:00:00",
    endAt: "2024-03-12T17:00:00",
    status: "進行中",
    protocolUrl: "https://example.com/protocols/T002"
  },
  {
    projectId: "P003",
    id: "T003",
    registeredAt: "2024-03-11T14:15:00",
    startAt: "2024-03-13T13:00:00",
    endAt: "2024-03-13T18:00:00",
    status: "未開始",
    protocolUrl: "https://example.com/protocols/T003"
  },
  {
    projectId: "P004",
    id: "T004",
    registeredAt: "2024-03-11T16:45:00",
    startAt: "2024-03-14T10:00:00",
    endAt: "2024-03-14T16:00:00",
    status: "キャンセル",
    protocolUrl: "https://example.com/protocols/T004"
  },
  {
    projectId: "P005",
    id: "T005",
    registeredAt: "2024-03-12T08:30:00",
    startAt: "2024-03-15T09:00:00",
    endAt: "2024-03-15T17:30:00",
    status: "未開始",
    protocolUrl: "https://example.com/protocols/T005"
  }
] as const;