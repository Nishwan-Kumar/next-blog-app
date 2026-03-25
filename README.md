# 📝 BlogApp

A full-stack blogging platform built with **Next.js 16**, **MongoDB**, and **ImageKit** — featuring a public-facing blog feed, email subscriptions, and a protected admin dashboard for content management.

---

## ✨ Features

### Public
- 📰 Browse all published blog posts in a responsive, animated feed
- 🔍 Filter blogs by category
- 📧 Subscribe with your email to stay updated

### Admin Dashboard (`/admin`)
- 📊 Stats overview — total blogs, subscribers, and views
- ✍️ Create new blog posts with title, description, category, author info, and a cover image
- 🗂️ Manage and delete existing blog posts
- 👥 View all email subscribers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Database | [MongoDB](https://www.mongodb.com) via [Mongoose](https://mongoosejs.com) |
| Image Hosting | [ImageKit](https://imagekit.io) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Icons | [Lucide React](https://lucide.dev) |
| HTTP Client | [Axios](https://axios-http.com) |
| Notifications | [React Toastify](https://fkhadra.github.io/react-toastify) |

---

## 📁 Project Structure

```
blog-app/
├── app/
│   ├── admin/               # Admin dashboard pages
│   │   ├── addProduct/      # Create new blog post
│   │   ├── blogList/        # Manage all blogs
│   │   └── subscriptions/   # View email subscribers
│   ├── api/
│   │   ├── blog/            # Blog CRUD API routes
│   │   └── email/           # Subscription API routes
│   ├── blogs/               # Individual blog post view
│   ├── layout.jsx
│   └── page.jsx             # Home / blog feed
├── Components/
│   ├── AdminComponents/     # Sidebar, admin-specific UI
│   ├── BlogItem.jsx         # Single blog card
│   ├── BlogList.jsx         # Blog feed with category filter
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Subscribe.jsx        # Email subscription form
└── lib/
    ├── config/
    │   ├── db.js            # MongoDB connection
    │   └── imagekit.js      # ImageKit configuration
    └── models/
        ├── BlogModel.js     # Blog schema
        └── EmailModel.js    # Subscriber schema
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas or local)
- An [ImageKit](https://imagekit.io) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/Nishwan-Kumar/next-blog-app.git
cd next-blog-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The admin dashboard is available at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

This project is configured for deployment on **Vercel** (recommended) or **Netlify**.

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the same environment variables from your `.env.local` in the Vercel project settings before deploying.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
