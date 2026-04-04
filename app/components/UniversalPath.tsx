// components/UniversalPath.tsx
import Link from "next/link";

interface PathNode {
  id: string;
  type: string;
  status: 'locked' | 'completed' | 'current';
}

export default function UniversalPath({ items }: { items: PathNode[] }) {
  return (
    <div className="flex flex-col items-center gap-10 py-10">
      {items.map((item, index) => (
        <Link key={item.id} href={`/lessons/${item.id}`}>
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center 
            shadow-xl cursor-pointer transition-transform hover:scale-110
            ${index % 2 === 0 ? 'translate-x-12' : '-translate-x-12'}
            ${item.status === 'completed' ? 'bg-success' : 'bg-neutral'}
          `}>
            {item.type === 'quiz' ? '🏆' : '⭐'}
          </div>
        </Link>
      ))}
    </div>
  );
}