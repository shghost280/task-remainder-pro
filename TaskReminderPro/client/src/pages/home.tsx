import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { setupNotifications } from "@/lib/notifications";

export default function Home() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm />
          </CardContent>
        </Card>
        
        <TaskList />
      </div>
    </div>
  );
}
