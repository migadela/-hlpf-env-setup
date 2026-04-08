### \## Student

### \- Name: Зінченко Вікторія Ігорівна

### \- Group: 232.1

### 

#### \## Практичне заняття №3 — CRUD REST API для MiniShop

#### &#x20;

#### \### Структура репозиторію

#### ```

#### .

#### ├── src/

#### │   ├── categories/

#### │   │   ├── category.entity.ts

#### │   │   ├── categories.module.ts

#### │   │   ├── categories.service.ts

#### │   │   └── categories.controller.ts

#### │   ├── products/

#### │   │   ├── product.entity.ts

#### │   │   ├── products.module.ts

#### │   │   ├── products.service.ts

#### │   │   └── products.controller.ts

#### │   ├── migrations/

#### │   │   ├── 1700000001-CreateTables.ts

#### │   │   └── 1775672009619-AddIsActiveToProducts.ts

#### │   ├── data-source.ts

#### │   └── app.module.ts

#### ├── Dockerfile

#### ├── docker-compose.yml

#### └── README.md

#### ```

#### &#x20;

#### \### Запуск проекту

#### ```bash

#### cp .env.example .env

#### docker compose up --build

#### ```

#### &#x20;

#### \### API Endpoints

#### | Method | URL | Опис |

#### |--------|-----|------|

#### | GET | /api/categories | Список категорій |

#### | GET | /api/categories/:id | Одна категорія |

#### | POST | /api/categories | Створити категорію |

#### | PATCH | /api/categories/:id | Оновити категорію |

#### | DELETE | /api/categories/:id | Видалити категорію |

#### | GET | /api/products | Список продуктів |

#### | GET | /api/products/:id | Один продукт |

#### | POST | /api/products | Створити продукт |

#### | PATCH | /api/products/:id | Оновити продукт |

#### | DELETE | /api/products/:id | Видалити продукт |

#### &#x20;

#### \### Перевірка міграцій

#### ```

#### C:\\Users\\36981\\-hlpf-env-setup>docker compose exec postgres psql -U nestuser -d nestdb -c "\\dt"

#### &#x20;          List of relations

#### &#x20;Schema |    Name    | Type  |  Owner

#### \--------+------------+-------+----------

#### &#x20;public | categories | table | nestuser

#### &#x20;public | migrations | table | nestuser

#### &#x20;public | products   | table | nestuser

#### (3 rows)

#### ```

#### \### Перевірка стурктури таблиці Products

#### ```

#### C:\\Users\\36981\\-hlpf-env-setup>docker compose exec postgres psql -U nestuser -d nestdb -c "SELECT column\_name, data\_type, column\_default FROM information\_schema.columns WHERE table\_name = 'products';"

#### &#x20;column\_name |          data\_type          |            column\_default

#### \-------------+-----------------------------+--------------------------------------

#### &#x20;id          | integer                     | nextval('products\_id\_seq'::regclass)

#### &#x20;name        | character varying           |

#### &#x20;description | text                        |

#### &#x20;price       | numeric                     |

#### &#x20;stock       | integer                     | 0

#### &#x20;category\_id | integer                     |

#### &#x20;createdAt   | timestamp without time zone | now()

#### &#x20;updatedAt   | timestamp without time zone | now()

#### &#x20;isActive    | boolean                     | true

#### (9 rows)

#### ```



#### &#x20;

#### \### Тест створення категорії

#### ```curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d "{\\"name\\": \\"Electronics\\", \\"description\\": \\"Gadgets and devices\\"}"

#### Вивід

#### {"id":1,"name":"Electronics","description":"Gadgets and devices","createdAt":"2026-04-08T18:42:26.535Z"}

#### ```

#### &#x20;

#### \### Тест створення продукту

#### ```curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\\"name\\": \\"iPhone 15\\", \\"price\\": 999.99, \\"stock\\": 50, \\"categoryId\\": 1}"

Вивід

#### {"id":1,"name":"iPhone 15","description":null,"price":999.99,"stock":50,"isActive":true,"category":{"id":1},"createdAt":"2026-04-08T18:43:02.109Z","updatedAt":"2026-04-08T18:43:02.109Z"}

#### ```

#### &#x20;

#### \### Тест отримання продуктів

#### ```curl -X POST http://localhost:3000/api/products

Вивід

#### \[{"id":1,"name":"iPhone 15","description":null,"price":"899.99","stock":45,"isActive":true,"category":{"id":1,"name":"Electronics","description":"Gadgets and devices","createdAt":"2026-04-08T18:42:26.535Z"},"createdAt":"2026-04-08T18:43:02.109Z","updatedAt":"2026-04-08T18:47:18.933Z"}]

#### ```

#### &#x20;

#### \### Тест 404

#### ```http://localhost:3000/api/products/999

Вивід

#### {"message":"Product #999 not found","error":"Not Found","statusCode":404}```



