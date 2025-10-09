"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconAt,
  IconCirclesRelation,
  IconEye,
  IconEyeOff,
  IconLockFilled,
  IconSignature
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { UserRoundIcon, UserRoundXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { trpcClient } from "~/integration/trpc/client.trpc";
import { authClient } from "~/server/authentication/client.auth";
import { Button } from "~/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/shadcn/ui/dialog";
import { Field, FieldError, FieldGroup, FieldSet } from "~/shadcn/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "~/shadcn/ui/input-group";
import { ItemMedia } from "~/shadcn/ui/item";
import { Spinner } from "~/shadcn/ui/spinner";
import { CustomToast } from "../toasts";

const createAccountFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { error: "Name is required for account creation." }),
    email: z.email({ error: "Please enter a valid email." }),
    username: z
      .string()
      .min(3, {
        error: "Username must be at least 3 characters long."
      })
      .max(120, {
        error: "Username can be at most 120 characters long."
      }),
    password: z
      .string()
      .min(8, {
        error: "Password must be at least 8 characters long."
      })
      .max(128, { error: "Password can be at most 128 characters long." })
  })
  .superRefine(async (data, ctx) => {
    const { data: response } = await authClient.isUsernameAvailable({
      username: data.username
    });
    if (response?.available === false) {
      ctx.addIssue({
        code: "custom",
        message:
          "This username is not available. Please select a different one.",
        path: ["username"],
        continue: false
      });
    }
  });

export function CreateAccountDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      username: ""
    }
  });

  async function onSubmit(values: z.infer<typeof createAccountFormSchema>) {
    setIsPending(true);
    await authClient.signUp.email({
      ...values,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: async () => {
          toast.custom((id) => {
            return (
              <CustomToast
                key={id}
                id={id}
                content={{
                  icon: <UserRoundIcon />,
                  title: `${values.name} registered successfully`,
                  source: "Authentication",
                  description: "Redirecting to user dashboard"
                }}
              />
            );
          });
          await queryClient.invalidateQueries(
            trpcClient.authentication.isAuthenticated.queryFilter()
          );
          router.push("/dashboard");
        },
        onError(error) {
          toast.custom((id) => (
            <CustomToast
              key={id}
              id={id}
              content={{
                icon: <UserRoundXIcon />,
                title: error.error.message,
                source: "Authentication"
              }}
            />
          ));
        }
      }
    });
    setIsPending(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="rounded-lg"
          size="sm"
        >
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center">
          <ItemMedia variant={"icon"}>
            <IconCirclesRelation />
          </ItemMedia>
          <DialogTitle>Create a Zip In Account</DialogTitle>
          <DialogDescription>
            Welcome! Create an account to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Name"
                    {...register("name")}
                  />
                  <InputGroupAddon>
                    <IconSignature />
                  </InputGroupAddon>
                </InputGroup>
                {errors.name?.message && (
                  <FieldError>{errors.name.message}</FieldError>
                )}
              </Field>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Username"
                    {...register("username")}
                  />
                  <InputGroupAddon>
                    <UserRoundIcon />
                  </InputGroupAddon>
                </InputGroup>
                {errors.username?.message && (
                  <FieldError>{errors.username.message}</FieldError>
                )}
              </Field>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Email"
                    {...register("email")}
                  />
                  <InputGroupAddon>
                    <IconAt />
                  </InputGroupAddon>
                </InputGroup>
                {errors.email?.message && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    {...register("password")}
                  />
                  <InputGroupAddon>
                    <IconLockFilled />
                  </InputGroupAddon>
                  <InputGroupAddon align={"inline-end"}>
                    <Button
                      variant={"ghost"}
                      size={"icon-sm"}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsVisible((c) => !c);
                      }}
                    >
                      {isVisible ?
                        <IconEye />
                      : <IconEyeOff />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password?.message && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
            </FieldSet>
            <DialogFooter>
              <Button
                type="reset"
                variant={"secondary"}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending && <Spinner />}
                Create Account
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
