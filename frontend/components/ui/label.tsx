export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-cattleya-black">{children}</label>;
}
