# Dobby 🧙‍♂️

> AI-powered parallel video generation system using browser automation

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)

Dobby is a high-performance video generation API that leverages browser automation to generate videos through Google's Flow video generation service. It manages multiple authenticated browser contexts to enable parallel video generation, handling up to 10 concurrent requests.

## 🚀 Key Features

- **Parallel Processing**: Handle up to 10 concurrent video generation requests
- **Persistent Authentication**: Context-based authentication that survives between sessions
- **AI-Powered Automation**: Uses Stagehand for intelligent browser interaction
- **Cloud-Native**: Designed for deployment on Google Cloud Run
- **TypeScript**: Fully typed for enhanced developer experience
- **Scalable Architecture**: Easily expandable to support more concurrent sessions

## 🏗️ Architecture Overview

Dobby uses a unique architecture that combines:

- **[Browserbase](https://www.browserbase.com/)**: Cloud browser infrastructure for running headless browsers
- **[Stagehand](https://stagehand.dev/)**: AI-powered browser automation tool
- **Context Pooling**: Maintains 10 pre-authenticated browser contexts for instant access
- **On-Demand Sessions**: Creates fresh browser sessions for each request using saved contexts

### How It Works

1. **Client Request**: Send a video generation request with a text prompt
2. **Context Acquisition**: System assigns an available pre-authenticated context
3. **Browser Automation**: AI navigates the video generation interface
4. **Video Generation**: Monitors progress and waits for completion
5. **Download & Delivery**: Retrieves the generated video and streams it to the client
6. **Cleanup**: Releases the context for the next request

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Browserbase API key
- Google API key (for Gemini 2.5 Pro) or OpenAI API key
- 10 Google accounts for parallel processing

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dobby.git
cd dobby
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=8080
BROWSERBASE_API_KEY=your_browserbase_api_key
GOOGLE_API_KEY=your_google_api_key  # Recommended
# or
OPENAI_API_KEY=your_openai_api_key
```

## 🚦 Quick Start

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📡 API Reference

### Health Check
```http
GET /
```

Returns service status and health information.

**Response:**
```json
{
  "status": "running",
  "service": "dobby",
  "message": "Dobby is free! Service is running successfully.",
  "timestamp": "2024-01-25T12:00:00.000Z"
}
```

### Generate Video
```http
POST /generate-video
```

Generates a video based on the provided text prompt.

**Request Body:**
```json
{
  "prompt": "A magical castle floating in the clouds"
}
```

**Response:**
- **Content-Type**: `video/mp4`
- **Body**: Binary video stream

**Status Codes:**
- `200`: Video generated successfully
- `503`: All workers busy
- `500`: Generation failed

## 🔧 Configuration

### Context Setup (One-Time Process)

Before using Dobby, you need to set up 10 authenticated browser contexts:

1. Create 10 Google accounts (dobby.worker0@gmail.com through dobby.worker9@gmail.com)
2. For each account:
   - Create a Browserbase session with context ID `dobby.worker{0-9}`
   - Use Session Live View to manually log into Google
   - Navigate to https://labs.google/fx/tools/flow
   - Complete any required authentication
   - The context will persist the authentication state

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `8080` |
| `BROWSERBASE_API_KEY` | Browserbase API key | Yes | - |
| `GOOGLE_API_KEY` | Google API key for Gemini | Recommended | - |
| `OPENAI_API_KEY` | OpenAI API key (fallback) | No | - |

## 📦 Project Structure

```
dobby/
├── src/
│   ├── server.ts           # Main Express server
│   ├── config/             # Configuration files
│   ├── services/           # Core business logic
│   │   ├── browserbase.ts  # Browserbase integration
│   │   ├── stagehand.ts    # Stagehand automation
│   │   └── context-pool.ts # Context management
│   └── types/              # TypeScript definitions
├── docs/                   # API documentation
│   ├── browserbase/        # Browserbase docs
│   └── stagehand/          # Stagehand docs
├── dist/                   # Compiled output
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── CLAUDE.md              # AI assistant instructions
└── README.md              # This file
```

## 🚀 Deployment

### Google Cloud Run

1. Build the container:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/dobby
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy dobby \
  --image gcr.io/YOUR_PROJECT/dobby \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars BROWSERBASE_API_KEY=xxx,GOOGLE_API_KEY=xxx
```

## 🔍 Monitoring & Maintenance

### Health Monitoring
- Track context availability and health status
- Monitor authentication expiry
- Alert on repeated failures

### Performance Metrics
- Average video generation time: ~60-90 seconds
- Context utilization rates
- Request queue depths
- Success/failure rates per context

## 🎯 Scaling

To scale beyond 10 concurrent requests:

1. Create additional Google accounts
2. Set up new authenticated contexts
3. Update the context pool configuration
4. Consider implementing:
   - Request queueing with estimated wait times
   - Load balancing across multiple instances
   - Context rotation strategies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Browserbase](https://www.browserbase.com/) for cloud browser infrastructure
- [Stagehand](https://stagehand.dev/) for AI-powered browser automation
- Google Flow team for the video generation service

---

**Note**: This project is designed for authorized use with Google's Flow video generation service. Ensure you have proper permissions and comply with all terms of service. 