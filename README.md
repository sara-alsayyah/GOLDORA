# GOLDORA

GOLDORA is a full-stack luxury e-commerce project built with a Django REST backend and a Next.js frontend. It includes product browsing, wishlist and cart flows, checkout, account pages, notifications, contact handling, and an elevated storefront UI with responsive navigation and boutique-style presentation.

## Stack

- Backend: Django 6, Django REST Framework, SimpleJWT, django-filter, SQLite
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion

## Project Structure

```text
GOLDORA/
|-- config/        Django project settings and URL routing
|-- users/         Authentication, profile, address APIs
|-- products/      Products, categories, wishlist, reviews
|-- cart/          Cart APIs
|-- orders/        Checkout and order APIs
|-- core/          Contact and shared backend features
|-- frontend/      Next.js storefront
|-- media/         Uploaded/demo media assets
|-- manage.py
```

## Main Features

- Luxury home page with curated editorial sections
- Product listing with search, category filtering, price filtering, availability filtering, sorting, and pagination
- Product detail pages with related products and reviews
- JWT login and registration
- Wishlist drawer and recently viewed panel
- Floating cart, cart page, quantity editing, save-for-later flow
- Checkout with address support and coupon support
- Account dashboard and order history
- Notifications page
- Contact page/API
- Responsive navbar with shrink-on-scroll behavior

## Backend Setup

1. Create and activate a virtual environment.
2. Install backend dependencies.
3. Run migrations.
4. Optionally seed demo data.
5. Start the backend server.

Example:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_store
python manage.py runserver 8001
```

The backend API is served from `http://127.0.0.1:8001/`.

Important API groups:

- `/api/token/`
- `/api/token/refresh/`
- `/api/products/`
- `/api/cart/`
- `/api/orders/`
- `/api/users/`
- `/api/contact/`

## Frontend Setup

1. Open the frontend directory.
2. Install dependencies.
3. Set the API base URL.
4. Start the Next.js dev server.

Example:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001/api
```

Then run:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Demo Data

The project includes a seed command:

```bash
python manage.py seed_store
```

This creates:

- Sample categories
- Sample products
- A demo coupon: `WELCOME10`
- A demo user:

```text
email: demo@example.com
password: DemoPass123!
```

## Development Notes

- The frontend expects the backend on port `8001`.
- JWT authentication is used for protected cart, wishlist, account, and order flows.
- Invalid or expired frontend tokens are cleared automatically and the user is prompted to log in again.
- Media files are served through Django in development.

## Validation

Useful project checks:

```bash
python manage.py check
cd frontend && npm run lint
cd frontend && npm run build
```

## Future Improvements

- Replace remaining raw `<img>` tags with Next.js `Image`
- Add automated backend and frontend tests
- Add persistent notifications from the backend
- Add payment gateway integration
- Add deployment configuration for production
