'use client'
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { API_HOST_BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, MoreHorizontalIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Habit = {
  id: number;
  name: string;
  quantity?: number;
  duration?: number;
  days_of_week?: string[];
  category_id?: number;
  category_name?: string;
  completed?: boolean;
};

type HabitLog = {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
};

const DragAndDropList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, colorTheme } = useTheme();
  const [deletingHabit, setDeletingHabit] = useState<number | null>(null);
  const [updatingHabit, setUpdatingHabit] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchHabits();
    fetchCompletedHabits();
  }, [mounted]);

  const fetchHabits = async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(`${API_HOST_BASE_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching habits:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedHabits = async () => {
    if (!mounted) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch(`${API_HOST_BASE_URL}/habits/habit-logs/today`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn("Failed to fetch completed habits");
        return;
      }

      const habitLogs = await response.json();
      const completedIds = new Set(habitLogs.map((log: HabitLog) => log.habit_id));
      setCompletedHabits(completedIds as Set<number>);
    } catch (err) {
      console.error("Error fetching completed habits:", err);
    }
  };

  const toggleHabitCompletion = async (habitId: number, completed: boolean) => {
    setUpdatingHabit(habitId);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("You must be logged in to update habits");
        return;
      }

      // Current date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];

      // Create or update the habit log for today
      const response = await fetch(`${API_HOST_BASE_URL}/habits/${habitId}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: today
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update habit: ${response.statusText}`);
      }

      // Update local state
      if (completed) {
        setCompletedHabits(prev => {
          const newSet = new Set(prev);
          newSet.add(habitId);
          return newSet;
        });
      } else {
        setCompletedHabits(prev => {
          const newSet = new Set(prev);
          newSet.delete(habitId);
          return newSet;
        });
      }

      toast.success(completed ? "Habit marked as completed!" : "Habit marked as incomplete");
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update habit");
    } finally {
      setUpdatingHabit(null);
    }
  };

  const deleteHabit = async (habitId: number) => {
    setDeletingHabit(habitId);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("You must be logged in to delete habits");
        return;
      }

      const response = await fetch(`${API_HOST_BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete habit: ${response.statusText}`);
      }

      // Remove the habit from the state
      setHabits(habits.filter(habit => habit.id !== habitId));
      toast.success("Habit deleted successfully");
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete habit");
    } finally {
      setDeletingHabit(null);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...habits];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setHabits(reordered);
  };

  if (!mounted || loading) {
    return (
      <div className="p-5 flex justify-center items-center h-64 text-foreground">
        <p>Loading habits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 flex flex-col justify-center items-center h-64">
        <p className="text-destructive mb-2">Error: {error}</p>
        <Button onClick={fetchHabits} size="sm" variant="outline">Retry</Button>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="p-5 flex flex-col justify-center items-center h-64">
        <p className="text-muted-foreground mb-4">You don't have any habits yet</p>
        <Button 
          onClick={() => {
            // This is handled by the parent component
            // which will switch to the create view
            const createButton = document.querySelector('[data-create-habit]') as HTMLButtonElement;
            if (createButton) createButton.click();
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Your First Habit
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 text-foreground">
      <h2 className="text-xl font-bold mb-4 text-center">Habits List</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {habits.map((habit, index) => {
                const isCompleted = completedHabits.has(habit.id);
                return (
                <Draggable key={String(habit.id)} draggableId={String(habit.id)} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 bg-card text-card-foreground rounded-lg shadow transition border border-border
                        ${
                          snapshot.isDragging
                            ? "bg-accent/20 shadow-lg"
                            : "hover:bg-accent/10"
                        }
                        ${isCompleted ? "opacity-60" : "opacity-100"}
                        `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <Checkbox 
                            id={`habit-${String(habit.id)}`} 
                            checked={isCompleted}
                            onCheckedChange={(checked) => {
                              toggleHabitCompletion(habit.id, checked === true);
                            }}
                            disabled={updatingHabit === habit.id}
                            className={updatingHabit === habit.id ? "opacity-50" : ""}
                          />
                          <label 
                            htmlFor={`habit-${String(habit.id)}`} 
                            className={`ml-3 flex-1 ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                          >
                            <div className="font-medium">{habit.name}</div>
                            {habit.quantity && (
                              <div className="text-sm text-muted-foreground">
                                Quantity: {habit.quantity}
                              </div>
                            )}
                            {habit.duration && (
                              <div className="text-sm text-muted-foreground">
                                Duration: {habit.duration} minutes
                              </div>
                            )}
                            {habit.days_of_week && habit.days_of_week.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Days: {habit.days_of_week.join(', ')}
                              </div>
                            )}
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-background text-foreground">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Are you sure you want to delete "{habit.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-background text-foreground border-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteHabit(habit.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deletingHabit === habit.id}
                                >
                                  {deletingHabit === habit.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              )})}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragAndDropList;