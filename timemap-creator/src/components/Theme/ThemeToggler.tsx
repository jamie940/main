import React from 'react';
import useDarkMode from 'use-dark-mode';

const ThemeToggler = () => {
  const darkMode = useDarkMode(false);

  return (
    <button
      onClick={darkMode.toggle}
      className="p-2 rounded-full text-white hover:bg-gray-700"
    >
      {darkMode.value ? '🌞' : '🌜'}
    </button>
  );
};

export default ThemeToggler;
