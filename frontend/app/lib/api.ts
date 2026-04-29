import type {
  Address,
  CartItem,
  Order,
  PaginatedResponse,
  Product,
  Review,
  UserProfile,
  WishlistItem,
} from "@/app/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001/api";

type RequestOptions = RequestInit & {
  token?: string | null;
  _retried?: boolean;
};

async function refreshAccessToken() {
  if (typeof window === "undefined") return null;

  const refresh = window.localStorage.getItem("refresh");
  if (!refresh) return null;

  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!response.ok) {
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    return null;
  }

  const payload = (await response.json()) as { access?: string };
  if (!payload.access) return null;

  window.localStorage.setItem("access", payload.access);
  return payload.access;
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (response.status === 401 && options.token && !options._retried) {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      return apiFetch<T>(path, {
        ...options,
        token: nextAccessToken,
        _retried: true,
      });
    }
  }

  if (!response.ok) {
    throw payload;
  }

  return payload as T;
}

export function resolveMediaUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const origin = API_BASE.replace(/\/api$/, "");
  return `${origin}${image}`;
}

export function money(value: string | number) {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

export function asArray<T>(payload: PaginatedResponse<T> | T[]) {
  return Array.isArray(payload) ? payload : payload.results;
}

export async function getProducts(query = "") {
  return apiFetch<PaginatedResponse<Product> | Product[]>(`/products/${query}`);
}

export async function getProduct(slug: string) {
  return apiFetch<Product>(`/products/${slug}/`);
}

export async function getReviews(productId: number) {
  return apiFetch<Review[]>(`/products/${productId}/reviews/`);
}

export async function getWishlist(token: string) {
  return apiFetch<WishlistItem[]>("/products/wishlist/", { token });
}

export async function addWishlistItem(token: string, productId: number) {
  return apiFetch<{ message: string }>("/products/wishlist/add/", {
    method: "POST",
    token,
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function removeWishlistItem(token: string, productId: number) {
  return apiFetch<{ message: string }>(`/products/wishlist/remove/${productId}/`, {
    method: "DELETE",
    token,
  });
}

export async function login(email: string, password: string) {
  return apiFetch<{ access: string; refresh: string }>("/token/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) {
  return apiFetch<{ message: string }>("/users/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ message: string }>("/users/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(payload: {
  uid: string;
  token: string;
  new_password: string;
}) {
  return apiFetch<{ message: string }>("/users/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCart(token: string) {
  return apiFetch<CartItem[]>("/cart/", { token });
}

export async function addCartItem(token: string, productId: number, quantity = 1) {
  return apiFetch<{ message: string }>("/cart/add/", {
    method: "POST",
    token,
   body: JSON.stringify({
  product_id: Number(productId),
  quantity: Number(quantity),
}),
  });
}

export async function updateCartItem(token: string, itemId: number, quantity: number) {
  return apiFetch<{ message: string }>(`/cart/update/${itemId}/`, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(token: string, itemId: number) {
  return apiFetch<{ message: string }>(`/cart/remove/${itemId}/`, {
    method: "DELETE",
    token,
  });
}

export async function getProfile(token: string) {
  return apiFetch<UserProfile>("/users/profile/", { token });
}

export async function updateProfile(token: string, payload: Partial<UserProfile>) {
  return apiFetch<UserProfile>("/users/profile/", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getAddresses(token: string) {
  return apiFetch<Address[]>("/users/addresses/", { token });
}

export async function addAddress(
  token: string,
  payload: { full_name: string; phone: string; city: string; street: string },
) {
  return apiFetch<{ message: string }>("/users/addresses/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function checkout(
  token: string,
  addressId: number,
  coupon?: string,
  paymentMethod = "cod",
) {
  return apiFetch<{ message: string }>("/orders/checkout/", {
    method: "POST",
    token,
    body: JSON.stringify({ address_id: addressId, coupon:coupon, payment_method: paymentMethod }),
  });
}

export async function getOrders(token: string) {
  return apiFetch<Order[]>("/orders/", { token });
}

export async function sendContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return apiFetch<{ message: string }>("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
