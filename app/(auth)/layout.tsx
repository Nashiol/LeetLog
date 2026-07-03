export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="hud-card w-full max-w-sm rounded-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">LeetLog</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Track your coding interview prep
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
