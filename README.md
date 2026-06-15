# megaprojectRev

A React + Vite blog application with Appwrite backend integration, Tailwind styling, Redux state management, and rich text editing.

## Features

- React 19 with Vite for fast development
- Tailwind CSS for utility-first styling
- Redux Toolkit for global auth state
- Appwrite for authentication, database, and file storage
- Rich text editor via TinyMCE
- Image upload and drag-and-drop support
- Responsive post creation and editing UI

## Project setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview build locally:

```bash
npm run preview
```

Lint project files:

```bash
npm run lint
```

## Environment variables

Create a `.env` file in the project root with the following values:

```env
VITE_APPWRITE_URL=https://your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

> `src/config/conf.js` reads these values at runtime.

## App structure

- `src/main.jsx` — application entry point
- `src/App.jsx` — top-level router and layout
- `src/components/` — reusable UI components
- `src/components/post-form/` — post creation/edit form
- `src/appwrite/` — Appwrite authentication and service helpers
- `src/features/` — Redux slice definitions
- `src/pages/` — route pages like `Home`, `Login`, `Signup`, and `Post`
- `src/config/conf.js` — environment-based Appwrite config

## Notes

- The app uses Appwrite document IDs for post slugs.
- The image preview is generated from file upload or Appwrite storage.
- Form handling is implemented with React Hook Form.

## Recommended setup

Use Node.js 18+ and a modern browser.

If you want to customize the theme, update Tailwind classes in the component files or add utility classes in `src/index.css`.
