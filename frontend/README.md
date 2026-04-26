# GOLDORA Frontend

Luxury e-commerce frontend built with Next.js for a full-stack project.

This frontend connects to a Django REST API and includes:
- cinematic opening gate animation
- product browsing with search, category filters, price filters, availability filter, sorting, and pagination
- product details, cart, checkout, account dashboard, contact page, login, and register
- floating luxury cart with fly-to-cart animation
- mobile-friendly shopping flow

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion

## Backend Connection

The frontend expects the Django API at:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001/api
```

You can set this in `.env` or `.env.local`.

## Run The Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Required Backend

The Django backend should be running on port `8001`.

Important API groups used by the frontend:
- `/api/token/`
- `/api/products/`
- `/api/cart/`
- `/api/orders/`
- `/api/users/`
- `/api/contact/`

## Main Pages

- `/` home page
- `/products` products listing
- `/products/[slug]` product details
- `/cart` cart page
- `/checkout` checkout
- `/account` user dashboard
- `/contact` contact page
- `/login` login
- `/register` register

## Features Implemented

### Home Page
- featured products
- category overview
- promotional sections
- opening gate animation

### Products Page
- product listing
- search by name
- visual-search entry using uploaded image filename hints
- category filter
- price filter
- availability filter
- sorting
- pagination

### Product Details
- image
- description
- price
- stock status
- add to cart
- reviews display

### Cart
- view cart items
- update quantity
- remove items
- subtotal
- right-side luxury cart drawer

### Checkout
- address creation
- address selection
- order summary
- coupon field
- mock payment method selection
- place order

### Account
- profile update
- order history
- order status
- address list

### Contact
- contact form submission to backend API

## Instructor Demo Flow

Recommended demo order:

1. Open the home page and show the gate animation.
2. Browse categories from the navbar.
3. Search from the navbar.
4. Open the products page and show filters, sorting, and pagination.
5. Open a product detail page and add to cart.
6. Show the flying product animation and floating cart.
7. Open cart and checkout.
8. Login or register.
9. Place an order with a saved address.
10. Open account dashboard and show order history.

## Notes

- The visual-search button is a lightweight helper. It uses the uploaded image filename as a search hint and tries to guess a matching category. It is not an AI vision model.
- Product images are loaded from the Django backend media URLs.
- For best results, run frontend and backend locally at the same time.

## Build Check

```bash
npm run lint
npm run build
```

Both should pass before submission.
