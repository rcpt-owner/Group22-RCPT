import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subText: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subText }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground mt-2">{subText}</p>
    </CardContent>
  </Card>
);

export default StatsCard;
