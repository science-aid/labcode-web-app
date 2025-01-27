export const mockData = [
  {
    id: "T001",
    projectId: "P001",
    projectName: "がん研究プロジェクト",
    protocolName: "細胞培養実験A",
    registeredAt: "2024-03-10T09:00:00",
    startAt: "2024-03-11T10:00:00",
    endAt: "2024-03-11T15:30:00",
    status: "完了",
    protocolUrl: "https://example.com/protocols/T001",
    contentMd5: "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    id: "T002",
    projectId: "P002",
    projectName: "免疫研究プロジェクト",
    protocolName: "抗体実験B",
    registeredAt: "2024-03-10T11:30:00",
    startAt: "2024-03-12T09:00:00",
    endAt: "2024-03-12T17:00:00",
    status: "進行中",
    protocolUrl: "https://example.com/protocols/T002",
    contentMd5: "e10adc3949ba59abbe56e057f20f883e"
  },
  {
    projectId: "P003",
    projectName: "代謝研究プロジェクト",
    id: "T003",
    protocolName: "代謝分析C",
    registeredAt: "2024-03-11T14:15:00",
    startAt: "2024-03-13T13:00:00",
    endAt: "2024-03-13T18:00:00",
    status: "未開始",
    protocolUrl: "https://example.com/protocols/T003",
    contentMd5: "c33367701511b4f6020ec61ded352059"
  },
  {
    projectId: "P004",
    projectName: "遺伝子研究プロジェクト",
    id: "T004",
    protocolName: "シーケンス実験D",
    registeredAt: "2024-03-11T16:45:00",
    startAt: "2024-03-14T10:00:00",
    endAt: "2024-03-14T16:00:00",
    status: "キャンセル",
    protocolUrl: "https://example.com/protocols/T004",
    contentMd5: "8f14e45fceea167a5a36dedd4bea2543"
  },
  {
    projectId: "P005",
    projectName: "幹細胞研究プロジェクト",
    id: "T005",
    protocolName: "分化誘導実験E",
    registeredAt: "2024-03-12T08:30:00",
    startAt: "2024-03-15T09:00:00",
    endAt: "2024-03-15T17:30:00",
    status: "未開始",
    protocolUrl: "https://example.com/protocols/T005",
    contentMd5: "1679091c5a880faf6fb5e6087eb1b2dc"
  }
] as const;