'use client'
import React, { useCallback } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

// 전역 데이터 정의
const data = {
  "files": [
    {
      "id": 183,
      "version": "v6",
      "original_name": "aaaa.pptx",
      "created_at": "2025-01-23T12:54:12.378300",
      "created_by": 2001,
      "created_by_name": "string"
    },
    {
      "id": 177,
      "version": "v5",
      "original_name": "aaaa.pptx",
      "created_at": "2025-01-16T14:19:58.057134",
      "created_by": 2001,
      "created_by_name": "string"
    },
    {
      "id": 173,
      "version": "v4",
      "original_name": "aaaa.pptx",
      "created_at": "2025-01-16T13:40:36.137477",
      "created_by": 2001,
      "created_by_name": "string"
    },
    {
      "id": 172,
      "version": "v3",
      "original_name": "aaaa.pptx",
      "created_at": "2025-01-16T13:40:13.766081",
      "created_by": 2001,
      "created_by_name": "string"
    },
    {
      "id": 86,
      "version": "v2",
      "original_name": "aaaa.pptx",
      "created_at": "2024-12-12T14:26:27.815476",
      "created_by": 2001,
      "created_by_name": "string"
    },
    {
      "id": 85,
      "version": "v1",
      "original_name": "aaaa.pptx",
      "created_at": "2024-12-11T17:12:13.223835",
      "created_by": 2001,
      "created_by_name": "string"
    }
  ],
  "relations": [
    {
      "parent": 177,
      "child": 183
    },
    {
      "parent": 172,
      "child": 177
    },
    {
      "parent": 172,
      "child": 173
    },
    {
      "parent": 86,
      "child": 172
    },
    {
      "parent": 85,
      "child": 86
    }
  ]
};

// 노드 스타일
const nodeStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  backgroundColor: '#fff',
};

const VersionTree = () => {
  // 초기 노드 생성
  const initialNodes = data.files.map((file, index) => ({
    id: file.id.toString(),
    data: { 
      label: file.version,
      createdAt: new Date(file.created_at).toLocaleDateString(),
    },
    position: { x: 100, y: index * 100 }, // 세로로 배치
    style: nodeStyle,
  }));

  // 초기 엣지 생성
  const initialEdges = data.relations.map((relation) => ({
    id: `${relation.parent}-${relation.child}`,
    source: relation.parent.toString(),
    target: relation.child.toString(),
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: '#555' },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 노드 클릭 핸들러
  const onNodeClick = useCallback((event: any, node: any) => {
    console.log('Clicked node:', node);
  }, []);

  return (
    <div className="w-full h-96 border border-gray-200 rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default VersionTree;