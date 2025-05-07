'use client'
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Habit = {
  id: string;
  name: string;
  quantity?: number;
  duration?: number;
  daysofweek?: string[];
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  category?: string
  completed?: boolean;
};

const initialHabits: Habit[] = [
  { id: "1", name: "Habit One", quantity: 1, category: "Other", completed: false },
  { id: "2", name: "Habit Two", quantity: 2, category:"Other", completed: false },
  { id: "3", name: "Habit Three", category:"Other", completed: false },  
];

const DragAndDropList: React.FC = () => {
  const [Habits, setHabits] = useState<Habit[]>(initialHabits);
  const [HabitName, setHabitName] = useState<string>("");

  const [HabitDaysOfWeek, setHabitDaysOfWeek] = useState<string[]>([]);
  const [HabitMonday, setHabitMonday] = useState<boolean>(false);
  const [HabitTuesday, setHabitTuesday] = useState<boolean>(false);
  const [HabitWednesday, setHabitWednesday] = useState<boolean>(false);
  const [HabitThursday, setHabitThursday] = useState<boolean>(false);
  const [HabitFriday, setHabitFriday] = useState<boolean>(false);
  const [HabitSaturday, setHabitSaturday] = useState<boolean>(false);
  const [HabitSunday, setHabitSunday] = useState<boolean>(false);
  const [HabitQuantity, setHabitQuantity] = useState<number>(0);
  const [HabitDuration, setHabitDuration] = useState<number>(0);
  const [HabitCategory, setHabitCategory] = useState<string>("Other");
  const [HabitCompleted, setHabitCompleted] = useState<boolean>(false);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...Habits];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setHabits(reordered);
  };

  const addHabit = () => {
    const newHabit: Habit = {
      id: (Habits.length + 1).toString(),
      name: HabitName,
      category: HabitCategory,
      completed: false,
    };
    setHabits([...Habits, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits(Habits.filter((habit) => habit.id !== id));
  };

  const toggleHabitCompletion = (id: string) => {
    setHabits(
      Habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };



  return (
    <div className="p-5 mt-5">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className='text-[30px] text-(--accentcolor2)'>+</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Habit</DialogTitle>
            <DialogDescription>
              Add a new habit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                type="text"
                value={HabitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Enter habit title"
                className="col-span-3 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Days" className="text-right">Days</Label>
              <div className="flex gap-4">
                <Label>Mon</Label>
                <Label>Tue</Label>
                <Label>Wen</Label>
                <Label>Thu</Label>
                <Label>Fri</Label>
                <Label>Sat</Label>
                <Label>Sun</Label>
              </div>           
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Days" className="text-right"></Label>
              <div className="col-span-3 flex gap-6">
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
                <Checkbox></Checkbox>
              </div>             
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input
                type="number"
                min={0}
                value={HabitQuantity}
                onChange={(e) => setHabitQuantity(Number(e.target.value))}
                placeholder="Enter quantity"
                className="col-span-3 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <Input
                type="number"
                min={0}
                value={HabitDuration}
                onChange={(e) => setHabitDuration(Number(e.target.value))}
                placeholder="Enter duration"
                className="col-span-3 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select value={HabitCategory} onValueChange={(value) => setHabitCategory(value as string)}>
                  <SelectTrigger className="w-[200]">
                    <SelectValue placeholder="Category"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-(--accentcolor)" onClick={addHabit}>Add Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <h2 className="text-xl font-bold mb-4 text-center">Habits List</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Habits.map((Habit, index) => (
                <Draggable key={Habit.id} draggableId={Habit.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 bg-white rounded-lg shadow transition
                        ${
                          snapshot.isDragging
                            ? "bg-blue-100 shadow-lg"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <Checkbox
                        checked={Habit.completed}
                        onCheckedChange={() => toggleHabitCompletion(Habit.id)}
                      />
                      <span className="pl-4">{Habit.name}</span>

                      <div className="text-xs pt-4 pl-8">
                        <span className="p-2 bg-(--accentcolor) text-white rounded-md">{Habit.category}</span>
                        <span>
                          <Button
                            variant="outline"
                            size={null}
                            onClick={() => removeHabit(Habit.id)}
                            className="absolute right-10 ml-auto pl-[0] text-red-500 hover:bg-transparent bg-transparent border-none shadow-none"
                            aria-label="Delete Habit"
                          >
                            <Trash2 className="h-1 w-1 "/>
                          </Button>
                        </span>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragAndDropList;