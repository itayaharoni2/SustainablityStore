import { buttonVariants } from "@/components/ui/button";
import { LucideProps } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThankyouPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Thank You for Your Purchase
        </h1>
        <p className="mt-4 text-muted-foreground">
          We appreciate your business and are grateful for your support. Your
          order is on its way and you'll receive it soon.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Link to="/" className={buttonVariants()}>
            Back to Homepage
          </Link>
          <Link
            to="/orders"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            View Order &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function CircleCheckIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
