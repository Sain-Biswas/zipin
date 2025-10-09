import { IconCirclesRelation } from "@tabler/icons-react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "~/shadcn/ui/item";
import { AuthenticationUser } from "./authentication-user";

export function Navbar() {
  return (
    <header className="m-auto flex items-center justify-between rounded-lg border border-border bg-card px-3 md:max-w-2/3">
      <Item
        size={"sm"}
        className="px-0"
      >
        <ItemMedia variant={"icon"}>
          <IconCirclesRelation />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="font-bold md:text-xl">Zip In</ItemTitle>
        </ItemContent>
      </Item>
      <AuthenticationUser />
    </header>
  );
}
