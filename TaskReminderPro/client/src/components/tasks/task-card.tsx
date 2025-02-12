import { Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Briefcase, User, ShoppingCart, Heart, MoreHorizontal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TaskCardProps {
  task: Task;
}

const categoryConfig = {
  work: {
    icon: Briefcase,
    color: "bg-blue-500",
  },
  personal: {
    icon: User,
    color: "bg-purple-500",
  },
  shopping: {
    icon: ShoppingCart,
    color: "bg-green-500",
  },
  health: {
    icon: Heart,
    color: "bg-red-500",
  },
  other: {
    icon: MoreHorizontal,
    color: "bg-gray-500",
  },
} as const;

export function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/tasks/${task.id}/complete`, {
        completed: !task.completed,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const CategoryIcon = categoryConfig[task.category].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      layout
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <motion.div 
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleMutation.mutate()}
              />
            </motion.div>
            <motion.div
              animate={{
                scale: task.completed ? 0.95 : 1,
                opacity: task.completed ? 0.7 : 1,
              }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            >
              <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </h3>
              <AnimatePresence>
                {task.description && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    {task.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Badge className={cn("flex gap-1 items-center", categoryConfig[task.category].color)}>
                <CategoryIcon className="h-3 w-3" />
                <span>{task.category}</span>
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}