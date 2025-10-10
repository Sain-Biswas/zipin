"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { trpcClient } from "~/integration/trpc/client.trpc";
import { Spinner } from "~/shadcn/ui/spinner";

export default function AuthenticatedTemplate({ children }: LayoutProps<"/">) {
  const { isPending, data } = useQuery(
    trpcClient.authentication.isAuthenticated.queryOptions()
  );

  const router = useRouter();

  if (isPending)
    return (
      <main className="grid size-full place-content-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p>Loading</p>
        </div>
      </main>
    );

  if (data?.user) return children;

  router.push("/");
}
