"use client";

import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/integration/trpc/client.trpc";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from "~/shadcn/ui/item";
import { Skeleton } from "~/shadcn/ui/skeleton";
import { CreateAccountDialog } from "./create-account-dialog";
import { LogInDialog } from "./log-in-dialog";
import { UserDropdown } from "./user-dropdown";

export function AuthenticationUser() {
  const { data, error, isPending } = useQuery(
    trpcClient.authentication.isAuthenticated.queryOptions()
  );

  if (isPending) return <Skeleton className="h-10 w-36" />;

  if (error)
    return (
      <Item
        className="p-0"
        size={"sm"}
      >
        <ItemMedia variant={"icon"}>
          <IconExclamationCircleFilled />
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemTitle className="text-xs">Fetch failed</ItemTitle>
          <ItemDescription className="text-xs">
            Try reloading page
          </ItemDescription>
        </ItemContent>
      </Item>
    );

  if (data.success) return <UserDropdown user={data.user} />;

  return (
    <Item className="px-0">
      <ItemActions>
        <LogInDialog />
        <CreateAccountDialog />
      </ItemActions>
    </Item>
  );
}
