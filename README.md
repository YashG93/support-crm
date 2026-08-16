# Support CRM System
A full-stack Customer Support Ticketing CRM built for the **DataStraw Technologies AI + Tech Intern Assessment**.
The application allows support teams to create, search, filter, view, and update customer support tickets through a simple and responsive interface.

##  Features

### 1. Create Tickets
* Customer name
* Customer email
* Issue subject
* Issue description
* Automatically generated ticket ID
* Automatic creation timestamp

### 2. Ticket List
Displays:
* Ticket ID
* Customer name
* Subject
* Status
* Creation date

### 3. Search
Search tickets using:
* Customer name
* Customer email
* Ticket ID
* Subject
* Description

Search results update dynamically as the user types.

### 4. Filter by Status
Tickets can be filtered by:
* Open
* In Progress
* Closed

### 5. View & Update Tickets
Each ticket has a detailed view containing:
* Customer information
* Issue details
* Current status
* Notes/comments
* Created timestamp
* Updated timestamp

Support agents can update the ticket status and add notes.

### 6. Responsive Interface
The frontend is designed to work across:
* Desktop
* Tablet
* Mobile

## 🛠️ Technology Stack

### Frontend
* React
* Vite
* CSS

### Backend
* Python
* FastAPI
* SQLAlchemy

### Database
* SQLite

## 🗄️ Database Design
The CRM uses a simple ticket-based database structure.

### Tickets
| Field          | Description                 |
| -------------- | --------------------------- |
| id             | Primary key                 |
| ticket_id      | Unique ticket identifier    |
| customer_name  | Customer name               |
| customer_email | Customer email              |
| subject        | Ticket subject              |
| description    | Issue description           |
| status         | Open / In Progress / Closed |
| created_at     | Creation timestamp          |
| updated_at     | Last update timestamp       |

### Notes
Notes can be associated with tickets to store support comments.
| Field      | Description    |
| ---------- | -------------- |
| id         | Primary key    |
| ticket_id  | Related ticket |
| note_text  | Support note   |
| created_at | Note timestamp |
