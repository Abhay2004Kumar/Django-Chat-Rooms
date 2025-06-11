# 🗨️ Chat App (Django + React)

A real-time chat application built with **Django REST Framework** and **React**, supporting JWT authentication, profile photo upload via **Cloudinary**, and deployed on **Render**.

---

## 🚀 Features

- 🔐 User registration & login with JWT
- 🧑 Upload & update profile pictures
- 💬 Chat room functionality
- 🛡️ Protected API endpoints
- ☁️ Cloudinary for media storage
- 🖥️ Deployed on Vercel and Render (Frontend + Backend)

---

## 🧰 Tech Stack

### Backend
- Django 5.2.3
- Django REST Framework
- Simple JWT
- Cloudinary
- PostgreSQL (via Render)
- `dj-database-url` & `python-dotenv`

### Frontend
- React (with Tailwind CSS)
- Axios for API calls
- React Router DOM

---

## ⚙️ Environment Variables

Create a `.env` file in the root of your backend project:

```env
SECRET_KEY=your-django-secret-key
DEBUG=False

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

DATABASE_URL=postgres://username:password@host:port/dbname
