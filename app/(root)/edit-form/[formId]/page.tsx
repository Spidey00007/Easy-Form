"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import FormUI from "@/components/shared/FormUI";
import FieldEdit from "@/components/shared/FieldEdit";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import Controller from "@/components/shared/Controller";
import Link from "next/link";
import { Menu } from '@headlessui/react';

interface FormParams {
  formId: number;
}

interface JsonForm {
  formTitle: string;
  formHeading: string;
  fields: FormFields[];
}

interface FormFields {
  fieldTitle: string;
  fieldType: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: Option[];
}

interface Option {
  label: string;
  value: string;
}

const EditForm = ({ params }: { params: FormParams }) => {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const [record, setRecord] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newFieldType, setNewFieldType] = useState<string>("text");

  const [selectedTheme, setSelectedTheme] = useState<string>("light");
  const [selectedBackground, setSelectedBackground] = useState<string>("default");
  const [selectedStyle, setSelectedStyle] = useState<string>("none");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getFormData();
    }
  }, [user]);

  const getFormData = async () => {
    const response = await db
      .select()
      .from(JsonForms)
      .where(
        and(
          eq(JsonForms.id, params.formId),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress || "")
        )
      );
    if (response.length > 0) {
      setRecord(response[0]);
      setJsonForm(JSON.parse(response[0].jsonform));
      setSelectedTheme(response[0]?.theme || "light");
      setSelectedBackground(response[0]?.background || "default");
    }
  };

  useEffect(() => {
    if (jsonForm) {
      updateJsonFormInDb();
    }
  }, [updateTrigger]);

  const onFieldUpdate = (value: Partial<FormFields>, index: number) => {
    setJsonForm((prevForm) => {
      if (prevForm) {
        const updatedFields = [...prevForm.fields];
        updatedFields[index] = { ...updatedFields[index], ...value };
        return { ...prevForm, fields: updatedFields };
      }
      return prevForm;
    });

    setUpdateTrigger(Date.now());
  };

  const updateJsonFormInDb = async () => {
    if (record && jsonForm) {
      const result = await db
        .update(JsonForms)
        .set({
          jsonform: JSON.stringify(jsonForm),
        })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(
              JsonForms.createdBy,
              user?.primaryEmailAddress?.emailAddress || ""
            )
          )
        );
      toast("Field updated successfully");
      console.log(result);
    }
  };

  const deleteField = (indexToRemove: number) => {
    setJsonForm((prevForm) => {
      if (prevForm) {
        const updatedFields = prevForm.fields.filter(
          (_, index) => index !== indexToRemove
        );
        return { ...prevForm, fields: updatedFields };
      }
      return prevForm;
    });
    setUpdateTrigger(Date.now());
  };

  const addNewField = () => {
    const newField: FormFields = {
      fieldTitle: "New Field",
      fieldType: newFieldType,
      label: "New Field",
      placeholder: "Enter your data",
      required: false,
      options:
        newFieldType === "select" ||
        newFieldType === "radio" ||
        newFieldType === "checkbox"
          ? []
          : undefined,
    };

    setJsonForm((prevForm) => ({
      ...prevForm!,
      fields: [...prevForm!.fields, newField],
    }));
    setUpdateTrigger(Date.now());
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditButtonClick = () => {
    setIsEditDialogOpen(true);
  };

  const updateControllerFields = async (value: string, columnName: string): Promise<void> => {
    try {
      if (record) {
        const result = await db.update(JsonForms).set({
          [columnName]: value,
        })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(
              JsonForms.createdBy,
              user?.primaryEmailAddress?.emailAddress || ""
            )
          )
        );
        toast("Field updated successfully");
        console.log("Update result:", result);
      }
    } catch (error) {
      console.error("Error updating controller fields:", error);
    }
  };

  const shareLink = `${window.location.origin}/aiform/${record?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast("Link copied to clipboard");
    }).catch((error) => {
      console.error("Failed to copy link:", error);
      toast("Failed to copy link");
    });
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(jsonForm?.formTitle ?? '')}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(jsonForm?.formTitle ?? '')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-2">
        <h2
          onClick={() => router.back()}
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
        >
          <ArrowLeft />
          Back
        </h2>
        <div className="flex gap-2 ">
          <Link href={`/aiform/${record?.id}`} target="_blank">
            <Button className="flex gap-2">
              <SquareArrowOutUpRight className="h-5 w-5" /> Live Preview
            </Button>
          </Link>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                <Share2 className="w-5 h-5 mr-2" /> Share
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
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value: string) => {
              updateControllerFields(value, 'theme');
              setSelectedTheme(value);
            }}
            selectedBackground={(value: string) => {
              updateControllerFields(value, 'background');
              setSelectedBackground(value);
            }}
            selectedStyle={(value: any) => {
              updateControllerFields(value, 'style');
              setSelectedStyle(value);
            }}
            setSignInEnable={(value)=>{
              updateControllerFields(value, 'enableSignIn');
            }}
          />
        </div>
        <div className="md:col-span-2 border rounded-lg p-5 flex flex-col items-start"
          style={{ backgroundImage: selectedBackground }}
        >
          {jsonForm && (
            <FormUI
              jsonForm={jsonForm}
              selectedTheme={selectedTheme}
              selectedStyle={selectedStyle}
              onFieldUpdate={onFieldUpdate}
              deleteField={deleteField}
              onClose={handleEditDialogClose}
              editable={true}
              formId={record?.id}
              enableSignIn={record?.enableSignIn || false}
            />
          )}
          <div className="mt-5 w-full">
            <Select value={newFieldType} onValueChange={setNewFieldType}>
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={addNewField} className="mt-2">
              Add New Field
            </Button>
          </div>
        </div>
      </div>
      {isEditDialogOpen && (
        <FieldEdit
          defaultValue={{ fieldType: "text", label: "", placeholder: "" }}
          onUpdate={(updatedField) => {
            console.log(updatedField);
            handleEditDialogClose();
          }}
          deleteField={() => {
            console.log("Deleting field");
            handleEditDialogClose();
          }}
          onClose={handleEditDialogClose}
        />
      )}
    </div>
  );
};

export default EditForm;
