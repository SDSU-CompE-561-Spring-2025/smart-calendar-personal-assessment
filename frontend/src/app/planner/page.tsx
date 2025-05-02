'use client'
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';


/* import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" */

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

      
      {/* <div className="event-form">
        <div>
          <label>Title:</label>
          <input 
            type="text" 
            value={newEvent.title} 
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
            placeholder="Enter event title"
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input 
            type="datetime-local" 
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')} 
            onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})} 
          />
        </div>
        <div>
          <label>End Date:</label>
          <input 
            type="datetime-local" 
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')} 
            onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})} 
          />
        </div>
        <button onClick={handleAddEvent}>Add Event</button>
      </div> */}
    </div>
    
  );  
}