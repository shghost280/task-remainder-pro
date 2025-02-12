import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { Task } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface TaskShareDialogProps {
  task: Task;
}

export function TaskShareDialog({ task }: TaskShareDialogProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const shareMutation = useMutation({
    mutationFn: async () => {
      // First get or create the user
      const userResponse = await apiRequest("POST", "/api/users/find-or-create", { email });
      const user = await userResponse.json();

      // Then share the task with them
      const shareResponse = await apiRequest("POST", `/api/tasks/${task.id}/share`, {
        userId: user.id,
        canEdit: true,
      });
      return shareResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${task.id}/shares`] });
      toast({
        title: "Task shared",
        description: `Task "${task.title}" has been shared with ${email}`,
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
          <DialogDescription>
            Share this task with other users via their email address.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            shareMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={!email || shareMutation.isPending}
            className="w-full"
          >
            {shareMutation.isPending ? "Sharing..." : "Share Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
