// components/navbar.tsx
import { Card, CardContent } from '@/components/ui/card';

export function Navbar() {
  return (
    <Card className="bg-slate-500 rounded-none shadow-sm">
      <CardContent className="py-2 px-6 flex items-center">
        <span className="text-xl font-semibold">Patient Dashboard</span>
      </CardContent>
    </Card>
  );
}
