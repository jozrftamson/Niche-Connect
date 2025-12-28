import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function ComplianceBanner() {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div 
        onClick={() => setMinimized(false)}
        className="fixed top-4 right-4 z-[60] bg-green-100 text-green-800 p-2 rounded-full shadow-lg cursor-pointer hover:bg-green-200 transition-colors"
      >
        <ShieldCheck size={20} />
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 sticky top-0 z-40 flex items-start gap-3">
      <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
      <div className="flex-1 text-sm text-amber-900">
        <p className="font-semibold">Compliance Notice</p>
        <p className="opacity-90 leading-tight mt-0.5">
          Automated actions on third-party platforms are strictly prohibited. 
          All interactions must be manually approved and executed by you.
        </p>
      </div>
      <button 
        onClick={() => setMinimized(true)}
        className="text-amber-500 hover:text-amber-700 text-xs font-medium px-2 py-1"
      >
        Dismiss
      </button>
    </div>
  );
}
