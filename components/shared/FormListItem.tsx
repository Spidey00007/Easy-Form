import React, { useState } from "react";
import { Button } from "../ui/button";
import { Edit, Share, Trash } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { JsonForms, userResponses } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { Menu } from '@headlessui/react';

interface FormListItemProps {
  formRecord: {
    id: number;
    jsonform: string;
    theme?: string | null;
    background?: string | null;
    style?: string | null;
    createdBy: string;
    createdAt: string;
  };
  jsonForm: {
    formTitle: string;
    formHeading: string;
  };
  refreshData: () => void;
}

const FormListItem: React.FC<FormListItemProps> = ({ formRecord, jsonForm, refreshData }) => {
  const { user } = useUser();
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const onDeleteForm = async () => {
    try {
      const responseDeleteResult = await db
        .delete(userResponses)
        .where(eq(userResponses.formRef, formRecord.id));

      const formDeleteResult = await db
        .delete(JsonForms)
        .where(
          and(
            eq(JsonForms.id, formRecord.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress || "")
          )
        );

      if (formDeleteResult) {
        toast("Form deleted successfully");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      toast("Failed to delete form");
    }
  };

  const shareLink = `${window.location.origin}/aiform/${formRecord.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast("Link copied to clipboard");
    }).catch((error) => {
      console.error("Failed to copy link:", error);
      toast("Failed to copy link");
    });
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(jsonForm?.formTitle)}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(jsonForm?.formTitle)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-black">{jsonForm?.formTitle}</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Form and remove your Form from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteForm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className="text-sm text-gray-500">{jsonForm?.formHeading}</h2>
      <hr className="my-4" />
      <div className="flex justify-between gap-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              <Share className="w-5 h-5 mr-2" /> Share
            </Menu.Button>
          </div>
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={copyToClipboard}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex items-center px-4 py-2 text-sm`}
                  >
                    Copy Link
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={shareToTwitter}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex items-center px-4 py-2 text-sm`}
                  >
                    Share to Twitter
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={shareToFacebook}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex items-center px-4 py-2 text-sm`}
                  >
                    Share to Facebook
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={shareToLinkedIn}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex items-center px-4 py-2 text-sm`}
                  >
                    Share to LinkedIn
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
        <Link href={`/edit-form/${formRecord?.id}`}>
          <Button size="sm" className="flex gap-2">
            <Edit className="w-5 h-5" /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FormListItem;
