import { useQuery } from "@tanstack/react-query";
import { Task, type Category } from "@shared/schema";
import { TaskCard } from "./task-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function TaskList() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const filteredTasks = tasks?.filter((task) =>
    selectedCategory === "all" || task.category === selectedCategory
  ) || [];

  const highPriorityTasks = filteredTasks.filter((t) => t.priority === "high");
  const otherTasks = filteredTasks.filter((t) => t.priority !== "high");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex justify-end"
      >
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {highPriorityTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}