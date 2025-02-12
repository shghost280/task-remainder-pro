import { Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function setupNotifications() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

export function notifyHighPriorityTask(task: Task) {
  if (Notification.permission === "granted" && task.priority === "high") {
    const notification = new Notification("High Priority Task Added", {
      body: task.title,
      icon: "/favicon.ico",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Also show in-app toast
    const { toast } = useToast();
    toast({
      title: "High Priority Task",
      description: task.title,
      variant: "destructive",
    });
  }
}
