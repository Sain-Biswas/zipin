"use client";

import {
  IconCreditCard,
  IconDeviceDesktop,
  IconDotsVertical,
  IconLogout,
  IconMoonFilled,
  IconNotification,
  IconSunHighFilled,
  IconUserCircle
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "~/integration/trpc/client.trpc";

import { UserRoundIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomToast } from "~/components/toasts";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "~/shadcn/ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export function NavUser() {
  const { data, isPending } = useQuery(
    trpcClient.authentication.isAuthenticated.queryOptions()
  );

  const { setTheme } = useTheme();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { isMobile } = useSidebar();

  if (isPending) {
    return <Skeleton className="h-12 w-full" />;
  }

  if (!data?.success) return <div>Error</div>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={data.user.image ?? undefined}
                  alt={data.user.name}
                />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {data.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data.user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {data.user.username}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data.user.image ?? undefined}
                    alt={data.user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {data.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {data.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
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
                            title: `${data.user.name} signed out`,
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
              <IconLogout />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
