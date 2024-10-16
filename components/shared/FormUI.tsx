"use client";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit"; // Adjust the import path as needed
import { db } from "@/config";
import { userResponses } from "@/config/schema";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

interface Option {
  label: string;
  value: string;
}

interface FormFields {
  fieldName?: string;
  fieldTitle: string;
  fieldType: string;
  placeholder: string;
  label: string;
  required: boolean;
  options?: Option[];
}

interface FormUIProps {
  jsonForm: {
    formTitle: string;
    formHeading: string;
    fields: FormFields[];
  };
  onFieldUpdate: (value: Partial<FormFields>, index: number) => void;
  selectedTheme: string;
  selectedStyle: any;
  deleteField: (index: number) => void;
  onClose: () => void;
  editable: boolean;
  formId: number;
  enableSignIn:boolean;
}

const convertOptions = (options: (string | Option)[]): Option[] => {
  return options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
};

const FormUI: React.FC<FormUIProps> = ({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  onClose,
  editable,
  formId,
  enableSignIn,
}: FormUIProps) => {
  if (!jsonForm || !jsonForm.fields) {
    return null;
  }
  const {user,isSignedIn} = useUser();
  const [formData, setFormData] = useState<Record<string, any>>({});
  let formRef = useRef<HTMLFormElement>(null);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (fieldName: string, itemName: string, checked: boolean) => {
    setFormData((prev) => {
      const list = prev[fieldName] ? prev[fieldName] : [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...list, { label: itemName, value: checked }],
        };
      } else {
        return {
          ...prev,
          [fieldName]: list.filter((item: any) => item.label !== itemName),
        };
      }
    });
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formattedDate = new Date().toLocaleDateString("en-GB");
    const [day, month, year] = formattedDate.split("/").map((part) => part.padStart(2, "0"));
    const formattedDateDDMMYYYY = `${day}-${month}-${year}`;

    const result = await db.insert(userResponses).values({
      jsonResponse: JSON.stringify(formData),
      createdAt: formattedDateDDMMYYYY,
      formRef:formId,
    });

    if (result) {
      formRef.current?.reset();
      setFormData({});
      toast.success("Response Submitted Successfully");
    } else {
      toast.error("Internal Server Error");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onFormSubmit}
      className="border p-5 md:w-[800px] rounded-lg"
      data-theme={selectedTheme}
      style={{
        boxShadow: selectedStyle?.key === "boxshadow" ? "5px 5px 0px black" : undefined,
        border: selectedStyle?.key === "border" ? selectedStyle.value : undefined,
      }}
    >
      <h2 className="font-bold text-center text-2xl w-full truncate">
        {jsonForm.formTitle}
      </h2>
      <h2 className="text-sm text-gray-400 text-center w-full truncate">
        {jsonForm.formHeading}
      </h2>

      {jsonForm.fields.map((field, index) => {
        const options = field.options ? convertOptions(field.options) : undefined;

        return (
          <div key={index} className="flex items-center gap-2">
            {field.fieldType === "select" && options && options.length > 0 ? (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{field.label}</label>
                <Select
                  onValueChange={(value) => handleSelectChange(field.fieldName || "", value)}
                  required={field?.required || false}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.placeholder || ""} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option, optionIndex) => (
                      <SelectItem key={optionIndex} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : field.fieldType === "radio" ? (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{field.label}</label>
                <RadioGroup
                  onValueChange={(value) => handleSelectChange(field.fieldName || "", value)}
                  defaultValue={options?.[0]?.value}
                  required={field?.required || false}
                >
                  {options?.map((item, optionIndex) => (
                    <div className="flex items-center space-x-2 mb-2" key={optionIndex}>
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : field.fieldType === "checkbox" ? (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{field?.label}</label>
                {options && options.length > 0 ? (
                  options.map((item, optionIndex) => (
                    <div className="flex items-center space-x-2 mb-2" key={optionIndex}>
                      <Checkbox
                        id={item.value}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(field.fieldName || "", item.label, checked as boolean)
                        }
                        required={field?.required || false}
                      />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  ))
                ) : (
                  <Checkbox
                    className="m-3"
                    id={`checkbox-${index}`}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(field.fieldName || "", "", checked as boolean)
                    }
                    required={field?.required || false}
                  />
                )}
              </div>
            ) : (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{field.label}</label>
                <Input
                  type={field.fieldType}
                  placeholder={field.placeholder || ""}
                  name={field.fieldName || ""}
                  onChange={handleInputChange}
                  required={field?.required || false}
                />
              </div>
            )}
            {editable && (
              <FieldEdit
                defaultValue={{ ...field, options }}
                onUpdate={(value: any) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
                onClose={onClose}
              />
            )}
          </div>
        );
      })}

      {!enableSignIn?<button type="submit" className="btn btn-primary">
        Submit
      </button> :
       ( isSignedIn ? <button type="submit" className="btn btn-primary">
        Submit
      </button>
        :<Button>
      <SignInButton mode="modal">SignIn Before Submit</SignInButton>
      </Button> )
    }
    </form>
  );
};

export default FormUI;
