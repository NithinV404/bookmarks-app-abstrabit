# 🔖 Bookmarks App

A modern, full-stack bookmarks application built with Next.js 16, Supabase, and Google OAuth authentication.

### Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Then fill in your credentials in `.env.local`.

3. **Set up Supabase database:**

See [SETUP.md](./SETUP.md) for detailed instructions on creating the database schema and configuring Google OAuth.

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Problems faced and solutions

1. Since i have never extensively worked with nextjs i am do not have soo much familiarity with it i used AI help in regards to configuring nextjs and installing different packages and integrating them to work
2. The Auth path went pretty smooth since i have already worked on the auth system using node and expressjs immplementing a jwt system i knew how most of the security part should be handled
3. I have implemented the real time update by basically using swr package which updates the dashboard every 3 seconds and caches it also in order to avoid server load we can use supabase realtime db subscription to update the bookmarks dynamically
4. Since there was requirement of to just use googleOAuth we are using the tokens provided by the google auth to authenticate user by storing those token in http cookie and using them to authenticate user when requesting user to login next time

## 📝 License

MIT
