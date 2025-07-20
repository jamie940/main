import React from 'react';
import { useTimemapStore } from '../../store/timemapStore';
import { useAuthStore } from '../../store/authStore';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import apiClient from '../../api';
import { saveSvgAsPng, svgAsDataUri } from 'save-svg-as-png';
import toast from 'react-hot-toast';
import ThemeToggler from '../Theme/ThemeToggler';

const Toolbar = () => {
  const { nodes, addNode } = useTimemapStore();
  const user = useAuthStore((state) => state.user);

  const handleAddNode = () => {
    const newNode = {
      id: uuidv4(),
      x: Math.random() * 500,
      y: Math.random() * 300,
      radius: 20,
      color: 'red',
    };
    addNode(newNode);
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving timemap...');
    try {
      await apiClient.post('/timemaps', { name: 'My First Timemap', nodes });
      toast.success('Timemap saved successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to save timemap:', error);
      toast.error('Failed to save timemap.', { id: toastId });
    }
  };

  const handleDownloadSVG = async () => {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      const uri = await svgAsDataUri(svgElement, { scale: 2 });
      const a = document.createElement('a');
      a.href = uri;
      a.download = 'timemap.svg';
      a.click();
      toast.success('SVG download started!');
    } else {
      toast.error('Could not find the canvas to download.');
    }
  };

  const handleDownloadPNG = () => {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      saveSvgAsPng(svgElement, 'timemap.png', { scale: 2 });
      toast.success('PNG download started!');
    } else {
      toast.error('Could not find the canvas to download.');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    toast.success('Logged out successfully.');
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-2">
        <button
          onClick={handleAddNode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Node
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button
          onClick={handleDownloadSVG}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Download SVG
        </button>
        <button
          onClick={handleDownloadPNG}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PNG
        </button>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggler />
        <span className="mr-4">Welcome, {user?.displayName || user?.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
