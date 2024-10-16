import NavBar from '@/components/shared/NavBar';
import MobileNav from '@/components/shared/MobileNav';
import { SignedIn } from '@clerk/nextjs';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      <div >
        {/* Sidebar for larger screens */}
        <div className='md:w-64 fixed hidden lg:block'>
          <NavBar />
        </div>

        
        {/* Content area */}
        <div className='md:ml-64'>
          {children}
        </div>
      </div>
    </SignedIn>
  );
};

export default DashboardLayout;
