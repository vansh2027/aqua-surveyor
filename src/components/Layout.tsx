
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main 
        className="flex-grow px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full"
      >
        {children}
      </main>
      <footer className="py-6 px-4 sm:px-6 md:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto w-full text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AquaSurveyor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
