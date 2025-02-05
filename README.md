# 🎵 Prismy

Prismy is a modern, privacy-focused music analytics platform that enhances your Spotify experience. Built with Next.js and designed with a beautiful, responsive interface.

![Prismy Banner](public/banner.png)

## ✨ Features

- **🎯 Top Tracks Analysis**: Discover your most played tracks across different time periods
- **👨‍🎤 Artist Insights**: Deep dive into your favorite artists and their musical connections
- **📊 Listening History**: Track your recent listening patterns with detailed analytics
- **🎨 Smart Playlists**: Generate personalized playlists based on your music taste
- **📱 Playlist Management**: Organize and sort your Spotify playlists efficiently
- **🔍 Music Discovery**: Find new music based on your listening habits

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **API**: [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- **Deployment**: [Heroku](https://heroku.com)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lgsarius/prismy.git
   cd prismy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Set up Spotify:
   - Create a [Spotify Developer Account](https://developer.spotify.com/dashboard)
   - Create a new application
   - Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs
   - Copy the Client ID and Client Secret to your `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Deploying to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Create a new Heroku app:
   ```bash
   heroku create prismy-app
   ```

3. Set environment variables:
   ```bash
   heroku config:set SPOTIFY_CLIENT_ID=your_client_id
   heroku config:set SPOTIFY_CLIENT_SECRET=your_client_secret
   heroku config:set NEXTAUTH_SECRET=$(openssl rand -base64 32)
   heroku config:set NEXTAUTH_URL=https://your-app-name.herokuapp.com
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

5. Update Spotify Dashboard:
   - Add `https://your-app-name.herokuapp.com/api/auth/callback/spotify` to Redirect URIs

## 🔒 Privacy & Security

- EU/GDPR compliant
- Data stored on EU servers
- Transparent data handling
- No third-party tracking
- Minimal data collection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing the music data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icons

## 📞 Contact

- GitHub: [@Lgsarius](https://github.com/Lgsarius)
- Website: [prismy.app](https://prismy.app)

---

Made with ❤️ by [Your Name]
