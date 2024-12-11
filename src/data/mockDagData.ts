import { DAGNode, DAGEdge } from '../types/dag';

export const mockNodes: DAGNode[] = [
  {
    id: 'node-1',
    label: 'データ収集',
    status: '完了',
    details: {
      description: '複数のソースからデータを収集',
      startTime: '2024-03-15T09:00:00',
      endTime: '2024-03-15T09:30:00',
      parameters: {
        'sources': 'database,api,files',
        'batch_size': '1000'
      },
      output: '3000 records collected'
    }
  },
  {
    id: 'node-2a',
    label: '画像処理',
    status: '完了',
    details: {
      description: '画像データの前処理と正規化',
      startTime: '2024-03-15T09:31:00',
      endTime: '2024-03-15T10:00:00',
      parameters: {
        'resize': '224x224',
        'normalize': 'true',
        'augmentation': 'enabled'
      },
      output: '1000 images processed'
    }
  },
  {
    id: 'node-2b',
    label: 'テキスト処理',
    status: '完了',
    details: {
      description: 'テキストデータのクリーニングと正規化',
      startTime: '2024-03-15T09:31:00',
      endTime: '2024-03-15T09:45:00',
      parameters: {
        'lowercase': 'true',
        'remove_stopwords': 'true',
        'language': 'ja'
      },
      output: '1000 text records processed'
    }
  },
  {
    id: 'node-2c',
    label: '数値データ処理',
    status: '完了',
    details: {
      description: '数値データの正規化とスケーリング',
      startTime: '2024-03-15T09:31:00',
      endTime: '2024-03-15T09:40:00',
      parameters: {
        'scaling': 'standard',
        'handle_missing': 'mean'
      },
      output: '1000 numeric records processed'
    }
  },
  {
    id: 'node-3a',
    label: '画像特徴抽出',
    status: '進行中',
    details: {
      description: 'CNNによる特徴抽出',
      startTime: '2024-03-15T10:01:00',
      parameters: {
        'model': 'resnet50',
        'layer': 'features'
      }
    }
  },
  {
    id: 'node-3b',
    label: 'テキスト特徴抽出',
    status: '進行中',
    details: {
      description: 'BERTによる特徴抽出',
      startTime: '2024-03-15T09:46:00',
      parameters: {
        'model': 'bert-base-japanese',
        'max_length': '512'
      }
    }
  },
  {
    id: 'node-3c',
    label: '数値特徴抽出',
    status: 'エラー',
    details: {
      description: '主成分分析による特徴抽出',
      startTime: '2024-03-15T09:41:00',
      parameters: {
        'n_components': '10',
        'whiten': 'true'
      }
    }
  },
  {
    id: 'node-4',
    label: '特徴量統合',
    status: '未開始',
    details: {
      description: '各モダリティの特徴量を統合',
      parameters: {
        'fusion_method': 'concatenate',
        'normalize': 'true'
      }
    }
  },
  {
    id: 'node-5',
    label: 'モデル学習',
    status: '未開始',
    details: {
      description: 'マルチモーダルモデルの学習',
      parameters: {
        'model_type': 'transformer',
        'batch_size': '32',
        'epochs': '100'
      }
    }
  },
];

export const mockEdges: DAGEdge[] = [
  // データ収集から各処理へ
  { id: 'edge-1-2a', source: 'node-1', target: 'node-2a' },
  { id: 'edge-1-2b', source: 'node-1', target: 'node-2b' },
  { id: 'edge-1-2c', source: 'node-1', target: 'node-2c' },
  
  // 各処理から特徴抽出へ
  { id: 'edge-2a-3a', source: 'node-2a', target: 'node-3a' },
  { id: 'edge-2b-3b', source: 'node-2b', target: 'node-3b' },
  { id: 'edge-2c-3c', source: 'node-2c', target: 'node-3c' },
  
  // 特徴抽出から統合へ
  { id: 'edge-3a-4', source: 'node-3a', target: 'node-4' },
  { id: 'edge-3b-4', source: 'node-3b', target: 'node-4' },
  { id: 'edge-3c-4', source: 'node-3c', target: 'node-4' },
  
  // 統合からモデル学習へ
  { id: 'edge-4-5', source: 'node-4', target: 'node-5' },
];