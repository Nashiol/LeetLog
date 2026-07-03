export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">LeetLog</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your coding interview prep
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
