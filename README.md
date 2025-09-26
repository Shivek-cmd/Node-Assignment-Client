# User Management Dashboard

A modern, dashboard for managing users with CRUD operations.

## 🚀 Features

- CRUD operations with modals and toast notifications  
- Pagination with jump-to-page and real-time search  
- Sortable table (name/email)  
- Dark mode toggle with persistence  
- Smooth animations with Framer Motion  
- Error handling and loading states  
- Fully responsive with Tailwind CSS  
- API integration with Axios  

## 🛠 Tech Stack

- **Frontend:** React.js, Next.js  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  
- **Forms:** React Hook Form  
- **Notifications:** React Hot Toast  
- **API Calls:** Axios  

## 📋 Prerequisites

- Node.js (v14+)  
- npm or yarn  
- Backend API running at: `http://localhost:8000/api`  
  - Endpoints: `/users` (GET, POST, PUT, DELETE)  

## ⚙️ Installation & Setup

1. Clone the repository  
   git clone https://github.com/Shivek-cmd/Node-Assignment-Client.git
   cd client


2. Install dependencies
   npm install


3. Configure environment
   Create a .env.local file in the root directory and add:
   NEXT_PUBLIC_API_URL=http://localhost:8000/api


4. Run the development server 
   npm run dev

## 🎯 Usage Guide

- On load, users are displayed in a paginated table.  
- Add, edit, and delete users via modal forms.  
- Use search and pagination for large datasets.  
- Toggle dark mode via header icon.  
- Errors and loading states are handled gracefully.  
