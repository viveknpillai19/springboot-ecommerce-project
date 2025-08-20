# E-commerce Frontend

A modern React frontend for the Spring Boot e-commerce API.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Product Catalog**: Browse and search products
- **Admin Panel**: Manage products and users (admin only)
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Built with Tailwind CSS and Headless UI

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS for styling
- Headless UI for accessible components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your Spring Boot backend is running on `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Auth/           # Authentication forms
│   ├── Layout/         # Layout components
│   └── Products/       # Product-related components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## API Integration

The frontend integrates with the Spring Boot backend through:

- **Authentication**: `/api/auth/login` and `/api/auth/register`
- **Products**: `/api/products` for public access
- **Admin**: `/api/admin/*` for admin operations

## Admin Features

To access admin features:
1. Register with an admin role or modify your user role in the database
2. The admin panel provides:
   - Product management (create, delete)
   - User management (ban/unban users)

## Environment Variables

The API base URL is currently hardcoded to `http://localhost:8080/api`. For production, you should use environment variables.