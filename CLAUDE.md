# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Event booking management system — a monorepo with a PHP REST API backend and a vanilla JS frontend. Manages halls, catering items, bookings, and invoice generation for event venues.

## Commands

### Backend (`deo-api/`)
```bash
composer install          # Install PHP dependencies
php -S localhost:8080 -t public   # Start dev server
composer test             # Run PHPUnit tests
phpunit                   # Run tests directly
docker-compose up         # Start via Docker (PHP 7 Alpine)
```

### Frontend (`event-plan/`)
```bash
# No build step — serve files directly
php -S localhost:8081     # or
python -m http.server 8081
```

### Database
```bash
mysql -u root < deo-api/db_script.sql   # Initialize schema
```

## Architecture

### Monorepo Structure
```
booking2.0/
├── deo-api/          # PHP 7 + Slim Framework 3 REST API
│   ├── public/       # Web root — index.php bootstraps Slim
│   ├── src/
│   │   ├── routes.php        # All CRUD endpoints (halls, items, bookings)
│   │   ├── dependencies.php  # DI container: logger, PDO, renderer
│   │   ├── settings.php      # DB config, Monolog settings
│   │   └── middleware.php    # Slim middleware config
│   ├── db_script.sql         # MySQL schema (eventdata DB)
│   └── logs/app.log          # Runtime error log
│
└── event-plan/       # Vanilla JS + Bootstrap 4 + Axios frontend
    ├── index.html        # Main dashboard (lists bookings, entry point)
    ├── invoice.html      # Print-ready invoice page
    ├── index.js          # Shared globals, Booking/ItemRows classes, base API helpers
    ├── createBooking.js  # Booking form logic + GST/total calculations
    ├── createHall.js     # Hall creation form
    ├── createItem.js     # Item creation form
    └── invoice.js        # Invoice rendering + print
```

### API Design
All endpoints live in `deo-api/src/routes.php`. Pattern: `GET/POST/PUT/DELETE /{resource}[/{id}]` for `halls`, `items`, and `bookings`.

Base URL hardcoded in `event-plan/index.js`:
```js
const base_url = 'http://localhost:8080/deo-api/public/';
```

Frontend makes Axios calls to this base URL. No auth layer exists.

### Data Storage Quirk
`booking` table stores hall and item selections as denormalized comma-separated strings:
- `allHall`: `"Grand Hall:75000"`
- `allItems`: `"Pillow:10:500,Bed-Sheet:20:200"` (name:qty:price)

Parsing these strings happens in the frontend (`invoice.js`, `createBooking.js`).

### Frontend State
No framework — state lives in global variables and DOM. The `Booking` and `ItemRows` classes in `index.js` are the main abstractions. jQuery is used for DOM + animations; Axios for all HTTP.

### Configuration
- DB credentials: `deo-api/src/settings.php` (`host`, `dbname`, `user`, `pass`)
- No `.env` file — credentials are inline PHP

## Key Conventions

- Backend returns raw JSON arrays/objects; no envelope or status wrapper
- Booking IDs (`bookingid`) are generated client-side (random string prefixed `B`)
- All prices stored as `BIGINT` (integers, smallest currency unit or rupees — no decimals)
- Hall `type` field: `"A/C"` or `"non A/C"`; item `status`: `"active"` / `"not-active"`
- Logs go to `deo-api/logs/app.log` via Monolog; check here for PDO/SQL errors
