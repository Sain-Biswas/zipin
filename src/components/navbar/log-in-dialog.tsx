"use client";

import { Button } from "~/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/shadcn/ui/dialog";

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
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
