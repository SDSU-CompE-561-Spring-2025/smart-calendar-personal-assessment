'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, View, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';
import 'moment-timezone';
import { Headerinstance } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme-provider';
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
import { API_HOST_BASE_URL } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const dayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

const initializeLocalizer = () => {
  const savedStartDay = typeof window !== 'undefined' ?
    localStorage.getItem("calendar-start-day") || "sunday" : "sunday";

  moment.updateLocale('en', { week: { dow: dayMap[savedStartDay] } });
  return momentLocalizer(moment);
};

const localizer = initializeLocalizer();

const formatDateForInput = (date: Date): string => {
  return moment(date).format('YYYY-MM-DDTHH:mm');
};

const createDateFromInput = (dateValue: string): Date => {
  return new Date(dateValue);
};

const formatDateForDisplay = (date: Date): string => {
  return moment(date).format('MMMM D, YYYY h:mm A');
};

const handleTokenExpiration = (router: any) => {
  localStorage.removeItem("access_token");
  toast.error("Your session has expired. Please sign in again.");
  router.push('/signin');
};

export default function CalendarPage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();
  const { theme, colorTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<Array<{ id: number, title: string, start: Date, end: Date }>>([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<{ id: number, title: string, start: Date, end: Date } | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (theme && theme !== 'system') {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    if (colorTheme && colorTheme !== 'default') {
      root.classList.forEach(c => c.startsWith('theme-') && root.classList.remove(c));
      root.classList.add(colorTheme);
    }
  }, [theme, colorTheme]);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push('/signin');
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (!isLoggedIn || !mounted) return;
    const fetchEvents = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await fetch(`${API_HOST_BASE_URL}/event`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          if (res.status === 401) return handleTokenExpiration(router);
          const err = await res.json();
          throw new Error(err.detail || "Unauthorized");
        }
        const data = await res.json();
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.name,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    fetchEvents();
  }, [isLoggedIn, mounted, router]);

  const handleAddEvent = async () => {
    if (!newEvent.title || !isLoggedIn) return;
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return router.push('/signin');
      const timezoneOffsetMs = newEvent.start.getTimezoneOffset() * 60 * 1000;
      const eventPayload = {
        name: newEvent.title,
        start_time: new Date(newEvent.start.getTime() - timezoneOffsetMs).toISOString(),
        end_time: new Date(newEvent.end.getTime() - timezoneOffsetMs).toISOString(),
      };
      const response = await fetch(`${API_HOST_BASE_URL}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });
      if (!response.ok) {
        if (response.status === 401) return handleTokenExpiration(router);
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create event');
      }
      const savedEvent = await response.json();
      setEvents([...events, {
        id: savedEvent.id,
        title: savedEvent.name,
        start: new Date(savedEvent.start_time),
        end: new Date(savedEvent.end_time),
      }]);
      setNewEvent({ title: '', start: new Date(), end: new Date() });
    } catch (error) {
      console.error('Create event error:', error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  const handleEventSelect = useCallback((event: any) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  }, []);

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !isLoggedIn) return;
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return router.push('/signin');
      const response = await fetch(`${API_HOST_BASE_URL}/event/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) return handleTokenExpiration(router);
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete event');
      }
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setShowDeleteConfirm(false);
      setShowEventDetail(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const handleNavigate = useCallback((action: NavigateAction, newDate?: Date) => {
    switch (action) {
      case 'PREV': setDate(prev => new Date(prev.setMonth(prev.getMonth() - 1))); break;
      case 'NEXT': setDate(prev => new Date(prev.setMonth(prev.getMonth() + 1))); break;
      case 'TODAY': setDate(new Date()); break;
      default: if (newDate) setDate(newDate);
    }
  }, []);

  const handleViewChange = useCallback((newView: View) => setView(newView), []);

 if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Headerinstance />
        <div className="flex justify-center items-center h-screen">
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in and still on this page (before redirect completes), show message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Headerinstance />
        <div className="flex justify-center items-center h-screen">
          <p className="text-foreground">Please log in to access your planner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Headerinstance />

      <div className="calendar-container p-[20px] pb-[0px] text-foreground">
        <div className="mb-4 flex flex-col space-y-2">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleNavigate('TODAY')}
                className="text-foreground border-border hover:bg-accent/10"
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigate('PREV')}
                className="text-foreground border-border hover:bg-accent/10"
              >
                Back
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigate('NEXT')}
                className="text-foreground border-border hover:bg-accent/10"
              >
                Next
              </Button>
            </div>
            
            <div className="w-[158px]">{/* Empty div to balance the layout */}</div>
          </div>
          
          <div className="flex justify-center z-10 relative">
            <div className="flex space-x-2">
              <Button 
                variant={view === 'month' ? 'default' : 'outline'} 
                onClick={() => handleViewChange('month')}
                className={view === 'month' ? 'bg-primary text-primary-foreground' : 'text-foreground border-border hover:bg-accent/10'}
              >
                Month
              </Button>
              <Button 
                variant={view === 'week' ? 'default' : 'outline'} 
                onClick={() => handleViewChange('week')}
                className={view === 'week' ? 'bg-primary text-primary-foreground' : 'text-foreground border-border hover:bg-accent/10'}
              >
                Week
              </Button>
              <Button 
                variant={view === 'day' ? 'default' : 'outline'} 
                onClick={() => handleViewChange('day')}
                className={view === 'day' ? 'bg-primary text-primary-foreground' : 'text-foreground border-border hover:bg-accent/10'}
              >
                Day
              </Button>
            </div>
          </div>
        </div>
        <SidebarProvider defaultOpen={true}>
          <SidebarInset className="bg-background border-border">
            <header className="flex shrink-0 items-center gap-2 bg-background text-foreground">

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-[30px] text-primary">+</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
                  <DialogHeader>
                    <DialogTitle>Add Event/Habit</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Add a new event or habit to your calendar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                        className="col-span-3 focus:outline-none bg-background border-border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Start Date</Label>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(newEvent.start)}
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          const newDate = createDateFromInput(dateValue);
                          
                          // Debug the date being created
                          console.log('Creating event start date:', {
                            inputValue: dateValue,
                            parsedDate: newDate.toString(),
                            utcString: newDate.toISOString(),
                            year: newDate.getFullYear(),
                            month: newDate.getMonth(),
                            day: newDate.getDate(),
                            hours: newDate.getHours(),
                            minutes: newDate.getMinutes()
                          });
                          
                          setNewEvent({ ...newEvent, start: newDate });
                        }}
                        className="col-span-3 focus:outline-none bg-background border-border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">End Date</Label>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(newEvent.end)}
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          const newDate = createDateFromInput(dateValue);
                          
                          // Debug the date being created
                          console.log('Creating event end date:', {
                            inputValue: dateValue,
                            parsedDate: newDate.toString(),
                            utcString: newDate.toISOString(),
                            year: newDate.getFullYear(),
                            month: newDate.getMonth(),
                            day: newDate.getDate(),
                            hours: newDate.getHours(),
                            minutes: newDate.getMinutes()
                          });
                          
                          setNewEvent({ ...newEvent, end: newDate });
                        }}
                        className="col-span-3 bg-background border-border"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <SidebarTrigger className="mr-5 ml-auto rotate-180 text-foreground z-10 relative" />
            </header>
            <div className="flex flex-1 flex-col bg-background">
              <section className="calendar bg-background text-foreground">
                <Calendar 
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 'calc(100vh - 180px)' }}
                  date={date}
                  view={view}
                  onNavigate={(newDate, view, action) => handleNavigate(action, newDate)}
                  onView={handleViewChange}
                  className="rbc-calendar-wrapper"
                  toolbar={false}
                  onSelectEvent={handleEventSelect}
                  onRangeChange={(range) => {
                    console.log('Calendar range changed:', range);
                  }}
                  dayPropGetter={(date) => {
                    return {
                      className: '',
                      style: {},
                    };
                  }}
                  eventPropGetter={(event) => {
                    console.log('Rendering event:', event.title, 'Start:', event.start.toString());
                    return {
                      className: '',
                      style: {
                        backgroundColor: '#F43F5E',
                        color: 'white',
                        border: 'none',
                      },
                    };
                  }}
                />
              </section>
            </div>
          </SidebarInset>
          <AppSidebar side="right" />
        </SidebarProvider>

        {/* Event Detail Dialog */}
        <Dialog open={showEventDetail} onOpenChange={setShowEventDetail}>
          <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Event Details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Start Time</Label>
                <p className="text-sm">{selectedEvent ? formatDateForDisplay(selectedEvent.start) : ''}</p>
              </div>
              <div className="grid gap-2">
                <Label>End Time</Label>
                <p className="text-sm">{selectedEvent ? formatDateForDisplay(selectedEvent.end) : ''}</p>
              </div>
            </div>
            <DialogFooter className="flex space-x-2 justify-between">
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                Delete Event
              </Button>
              <Button onClick={() => setShowEventDetail(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="bg-background text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to delete this event? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-background text-foreground border-border">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDeleteEvent}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>  
    );
}
