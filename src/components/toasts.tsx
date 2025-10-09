"use client";

import { IconX } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "~/shadcn/ui/button";
import { ItemMedia } from "~/shadcn/ui/item";

interface ToastProps {
  icon: ReactNode;
  title: string;
  description?: string | undefined;
  source?: string | undefined;
  actions?: {
    variant: "default" | "outline" | "destructive" | "secondary" | "ghost";
    icon?: ReactNode;
    run: () => void;
    label: string;
  }[];
}

export function CustomToast({
  content,
  id
}: {
  content: ToastProps;
  id: string | number;
}) {
  return (
    <div
      className="flex gap-2 rounded-lg border border-border bg-popover p-2 text-popover-foreground"
      aria-label="success-toast"
    >
      <div aria-label="toast-icon">
        <ItemMedia
          variant={"icon"}
          className="size-10"
        >
          {content.icon}
        </ItemMedia>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex">
          <div className="">
            <p className="text-sm font-bold">
              {content.title}{" "}
              {content.source && (
                <span className="font-normal text-muted-foreground">
                  | {content.source}
                </span>
              )}{" "}
            </p>
            {content.description && (
              <p className="text-xs text-muted-foreground">
                {content.description}
              </p>
            )}
          </div>
          <Button
            variant={"ghost"}
            className="size-6"
            onClick={() => toast.dismiss(id)}
            aria-label="toast-close-button"
          >
            <IconX />
          </Button>
        </div>
        <div className="flex gap-2">
          {content.actions?.map((action) => (
            <Button
              variant={action.variant}
              onClick={action.run}
              key={action.label}
              size={"sm"}
              className="h-7"
            >
              {action.icon} {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
