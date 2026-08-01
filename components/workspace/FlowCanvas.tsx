"use client";

import {
  useCallback,
  useMemo,
  type DragEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes, DEFAULT_LABELS, type FlowNodeKind } from "./nodeTypes";

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  setNodes,
  wrapperRef,
  hideChrome,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  hideChrome: boolean;
}) {
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, markerEnd: { type: "arrowclosed" as const } }, eds)
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as FlowNodeKind;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: DEFAULT_LABELS[type] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  // Forces nodes to render with fixed light-mode colors while exporting, so
  // the captured image doesn't pick up the viewer's OS dark-mode colors.
  const renderedNodes = useMemo(
    () =>
      hideChrome
        ? nodes.map((n) => ({ ...n, data: { ...n.data, exportMode: true } }))
        : nodes,
    [nodes, hideChrome]
  );

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full bg-white dark:bg-zinc-950"
      style={hideChrome ? { backgroundColor: "#ffffff" } : undefined}
    >
      <ReactFlow
        nodes={renderedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        {!hideChrome && <Background />}
        {!hideChrome && (
          <>
            <Controls />
            <MiniMap pannable zoomable />
          </>
        )}
      </ReactFlow>
    </div>
  );
}
