interface CardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function Card({ title, value, description }: CardProps) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#e8e8e8] dark:border-[#1f1f1f] p-5">
      <p className="text-[11px] uppercase tracking-widest font-medium text-[#999] dark:text-[#555]">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#111] dark:text-white">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-[#bbb]">{description}</p>
      )}
    </div>
  );
}
