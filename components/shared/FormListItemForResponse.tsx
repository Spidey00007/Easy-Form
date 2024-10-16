import { Button } from '@/components/ui/button';
import { db } from '@/config';
import { userResponses } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface FormListItemProps {
  jsonForm: {
    formTitle: string;
    formHeading: string;
  };
  formRecord: {
    id: number;
  };
}

const FormListItemForResponse: React.FC<FormListItemProps> = ({ jsonForm, formRecord }) => {
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    const fetchResponseCount = async () => {
      const result = await db.select().from(userResponses)
        .where(eq(userResponses.formRef, formRecord.id));
      setResponseCount(result.length);
    };

    fetchResponseCount();
  }, [formRecord.id]);

  const exportToExcel = async () => {
    setLoading(true);
    const result = await db.select().from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id));

    const jsonData = result.map(item => JSON.parse(item.jsonResponse));

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${jsonForm.formTitle}.xlsx`);
    setLoading(false);
  };

  return (
    <div className='border shadow-sm rounded-lg p-4 my-5'>
      <h2 className='text-lg text-black'>{jsonForm.formTitle}</h2>
      <h2 className='text-sm text-gray-500'>{jsonForm.formHeading}</h2>
      <hr className='my-4' />
      <div className='flex justify-between items-center'>
        <h2 className='text-sm'>
          <strong>{responseCount}</strong> Responses
        </h2>
        <Button className="" size="sm"
          onClick={exportToExcel}
          disabled={loading}
        >
          {loading ? <Loader2 className='animate-spin' /> : 'Export'}
        </Button>
      </div>
    </div>
  );
};

export default FormListItemForResponse;
