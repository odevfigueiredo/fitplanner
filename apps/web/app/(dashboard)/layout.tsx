import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[var(--background)] lg:flex">
      <div className="lg:sticky lg:top-0 lg:h-screen">
        <Sidebar />
      </div>
      <main className="w-full max-w-[100vw] min-w-0 flex-1 overflow-x-hidden px-4 pb-28 pt-5 md:p-8 xl:px-10">{children}</main>
    </div>
  );
}
