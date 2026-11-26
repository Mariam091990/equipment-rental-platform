# Equipment Rental Platform

A full-stack web application that connects equipment owners with customers who need equipment for short-term or long-term rental. The platform provides a convenient way to explore equipment, manage listings, book rentals, and make secure online payments.

## Live Demo

- **Frontend:** https://equipment-rental-platform-client.vercel.app
- **Backend API:** `https://equipment-rental-platform-server-chi.vercel.app`

## Project Overview

The Equipment Rental Platform is designed to simplify the equipment rental process through a centralized marketplace. Equipment owners can list and manage their equipment, while customers can browse available items, make rental bookings, manage their favorites, and complete payments online.

The platform also includes role-based dashboards for customers, equipment owners, and administrators to manage their respective activities.

## Key Features

### Public Features
- Responsive and user-friendly interface.
- Browse all available equipment.
- Search equipment by name and category.
- Filter equipment by category, rental type, price, and availability.
- View detailed equipment information.
- User registration and login.
- Google and GitHub social authentication.

### Customer Dashboard
- View and manage rental bookings.
- Track rental and payment statuses.
- Add equipment to favorites.
- View and update profile information.

### Owner Dashboard
- Add new equipment listings.
- View and manage listed equipment.
- Monitor equipment rental activities.
- Manage profile information.

### Admin Dashboard
- Manage registered users.
- Manage equipment listings.
- Monitor rental activities.
- Access platform management features.

### Security & Payment
- Authentication with Better Auth.
- JWT-based API authentication.
- Role-based access control.
- Protected dashboard routes and backend endpoints.
- Secure online payment integration with Stripe.
- MongoDB database integration.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js 16, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Authentication | Better Auth, MongoDB Adapter |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| API Security | JWT, jose |
| Payment Gateway | Stripe |
| Deployment | Vercel |
| Package Manager | pnpm |

## NPM Packages

### Frontend
- `next` – React framework for full-stack web applications.
- `react` – Component-based user interface development.
- `better-auth` – Authentication and session management.
- `@better-auth/mongo-adapter` – MongoDB integration for Better Auth.
- `mongodb` – MongoDB database connectivity.
- `stripe` – Online payment integration.
- `lucide-react` – Icon library.
- `tailwindcss` – Utility-first CSS framework.
- `typescript` – Static type checking.


### Backend
- `express` – REST API development.
- `mongodb` – MongoDB database driver.
- `cors` – Cross-origin resource sharing.
- `dotenv` – Environment variable management.
- `jose` – JWT verification.
- `stripe` – Payment processing.
- `nodemon` – Automatic server restarting during development.

## Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the repositories

Clone the client and server repositories separately:

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
git clone YOUR_SERVER_REPOSITORY_URL
```

### 2. Install dependencies

For the client:

```bash
cd client
pnpm install
```

For the server:

```bash
cd server
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the client project and configure the required environment variables:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET
```

Create a `.env` file in the server project:

```env
PORT=5000
DB_USERNAME=YOUR_MONGODB_USERNAME
DB_PASSWORD=YOUR_MONGODB_PASSWORD
DB_NAME=equipment-rental
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

**Important:** Configure all required environment variables according to your application setup. Never commit `.env` or `.env.local` files to GitHub.

### 4. Run the development servers

Start the backend:

```bash
cd server
pnpm dev
```

Start the frontend in another terminal:

```bash
cd client
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

The project is organized into two separate applications:

```text
equipment-rental-platform/
│
├── client/                 # Next.js frontend application
│   ├── src/
│   │   └── app/
│   │       ├── (auth)/
│   │       ├── (dashboard)/
│   │       ├── (root)/
│   │       └── api/
│   └── package.json
│
└── server/                 # Express.js backend application
    ├── index.js
    ├── src/
    │   └── routes/
    ├── .env
    └── package.json
```

## Database Collections

The application uses MongoDB to manage its data. Main collections include:

- `user` – User accounts and profile information.
- `equipment` – Equipment listings and details.
- `favorites` – Customer favorite equipment.
- `bookings` – Rental booking information.
- `payments` – Payment transaction records.

## Future Improvements

- Advanced booking and availability management.
- Email notifications for booking updates.
- Dashboard analytics and reporting enhancements.
- Pagination for equipment and rental listings.
- Improved equipment recommendation features.

## Author

**Mariam Farzana**

- GitHub: https://github.com/Mariam091990


---

*Built as a full-stack equipment rental marketplace project using modern web technologies.*
