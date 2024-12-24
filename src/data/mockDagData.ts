import { DAGNode, DAGEdge } from '../types/dag';

export const mockNodes: DAGNode[] = [
  {
    "id": "node_input",
    "label": "input",
    "status": "完了",
    "startTime": "2024-03-15T09:00:00",
    "endTime": "2024-03-15T09:30:00",
    // "input": "volume",
    // "output": "volume",
    "processId": "input",
    "storage_address": "storage/input",
    "isTransport": false
  },
  {
    "id": "node_serve_plate1",
    "status": "完了",
    "label": "serve_plate1",
    "startTime": "2024-03-15T09:00:00",
    "endTime": "2024-03-15T09:30:00",
    // "input": ""
    // "output": "3000 records collected",
    "storage_address": "storage/serve_plate1",
    "processId": "serve_plate1",
    "isTransport": false
  },
  {
    "id": "node_dispense_liquid1",
    "status": "完了",
    "label": "dispense_liquid1",
    "startTime": "2024-03-15T09:30:00",
    "endTime": "2024-03-15T10:00:00",
    // "input": "3000 records collected",
    // "output": "3000 records collected",
    "processId": "dispense_liquid1",
    "isTransport": false
  },
  {
    "id": "node_read_absorbance1",
    "status": "進行中",
    "label": "read_absorbance1",
    "startTime": "2024-03-15T10:00:00",
    "endTime": "2024-03-15T10:30:00",
    // "input": "",
    // "output": "3000 records collected",
    "storage_address": "storage/absorbance1",
    "processId": "read_absorbance1",
    "isTransport": false
  },
  {
    "id": "node_store_labware1",
    "status": "未開始",
    "label": "store_labware1",
    "startTime": "2024-03-15T10:30:00",
    "endTime": "2024-03-15T11:00:00",
    // "input": "3000 records collected",
    // "output": "3000 records collected",
    "processId": "store_labware1",
    "storage_address": "storage/labware1",
    "isTransport": false
  },
  {
    "id": "node_output",
    "status": "未開始",
    "label": "output",
    "startTime": "2024-03-15T10:30:00",
    "endTime": "2024-03-15T11:00:00",
    // "input": "3000 records collected",
    // "output": "3000 records collected",
    "processId": "output",
    "storage_address": "storage/labware1",
    "isTransport": false
  },
  {
    "id": "node-5-1",
    "status": "完了",
    "label": "transport input to dispense_liquid1 (volume)",
    "startTime": "2024-03-15T09:00:00",
    "endTime": "2024-03-15T09:30:00",
    "input": "volume",
    "output": "volume",
    "processId": "dispense_liquid1",
    "storage_address": "storage/serve_plate1",
    "isTransport": true
  },
  {
    "id": "node-5-2",
    "status": "完了",
    "label": "transport input to dispense_liquid1 (channel)",
    "startTime": "2024-03-15T09:00:00",
    "endTime": "2024-03-15T09:30:00",
    "input": "channel",
    "output": "channel",
    "processId": "dispense_liquid1",
    "storage_address": "storage/serve_plate1",
    "isTransport": true
  },
  {
    "id": "node-6",
    "status": "完了",
    "label": "transport serve_plate1 to dispense_liquid1",
    "startTime": "2024-03-15T09:30:00",
    "endTime": "2024-03-15T10:00:00",
    "input": "value",
    "output": "in1",
    "processId": "dispense_liquid1",
    "isTransport": true,
    "storage_address": "storage/location1"
  },
  {
    "id": "node-7",
    "status": "完了",
    "label": "transport dispense_liquid1 to read_absorbance1",
    "startTime": "2024-03-15T10:00:00",
    "endTime": "2024-03-15T10:30:00",
    "input": "out1",
    "output": "in1",
    "processId": "read_absorbance1",
    "isTransport": true,
    "storage_address": "storage/location2"
  },
  {
    "id": "node-8",
    "status": "未開始",
    "label": "transport read_absorbance1 to store_labware1",
    "startTime": "2024-03-15T10:30:00",
    "endTime": "2024-03-15T11:00:00",
    "input": "out1",
    "output": "in1",
    "processId": "store_labware1",
    "isTransport": true,
    "storage_address": "storage/location3"
  },
  {
    "id": "node-9",
    "status": "未開始",
    "label": "transport read_absorbanse1 to output",
    "startTime": "2024-03-15T11:00:00",
    "endTime": "2024-03-15T11:30:00",
    "input": "value",
    "output": "data",
    "processId": "output",
    "isTransport": true,
    "storage_address": "storage/location4"
  },
];

export const mockEdges: DAGEdge[] = [
  // input to dispense_liquid1
  { id: 'edge0', source: 'node_input', target: 'node-5-1' },
  { id: 'edge1', source: 'node-5-1', target: 'node_dispense_liquid1' },
  { id: 'edge2', source: 'node_input', target: 'node-5-2' },
  { id: 'edge3', source: 'node-5-2', target: 'node_dispense_liquid1' },
  // serve_plate1 to dispense_liquid1
  { id: 'edge4', source: 'node_serve_plate1', target: 'node-6' },
  { id: 'edge5', source: 'node-6', target: 'node_dispense_liquid1' },
  // dispense_liquid1 to read_absorbance1
  { id: 'edge6', source: 'node_dispense_liquid1', target: 'node-7' },
  { id: 'edge7', source: 'node-7', target: 'node_read_absorbance1' },
  // read_absorbance1 to store_labware1
  { id: 'edge8', source: 'node_read_absorbance1', target: 'node-8' },
  { id: 'edge9', source: 'node-8', target: 'node_store_labware1' },
  // store_labware1 to output
  { id: 'edge10', source: 'node_read_absorbance1', target: 'node-9' },
  { id: 'edge11', source: 'node-9', target: 'node_output' },
];