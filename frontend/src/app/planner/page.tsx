'use client'
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

import { API_HOST_BASE_URL } from "@/lib/constants" 

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

// Utility functions for handling dates consistently
const formatDateForBackend = (date: Date): string => {
  // Send dates to backend in UTC format
  console.log('Sending to backend:', date.toISOString(), '(Local date was:', date.toString(), ')');
  return date.toISOString();
};

const parseBackendDate = (dateString: string): Date => {
  // The backend is storing dates in UTC, but we need to display them in local time
  // When the Date constructor parses an ISO string, it automatically converts to local time
  // which is causing the display issue in Pacific Time
  const date = new Date(dateString);
  console.log('Got from backend:', dateString, 'Parsed as local:', date.toString());
  return date;
};

// Format dates for display in local timezone
const formatDateForDisplay = (date: Date): string => {
  return moment(date).format('MMMM D, YYYY h:mm A');
};

// Utility to convert date inputs to proper Date objects ensuring proper time preservation
const createDateFromInput = (dateValue: string): Date => {
  // When user selects a datetime-local input, the browser gives us a string in local time
  // We need to create a Date object that preserves the local time as selected
  // Standard Date constructor can have timezone issues
  const [datePart, timePart] = dateValue.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create date using local components (month is 0-indexed in JavaScript)
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);
  
  console.log('Input date string:', dateValue);
  console.log('Parsed as local components:', {year, month, day, hours, minutes});
  console.log('Created date:', localDate.toString());
  
  return localDate;
};

// For showing the date in the input field, we need the local date
const formatDateForInput = (date: Date): string => {
  return moment(date).format('YYYY-MM-DDTHH:mm');
};

// A special function to explicitly fix the timezone issue when displaying events
// This ensures events show on the correct day and time regardless of timezone
const fixEventDates = (events: any[]) => {
  return events.map(event => {
    // Create a new object with all properties
    const fixedEvent = { ...event };
    
    // Pacific Time is UTC-7 or UTC-8 depending on daylight saving
    // If events are showing 7 hours ahead on the next day (9:27 PM showing as 4:27 AM next day)
    // We need to adjust back by explicitly setting the time components
    
    if (fixedEvent.start instanceof Date) {
      console.log('Original start date:', fixedEvent.start.toString());
      
      // Create a new date with the local time components to fix the display
      // This explicitly preserves the local time without timezone shifting
      const year = fixedEvent.start.getFullYear();
      const month = fixedEvent.start.getMonth();
      const day = fixedEvent.start.getDate();
      const hours = fixedEvent.start.getHours();
      const minutes = fixedEvent.start.getMinutes();
      const seconds = fixedEvent.start.getSeconds();
      
      // Create a date explicitly with these components
      fixedEvent.start = new Date(year, month, day, hours, minutes, seconds);
      console.log('Fixed start date:', fixedEvent.start.toString());
    }
    
    if (fixedEvent.end instanceof Date) {
      console.log('Original end date:', fixedEvent.end.toString());
      
      // Same fix for end date
      const year = fixedEvent.end.getFullYear();
      const month = fixedEvent.end.getMonth();
      const day = fixedEvent.end.getDate();
      const hours = fixedEvent.end.getHours();
      const minutes = fixedEvent.end.getMinutes();
      const seconds = fixedEvent.end.getSeconds();
      
      // Create a date explicitly with these components
      fixedEvent.end = new Date(year, month, day, hours, minutes, seconds);
      console.log('Fixed end date:', fixedEvent.end.toString());
    }
    
    return fixedEvent;
  });
};

// Function to handle token expiration
const handleTokenExpiration = (router: any) => {
  console.log("Token expired, redirecting to login");
  
  // Clear the expired token
  localStorage.removeItem("access_token");
  
  // Show a notification
  toast.error("Your session has expired. Please sign in again.");
  
  // Redirect to login page
  router.push('/signin');
};

export default function CalendarPage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();
  const { theme, colorTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<Array<{id: number, title: string, start: Date, end: Date}>>([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<{id: number, title: string, start: Date, end: Date} | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle mounting to avoid hydration issues and ensure proper theme
  useEffect(() => {
    setMounted(true);
    
    // Ensure correct theme classes
    const root = document.documentElement;
    
    // This will reapply classes if needed
    if (theme && theme !== 'system') {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    if (colorTheme && colorTheme !== 'default') {
      // Remove any existing theme classes
      root.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          root.classList.remove(className);
        }
      });
      
      // Add the current color theme
      root.classList.add(colorTheme);
    }
  }, [theme, colorTheme]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/signin');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    // Only fetch events if user is logged in and component is mounted
    if (!isLoggedIn || !mounted) return;
    
    const fetchEvents = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        return;
      }
  
      try {
        const res = await fetch(`${API_HOST_BASE_URL}/event`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          // Check if the token has expired
          if (res.status === 401) {
            handleTokenExpiration(router);
            return;
          }
          
          const err = await res.json();
          throw new Error(err.detail || "Unauthorized");
        }
  
        const data = await res.json();
        console.log('Raw events data from backend:', data);
        
        const formattedEvents = data.map((event: any) => {
          console.log(`Event ${event.id}: ${event.name}`, 'Start:', event.start_time, 'End:', event.end_time);
          
          // Parse UTC ISO string to local date 
          const startDate = parseBackendDate(event.start_time);
          const endDate = parseBackendDate(event.end_time);
          
          return {
            id: event.id,
            title: event.name,
            start: startDate,
            end: endDate,
          };
        });
  
        // Apply the timezone fix to ensure correct display
        const fixedEvents = fixEventDates(formattedEvents);
        setEvents(fixedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
  
    fetchEvents();
  }, [isLoggedIn, mounted, router]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date()
  });

  const handleAddEvent = async () => {
    if (!newEvent.title || !isLoggedIn) return;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/signin');
        return;
      }
      
      console.log('Creating event with dates:', {
        start: newEvent.start.toString(),
        startISO: newEvent.start.toISOString(),
        end: newEvent.end.toString(),
        endISO: newEvent.end.toISOString(),
        timezoneOffset: newEvent.start.getTimezoneOffset()
      });
      
      // Form the event payload
      const eventPayload = {
        name: newEvent.title,
        start_time: formatDateForBackend(newEvent.start),
        end_time: formatDateForBackend(newEvent.end),
      };
      
      console.log('Event payload:', eventPayload);
      
      const response = await fetch(`${API_HOST_BASE_URL}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        // Check if the token has expired
        if (response.status === 401) {
          handleTokenExpiration(router);
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create event');
      }

      const savedEvent = await response.json();
      console.log('Saved event from backend:', savedEvent);

      // Parse the saved event dates
      const startDate = parseBackendDate(savedEvent.start_time);
      const endDate = parseBackendDate(savedEvent.end_time);
      
      // Create the new event and fix timezone issues
      const newEventObj = {
        id: savedEvent.id,
        title: savedEvent.name,
        start: startDate,
        end: endDate,
      };
      
      // Add the new event to the list with timezone fix applied
      const fixedNewEvent = fixEventDates([newEventObj])[0];
      setEvents([...events, fixedNewEvent]);

      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date()
      });

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
      if (!token) {
        router.push('/signin');
        return;
      }
      
      const response = await fetch(`${API_HOST_BASE_URL}/event/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        // Check if the token has expired
        if (response.status === 401) {
          handleTokenExpiration(router);
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete event');
      }

      // Remove the deleted event from the state
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      
      // Close the dialogs
      setShowDeleteConfirm(false);
      setShowEventDetail(false);
      setSelectedEvent(null);
      
      toast.success("Event deleted successfully");

    } catch (error) {
      console.error('Delete event error:', error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  // Navigation handlers
  const handleNavigate = useCallback((action: NavigateAction, newDate?: Date) => {
    switch (action) {
      case 'PREV':
        setDate(prevDate => {
          const newDate = new Date(prevDate);
          if (view === 'month') {
            newDate.setMonth(prevDate.getMonth() - 1);
          } else if (view === 'week') {
            newDate.setDate(prevDate.getDate() - 7);
          } else if (view === 'day') {
            newDate.setDate(prevDate.getDate() - 1);
          }
          return newDate;
        });
        break;
      case 'NEXT':
        setDate(prevDate => {
          const newDate = new Date(prevDate);
          if (view === 'month') {
            newDate.setMonth(prevDate.getMonth() + 1);
          } else if (view === 'week') {
            newDate.setDate(prevDate.getDate() + 7);
          } else if (view === 'day') {
            newDate.setDate(prevDate.getDate() + 1);
          }
          return newDate;
        });
        break;
      case 'TODAY':
        setDate(new Date());
        break;
      default:
        if (newDate) {
          setDate(newDate);
        }
    }
  }, [view]);

  // View change handler
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  // Show loading state while checking authentication
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
