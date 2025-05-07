'use client'
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Item = {
  id: string;
  name: string;
  quantity?: number;
  duration?: number;
  daysofweek?: string[];
  category?: number;
  checked?: boolean;
};

const initialItems: Item[] = [
  { id: "1", name: "Item One", quantity: 1 },
  { id: "2", name: "Item Two",},
  { id: "3", name: "Item Three" },
];

const DragAndDropList: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  return (
    <div className="p-5 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Habits List</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                      <Checkbox/>
                      <span className="p-4">{item.name}</span>
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