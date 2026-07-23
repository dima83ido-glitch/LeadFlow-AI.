export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 ease-out">{children}</div>
  );
}
