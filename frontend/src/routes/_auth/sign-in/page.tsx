import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/auth-context";
import { useSignInAccount } from "@/lib/react-query/mutations";
import { SignInSchema } from "@/schemas/auth";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type TAuthCredentialValidator = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const navigate = useNavigate();

  const form = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const {
    formState: { errors },
  } = form;

  const { mutateAsync: signIn, isPending } = useSignInAccount();
  const { checkAuthUser } = useUserContext();

  const onSubmit = async (values: TAuthCredentialValidator) => {
    const data = await signIn(values);

    if (data?.success) {
      toast.success("Signed In successfully");
      checkAuthUser();
      return navigate("/");
    }

    toast.error("Invalid credentials");
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
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              to="/sign-up"
            >
              {"Don't have an account?"}
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
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={isPending} type="submit">
                  Sign in
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
