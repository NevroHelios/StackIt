import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RenderTagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount,
}: RenderTagProps) => {
  return (
    <Link 
      href={`/tags/${_id}`} 
      className="flex justify-between items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 group relative overflow-hidden"
    >
      {/* Hover background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-green-50/20 dark:from-emerald-900/20 dark:to-green-900/10 opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-xl" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out rounded-xl" />
      
      <div className="relative z-10 flex items-center justify-between w-full gap-3">
        <Badge className="subtle-medium bg-emerald-100/60 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50 rounded-lg px-3 py-1.5 uppercase transition-all duration-300 group-hover:bg-emerald-200/70 dark:group-hover:bg-emerald-700/50 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 group-hover:border-emerald-300/70 dark:group-hover:border-emerald-600/70 group-hover:shadow-md group-hover:scale-105 relative overflow-hidden">
          {/* Badge shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-500 ease-out" />
          <span className="relative z-10 font-semibold">{name}</span>
        </Badge>
        
        {showCount && (
          <div className="relative">
            <p className="small-medium text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300 group-hover:font-semibold group-hover:scale-110">
              {totalQuestions}
            </p>
            {/* Count background glow on hover */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>
      
      {/* Left accent border */}
      <div className="absolute left-0 top-0 w-1 h-0 bg-gradient-to-b from-emerald-500 to-green-500 transition-all duration-300 group-hover:h-full rounded-r-full" />
    </Link>
  );
};

export default RenderTag;
