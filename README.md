# cloudorbit.fun

A lead-capture website for cloudorbit.fun, a DevOps training institute. Visitors submit
**name, email, phone number, profession (working professional / student), and course interested**
(CI/CD / Cloud & AWS / Docker & Kubernetes / Monitoring). Submissions are saved to an **Amazon
RDS** database. The site also features founder **Pankaj Modak** with his LinkedIn profile, and
the Bengaluru, Karnataka address.

The project has two parts, because a purely static site cannot write to a database on its own —
it needs a small server in between to talk to RDS securely:

```
cloudorbit/
├── frontend/   React + TypeScript site (builds to static HTML/CSS/JS)
└── backend/    Express + TypeScript API that saves leads into Amazon RDS
```

## 1. Set up the Amazon RDS database

1. In the AWS Console, create (or reuse) an **RDS PostgreSQL** instance.
   - Note the endpoint host, port (usually 5432), database name, master username and password.
   - In the instance's **security group**, allow inbound traffic on port 5432 from wherever the
     backend will run (your EC2 instance, Elastic Beanstalk, ECS task, or your own IP for local
     testing).
2. Copy `backend/.env.example` to `backend/.env` and fill in your real `RDS_HOST`, `RDS_DATABASE`,
   `RDS_USER`, `RDS_PASSWORD`.
3. Create the `leads` table:
   ```bash
   cd backend
   npm install
   npm run migrate
   ```
   (This runs `schema.sql` against your RDS instance. You can also run
   `psql -h <RDS_HOST> -U <RDS_USER> -d <RDS_DATABASE> -f schema.sql` directly.)

> The backend uses PostgreSQL (`pg`). If your RDS instance is MySQL/MariaDB instead, swap the
> `pg` package for `mysql2` in `backend/src/db.ts` and `routes/leads.ts` — the SQL is simple
> enough that the change is mechanical.

## 2. Run the backend

```bash
cd backend
npm install
npm run dev      # local development, http://localhost:4000
# or, for production:
npm run build
npm start
```

Deploy this anywhere that can reach your RDS instance and stay running: an EC2 instance, Elastic
Beanstalk, ECS/Fargate, or a small Lightsail instance. Set `CORS_ORIGIN` in `.env` to your real
site domain (e.g. `https://cloudorbit.fun`) before going live.

Endpoints:
- `POST /api/leads` — body `{ name, email, phone, profession, course }`, saves a lead.
- `GET /api/leads` — lists the most recent 200 leads (add authentication before exposing this
  publicly).
- `GET /api/health` — health check.

## 3. Run / build the frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your deployed backend URL
npm run dev             # local development
npm run build            # produces static files in frontend/dist
```

`frontend/dist` is a fully static site — upload it to S3 + CloudFront, Netlify, Vercel, or any
static host for `cloudorbit.fun`. It calls the backend API over HTTPS to save form submissions.

## Editing content

- Founder details: `frontend/src/components/Founder.tsx`
- Address: `frontend/src/components/ContactForm.tsx` and `Footer.tsx`
- Course list: keep `COURSES` in sync between
  `frontend/src/components/ContactForm.tsx` and `backend/src/routes/leads.ts`.

## Security notes before going live

- Put the backend behind HTTPS (e.g. an Application Load Balancer with an ACM certificate, or
  API Gateway in front of a Lambda).
- Restrict the RDS security group to only the backend's IP/security group — never open it to
  `0.0.0.0/0`.
- Add authentication to `GET /api/leads` if you deploy it, so lead data isn't publicly readable.
- Consider basic rate limiting on `POST /api/leads` to reduce spam submissions.
