import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Zap, Clock } from "lucide-react";

export default function Profile() {
  const { user } = useStore();

  if (!user) return null;

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground text-lg">{user.handle}</p>
          <div className="flex items-center gap-2 mt-2">
             <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
               {user.selectedNiche ? user.selectedNiche.toUpperCase() : 'NO NICHE'}
             </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Points" value={user.points} color="text-yellow-500" />
        <StatCard icon={TrendingUp} label="Streak" value="12 Days" color="text-green-500" />
        <StatCard icon={Zap} label="Engagements" value="142" color="text-blue-500" />
        <StatCard icon={Clock} label="Time Saved" value="4.5h" color="text-purple-500" />
      </div>

      {/* Boost Section */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent text-accent-foreground rounded-lg">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Profile Boost</h3>
                <p className="text-sm text-muted-foreground">Increase your visibility in the community feed</p>
              </div>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Boost Now (500 pts)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
               <span>Next Level Progress</span>
               <span className="font-medium">650 / 1000 pts</span>
             </div>
             <Progress value={65} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            +10
                        </div>
                        <div>
                            <p className="font-medium">Commented on @sarah_edo</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
      <Icon className={color} size={24} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
    </Card>
  );
}
