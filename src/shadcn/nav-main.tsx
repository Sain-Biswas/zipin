"use client";

import {
  IconChartBar,
  IconLayout2Filled,
  IconLink,
  IconMail
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuickCreateDialog } from "~/components/quick-create-dialog";

import { Button } from "~/shadcn/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/shadcn/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayout2Filled
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: IconChartBar
  },
  {
    title: "Links",
    url: "/links",
    icon: IconLink
  }
] as const;

export function NavMain() {
  const path = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <QuickCreateDialog />
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                variant={path === item.url ? "outline" : "default"}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
