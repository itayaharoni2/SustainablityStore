import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from "@/context/auth-context";
import { useCreateUserAccount } from "@/lib/react-query/mutations";
import { SignUpSchema } from "@/schemas/auth";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CategoryEnum } from "@/types";

type TAuthCredentialValidator = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const form = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(SignUpSchema),
  });

  const navigate = useNavigate();

  const {
    formState: { errors },
  } = form;

  const { mutateAsync: signUp, isPending } = useCreateUserAccount();
  const { checkAuthUser } = useUserContext();

  const onSubmit = async (values: TAuthCredentialValidator) => {
    const data = await signUp(values);

    if (data?.success) {
      toast.success("Account created successfully");
      checkAuthUser();
      return navigate("/");
    }

    toast.error("Account creation failed");
  };

  return (
    <>
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link to="/">
              <img
                src="/logo.png"
                alt="logo"
                width={80}
                height={80}
                className="object-fit"
              />
            </Link>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              to="/sign-in"
            >
              Already have an account? Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          className={cn({
                            "focus-visible:ring-red-500": !!errors.name,
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          className={cn({
                            "focus-visible:ring-red-500": !!errors.email,
                          })}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                        type="password"
                          disabled={isPending}
                          className={cn({
                            "focus-visible:ring-red-500": !!errors.password,
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              className="capitalize"
                              placeholder="Select a category"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(
                            Object.keys(CategoryEnum) as Array<
                              keyof typeof CategoryEnum
                            >
                          ).map((key) => (
                            <SelectItem key={key} value={CategoryEnum[key]}>
                              {CategoryEnum[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category that interests you the most
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isPending} type="submit">
                  Sign up
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
