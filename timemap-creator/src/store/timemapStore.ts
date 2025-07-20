import create from 'zustand';

export interface Node {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface TimemapState {
  nodes: Node[];
  addNode: (node: Node) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  setNodes: (nodes: Node[]) => void;
}

export const useTimemapStore = create<TimemapState>((set) => ({
  nodes: [],
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNodePosition: (id, x, y) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, x, y } : node
      ),
    })),
  setNodes: (nodes) => set({ nodes }),
}));
