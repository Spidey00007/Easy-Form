"use client"
// components/shared/Header.jsx
import Image from 'next/image';
import { Button } from '../ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
const {user,isSignedIn} = useUser();
const path = usePathname();
  return !path.includes('aiform') && (
    <div className='p-5 border-b shadow-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Link href={'/'} className='cursor-pointer'>
             <Image src='/logo.svg' alt='logo' width={80} height={50} />
              <p className='text-primary text-2xl font-bold hidden sm:block'>EasyFormAI</p>
          </Link>
        </div>
        
        {isSignedIn?
        <div className='flex items-center gap-5'>
          <Link href={'/dashboard'}>
          <Button variant='outline'>Dashboard</Button>
         </Link>
          <UserButton/></div>
        : <SignInButton>
          <Button>Get Started</Button>
        </SignInButton>
        }
    
      </div>
    </div>
  );
};

export default Header;
