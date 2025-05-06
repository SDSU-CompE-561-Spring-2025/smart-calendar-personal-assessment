'use client'
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';
import { Headerinstance } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { API_HOST_BASE_URL } from "@/lib/constants" 

// Map day strings to numeric values
const dayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

// Initialize localizer
const initializeLocalizer = () => {
  const savedStartDay = typeof window !== 'undefined' ?
    localStorage.getItem("calendar-start-day") || "sunday" : "sunday";

  moment.updateLocale('en', { week: { dow: dayMap[savedStartDay] } });
  return momentLocalizer(moment);
};

const localizer = initializeLocalizer();

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: 'Sample Event',
    }
  ]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedStartDay = localStorage.getItem("calendar-start-day") || "sunday";
      moment.updateLocale('en', { week: { dow: dayMap[savedStartDay] } });
      setEvents([...events]); // trigger re-render
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [events]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date()
  });

  const handleAddEvent = async () => {
    if (!newEvent.title) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_HOST_BASE_URL}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newEvent.title,
          start_time: newEvent.start.toISOString(),
          end_time: newEvent.end.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create event');
      }

      const savedEvent = await response.json();

      setEvents([
        ...events,
        {
          title: savedEvent.name,
          start: new Date(savedEvent.start_time),
          end: new Date(savedEvent.end_time),
        }
      ]);

      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date()
      });

    } catch (error) {
      console.error('Create event error:', error);
    }
  };

  return (
    <div>
      <Headerinstance />
      <div className="calendar-container p-[20px] pb-[0px]">
        <SidebarProvider>
          <SidebarInset>
            <header className="flex shrink-0 items-center gap-2">
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
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                        className="col-span-3 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label>Start Date</Label>
                      <Input
                        type="datetime-local"
                        value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                        className="col-span-3 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-(--accentcolor)" onClick={handleAddEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <SidebarTrigger className="mr-0 ml-auto rotate-180" />
            </header>
            <div className="flex flex-1 flex-col">
              <section className="calendar">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 1000 }}
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
    </div>
  );
}
