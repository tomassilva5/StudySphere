# StudySphere Frontend

This is a [Next.js](https://nextjs.org) project for the StudySphere application - a task and time management system for students.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit files.

## Project Structure

```
frontend/src/
├── app/
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── dashboard/      # Main dashboard
│   ├── tasks/          # Tasks management
│   ├── groups/         # Groups page
│   ├── settings/       # User settings
│   ├── components/     # Reusable components
│   ├── providers/      # Context providers
│   ├── layout.tsx      # Root layout
│   ├── template.tsx    # Global page transitions
│   └── middleware.ts   # Route protection
└── globals.css         # Global styles
```

## Authentication

The application uses a token-based authentication system with cookies.

### Authentication Flow

1. **Login/Register**: User submits credentials
2. **Backend Validation**: Server validates and issues JWT token
3. **Token Storage**: Token stored in HTTP-only cookie (secure)
4. **Middleware Protection**: Each request checked for valid token
5. **Protected Routes**: `/dashboard`, `/tasks`, `/groups`, `/settings` require authentication

### Key Files

- `src/app/login/page.tsx` - Login form
- `src/app/register/page.tsx` - Registration form
- `src/providers/AuthContext.tsx` - Global auth state management
- `src/middleware.ts` - Route protection and token validation

### Backend Integration

Login and register pages contain `TODO` comments showing where to integrate with the backend API:

```typescript
// TODO: Integrate with API of backend
// const response = await fetch('/api/auth/login', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email, password }),
// });
// const data = await response.json();
// if (!response.ok) throw new Error(data.message);
```

Replace mock tokens with real tokens from backend when API is ready.

## Features

- ✅ User authentication (login/register)
- ✅ Protected routes with middleware
- ✅ Task management with categories
- ✅ Time distribution tracking
- ✅ Groups page
- ✅ Bottom navigation tabs
- ✅ Global page transitions (smooth fade animations)
- ✅ Responsive design with Tailwind CSS
- ✅ Dark theme UI

## Technologies

- [Next.js 14](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React Icons](https://react-icons.github.io/react-icons) - Icon library
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Environment Variables

Currently no environment variables required for development.

For production, configure:
- Backend API URL (when API is ready)
- Authentication endpoints

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
npm run start
```

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Notes

- The app uses mock tokens for testing. Replace with real backend tokens when available.
- All routes except `/login` and `/register` require a valid authentication token.
- Page transitions are handled globally via `template.tsx` for smooth animations.
- Task data is persisted in browser context (can be integrated with backend).
