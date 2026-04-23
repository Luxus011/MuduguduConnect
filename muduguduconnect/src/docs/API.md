# MuduguduConnect — API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## AUTH

### POST /auth/register
Register a new user.
```json
{ "name": "Marie", "email": "marie@mc.rw", "password": "secret", "role": "worker" }
```
Response: `{ "message": "Registered. Check email for verification code.", "userId": 1 }`

### POST /auth/verify-email
```json
{ "email": "marie@mc.rw", "code": "123456" }
```
Response: `{ "message": "Email verified", "token": "jwt_token" }`

### POST /auth/login
```json
{ "email": "marie@mc.rw", "password": "secret" }
```
Response: `{ "token": "...", "user": { "id":1, "name":"Marie", "role":"worker", "verified":true } }`

### GET /auth/me *(protected)*
Response: full user object

---

## WORKERS

### GET /workers
Query params: `?job=Cleaner&location=Kacyiru&availability=Available Now&sort=rating`

### GET /workers/recommended
Returns top 6 available workers sorted by boost + rating.

### GET /workers/emergency
Returns workers who are Available Now AND online.

### GET /workers/:id
Returns single worker with user info.

### POST /workers *(protected, multipart/form-data)*
```
photo (file), job, location, availability, description, skills (JSON), rate_per_day, exp_years, phone
```

### PUT /workers/:id *(protected)*
Same fields as POST.

### PUT /workers/:id/availability *(protected)*
```json
{ "availability": "Available Now", "is_online": true }
```

---

## REVIEWS

### POST /reviews *(protected)*
```json
{ "worker_id": 1, "rating": 5, "comment": "Excellent work!" }
```

### GET /reviews/:worker_id
Returns all reviews for a worker.

---

## REPORTS

### POST /reports *(protected)*
```json
{ "target_id": 3, "reason": "Fake profile", "details": "..." }
```

---

## CHATBOT

### POST /chatbot *(public)*
```json
{ "message": "I need a cleaner in Kacyiru available now" }
```
Response:
```json
{
  "reply": "Found 2 workers for Cleaner in Kacyiru available now.",
  "intent": { "job": "Cleaner", "location": "Kacyiru", "available": true },
  "workers": [...]
}
```

---

## Error format
```json
{ "error": "Description of the error" }
```
