# Campus Connect

A student-only campus **marketplace + events + real-time chat** platform.

> "What if your campus had its own beautifully designed local internet?"

Built with a clean, modular architecture and a distinctive design language
(warm paper, ink, a single campus-orange accent — no AI-template gradients).

## Stack
- **Client:** React 18 + Vite, React Router, Socket.IO client
- **Server:** Node.js + Express + Mongoose + Socket.IO
- **DB:** MongoDB (uses an in-memory MongoDB when `MONGODB_URI` is unset, so it runs with zero setup). Set `MONGODB_URI` for a real database.

## Structure (feature-folder architecture)
```
campus-connect/
├── server/                     # API + realtime
│   └── src/
│       ├── config/            # env, db connection (memory-server fallback)
│       ├── models/            # User, Listing, Event, Rsvp, Conversation, Message
│       ├── middleware/        # auth, error handling
│       ├── validation/        # request validators
│       ├── utils/             # responses, tokens, errors, serialize, avatar
│       ├── controllers/       # business logic per resource
│       ├── routes/            # express routers
│       ├── sockets/           # Socket.IO: chat, typing, rsvp presence
│       └── seed/             # realistic campus seed data
└── client/                    # SPA
    └── src/
        ├── components/        # primitives, listing, event, chat, nav, icons
        ├── context/           # Auth, Toast
        ├── lib/               # api client, socket, format, constants
        ├── pages/             # Home, Marketplace, ListingDetail, Sell,
        │                      #   Events, EventDetail, Messages, Saved, Search, Profile
        └── styles/            # tokens, global, components (design system)
```

## Run it
```bash
# API (port 4000)
cd server && npm install && npm start

# Client (port 5173)
cd client && npm install && npm run dev
```
Open http://localhost:5173

**Demo login:** `you@campus.edu` / `campus123`

## API highlights
- `POST /api/auth/login|register`, `GET /api/auth/me`
- `GET|POST|PATCH|DELETE /api/listings`, `POST /api/listings/:id/save`
- `GET|POST /api/events`, `POST /api/events/:id/rsvp`, `GET /api/events/:id/attendees`
- `GET /api/conversations`, `GET|POST /api/conversations/:id/messages`
- `GET /api/users/saved`, `GET /api/search?q=`
- Realtime: messages, typing indicators, live RSVP counts via Socket.IO

Data is seeded automatically on first run and persisted only while the
in-memory server is alive (restart = fresh seed). Use `MONGODB_URI` for durable data.
