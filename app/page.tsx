"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FaFile } from "react-icons/fa";

// Dynamically import Tree with no SSR
const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

// Types for our file data
interface FileData {
  id: number;
  version: string;
  original_name: string;
  created_at: string;
  created_by: number;
  created_by_name: string;
  description: string;
}

interface Relation {
  parent: number;
  child: number;
}

interface CustomNodeData {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: CustomNodeData[];
  __rd3t?: {
    collapsed: boolean;
  };
}

// The same global data
const data = {
  files: [
    {
      id: 183,
      version: "v6",
      original_name: "aaaa.pptx",
      created_at: "2025-01-23T12:54:12.378300",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 6 of the file",
    },
    {
      id: 177,
      version: "v5",
      original_name: "aaaa.pptx",
      created_at: "2025-01-16T14:19:58.057134",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 5 of the file",
    },
    {
      id: 173,
      version: "v4",
      original_name: "aaaa.pptx",
      created_at: "2025-01-16T13:40:36.137477",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 4 of the file",
    },
    {
      id: 172,
      version: "v3",
      original_name: "aaaa.pptx",
      created_at: "2025-01-16T13:40:13.766081",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 3 of the file",
    },
    {
      id: 86,
      version: "v2",
      original_name: "aaaa.pptx",
      created_at: "2024-12-12T14:26:27.815476",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 2 of the file",
    },
    {
      id: 85,
      version: "v1",
      original_name: "aaaa.pptx",
      created_at: "2024-12-11T17:12:13.223835",
      created_by: 2001,
      created_by_name: "string",
      description: "Version 1 of the file",
    },
  ],
  relations: [
    {
      parent: 177,
      child: 183,
    },
    {
      parent: 172,
      child: 177,
    },
    {
      parent: 172,
      child: 173,
    },
    {
      parent: 86,
      child: 172,
    },
    {
      parent: 85,
      child: 86,
    },
  ],
};

// Transform data to format required by react-d3-tree
const transformDataToD3Tree = (
  files: FileData[],
  relations: Relation[]
): CustomNodeData => {
  const fileMap = files.reduce<Record<number, FileData>>((acc, file) => {
    acc[file.id] = file;
    return acc;
  }, {});

  const childrenMap: Record<number, number[]> = {};
  relations.forEach(({ parent, child }) => {
    if (!childrenMap[parent]) {
      childrenMap[parent] = [];
    }
    childrenMap[parent].push(child);
  });

  const rootId = files.find(
    (file) => !relations.some((relation) => relation.child === file.id)
  )?.id;

  if (!rootId) {
    throw new Error("No root node found in the data");
  }

  const buildTree = (nodeId: number): CustomNodeData => {
    const file = fileMap[nodeId];
    const formattedDate = new Date(file.created_at).toLocaleDateString();

    const node: CustomNodeData = {
      name: formattedDate,
      attributes: {
        id: nodeId,
        date: formattedDate,
        version: file.version,
        fileName: file.original_name,
        description: file.description,
        createdBy: file.created_by_name,
        fullDate: file.created_at,
      } as Record<string, string | number | boolean>,
    };

    const children = childrenMap[nodeId];
    if (children && children.length > 0) {
      return {
        ...node,
        children: children.map((childId) => buildTree(childId)),
      };
    }

    return node;
  };

  return buildTree(rootId);
};

type CustomNodeElementProps = {
  nodeDatum: CustomNodeData;
  toggleNode: () => void;
  foreignObjectProps?: {
    width: number;
    height: number;
    x: number;
  };
};

// Custom Node Component without using hooks
const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
}: CustomNodeElementProps) => {
  // Instead of useState, we'll use DOM events directly
  const childCount = nodeDatum.children?.length || 0;
  const isCollapsed = nodeDatum.__rd3t?.collapsed;

  const formattedDate = nodeDatum.attributes?.date
    ? new Date(nodeDatum.attributes.date as string).toLocaleDateString(
        "ko-KR",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      )
    : "";

  return (
    <g>
      {/* This rect is just for handling clicks */}
      <rect
        width="160"
        height="150"
        x="-80"
        y="-65"
        rx="10"
        ry="10"
        fill="transparent"
        stroke="none"
        onClick={toggleNode}
        className="cursor-pointer"
      />
      <foreignObject
        width={160}
        height={150}
        x={-80}
        y={-65}
        className="overflow-visible pointer-events-none"
      >
        {/* Card with consistent border */}
        <div
          className="h-full rounded-lg p-6 pointer-events-auto flex flex-col items-center justify-between shadow-sm transition-shadow duration-200 hover:shadow-md relative group"
          style={{
            border: "1.5px solid #A9A9A9",
            backgroundColor: childCount > 0 ? "#fff" : "#f5f5f5",
          }}
        >
          {/* Content container with more spacing */}
          <div className="flex flex-col items-center space-y-3 w-full">
            {/* Icon with pastel background circle */}
            {/* <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100" style={{ border: '1.5px solid #A9A9A9' }}> */}
            <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              <FaFile className="w-5 h-5 text-gray-500" />
            </div>

            {/* Date and version with more spacing */}
            <div className="text-base text-gray-700 font-small">
              {nodeDatum.name}
            </div>
            <div className="text-xs text-gray-500">
              {nodeDatum.attributes?.version}
            </div>
          </div>

          {/* The plus versions button - 색상 조건 변경 */}
          {childCount > 0 && (
            <div
              className={`mt-3 text-xs font-medium transition-colors duration-200 px-3 py-1 rounded-full ${
                isCollapsed
                  ? "text-blue-600 hover:text-blue-800 bg-blue-50"
                  : "text-gray-500 bg-gray-100"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNode();
              }}
            >
              {isCollapsed
                ? `+ ${childCount} 버전 ...`
                : `+ ${childCount} 버전`}
            </div>
          )}

          {/* Hover tooltip for file information - using Tailwind's group-hover instead of React state */}
          <div className="absolute z-10 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 left-full ml-4 top-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <h3 className="font-medium text-gray-900 mb-2">
              {nodeDatum.attributes?.fileName}
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-gray-600">
                <span className="font-medium">ID:</span>{" "}
                {nodeDatum.attributes?.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">버전:</span>{" "}
                {nodeDatum.attributes?.version}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">생성일:</span>{" "}
                {new Date(
                  nodeDatum.attributes?.fullDate as string
                ).toLocaleString("ko-KR")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">생성자:</span>{" "}
                {nodeDatum.attributes?.createdBy}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">설명:</span>{" "}
                {nodeDatum.attributes?.description}
              </p>
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const VersionTree = () => {
  const [translate, setTranslate] = useState({ x: 500, y: 100 });
  const treeData = transformDataToD3Tree(data.files, data.relations);

  // Handler for when the tree is loaded
  const onTreeLoad = () => {
    // You could set initial state here
    console.log("Tree loaded");
  };

  return (
    <div className="w-full h-[1200px] border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      <style>
        {`
          .rd3t-link {
            stroke: #A9A9A9 !important;
            stroke-width: 2px;
          }
          .rd3t-tree-container {
            background-color: #fafafa;
            border-radius: 0.75rem;
          }
        `}
      </style>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">버전 트리</h1>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            onClick={() => setTranslate({ x: 500, y: 100 })}
          >
            중앙으로
          </button>
        </div>
      </div>
      <div style={{ width: "100%", height: "800px" }}>
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          renderCustomNodeElement={renderForeignObjectNode}
          pathFunc="step"
          separation={{ siblings: 3, nonSiblings: 3.5 }}
          zoom={0.9}
          nodeSize={{ x: 240, y: 180 }}
          collapsible={true}
          initialDepth={5}
          pathClassFunc={() => "stroke-gray-200 stroke-2"}
          enableLegacyTransitions={false}
          transitionDuration={300}
          zoomable={true}
          onNodeClick={(nodeDatum, evt) => {
            console.log("Node clicked:", nodeDatum.attributes?.id);
            // You could add custom behavior here
          }}
          onLoad={onTreeLoad}
        />
      </div>
    </div>
  );
};

export default VersionTree;
