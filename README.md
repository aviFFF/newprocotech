# Procotech Website

A professional website for a tech consultancy, featuring projects, courses, and company information.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is available at [https://supabase.com](https://supabase.com))

### Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Set up environment variables by running:

```bash
npm run setup
```

This interactive script will ask you for your Supabase credentials and create a `.env.local` file.

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Setup

To set up the necessary database tables, visit [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup) after starting the development server.

The setup page provides:
- An automated setup option
- SQL scripts you can run manually in your Supabase SQL Editor

## Features

- **Projects Management:** Create, edit, and delete portfolio projects
- **Courses Management:** Manage educational courses offerings 
- **Companies Display:** Showcase partner companies
- **Contact Form:** Receive inquiries from potential clients
- **Admin Dashboard:** Secure admin area for content management

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Styling:** Shadcn UI components
- **Authentication:** Supabase Auth

## Troubleshooting

### Invalid URL Error

If you encounter an error like `Failed to construct 'URL': Invalid URL`, make sure:

1. Your `.env.local` file contains valid Supabase credentials
2. Run the setup script again with:

```bash
npm run setup
```

3. Make sure the URL in your environment variables is a valid URL with the protocol included (e.g., `https://yourproject.supabase.co`) 