import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Empty component
export function Empty() {
  return (
    <div className={cn("flex h-full items-center justify-center p-8")} onClick={() => toast('Coming soon')}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <i className="fa-solid fa-box-open text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-xl font-medium mb-2">即将上线</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">这个功能正在开发中，敬请期待！</p>
        <button 
          onClick={() => toast('Coming soon!')}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          了解更多
        </button>
      </div>
    </div>
  );
}