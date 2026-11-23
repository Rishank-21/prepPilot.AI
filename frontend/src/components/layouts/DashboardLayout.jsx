import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
