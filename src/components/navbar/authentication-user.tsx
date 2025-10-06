"use client";

import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/integration/trpc/client.trpc";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import { Item, ItemActions, ItemMedia } from "~/shadcn/ui/item";
import { Skeleton } from "~/shadcn/ui/skeleton";
import { CreateAccountDialog } from "./create-account-dialog";
import { LogInDialog } from "./log-in-dialog";

export function AuthenticationUser() {
  const { data, error, isPending } = useQuery(
    trpcClient.authentication.isAuthenticated.queryOptions()
  );

  if (isPending) return <Skeleton className="h-10 w-36" />;

  if (error) return <Item className="px-0">Error: {error.message}</Item>;

  if (data.success)
    return (
      <Item className="px-0">
        <ItemMedia variant="image">
          <Avatar>
            <AvatarImage src={data.user.image ?? undefined} />
            <AvatarFallback>
              {data.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
      </Item>
    );

  return (
    <Item className="px-0">
      <ItemActions>
        <LogInDialog />
        <CreateAccountDialog />
      </ItemActions>
    </Item>
  );
}
