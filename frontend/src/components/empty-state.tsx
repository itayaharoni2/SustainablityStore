import { XCircle } from "lucide-react";

const EmptyState = ({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) => {
  return (
    <div className="relative col-span-full h-80 bg-gray-50 w-full p-12 flex flex-col items-center justify-center">
      <XCircle className="h-8 w-8 text-red-500" />
      <h3 className="font-semibold text-xl">{heading}</h3>
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
