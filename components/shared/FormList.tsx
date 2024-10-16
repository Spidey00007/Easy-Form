"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";

interface JsonForm {
  id: number;
  jsonform: string;
  theme?: string | null;
  background?: string | null;
  style?: string | null;
  createdBy: string;
  createdAt: string;
}

const FormList: React.FC = () => {
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

  return (
    <div className="mt-5">
      {formList.length === 0 ? (
        <div className="flex justify-center items-center h-full m-20">
          <p>Create a form to appear</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {formList.map((form, index) => (
            <div key={index}>
              <FormListItem
                jsonForm={JSON.parse(form.jsonform)}
                formRecord={form}
                refreshData={getFormList}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormList;
