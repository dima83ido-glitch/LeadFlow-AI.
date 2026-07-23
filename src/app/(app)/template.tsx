export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-1 flex-col gap-6 duration-300 ease-out">
      {children}
    </div>
  );
}
