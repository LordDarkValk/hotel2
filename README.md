Hotel Cleaning System
A web application for managing hotel room cleaning assignments.
Setup

Create the folder structure as shown above.
Place all files in their respective directories.
Open index.html in a browser or use VS Code's Live Server extension for development.

Features

Register Tab: Input maid count, names, and rooms not needing cleaning. Assigns rooms evenly and saves with timestamp.
Records Tab: View, edit, delete, or print records. Download all records as CSV.
Responsive Design: Clean, professional UI with Tailwind CSS.
Data Storage: Uses localStorage for persistent data.

Room Configuration
Predefined rooms:

1st Floor: 101-122
2nd Floor: 201-219
3rd Floor: 301-314
4th Floor: 401-416
5th Floor: 501-512, 514-516

Distribution Logic

For floors 1-3: Rooms are distributed in consecutive blocks as evenly as possible among the maids.
For floors 4-5: Rooms are distributed using round-robin (alternating assignment to maids).

Usage

In the Register tab, enter the number of maids and their names.
Specify rooms not needing cleaning (comma-separated).
Submit to assign rooms and save the record.
In the Records tab, view all records, edit, delete, or print individual records, or download all as CSV.

Notes

Replace assets/images/logo.png with your hotel's logo.
Uses localStorage, so data persists only in the browser used.
Ensure all rooms entered are valid (e.g., match the predefined room numbers).
Rooms in assignments are sorted numerically for display.
