import { Database } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-primary">
      <Database className="h-6 w-6" />
      <span className="text-lg font-headline font-bold">MongoGenius</span>
    </div>
  );
}
