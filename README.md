

## Student
- Name: Зінченко Вікторія Ігорівна
- Group: 232.1

 

## MiniShop API — Фінальний проєкт

REST API інтернет-магазину на NestJS + PostgreSQL + Redis.

### Технології
- NestJS + TypeScript
- PostgreSQL + TypeORM (міграції, QueryBuilder)
- Redis (кешування з інвалідацією)
- JWT автентифікація + RBAC авторизація
- class-validator + class-transformer
- Swagger / OpenAPI

### Запуск
\`\`\`bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
\`\`\`

### Swagger UI
http://localhost:3000/api/docs

### API Endpoints

#### Auth
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /auth/register | - | Реєстрація |
| POST | /auth/login | - | Логін → JWT |

#### Categories
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/categories | - | Список |
| GET | /api/categories/:id | - | Одна |
| POST | /api/categories | admin | Створити |
| PATCH | /api/categories/:id | admin | Оновити |
| DELETE | /api/categories/:id | admin | Видалити |

#### Products
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/products | - | Список + pagination + filter |
| GET | /api/products/:id | - | Один |
| POST | /api/products | admin | Створити |
| PATCH | /api/products/:id | admin | Оновити |
| DELETE | /api/products/:id | admin | Видалити |

#### Orders
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /api/orders | user | Створити замовлення |
| GET | /api/orders | user | Мої / Всі (admin) |
| GET | /api/orders/:id | user | Одне (ownership) |
| PATCH | /api/orders/:id/status | admin | Змінити статус |
| DELETE | /api/orders/:id | admin | Видалити |

### Тест створення замовлення
\`\`\`json
curl -X 'POST' \
  'http://localhost:3000/api/orders' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2OTk3NTQsImV4cCI6MTc3OTcwMzM1NH0.hAq_iwW74qrFQb-Oe0SaXoC_NZAiN8a2ahsmS2f5Ch0' \
  -H 'Content-Type: application/json' \
  -d '{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 5,
      "quantity": 1
    }
  ]
}'
...
{
  "data": {
    "id": 1,
    "status": "pending",
    "totalPrice": "2247.00",
    "user": {
      "id": 1
    },
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": "999.00",
        "product": {
          "id": 1,
          "name": "iPhone 16",
          "description": null,
          "price": "999.00",
          "stock": 48,
          "isActive": true,
          "createdAt": "2026-05-23T16:32:59.224Z",
          "updatedAt": "2026-05-25T09:08:25.168Z"
        }
      },
      {
        "id": 2,
        "quantity": 1,
        "price": "249.00",
        "product": {
          "id": 5,
          "name": "AirPods Pro",
          "description": null,
          "price": "249.00",
          "stock": 99,
          "isActive": true,
          "createdAt": "2026-05-23T16:32:59.239Z",
          "updatedAt": "2026-05-25T09:08:25.168Z"
        }
      }
    ],
    "createdAt": "2026-05-25T09:08:25.168Z"
  },
  "statusCode": 201,
  "timestamp": "2026-05-25T09:08:25.209Z"
}
\`\`\`

### Тест ownership (403)
\`\`\`json
{
  "error": {
    "code": 403,
    "message": "You do not have permission to view this order",
    "traceId": "f4226c85-c762-4f34-952a-a31657712fad"
  },
  "timestamp": "2026-05-25T09:31:41.173Z"
}
\`\`\`

### Тест зміни статусу
\`\`\`json
curl -X 'PATCH' \
  'http://localhost:3000/api/orders/0/status' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2OTk3NTQsImV4cCI6MTc3OTcwMzM1NH0.hAq_iwW74qrFQb-Oe0SaXoC_NZAiN8a2ahsmS2f5Ch0' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "confirmed"
}'
...
{
  "data": "This action updates status of a #0 order",
  "statusCode": 200,
  "timestamp": "2026-05-25T09:15:44.203Z"
}
\`\`\`

### Тест insufficient stock
\`\`\`json
Response body
Download
{
  "error": {
    "code": 400,
    "message": "Insufficient stock for \"iPhone 16\": available 46, requested 1e+34",
    "traceId": "37109051-599d-4bf1-8ea9-f791b9c91537"
  },
  "timestamp": "2026-05-25T09:18:15.672Z"
}
Response headers
 connection: keep-alive 
 content-length: 190 
 content-type: application/json; charset=utf-8 
 date: Mon,25 May 2026 09:18:15 GMT 
 etag: W/"be-lsbZS/TGT/QxLGiU0eZP0i5gt8M" 
 keep-alive: timeout=5 
 x-powered-by: Express 
\`\`\`