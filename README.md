# Spotify Tools

A modern web application built with Next.js that provides various tools and insights for Spotify users. View your top tracks, artists, and more with a beautiful, responsive interface.

## Features

- 🎵 View your top tracks across different time ranges
- 👨‍🎤 Discover your most listened to artists
- 📊 Analyze your listening habits
- 🎨 Beautiful UI with shadcn/ui components
- 📱 Fully responsive design
- 🔒 Secure authentication with Spotify

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- NextAuth.js
- Spotify Web API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Spotify Developer account
- A registered Spotify application

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spotify-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Spotify credentials:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_SECRET=your_nextauth_secret_here # Generate with: openssl rand -base64 32
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Register your application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
   - Add `http://localhost:3000/api/auth/callback/spotify` as a redirect URI
   - Copy your Client ID and Client Secret to the `.env.local` file

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
