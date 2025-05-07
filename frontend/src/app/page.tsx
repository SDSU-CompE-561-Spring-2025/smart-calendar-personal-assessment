'use client'

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';
import { API_HOST_BASE_URL } from "@/lib/constants";
import { useAuth } from '@/hooks/useAuth';
import { Headerinstance } from "@/components/header";
import { useTheme } from '@/components/theme-provider';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckSquare, Target, Rocket, CheckCircle, Star } from 'lucide-react';

// Define correct types for the calendar component
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Define habit type
type Habit = {
  id: string;
  name: string;
  quantity?: number;
  duration?: number;
  completed?: boolean;
};

// Define event type
type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
};

// Small Calendar Component
function SmallCalendar({ onDateChange }: { onDateChange: (date: Date) => void }) {
  // Use proper typing for the state
  const [date, setDate] = useState<Value>(new Date());
  
  // Use an inline arrow function for onChange
  return (
    <div className="small-calendar-wrapper">
      <Calendar 
        onChange={(value) => {
          setDate(value);
          if (value instanceof Date) {
            onDateChange(value);
          }
        }}
        value={date}
        className="homepage-calendar"
      />
    </div>
  );
}

// Events List Component
function EventsList({ events, isLoggedIn, selectedDate }: { events: Event[], isLoggedIn: boolean, selectedDate: Date }) {
  if (!isLoggedIn) {
    return (
      <div className="events-placeholder">
        <p className="mb-4">Please <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">log in</Link> to view your events</p>
      </div>
    );
  }

  const formattedDate = format(selectedDate, 'MMMM d, yyyy');

  if (events.length === 0) {
    return (
      <div className="events-placeholder text-center">
        <p className="text-muted-foreground mb-4">No events for {formattedDate}</p>
        <Link href="/planner">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            Add Event
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="events-list">
      <h3 className="font-medium mb-4">Events for {formattedDate}</h3>
      {events.map((event) => (
        <div key={event.id} className="event-item border border-border rounded p-3 mb-2">
          <div className="font-medium">{event.title}</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Link href="/planner">
          <button className="text-primary text-sm hover:text-primary/80 transition-colors underline">
            View All Events
          </button>
        </Link>
      </div>
    </div>
  );
}

function HabitsList({ habits, isLoggedIn }: { habits: Habit[], isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <div className="habits-placeholder">
        <p className="mb-4">Please <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">log in</Link> to view your habits</p>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="habits-placeholder text-center">
        <p className="text-muted-foreground mb-4">You don't have any habits yet</p>
        <Link href="/planner">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            Create Your First Habit
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="habits-list">
      <h3 className="font-medium mb-4">Your Habits</h3>
      {habits.map((habit) => (
        <div key={habit.id} className="habit-item border border-border rounded p-3 mb-2">
          {habit.name}
        </div>
      ))}
      <div className="mt-4 text-center">
        <Link href="/planner">
          <button className="text-primary text-sm hover:text-primary/80 transition-colors underline">
            Manage Habits
          </button>
        </Link>
      </div>
    </div>
  );
}

// Main Homepage Component
export default function Homepage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { theme, colorTheme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch habits from backend
      fetchHabits();
      // Fetch events for the selected date
      fetchEvents(selectedDate);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, selectedDate]);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_HOST_BASE_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      } else {
        console.error('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (date: Date) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_HOST_BASE_URL}/event`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter events for the selected date
        const filteredEvents = data
          .map((event: any) => ({
            id: event.id,
            title: event.name,
            start: new Date(event.start_time),
            end: new Date(event.end_time)
          }))
          .filter((event: Event) => {
            // Check if the event is on the selected date
            const eventDate = new Date(event.start);
            return (
              eventDate.getDate() === date.getDate() &&
              eventDate.getMonth() === date.getMonth() &&
              eventDate.getFullYear() === date.getFullYear()
            );
          });
        
        setEvents(filteredEvents);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  if (!mounted) {
    return null; // Avoid rendering during SSR to prevent hydration issues
  }

  // Show promotional layout for non-logged in users
  if (!isLoggedIn) {
    return (
      <div className="w-full bg-background min-h-screen">
        <Headerinstance />
        
        <div className="container mx-auto py-16 px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-6 text-foreground">Calendar+</h1>
            <p className="text-xl mb-8 text-muted-foreground">A better way to manage your time, track habits, and achieve your goals</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="feature p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center">
                <CalendarIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Smart Calendar</h3>
                <p className="text-muted-foreground">Organize your events with our intuitive calendar interface</p>
              </div>
              
              <div className="feature p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center">
                <CheckSquare className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Habit Tracking</h3>
                <p className="text-muted-foreground">Build consistent habits with customizable trackers</p>
              </div>
              
              <div className="feature p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Goal Setting</h3>
                <p className="text-muted-foreground">Set and achieve your goals with progress tracking</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link href="/signin">
                <button className="w-full bg-primary text-primary-foreground px-12 py-3 rounded-md text-lg font-medium shadow-md hover:bg-primary/90 transition-all">
                  Log In
                </button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-6">Why Choose Calendar+?</h2>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Seamlessly integrate events and habits in one place</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Beautiful, customizable themes to match your style</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Track your progress with visual statistics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Accessible on any device with a responsive design</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Rocket className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Get Started Today</h3>
                <p className="mb-6">Join thousands of users who have improved their productivity with Calendar+</p>
                <Link href="/signup">
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-all">
                    Create Your Free Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main application layout for logged-in users
  return (
    <div className="w-full bg-background min-h-screen">
      <Headerinstance />
      
      <div className="container mx-auto py-12 px-4 lg:px-8">
        <h1 className="text-center text-xl mb-12 text-foreground">A new way to improve your life ...</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto mb-8">
          <div className="feature-box bg-card text-card-foreground border border-border rounded shadow-sm w-full h-full flex flex-col">
            <h2 className="text-center py-3 border-b border-border">Calendar</h2>
            <div className="p-4 lg:p-6 flex flex-col flex-grow">
              <SmallCalendar onDateChange={handleDateChange} />
              <div className="mt-4 flex-grow">
                {loading || authLoading ? (
                  <p className="text-center text-muted-foreground">Loading events...</p>
                ) : (
                  <EventsList 
                    events={events} 
                    isLoggedIn={isLoggedIn} 
                    selectedDate={selectedDate} 
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="feature-box bg-card text-card-foreground border border-border rounded shadow-sm w-full h-full">
            <h2 className="text-center py-3 border-b border-border">Habits</h2>
            <div className="p-6 lg:p-8 h-full">
              {loading || authLoading ? (
                <p className="text-center text-muted-foreground">Loading habits...</p>
              ) : (
                <HabitsList habits={habits} isLoggedIn={isLoggedIn} />
              )}
            </div>
          </div>
        </div>
        
        {/* Go to Planner button - full width */}
        <div className="max-w-6xl mx-auto mb-16">
          <Link href="/planner" className="block">
            <button className="w-full bg-primary text-primary-foreground py-4 rounded-md text-lg font-medium shadow-md hover:bg-primary/90 transition-all">
              Go to Full Planner
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
