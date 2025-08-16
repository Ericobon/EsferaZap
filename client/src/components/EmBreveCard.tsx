import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface EmBreveCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}

export function EmBreveCard({ icon: Icon, title, description, features }: EmBreveCardProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-center max-w-md mb-6">
          {description}
        </p>
        {features && (
          <div className="mb-6">
            <ul className="text-sm text-gray-600 space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
          Em Breve
        </Badge>
      </CardContent>
    </Card>
  );
}