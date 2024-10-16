"use client"
import FormUI from '@/components/shared/FormUI';
import { db } from '@/config';
import { JsonForms } from '@/config/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface LiveAiFormProps {
  params: { formid: number };
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
const LiveAiForm: React.FC<LiveAiFormProps> = ({ params }: LiveAiFormProps) => {

    const [record, setRecord] = useState<any>(null);
    const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);

  useEffect(() => {
    params && getFormData();
  }, [params]); 

  const getFormData = async () => {
    try {
      const result = await db.select().from(JsonForms).where(eq(JsonForms.id, Number(params?.formid) ));
      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
      console.log(result);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  return (
    <div className='p-10 flex justify-center items-center'
    style={{
        backgroundImage: record?.background
    }}
    >

         {jsonForm && (
            <FormUI
              jsonForm={jsonForm}
              selectedTheme={record?.theme}
              selectedStyle={JSON.parse(record?.style)}
              onFieldUpdate={()=>console.log}
              deleteField={()=>console.log}
              onClose={()=>console.log}
              editable = {false}
              formId = {record.id}
              enableSignIn = {record?.enableSignIn || false}
            />
          )}
          <Link className='flex gap-2 items-center bg-black text-white 
          px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer'
          href={'/'}
          >
            Built By Naman
          </Link>
    </div>
  );
};

export default LiveAiForm;
