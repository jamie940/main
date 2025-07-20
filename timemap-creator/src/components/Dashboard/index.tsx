import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../api';
import { useTimemapStore, Node } from '../../store/timemapStore';
import toast from 'react-hot-toast';
import ThemeToggler from '../Theme/ThemeToggler';

interface Timemap {
  _id: string;
  name: string;
  nodes: Node[];
}

interface DashboardProps {
  onLoadTimemap: () => void;
}

const Dashboard = ({ onLoadTimemap }: DashboardProps) => {
  const [timemaps, setTimemaps] = useState<Timemap[]>([]);
  const { setNodes } = useTimemapStore();

  const fetchTimemaps = useCallback(async () => {
    const toastId = toast.loading('Loading your timemaps...');
    try {
      const response = await apiClient.get<Timemap[]>('/timemaps');
      setTimemaps(response.data);
      toast.success('Timemaps loaded!', { id: toastId });
    } catch (error) {
      console.error('Failed to fetch timemaps:', error);
      toast.error('Could not load timemaps.', { id: toastId });
    }
  }, []);

  useEffect(() => {
    fetchTimemaps();
  }, [fetchTimemaps]);

  const handleLoadClick = (nodes: Node[]) => {
    setNodes(nodes);
    onLoadTimemap();
  };

  const handleForkClick = async (timemapId: string) => {
    const toastId = toast.loading('Forking timemap...');
    try {
      await apiClient.post(`/timemaps/${timemapId}/fork`);
      toast.success('Timemap forked successfully!', { id: toastId });
      fetchTimemaps(); // Refresh the list to show the forked map
    } catch (error) {
      console.error('Failed to fork timemap:', error);
      toast.error('Failed to fork timemap.', { id: toastId });
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Timemaps</h2>
        <ThemeToggler />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timemaps.map((timemap) => (
          <div key={timemap._id} className="p-4 border rounded shadow bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{timemap.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{timemap.nodes.length} nodes</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleLoadClick(timemap.nodes)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Load
              </button>
              <button
                onClick={() => handleForkClick(timemap._id)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Fork
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
