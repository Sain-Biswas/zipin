"use client";

import {
  IconDeviceDesktop,
  IconLayout2Filled,
  IconLogout,
  IconMoonFilled,
  IconSunHighFilled
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { UserRoundIcon } from "lucide-react";
import { useTheme } from "next-themes";
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Item
          size={"sm"}
          className="rounded-lg p-0"
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconSunHighFilled className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <IconMoonFilled className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme("light");
                  }}
                >
                  Light
                  <DropdownMenuShortcut>
                    <IconSunHighFilled />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme("dark");
                  }}
                >
                  Dark
                  <DropdownMenuShortcut>
                    <IconMoonFilled />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme("system");
                  }}
                >
                  System
                  <DropdownMenuShortcut>
                    <IconDeviceDesktop />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
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
