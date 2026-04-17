# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Event booking management system — a monorepo with a Python/FastAPI REST API backend and a React/Vite frontend. Manages halls, catering items, bookings, and invoice generation for event venues.

The legacy PHP + vanilla JS implementation lives in `deo-api/` and `event-plan/` and can be ignored for new development.

## Commands

### Backend (`api/`)
```bash
pip install -r requirements.txt    # Install dependencies
cp .env.example .env               # Configure DB URL
uvicorn main:app --reload --port 8080   # Start dev server
# API docs auto-generated at http://localhost:8080/docs
```

### Frontend (`frontend/`)
```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server on http://localhost:3000
npm run build     # Production build → dist/
```

### Database
```bash
mysql -u root < deo-api/db_script.sql   # Initialize schema (creates eventdata DB)
# Note: db_script.sql schema is outdated — SQLAlchemy will create correct columns
# on first API startup via Base.metadata.create_all()
```

## Architecture

### Monorepo Structure
```
booking2.0/
├── api/                    # Python 3 + FastAPI backend
│   ├── main.py             # App entry, CORS, router registration (prefix /api)
│   ├── database.py         # SQLAlchemy engine + get_db() dependency
│   ├── models.py           # ORM models: Hall, Item, Booking
│   ├── schemas.py          # Pydantic schemas (Create/Update/Out per resource)
│   ├── routes/
│   │   ├── halls.py        # CRUD: /api/halls, /api/hall/{id}
│   │   ├── items.py        # CRUD: /api/items, /api/item/{id}
│   │   └── bookings.py     # CRUD: /api/bookings, /api/booking/{id}
│   ├── requirements.txt
│   └── .env.example        # DATABASE_URL env var
│
└── frontend/               # React 18 + Vite + Tailwind CSS 3
    ├── vite.config.js      # Proxies /api → http://localhost:8080
    ├── tailwind.config.js  # Content paths for Tailwind purge
    ├── postcss.config.js
    ├── src/
    │   ├── index.css           # Tailwind directives + react-datepicker theme overrides
    │   ├── App.jsx             # Routes: / | /halls | /items (Layout) + /invoice (standalone)
    │   ├── api/client.js       # Axios wrappers: halls, items, bookings objects
    │   ├── utils/helpers.js    # generateId, formatCurrency, toSQLDatetime, parseItems, parseHall
    │   ├── components/
    │   │   ├── Layout.jsx      # Sidebar + <Outlet /> shell
    │   │   ├── Sidebar.jsx     # Dark nav: Bookings / Halls / Items with NavLink active states
    │   │   ├── BookingModal.jsx # Create/edit booking — most complex component
    │   │   ├── HallModal.jsx   # Create/edit hall (hall prop = edit mode)
    │   │   ├── ItemModal.jsx   # Create/edit item (item prop = edit mode)
    │   │   └── BookingCard.jsx
    │   └── pages/
    │       ├── Dashboard.jsx   # Stats cards, search/filter, booking grid, skeleton loaders
    │       ├── HallsPage.jsx   # Hall CRUD with inline edit/delete cards
    │       ├── ItemsPage.jsx   # Item CRUD with inline edit/delete cards
    │       └── Invoice.jsx     # Print-ready invoice, receives booking via router state
```

### API Design
All endpoints are prefixed `/api` in FastAPI and proxied transparently by Vite in dev.  
Pattern: `GET/POST/PUT/DELETE /api/{resource}[/{id}]` for `halls`, `items`, `bookings`.  
DELETE returns the remaining records list (matches original PHP behavior).

### Data Storage Quirk
`booking` table stores hall and item selections as denormalized comma-separated strings:
- `allHall`: `"Grand Hall:75000"` (name:price — use `lastIndexOf(':')` to parse, names may contain colons)
- `allItems`: `"Pillow:10:500,Bed-Sheet:20:200"` (name:qty:unitPrice per item)

`parseItems` and `parseHall` in `utils/helpers.js` handle this parsing. The React Invoice and BookingModal components both depend on these parsers.

### Booking Price Calculation
```
subTotal   = hallPrice + Σ(qty × unitPrice) for each item row
total      = subTotal + damage + gst + service_tax
due        = total - paid
```
Totals are derived/computed in `BookingModal.jsx`; only `total` and `paid` are persisted.

### Invoice Navigation
Invoice data is passed via React Router `state` (not localStorage):
```js
navigate('/invoice', { state: { booking } })  // BookingCard.jsx
const { state } = useLocation()               // Invoice.jsx
```

### Configuration
- DB URL: `api/.env` (`DATABASE_URL=mysql+pymysql://root:@localhost/eventdata`)
- Frontend API base: Vite proxies `/api` → `http://localhost:8080` (see `vite.config.js`)
- SQLAlchemy creates/verifies tables on startup — the legacy `db_script.sql` schema is stale

## Key Conventions

- All API routes identified by business ID (`hallid`, `itemid`, `bookingid`), not auto-increment `id`
- IDs generated client-side: `generateId('B')` → `"B-2026-April-17-14-30-45"`
- All prices stored as `BIGINT` integers (rupees, no decimals)
- Hall `type`: `"AC"` or `"Non-AC"`; item `status`: `"Active"` or `"Inactive"`
- Only active items (`status === 'Active'`) appear in the booking form item selector
- Pydantic v2 style (`model_config = {"from_attributes": True}`, `model_dump()`)
