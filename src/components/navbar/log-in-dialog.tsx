"use client";

import { LinkIcon } from "lucide-react";
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

export function LogInDialog() {
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
      </DialogContent>
    </Dialog>
  );
}
