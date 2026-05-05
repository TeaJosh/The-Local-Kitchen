# The-Local-Kitchen
Food discovery platform and restaurant ordering website.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Tiptap Editor
- **Backend:** Django, REST API
- **Database:** SQLite (PostgreSQL-ready)

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/TeaJosh/The-Local-Kitchen.git
cd The-Local-Kitchen
```

### 2. Backend Setup

```bash
cd tlk
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
Paste: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Then start the dev server:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`

### 4. Create a Test Account

Visit `http://localhost:3000/auth/select-account` to register as a Member or Restaurant Owner.

## Running Tests

```bash
cd tlk
python manage.py test
```

33 unit tests covering authentication, blog posts, comments, and permissions.

## Project Structure
The-Local-Kitchen/
├── frontend/          # Next.js frontend
│   ├── app/           # Pages and routes
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
├── tlk/               # Django backend
│   ├── accounts/      # Models, views, URLs
│   ├── backend/       # Settings and root config
│   └── media/         # Uploaded files (profile pictures)
└── README.md
## Backend Overview

The backend is a Django REST API that handles all data operations and business logic. The frontend never touches the database directly — all communication goes through JSON API endpoints.

**Key endpoints:**

- `/api/accounts/register/member/` — Register a new member account
- `/api/accounts/register/restaurant/` — Register a restaurant owner account
- `/api/accounts/login/` — Authenticate and receive an auth token
- `/api/accounts/profile/` — Get or update user profile
- `/api/posts/` — List all published blog posts (supports filters: section, cuisine, occasion)
- `/api/posts/create/` — Create a new blog post (authenticated, members only)
- `/api/posts/<id>/` — Get a single post with comments
- `/api/posts/<id>/delete/` — Delete a post (author only)
- `/api/posts/<id>/update/` — Edit a post (author only)
- `/api/posts/<id>/comments/` — GET lists comments (public), POST creates a comment (authenticated)
- `/api/comments/<id>/` — Delete a comment (author only)
- `/api/support/report-user/` — Submit a user report
- `/api/contact/` — Submit a contact form message

**Authentication:** Token-based using a custom AuthToken model. On login, the server returns a token that the frontend stores in localStorage and sends in the `Authorization: Bearer <token>` header with every authenticated request.

**User roles:** Members can create blog posts, comment, and manage profiles. Restaurant Owners can manage restaurant listings. Admins moderate content through Django's built-in admin panel (`/admin/`).

**Media files:** Profile pictures are uploaded via FormData and stored in the `media/` directory. Django serves them at `/media/` during development.

## Frontend Overview

The frontend is a Next.js 15 (React) application using Tailwind CSS for styling. It communicates with the Django backend exclusively through fetch calls to the REST API.

**Key pages:**

- `/` — Home page
- `/posts` — Blog listing with all published posts
- `/posts/[id]` — Individual blog post with comments
- `/posts/create-post` — Rich text editor (Tiptap) for creating posts with image upload, tags, and NSFW detection
- `/posts/my-posts` — View and edit your own posts
- `/auth/login` — Login page
- `/auth/select-account` — Choose account type for registration
- `/account/settings/profile` — Profile page with posts and activity feed
- `/account/settings/profile/edit-profile` — Edit profile with picture upload
- `/account/settings/saved-posts` — View, open, and delete saved drafts
- `/restaurants` — Restaurant directory
- `/contact` — Contact form
- `/support/report-user` — Report a user

**State management:** Auth tokens and user data are stored in localStorage. Draft posts are also saved to localStorage for offline persistence.

**How they work together:** The frontend renders the UI and captures user input. When data needs to be created, read, updated, or deleted, the frontend sends an HTTP request to the Django API. The API validates the request, performs the database operation, and returns a JSON response. The frontend then updates the UI based on that response. This separation means the frontend and backend can be developed, tested, and deployed independently.

## Team

- **Tejosh Rana** — Project Lead
- **Joseph Vang** — Frontend & Backend Development 
- **Yuepeng Vang** — Frontend Development
- **Terry Heng** — Frontend Development
- **Tristan Phay** — Backend Development & Testing
