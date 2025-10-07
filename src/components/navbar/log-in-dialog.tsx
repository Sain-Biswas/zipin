"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
  LockIcon,
  UserRoundIcon,
  UserRoundXIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet
} from "~/shadcn/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "~/shadcn/ui/input-group";
import { ItemMedia } from "~/shadcn/ui/item";
import { Spinner } from "~/shadcn/ui/spinner";
import { Switch } from "~/shadcn/ui/switch";
import { CustomToast } from "../toasts";

const logInFormSchema = z.object({
  nameORusername: z.string(),
  password: z.string()
});

export function LogInDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [switchEmailUsername, setSwitchEmailUsername] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      nameORusername: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof logInFormSchema>) {
    setIsPending(true);

    if (switchEmailUsername) {
      await authClient.signIn.email({
        email: values.nameORusername,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            toast.custom((id) => (
              <CustomToast
                id={id}
                key={id}
                content={{
                  icon: <UserRoundIcon />,
                  title: "User signed in successfully",
                  source: "Authentication"
                }}
              />
            ));
            router.refresh();
            router.push("/dashboard");
          },
          onError: ({ error }) => {
            toast.custom((id) => (
              <CustomToast
                id={id}
                key={id}
                content={{
                  icon: <UserRoundXIcon />,
                  title: error.message,
                  source: "Authentication"
                }}
              />
            ));
          }
        }
      });
    } else {
      await authClient.signIn.username({
        username: values.nameORusername,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            toast.custom((id) => (
              <CustomToast
                id={id}
                key={id}
                content={{
                  icon: <UserRoundIcon />,
                  title: "User signed in successfully",
                  source: "Authentication"
                }}
              />
            ));
            router.refresh();
            router.push("/dashboard");
          },
          onError: ({ error }) => {
            toast.custom((id) => (
              <CustomToast
                id={id}
                key={id}
                content={{
                  icon: <UserRoundXIcon />,
                  title: error.message,
                  source: "Authentication"
                }}
              />
            ));
          }
        }
      });
    }

    setIsPending(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-lg"
          size={"sm"}
        >
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center">
          <ItemMedia variant={"icon"}>
            <LinkIcon />
          </ItemMedia>
          <DialogTitle>Log In to Zip In</DialogTitle>
          <DialogDescription>
            Welcome back! Log In to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <Field orientation={"horizontal"}>
                <FieldContent>
                  <FieldLabel htmlFor="switch-email-username">
                    Use email instead of username.
                  </FieldLabel>
                  <FieldDescription>
                    If enabled email for registered user will be used instead of
                    username.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="switch-email-username"
                  value={switchEmailUsername ? "on" : "off"}
                  onCheckedChange={(c) => {
                    setSwitchEmailUsername(c);
                  }}
                />
              </Field>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    placeholder={switchEmailUsername ? "Email" : "Username"}
                    {...register("nameORusername")}
                  />
                  <InputGroupAddon>
                    {switchEmailUsername ?
                      <AtSignIcon />
                    : <UserRoundIcon />}
                  </InputGroupAddon>
                </InputGroup>
                {errors.nameORusername?.message && (
                  <FieldError> {errors.nameORusername.message} </FieldError>
                )}
              </Field>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    {...register("password")}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                  <InputGroupAddon align={"inline-end"}>
                    <Button
                      variant={"ghost"}
                      size={"icon-sm"}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((curr) => !curr);
                      }}
                    >
                      {showPassword ?
                        <EyeIcon />
                      : <EyeOffIcon />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
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
                Log In
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
