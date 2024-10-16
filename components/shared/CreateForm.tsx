"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AichatSession } from "@/config/AiModal";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { JsonForm, JsonForms } from "@/config/schema";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";



const CreateForm = () => {
  const [dialog, setDialog] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();
 
  const prompt = "Please provide a JSON format description for a form that includes essential details like the formTitle (title of the form) and formHeading (a brief description or heading for the form). For each field within the form, specify fieldName (optional identifier), fieldTitle (display name for the field), fieldType (input type such as text, select, radio, checkbox, or textarea), placeholder (optional example text), label (prompt or description for the field), and whether the field is required (true/false). If the fieldType is 'select', 'radio', or 'checkbox', ensure to include options with labels and optional values for user selections."
  const createform = async () => {
    setLoading(true);
    const result = await AichatSession.sendMessage("Description: " + input + prompt);
    const responseText = result.response.text();
    console.log(responseText);

    if (responseText) {
      const formattedDate = new Date().toLocaleDateString('en-GB');
      const [day, month, year] = formattedDate.split('/').map(part => part.padStart(2, '0')).reverse();
      const formattedDateDDMMYYYY = `${day}-${month}-${year}`;

      const formValues: JsonForm = {
        jsonform: responseText,
        createdBy: user?.primaryEmailAddress?.emailAddress || '',
        createdAt: formattedDateDDMMYYYY,
        enableSignIn: false,
      };

      try {
        const resp = await db.insert(JsonForms).values(formValues).returning({ id: JsonForms.id });
        const insertedId = resp[0]?.id;

        if (insertedId) {
          route.push(`/edit-form/${insertedId}`);
        }
      } catch (error) {
        console.error('Error inserting form:', error);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setDialog(true)}>+ Create AI Form</Button>
      <Dialog open={dialog} onOpenChange={(open) => setDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-3"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write Description for your form"
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button variant="destructive" onClick={() => setDialog(false)}>
                  Cancel
                </Button>
                <Button disabled={loading} onClick={createform}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Create'}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
