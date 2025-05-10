'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_HOST_BASE_URL } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Map full day names to the three-letter abbreviations expected by the backend
const dayMapping: Record<string, string> = {
  'monday': 'mon',
  'tuesday': 'tue',
  'wednesday': 'wed',
  'thursday': 'thu',
  'friday': 'fri',
  'saturday': 'sat',
  'sunday': 'sun',
};

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

// Color options for categories
const colorOptions = [
  { value: "red", label: "Red", bgClass: "bg-red-500" },
  { value: "blue", label: "Blue", bgClass: "bg-blue-500" },
  { value: "green", label: "Green", bgClass: "bg-green-500" },
  { value: "purple", label: "Purple", bgClass: "bg-purple-500" },
  { value: "pink", label: "Pink", bgClass: "bg-pink-500" },
  { value: "yellow", label: "Yellow", bgClass: "bg-yellow-500" },
  { value: "orange", label: "Orange", bgClass: "bg-orange-500" },
];

type Category = {
  id: number;
  name: string;
  color: string;
};

type HabitFormProps = {
  onSuccess?: () => void;
};

// Helper function to create a clean request payload
function createHabitPayload(name: string, duration: string, days: string[], categoryId: number) {
  // Create a clean object with only the fields we need
  // Explicitly constructing a new object to avoid any quantity field
  const durationValue = parseInt(duration);
  if (isNaN(durationValue) || durationValue <= 0) {
    throw new Error("Duration must be a positive number");
  }
  
  // Create a brand new object with only the required fields
  const payload = {
    name: name,
    duration: durationValue,
    days_of_week: days.map(day => dayMapping[day]),
    category_id: categoryId,
    start_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  };
  
  // Extra safety check to ensure no quantity field
  if ('quantity' in payload) {
    console.error("Quantity field detected in payload! This shouldn't happen.");
    // Create a new object without the quantity field
    const { quantity: _, ...cleanPayload } = payload as any;
    return cleanPayload;
  }
  
  return payload;
}

// Function to safely stringify payload without certain fields
function safeStringify(obj: any, omitFields: string[] = []) {
  const seen = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (omitFields.includes(key)) {
      return undefined; // Skip this field
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}

export function HabitForm({ onSuccess }: HabitFormProps) {
  const { theme, colorTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // New category form state
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('green');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Get appropriate button styles based on current theme
  const getButtonStyleClass = () => {
    switch(colorTheme) {
      case 'theme-green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'theme-orange':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'theme-purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'theme-pink':
        return 'bg-pink-600 hover:bg-pink-700 text-white';
      case 'theme-red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return theme === 'dark' ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-black hover:bg-gray-800 text-white';
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("You must be logged in to view categories");
        setLoadingCategories(false);
        return;
      }

      const response = await fetch(`${API_HOST_BASE_URL}/category`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      console.log("Categories:", data);
      setCategories(data);
      
      // Set default category if available
      if (data.length > 0) {
        setSelectedCategory(data[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Function to create a new category
  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setCreatingCategory(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("You must be logged in to create a category");
        setCreatingCategory(false);
        return;
      }

      const response = await fetch(`${API_HOST_BASE_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCategoryName,
          color: newCategoryColor
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create category: ${errorText}`);
      }

      const newCategory = await response.json();
      toast.success("Category created successfully");
      
      // Add new category to list and select it
      setCategories(prev => [...prev, newCategory]);
      setSelectedCategory(newCategory.id.toString());
      
      // Close dialog and reset form
      setIsCreateCategoryOpen(false);
      setNewCategoryName('');
      setNewCategoryColor('green');
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (selectedDays.length === 0) {
      toast.error("Please select at least one day of the week");
      return;
    }

    if (!duration.trim() || parseInt(duration) <= 0) {
      toast.error("Please enter a valid duration value (greater than 0)");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!mounted) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("You must be logged in to create habits");
        setLoading(false);
        return;
      }

      // Use the helper function to create a clean payload
      let habitData;
      try {
        habitData = createHabitPayload(habitName, duration, selectedDays, parseInt(selectedCategory));
      } catch (validationError) {
        toast.error((validationError as Error).message);
        setLoading(false);
        return;
      }

      console.log("Sending habit data:", JSON.stringify(habitData));
      
      // Extra safety check
      if ('quantity' in habitData) {
        console.error("Quantity still found in payload! Removing it...");
      }
      
      // Convert to string explicitly omitting 'quantity'
      const payloadString = safeStringify(habitData, ['quantity']);
      console.log("Final payload string:", payloadString);

      const response = await fetch(`${API_HOST_BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: payloadString
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      // Check for HTTP errors first
      if (!response.ok) {
        let errorMessage = '';
        
        try {
          const errorData = JSON.parse(responseText);
          console.error("Error response parsed:", errorData);
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : Array.isArray(errorData.detail) 
              ? errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
              : JSON.stringify(errorData);
        } catch (parseError) {
          // If response isn't valid JSON
          console.error("Parse error:", parseError);
          errorMessage = `Server error (${response.status}): ${responseText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      const data = JSON.parse(responseText);
      console.log("Habit created successfully:", data);
      
      toast.success("Habit created successfully");

      // Reset form
      setHabitName('');
      setDuration('');
      setSelectedDays([]);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create habit";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="p-4 text-foreground">Loading habit form...</div>;
  }

  return (
    <div className="p-4 text-foreground">
      <h3 className="text-lg font-medium mb-4">Create New Habit</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="habit-name">Habit Name</Label>
          <Input
            id="habit-name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Morning Meditation"
            className="mt-1 bg-background text-foreground border-border"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 10 minutes"
            className="mt-1 bg-background text-foreground border-border"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="category">Category</Label>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 text-xs">
                  + New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category for organizing your habits.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Fitness, Learning, Wellbeing"
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <RadioGroup 
                      value={newCategoryColor}
                      onValueChange={setNewCategoryColor}
                      className="flex flex-wrap gap-2"
                    >
                      {colorOptions.map((color) => (
                        <div key={color.value} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={color.value} 
                            id={`color-${color.value}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`color-${color.value}`}
                            className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                              newCategoryColor === color.value 
                                ? 'border-primary' 
                                : 'border-transparent'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full ${color.bgClass}`} />
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateCategoryOpen(false)}
                    className="bg-secondary text-secondary-foreground"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createCategory} 
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className={getButtonStyleClass()}
                  >
                    {creatingCategory ? 'Creating...' : 'Create Category'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            disabled={loadingCategories || categories.length === 0}
          >
            <SelectTrigger className="mt-1 bg-background text-foreground border-border">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingCategories && <p className="text-sm mt-1">Loading categories...</p>}
          {!loadingCategories && categories.length === 0 && 
            <p className="text-sm mt-1 text-red-500">No categories found. Please create a category first.</p>}
        </div>

        <div>
          <Label className="block mb-2">Days of Week</Label>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center">
                <Checkbox
                  id={day.id}
                  checked={selectedDays.includes(day.id)}
                  onCheckedChange={() => handleDayToggle(day.id)}
                />
                <label htmlFor={day.id} className="ml-2 text-sm text-foreground">
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className={`w-full ${getButtonStyleClass()}`}
          disabled={loading || categories.length === 0}
        >
          {loading ? 'Creating...' : 'Create Habit'}
        </Button>
      </form>
    </div>
  );
}