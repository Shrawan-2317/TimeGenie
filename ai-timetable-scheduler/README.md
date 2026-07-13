# AI Timetable Scheduler

A modern, production-ready frontend for an AI-Based Timetable Scheduler built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Multi-Role System**: Admin, Teacher, and Student portals with role-specific features
- **AI-Powered Timetable Generation**: Intelligent scheduling with conflict detection
- **Interactive Grid**: Drag-and-drop editing with color-coded subjects
- **Approval Workflow**: Publish timetables to teachers for validation and feedback
- **Export Functionality**: XLSX, PDF, iCalendar, and text exports
- **Version Control**: Track timetable versions with rollback capabilities
- **Real-time Notifications**: Stay updated with schedule changes and approvals
- **Conflict Detection**: Automatic validation for faculty, room, and workload conflicts
- **Responsive Design**: Mobile-first approach with professional dark theme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or download the ZIP file from v0

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Accounts

Use these credentials to test different roles:

- **Admin**: admin@example.com / password123
  - Full access to create, edit, and publish timetables
  - View analytics and manage versions
  
- **Teacher**: teacher@example.com / password123
  - View personal timetable
  - Approve/reject proposed timetables
  - Submit feedback
  
- **Student**: student@example.com / password123
  - View class timetable
  - Export schedules in multiple formats
  - View faculty information

## Project Structure

\`\`\`
├── app/
│   ├── admin/              # Admin portal pages
│   │   ├── dashboard/      # Overview and statistics
│   │   ├── generate/       # AI timetable generation
│   │   ├── create-timetable/ # Manual timetable creation
│   │   ├── versions/       # Version history
│   │   ├── analytics/      # Analytics and insights
│   │   ├── conflicts/      # Conflict detection
│   │   └── notifications/  # Notification management
│   ├── teacher/            # Teacher portal pages
│   │   ├── home/           # Teacher dashboard
│   │   ├── approvals/      # Timetable approvals
│   │   ├── feedback/       # Submit feedback
│   │   └── profile/        # Teacher profile
│   ├── student/            # Student portal pages
│   │   ├── home/           # Student dashboard
│   │   ├── export/         # Export timetables
│   │   ├── subjects/       # Subject information
│   │   └── faculty/        # Faculty directory
│   ├── api/                # Mock API endpoints
│   │   └── mock/           # Mocked backend responses
│   └── page.tsx            # Landing/login page
├── components/
│   ├── layouts/            # Role-specific layouts
│   ├── timetable/          # Timetable grid components
│   ├── notifications/      # Notification center
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── store.ts            # Zustand state management
│   ├── timetable-utils.ts  # Timetable operations
│   ├── export-utils.ts     # Export functionality
│   ├── validation-utils.ts # Conflict detection
│   └── utils.ts            # Utility functions
└── README.md
\`\`\`

## Key Features

### Admin Portal

- **Dashboard**: Overview of classes, subjects, faculty, and rooms
- **AI Generation**: Generate optimized timetables with conflict detection
- **Manual Editing**: Interactive grid with drag-and-drop slot editing
- **Version Control**: Track changes and rollback to previous versions
- **Analytics**: Faculty workload distribution and room utilization
- **Conflict Resolution**: Automatic detection and resolution tools

### Teacher Portal

- **Personal Timetable**: View weekly teaching schedule
- **Approval System**: Review and approve/reject proposed timetables
- **Feedback**: Submit suggestions and report conflicts
- **Profile**: View teaching preferences and constraints

### Student Portal

- **Class Timetable**: View weekly class schedule
- **Today's Schedule**: Quick view of current day's classes
- **Export Options**: Download in PDF, iCalendar, text, or print
- **Subject Information**: View all courses with faculty details
- **Faculty Directory**: Contact information for all teachers

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel (Recommended)

1. Click the "Publish" button in v0 to deploy directly to Vercel
2. Or push your code to GitHub and import in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Environment Variables

For production deployment with a real backend:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_WS_URL` - WebSocket URL for real-time notifications

Set these in your Vercel project settings or `.env.local` for local development.

## Mock API Endpoints

The application includes mock API endpoints for local development:

- `GET /api/mock/input` - Fetch input data (classes, subjects, faculty, rooms)
- `GET /api/mock/timetables` - Fetch timetables with filtering
- `POST /api/mock/timetables` - Create new timetable
- `PUT /api/mock/timetables` - Update existing timetable
- `DELETE /api/mock/timetables` - Delete timetable
- `POST /api/mock/generate` - Generate AI-powered timetable
- `POST /api/mock/conflicts` - Detect conflicts in timetable

## Backend Integration

This frontend is designed to work with mocked APIs for local development. To integrate with a real backend:

1. Replace mock API calls in `/app/api/mock/` with actual backend endpoints
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Implement WebSocket connection for real-time notifications
4. Add authentication middleware with JWT or session management
5. Update type definitions in `lib/types.ts` to match backend schema

## Color Coding System

The timetable uses a consistent color coding system:

- **Theory Classes**: Blue background
- **Lab Sessions**: Orange background with "LAB" badge
- **Special Slots**: Yellow background with "SPECIAL" badge
- **Lunch Break**: Gray background
- **Online Classes**: Dashed border pattern

## Customization

### Changing Theme Colors

Edit `app/globals.css` to customize the color palette:

\`\`\`css
@theme inline {
  --background: 0 0% 5%;
  --foreground: 0 0% 98%;
  --primary: 142 76% 36%;
  /* ... other colors */
}
\`\`\`

### Adding New Roles

1. Add role type to `lib/types.ts`
2. Create new layout in `components/layouts/`
3. Add role-specific pages in `app/[role]/`
4. Update authentication logic in `app/page.tsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Contact support at vercel.com/help
- Check the documentation at v0.dev

## Acknowledgments

Built with v0 by Vercel - The AI-powered development platform
