'use client'
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: 'Sample Event',
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date()
  });

  const handleAddEvent = () => {
    if (newEvent.title) {
      setEvents([...events, newEvent]);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date()
      });
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '20px' }}>
      <SidebarProvider>
      <SidebarInset>
        <header className="flex h-5 shrink-0 items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className='text-[30px] text-(--accentcolor2)'>+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Event/Habit</DialogTitle>
                <DialogDescription>
                  Add a new event or habit to your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                   Title
                  </Label>
                  <Input 
                    type="text" 
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                    placeholder="Enter event title"
                    className="col-span-3 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Start Date
                  </Label>
                  <Input 
                    type="datetime-local" 
                    value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')} 
                    onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})} 
                    className="col-span-3 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>End Date</Label>
                  <Input 
                    type="datetime-local" 
                    value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')} 
                    onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})} 
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
              <Button className="bg-(--accentcolor)" onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <SidebarTrigger className="mr-0 ml-auto rotate-180"/>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <section className="calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500}}
              views={['month', 'week', 'day']}
              defaultView='month'
              defaultDate={new Date()}
            />
          </section>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
      </SidebarProvider>
    </div>
  );  
}