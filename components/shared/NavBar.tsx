"use client"
import { LucideIcon, MessageSquareReply, Newspaper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { db } from '@/config';
import { JsonForms } from '@/config/schema';
import { desc, eq } from 'drizzle-orm';

import CreateForm from './CreateForm';

interface JsonForm {
  id: number;
  jsonform: string;
  theme?: string | null;
  background?: string | null;
  style?: string | null;
  createdBy: string;
  createdAt: string;
}

interface SidenavItem {
  id: number;
  name: string;
  icon: LucideIcon;
  path: string;
}

const NavBar: React.FC = () => {
  const sidenavList: SidenavItem[] = [
    {
      id: 1,
      name: 'My Forms',
      icon: Newspaper,
      path: '/dashboard'
    },
    {
      id: 2,
      name: 'Responses',
      icon: MessageSquareReply,
      path: '/dashboard/responses'
    }
  ];

  const { user } = useUser();
  const [formList, setFormList] = useState<JsonForm[]>([]);

  useEffect(() => {
    if (user) {
      getFormList();
    }
  }, [user]);

  const getFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress || "")
      )
      .orderBy(desc(JsonForms.id));

    setFormList(result);
  };

  const pathname = usePathname();

  return (
    <div className='h-screen shadow-md border'>
      <div className='p-4 pb-28'>
        {sidenavList.map((item, index) => (
          <Link href={item.path} key={index}
            className={`p-4 flex items-center gap-4 mt-10 mb-10 cursor-pointer
              hover:bg-primary hover:text-white
              rounded-full
              ${pathname === item.path && 'bg-primary text-white'}
            `}
          >
            <item.icon />
            {item.name}
          </Link>
        ))}
      </div>

      <div className='mt-2 bottom-7 p-6 w-64'>
      <CreateForm/>
      

      </div>
    </div>
  );
}

export default NavBar;
