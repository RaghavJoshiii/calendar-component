📅 Calendar View – Assignment Submission

This project is a fully interactive, accessible, and responsive Calendar Application built using:

React + TypeScript
Vite
TailwindCSS
Storybook
date-fns

LocalStorage for event persistence

It includes Month View, Week View, and complete event management with modal dialogs.

**Features Implemented**
# 📆 Month View

6×7 fixed grid (42 cells) as required in assignment
Displays previous and next month days
Today highlighted visually
Hover interaction
Selected cell highlight
Events displayed as colored chips
Hover delete button (×)
“+ More” indicator for overflow
Keyboard navigation (Arrow keys, Enter, Esc, Tab)
ARIA roles and labels for accessibility

# 📅 Week View

24-hour vertical time grid
Events positioned using minute-based calculation
Hover delete support
Responsive layout
ARIA-compliant structure
Time labels for each hour

# 📝 Event Modal

Supports:
Title
Description
Start date & time
End date & time
Color picker
Create / Edit modes
ESC to close
Click outside closes modal
Validation

How to run development server
````npm install````
````npm run dev````

