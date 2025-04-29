'use client'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';

// Define correct types for the calendar component
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Small Calendar Component
function SmallCalendar() {
  // Use proper typing for the state
  const [date, setDate] = useState<Value>(new Date());
  
  // Use an inline arrow function for onChange
  return (
    <div className="small-calendar-wrapper">
      <Calendar 
        onChange={(value) => {
          setDate(value);
        }}
        value={date}
        className="homepage-calendar"
      />
    </div>
  );
}

// Habits Placeholder Component
function HabitsPlaceholder() {
  return (
    <div className="habits-placeholder">
      <h3>Your Habits</h3>
      <p>Track your daily progress here</p>
      <div className="habits-coming-soon">
        Todo list coming soon...
      </div>
    </div>
  );
}

// Main Homepage Component
export default function Homepage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">A new way to improve your life ...</h1>
      
      <div className="feature-boxes">
        <div className="feature-box">
          <h2>Calendar</h2>
          <SmallCalendar />
        </div>
        
        <div className="feature-box">
          <h2>Habits</h2>
          <HabitsPlaceholder />
        </div>
      </div>
      
      <h2 className="take-control">Take Control Of You</h2>
      
      <Link href="/signup">
        <button className="sign-up-button">Sign Up</button>
      </Link>
    </div>
  );
}
