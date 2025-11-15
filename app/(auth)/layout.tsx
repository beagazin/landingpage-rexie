import PageIllustration from "@/components/page-illustration";
import Footer from "@/components/ui/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex flex-col">
      <PageIllustration multiple />

      <div className="flex flex-grow items-center justify-center">
        {children}
      </div>
      
      <Footer />
    </main>
  );
}