"use client";

import { IconLayout2Filled, IconLogout } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpcClient, type RouterOutputs } from "~/integration/trpc/client.trpc";
import { authClient } from "~/server/authentication/client.auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "~/shadcn/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from "~/shadcn/ui/item";
import { CustomToast } from "../toasts";

interface UserDropdownProps {
  user: RouterOutputs["authentication"]["isAuthenticated"]["user"];
}

export function UserDropdown({ user }: UserDropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Item
          size={"sm"}
          className="rounded-lg p-0 data-[state=open]:bg-muted data-[state=open]:text-muted-foreground"
        >
          <ItemMedia variant={"icon"}>
            <Avatar>
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback>
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-0">
            <ItemTitle className="text-xs">{user?.name}</ItemTitle>
            <ItemDescription className="text-xs">
              {user?.username}
            </ItemDescription>
          </ItemContent>
        </Item>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        sideOffset={4}
        className="min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0">
          <Item
            size={"sm"}
            className="rounded-lg data-[state=open]:bg-muted data-[state=open]:text-muted-foreground"
          >
            <ItemMedia variant={"icon"}>
              <Avatar>
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="gap-0">
              <ItemTitle>{user?.name}</ItemTitle>
              <ItemDescription>{user?.email}</ItemDescription>
            </ItemContent>
          </Item>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>
              Dashboard
              <DropdownMenuShortcut>
                <IconLayout2Filled />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: async () => {
                  toast.custom((id) => (
                    <CustomToast
                      key={id}
                      id={id}
                      content={{
                        icon: <UserRoundIcon />,
                        title: `${user?.name} signed out`,
                        source: "Authentication"
                      }}
                    />
                  ));
                  await queryClient.invalidateQueries(
                    trpcClient.authentication.isAuthenticated.queryFilter()
                  );
                  router.refresh();
                  router.push("/");
                }
              }
            });
          }}
        >
          Logout
          <DropdownMenuShortcut>
            <IconLogout />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
