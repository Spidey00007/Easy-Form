import React, { useState } from "react";
import { Edit, Trash, X } from "lucide-react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Option {
  label: string;
  value: string;
}

interface FormField {
  fieldType: string;
  label: string;
  placeholder: string;
  options?: Option[];
}

type FieldEditProps = 
{
  defaultValue: FormField;
  onUpdate: (value: Partial<FormField>) => void;
  deleteField: () => void;
  onClose: () => void;
}

const FieldEdit = ({ defaultValue, onUpdate, deleteField, onClose }: FieldEditProps) => {
  const [label, setLabel] = useState<string>(defaultValue.label);
  const [placeholder, setPlaceholder] = useState<string>(defaultValue.placeholder);
  const [options, setOptions] = useState<Option[]>(defaultValue.options || []);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].label = value;
    updatedOptions[index].value = value || `option-${index}`; // Ensure value is set
    setOptions(updatedOptions);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    const newIndex = options.length;
    setOptions([...options, { label: `Option ${newIndex + 1}`, value: `option-${newIndex}` }]);
  };

  const handleUpdateClick = () => {
    const updatedField = {
      fieldType: defaultValue.fieldType,
      label: label,
      placeholder: placeholder,
      options: options.length > 0 ? options : undefined,
    };

    onUpdate(updatedField);
    setIsEditDialogOpen(false); // Close the dialog after updating
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsEditDialogOpen(isOpen);
  };

  return (
    <div className="flex gap-2">
      <AlertDialog open={isEditDialogOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Edit className="h-4 w-5 text-gray-500 cursor-pointer" onClick={() => setIsEditDialogOpen(true)} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle>Edit fields</AlertDialogTitle>
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDialogHeader>
          <div>
            <label className="text-xs">Label Name</label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Placeholder</label>
            <Input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>
          {(defaultValue.fieldType === "select" ||
            defaultValue.fieldType === "radio" ||
            defaultValue.fieldType === "checkbox") && (
              <div>
                <h3 className="text-xs">Options</h3>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option.label}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <Button size="sm" className="m-1" type="button" onClick={() => handleDeleteOption(index)}>
                      Delete
                    </Button>
                  </div>
                ))}
                <Button size="sm" className="mt-5" onClick={handleAddOption}>
                  Add Option
                </Button>
              </div>
            )}
          <Button
            size="sm"
            className="mt-3"
            onClick={handleUpdateClick}
          >
            Update
          </Button>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger>
          <Trash className="h-4 w-5 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteField}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FieldEdit;
