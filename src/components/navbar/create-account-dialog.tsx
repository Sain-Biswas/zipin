"use client";

import { LinkIcon } from "lucide-react";
import z from "zod";
import { authClient } from "~/server/authentication/client.auth";
import { Button } from "~/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/shadcn/ui/dialog";
import { ItemMedia } from "~/shadcn/ui/item";

export const createAccountFormSchema = z
  .object({
    name: z.string(),
    email: z.email(),
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
    if (!response?.available) {
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
            <LinkIcon />
          </ItemMedia>
          <DialogTitle>Create a Zip In Account</DialogTitle>
          <DialogDescription>
            Welcome! Create an account to get started
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
