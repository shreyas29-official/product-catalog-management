# Order Approval Management System — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

---

## Authentication

### Register
`POST /auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

> Only the first user can register as `admin`. Subsequent admin registrations are rejected.

### Login
`POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "client" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Profile
`GET /auth/profile` 🔒

---

## Products

### List Products
`GET /products` 🔒

Query params: `page`, `limit`, `search`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `mine` (admin), `activeOnly`

### Get Product
`GET /products/:id` 🔒

### Create Product (Admin)
`POST /products` 🔒 Admin

`multipart/form-data`: `name`, `description`, `price`, `quantity`, `image` (file)

### Update Product (Admin)
`PUT /products/:id` 🔒 Admin

### Delete Product (Admin)
`DELETE /products/:id` 🔒 Admin

### Product Stats (Admin)
`GET /products/stats` 🔒 Admin

---

## Cart (Client only)

### Get Cart
`GET /cart` 🔒 Client

### Add to Cart
`POST /cart` 🔒 Client

```json
{ "productId": "...", "quantity": 1 }
```

### Update Cart Item
`PUT /cart/:productId` 🔒 Client

```json
{ "quantity": 2 }
```

### Remove from Cart
`DELETE /cart/:productId` 🔒 Client

### Clear Cart
`DELETE /cart` 🔒 Client

---

## Orders

### Place Order (Client)
`POST /orders` 🔒 Client

Creates order with status `PENDING`, clears cart, notifies admins.

### List Orders
`GET /orders` 🔒

- Admin: all orders
- Client: own orders

Query: `status`, `page`, `limit`

### Get Order
`GET /orders/:id` 🔒

### Approve Order (Admin)
`PATCH /orders/:id/approve` 🔒 Admin

Deducts stock, sets status `APPROVED`, notifies client.

### Reject Order (Admin)
`PATCH /orders/:id/reject` 🔒 Admin

```json
{ "rejectionReason": "Out of stock" }
```

### Order Stats (Admin)
`GET /orders/stats` 🔒 Admin

---

## Notifications

### List Notifications
`GET /notifications` 🔒

Query: `page`, `limit`, `unreadOnly`

### Mark as Read
`PATCH /notifications/:id/read` 🔒

### Mark All as Read
`PATCH /notifications/read-all` 🔒

### Delete Notification
`DELETE /notifications/:id` 🔒

---

## Socket.IO Events

Connect with auth: `{ auth: { token: '<jwt>' } }`

| Event | Direction | Description |
|-------|-----------|-------------|
| `notification-received` | Server → Client | New notification |
| `order-created` | Server → Admins | New order placed |
| `order-approved` | Server → Client/Admins | Order approved |
| `order-rejected` | Server → Client/Admins | Order rejected |

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Unauthorized / token expired |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Server error |
