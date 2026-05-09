# EduPath

A high-performance, single-page application (SPA) providing a minimalist, effortless career recommendation experience for students using AI.

## Environment Variables

This application requires a Gemini API key.
1. Copy `.env.example` to `.env`.
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY="your_actual_key_here"
   ```

## Local Development

```bash
npm install
npm run dev
```

## Deployment

This app is optimized for hosting on Vercel or similar platforms.

### 3-Step GitHub and Vercel Deployment

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Commit and push the code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/yourusername/edupath.git
     git push -u origin main
     ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com/) and log in.
   - Click "Add New Project" and import your newly created GitHub repository.
   - Vercel will auto-detect Vite as the framework.

3. **Configure Environment Variables**:
   - Before hitting "Deploy", go to the "Environment Variables" section in Vercel.
   - Add a new variable: Name: `VITE_GEMINI_API_KEY`, Value: `your_actual_api_key`. (Note: Since we use process.env.GEMINI_API_KEY in the vite.config.ts, you might need to also map it there depending on your Vercel setup, but typically Vercel handles `.env` variables if configured correctly, or use `GEMINI_API_KEY`).
   - Click "Deploy". Your app will be live in a few minutes!
