

## Student
- Name: Зінченко Вікторія Ігорівна
- Group: 232.1

## Практичне заняття №4 — DTO + class-validator + Pipes

### Структура репозиторію
=
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md

Запуск проекту
Bash
cp .env.example .env
docker compose up --build

Тест валідації — порожнє ім'я категорії
Запит: curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"\"}"
Відповідь:

C:\Users\36981\-hlpf-env-setup>curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"\"}"
{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}


Тест валідації — від'ємна ціна продукту
Запит: curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\": \"Test\", \"price\": -5}"
Відповідь:

C:\Users\36981\-hlpf-env-setup>curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\": \"Test\", \"price\": -5}"
{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}


Тест валідації — зайве поле
Запит: curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"Test\", \"isAdmin\": true}"
Відповідь:

C:\Users\36981\-hlpf-env-setup>curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"Test\", \"isAdmin\": true}"
{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}


Тест TrimPipe
Запит: curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"   Trimmed   \"}"
Відповідь:

JSON
C:\Users\36981\-hlpf-env-setup>curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\"name\": \"   Trimmed   \"}"
{"id":4,"name":"Trimmed","description":null,"createdAt":"2026-04-26T18:45:37.504Z"}


Тест валідне створення продукту


C:\Users\36981\-hlpf-env-setup>curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\": \"iPhone 16\", \"price\": 999.99, \"stock\": 50, \"categoryId\": 1}"
{"id":3,"name":"iPhone 16","description":null,"price":999.99,"stock":50,"isActive":true,"category":{"id":1},"createdAt":"2026-04-26T18:40:03.716Z","updatedAt":"2026-04-26T18:40:03.716Z"}