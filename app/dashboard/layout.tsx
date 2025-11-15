import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Dashboard - Open PRO",
  description: "Painel de controle",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        {children}
      </div>
    </ProtectedRoute>
  );
}