import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#1c1c1e] border-b border-[#2c2c2e] px-4 py-3">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </header>
  );
};

export default Header;