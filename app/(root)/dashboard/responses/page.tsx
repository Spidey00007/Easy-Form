"use client"
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import FormListItemForResponse from "@/components/shared/FormListItemForResponse";

const Responses: React.FC = () => {
  const [formList, setFormList] = useState<{ id: number; jsonform: string; }[]>([]);
  const { user } = useUser();

  useEffect(() => {
    user && getFormList();
  }, [user]);

  const getFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress || '')) as unknown as { id: number; jsonform: string; }[];

    setFormList(result);
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl flex items-center justify-between">
        Responses
      </h2>
      {formList.length === 0 ? (
        <div className="flex items-center justify-center h-full mt-20">
          <p>No responses available.</p>
        </div>
      ) : (
        <div>
          {formList.map((form, index) => (
            <FormListItemForResponse key={index} formRecord={form} jsonForm={JSON.parse(form.jsonform)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Responses;
