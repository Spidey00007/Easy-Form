"use client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LucideIcon, MessageSquareReply, Newspaper } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/config';
import { JsonForms } from '@/config/schema';
import { desc, eq } from 'drizzle-orm';
import CreateForm from './CreateForm';
import { useEffect, useState } from "react";

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

const MobileNav = () => {
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

  return !pathname.includes('aiform') && (
    <header className="header">
      <nav className="flex gap-2 justify-end ">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image 
                src="/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
              <Link href={'/'} className="cursor-pointer">
                <Image 
                  src="/logo.svg"
                  alt="logo"
                  width={50}
                  height={23}
                />
                </Link>
                <ul className="header-nav_elements">
                  {sidenavList.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                      <li 
                        className={`p-4 mt-10 mb-10 flex whitespace-nowrap text-dark-700 hover:bg-purple-300 rounded-full ${isActive ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white' : ''}`}
                        key={item.id}
                      >
                        <Link href={item.path}>
                          <div className="cursor-pointer flex items-center gap-2">
                            <item.icon className="w-6 h-6" />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <CreateForm />
              </>
            </SheetContent>
          </Sheet>    
        </SignedIn>

        <SignedOut>
          <Button className="button primary">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
    
  );
};

export default MobileNav;
