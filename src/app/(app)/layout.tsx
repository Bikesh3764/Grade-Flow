import { AppLayout } from "@/components/layout/AppLayout";

export default function AppGroupedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
