

## Student
- Name: Зінченко Вікторія Ігорівна
- Group: 232.1

 

## Практичне заняття №7 — Redis + Pagination + Filtering
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### API: GET /api/products
 
| Параметр | Тип | Default | Опис |
|----------|-----|---------|------|
| page | number | 1 | Номер сторінки |
| pageSize | number | 10 | Елементів на сторінку (max 100) |
| sort | string | createdAt | Поле сортування |
| order | asc/desc | desc | Напрямок |
| categoryId | number | - | Фільтр за категорією |
| minPrice | number | - | Мінімальна ціна |
| maxPrice | number | - | Максимальна ціна |
| search | string | - | Пошук за назвою (ILIKE) |
 
### Тест пагінації
{
  "data": [
    {
      "id": 90,
      "name": "Smartphone Stand v3",
      "price": "19.00",
      "stock": 100,
      "category": { "id": 2, "name": "Accessories" }
    },
    ... (ще 4 товари)
  ],
  "meta": {
    "page": 1,
    "pageSize": 5,
    "total": 90,
    "totalPages": 18
  }
}
### Тест фільтрації

{
  "data": [
    {
      "id": 85,
      "name": "iPhone 16 Pro",
      "price": "999.00",
      "category": { "id": 1, "name": "Electronics" }
    }
  ],
  "meta": { "page": 1, "pageSize": 10, "total": 12, "totalPages": 2 }
}
 
### Тест пошуку

{
  "data": [
    {
      "id": 78,
      "name": "MacBook Air M2",
      "price": "1200.00"
    }
  ],
  "meta": { "page": 1, "pageSize": 10, "total": 2, "totalPages": 1 }
}
 
### Тест кешування (Redis)
PS C:\Users\36981\-hlpf-env-setup> docker compose exec redis redis-cli KEYS "products:*"
1) "products:/api/products?page=1&pageSize=5"
2) "products:/api/products?categoryId=1&minPrice=500"
3) "products:/api/products?search=mac"
 
### Тест інвалідації кешу
PS C:\Users\36981\-hlpf-env-setup> docker compose exec redis redis-cli KEYS "products:*"
1) "products:/api/products?page=1&pageSize=5"
2) "products:/api/products?categoryId=1&minPrice=500"
