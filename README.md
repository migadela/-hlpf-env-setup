### \## Student

### \- Name: Зінченко Вікторія Ігорівна

### \- Group: 232.1

### 

#### \## Практичне заняття №2 — NestJS + PostgreSQL + Redis

#### 

#### \## Структура репозиторію

#### ```text

#### .

#### ├── src/              # NestJS source code

#### ├── Dockerfile

#### ├── docker-compose.yml

#### ├── .env.example      # шаблон змінних оточення

#### └── README.md



Вправа 2



C:\\Users\\36981\\-hlpf-env-setup>docker compose ps

NAME                        IMAGE                COMMAND                  SERVICE    CREATED         STATUS                   PORTS

hlpf-env-setup-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:5432->5432/tcp, \[::]:5432->5432/tcp

hlpf-env-setup-redis-1      redis:7-alpine       "docker-entrypoint.s…"   redis      2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:6379->6379/tcp, \[::]:6379->6379/tcp





C:\\Users\\36981\\-hlpf-env-setup>docker compose exec postgres psql -U nestuser -d nestdb -c "\\l"

&#x20;                                                     List of databases

&#x20;  Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges

\-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------

&#x20;nestdb    | nestuser | UTF8     | libc            | en\_US.utf8 | en\_US.utf8 |            |           |

&#x20;postgres  | nestuser | UTF8     | libc            | en\_US.utf8 | en\_US.utf8 |            |           |

&#x20;template0 | nestuser | UTF8     | libc            | en\_US.utf8 | en\_US.utf8 |            |           | =c/nestuser          +

&#x20;          |          |          |                 |            |            |            |           | nestuser=CTc/nestuser

&#x20;template1 | nestuser | UTF8     | libc            | en\_US.utf8 | en\_US.utf8 |            |           | =c/nestuser          +

&#x20;          |          |          |                 |            |            |            |           | nestuser=CTc/nestuser

(4 rows)







C:\\Users\\36981\\-hlpf-env-setup>docker compose exec redis redis-cli ping

PONG



Вправа 3



C:\\Users\\36981\\-hlpf-env-setup>curl http://localhost:3000

Hello World!



Вправа 4



\[6:13:18 PM] Starting compilation in watch mode...

app-1  |

app-1  | \[6:13:22 PM] Found 0 errors. Watching for file changes.

app-1  |

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[NestFactory] Starting Nest application...

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[InstanceLoader] TypeOrmModule dependencies initialized +63ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[InstanceLoader] ConfigHostModule dependencies initialized +0ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[InstanceLoader] AppModule dependencies initialized +0ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[InstanceLoader] ConfigModule dependencies initialized +0ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[InstanceLoader] TypeOrmCoreModule dependencies initialized +139ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[RoutesResolver] AppController {/}: +4ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[RouterExplorer] Mapped {/, GET} route +2ms

app-1  | \[Nest] 29  - 04/01/2026, 6:13:23 PM     LOG \[NestApplication] Nest application successfully started +2ms





