import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface formErrorProps {
  mesaage?: string;
}

export const FormError = ({ mesaage }: formErrorProps) => {
  if (!mesaage) return null;
  return (
    <div
      className="flex items-center gap-x-2 text-rose-500 bg-destructive/20
    p-3 rounded-md"
    >
      <ExclamationTriangleIcon className="h-4 w-4" />

      <p>{mesaage}</p>
    </div>
  );
};
