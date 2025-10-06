import { Navbar } from "~/components/navbar/navbar";

export default async function Home() {
  return (
    <main className="min-h-screen bg-sidebar p-4 pt-6 dark:bg-background">
      <section>
        <Navbar />
      </section>
    </main>
  );
}
