# 🌾 My Farm Twin - AI-Powered Smart Farming Assistant

> **Hackathon Submission Project**

My Farm Twin is a comprehensive, mobile-first digital twin platform and AI farming advisor designed specifically for smallholder farmers in Kenya and across Africa. It bridges the technology gap by providing accessible, multilingual agricultural insights powered by Azure AI services.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Azure AI](https://img.shields.io/badge/Azure-AI%20Services-0078D4?style=flat-square&logo=microsoft-azure)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 📋 Hackathon Submission

### Project Overview
**My Farm Twin** solves the critical challenge of limited access to agricultural expertise for smallholder farmers in Africa. By combining Azure AI services with an intuitive multilingual interface, farmers can get instant farming advice, detect plant diseases, monitor their farms, and receive alerts—all through voice interaction in their native language (English, Kiswahili, or French).

### Technologies Used
- **Azure OpenAI (GPT-4)** - Intelligent farming advice and contextual recommendations
- **Azure Computer Vision** - Plant disease detection and image analysis
- **Azure Speech Service** - Multilingual voice recognition and text-to-speech
- **Azure Translator** - Real-time translation across 60+ languages
- **Next.js 16** - Modern React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive, mobile-first UI design

### Team Members
- **Kalanza Victor** - [@Kalanza](https://github.com/Kalanza)
- **Lewis Machabe** - [@1239sachet](https://github.com/1249sachet)
- **Joram Mwanyika** - [@JoramMwanyika](https://github.com/JoramMwanyika)

### Links
- **📹 Demo Video (Part 1)**: [https://www.loom.com/share/d282110701b54070abe5cd8b10c9e096](https://www.loom.com/share/d282110701b54070abe5cd8b10c9e096)
- **📹 Demo Video (Part 2)**: [https://www.loom.com/share/f864ab08ee9f4fd9b7aee448be1c06c5](https://www.loom.com/share/f864ab08ee9f4fd9b7aee448be1c06c5)
- **💻 Repository**: [https://github.com/JoramMwanyika/My-Farm-Twin](https://github.com/JoramMwanyika/My-Farm-Twin)
- **🚀 Live Demo**: [Coming Soon]

### Submission Details
Please submit through: **[Hackathon Submission Page](https://github.com/armely/Hackathon/issues)**

**Required Submission Items:**
1. ✅ Short project description (above)
2. ✅ Project Repository URL
3. ⏳ Project Demo Video URL (upload to YouTube)
4. ✅ Team Members with GitHub usernames

---

## ✨ Features

### 🏠 Smart Dashboard
- Real-time weather information with temperature, humidity, and wind data
- Soil health monitoring with moisture levels and nutrient analysis
- Priority alerts for dry spells, pest outbreaks, and irrigation needs
- Quick action buttons for logging crop status and water usage
- Beautiful, animated UI with gradient cards and smooth transitions

### 🌱 Farm Digital Twin
- Interactive visual map of farm plots with customizable colors
- Real-time crop status tracking with growth progress indicators
- Soil composition analysis (pH, Nitrogen, Phosphorus levels)
- Farm task calendar with upcoming activities
- Editable farm layout with add/edit/delete functionality

### 🤖 AI Advisor (AgriVoice)
- **GPT-4 Powered Chat**: Context-aware farming advice using Azure OpenAI
- **Multilingual Support**: English, Kiswahili (Swahili), and French
- **Voice Interaction**: Speak in any supported language, get responses in your language
- **Plant Disease Detection**: Upload crop images for AI-powered diagnosis
- **Auto-translate**: Automatic translation between your language and the AI
- **Voice Synthesis**: Hear responses in natural-sounding voices

### 📸 Plant Disease Detection
- Azure Computer Vision for image analysis
- GPT-4 for disease identification and diagnosis
- Detailed analysis including plant type, condition, severity, and symptoms
- Treatment recommendations and prevention measures

### 🚨 Alert System
- Critical, Warning, and Info priority levels
- High-contrast visual indicators with color-coded alerts
- Dismissible notifications with swipe gestures
- Real-time updates with timestamps

### 🌍 Accessibility & Localization
- **Languages**: English (🇬🇧), Kiswahili (🇰🇪), Français (🇫🇷)
- **Neural Voices**: AvaNeural (English), ZuriNeural (Swahili), DeniseNeural (French)
- Large touch targets for easy mobile interaction
- High-contrast earthy color scheme (greens, browns, yellows)
- Icon-based navigation for low-literacy users

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Tailwind CSS + Custom Keyframes

### Azure AI Services
- **Azure OpenAI (GPT-4)**: Intelligent farming advice and plant disease analysis
- **Azure Computer Vision**: Image analysis for plant disease detection
- **Azure Speech Service**: Voice recognition and text-to-speech synthesis
- **Azure Translator**: Multi-language translation (60+ languages)

### Additional Libraries
- **Speech SDK**: `microsoft-cognitiveservices-speech-sdk` for voice interaction
- **Form Handling**: `react-hook-form` with `zod` validation
- **Notifications**: `sonner` for toast messages
- **Date Handling**: `date-fns` for date formatting


## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **Package Manager**: npm (comes with Node.js) or pnpm
- **Azure Account**: For AI services ([Sign up](https://azure.microsoft.com/free/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JoramMwanyika/My-Farm-Twin.git
   cd My-Farm-Twin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or if you prefer pnpm
   pnpm install
   ```

3. **Set up environment variables:**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Azure credentials:
   ```env
   # Azure OpenAI GPT-4
   AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/openai/deployments/gpt-4/chat/completions
   AZURE_OPENAI_KEY=your-azure-openai-key
   AZURE_OPENAI_DEPLOYMENT=gpt-4
   AZURE_OPENAI_API_VERSION=2025-01-01-preview

   # Azure Translator
   AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/
   AZURE_TRANSLATOR_KEY=your-translator-key
   AZURE_TRANSLATOR_REGION=eastus

   # Azure Speech Service
   AZURE_SPEECH_KEY=your-speech-service-key
   AZURE_SPEECH_REGION=eastus

   # Azure Computer Vision
   AZURE_VISION_ENDPOINT=https://your-vision-resource.cognitiveservices.azure.com
   AZURE_VISION_KEY=your-computer-vision-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open the application:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
My-Farm-Twin/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home dashboard
│   ├── advisor/                 # AI chat advisor
│   │   └── page.tsx
│   ├── farm/                    # Farm digital twin
│   │   └── page.tsx
│   ├── alerts/                  # Alert notifications
│   │   └── page.tsx
│   ├── profile/                 # User profile
│   │   └── page.tsx
│   ├── api/                     # API routes
│   │   ├── chat/               # GPT-4 chat endpoint
│   │   ├── speech/             # Speech service token
│   │   ├── translate/          # Translation endpoint
│   │   └── analyze-image/      # Image analysis endpoint
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── header.tsx              # App header
│   ├── bottom-nav.tsx          # Bottom navigation
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
│
├── lib/                        # Utility functions
│   ├── speech.ts              # Azure Speech SDK integration
│   └── utils.ts               # Helper functions
│
├── public/                     # Static assets
│   ├── icon.svg
│   └── placeholder-*.png
│
├── .env.local                  # Environment variables (gitignored)
├── .env.example               # Environment template
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```


## 💡 Usage Guide

### Navigation
Use the **bottom navigation bar** to switch between pages:
- 🏠 **Home**: Dashboard with weather, alerts, and quick actions
- 💬 **Advisor**: AI chat with voice support
- 🌱 **Farm**: Digital twin of your farm plots
- 🚨 **Alerts**: Priority notifications
- 👤 **Profile**: User settings and preferences

### AI Advisor Features

#### 1. Text Chat
- Type your farming question in any language
- AI automatically translates and responds in your language
- Get context-aware advice about crops, pests, soil, weather, etc.

#### 2. Voice Interaction
1. Click the 🎤 microphone button
2. Speak your question in English, Swahili, or French
3. The AI transcribes, translates, and responds
4. Enable "Auto-speak" to hear responses automatically

#### 3. Plant Disease Detection
1. Click the 📷 camera button
2. Upload or take a photo of your crop
3. AI analyzes the image for diseases, pests, or issues
4. Receive diagnosis with severity, symptoms, and treatment recommendations

### Farm Digital Twin

#### Manage Your Farm Plots
- **View**: See all your farm blocks on the visual map
- **Edit Layout**: Click "Edit Layout" to modify blocks
- **Add Block**: Click the + button to add new farm plots
- **Edit Block**: Click the pencil icon to change crop, name, or color
- **Delete Block**: Click the trash icon to remove a block
- **Track Progress**: View growth progress bars for each crop

#### Monitor Soil Health
Switch to the "Soil Health" tab to see:
- pH levels
- Nitrogen, Phosphorus, Potassium levels
- Recommendations for fertilization

#### Calendar & Tasks
- View upcoming farm activities
- Add new tasks with dates
- Mark tasks as complete

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

Create a `.env.local` file with these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI deployment URL | `https://....azure.com/.../chat/completions` |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | `abc123...` |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name | `gpt-4` |
| `AZURE_OPENAI_API_VERSION` | API version | `2025-01-01-preview` |
| `AZURE_TRANSLATOR_KEY` | Azure Translator key | `def456...` |
| `AZURE_TRANSLATOR_REGION` | Azure region | `eastus` |
| `AZURE_SPEECH_KEY` | Azure Speech Service key | `ghi789...` |
| `AZURE_SPEECH_REGION` | Azure region | `eastus` |
| `AZURE_VISION_ENDPOINT` | Computer Vision URL | `https://....azure.com` |
| `AZURE_VISION_KEY` | Computer Vision key | `jkl012...` |

### Setting Up Azure Services

1. **Azure OpenAI**
   - Create an Azure OpenAI resource
   - Deploy a GPT-4 model
   - Copy the endpoint and key

2. **Azure Translator**
   - Create a Translator resource
   - Copy the key and region

3. **Azure Speech Service**
   - Create a Speech Services resource
   - Copy the key and region

4. **Azure Computer Vision**
   - Create a Computer Vision resource
   - Copy the endpoint and key

See [Azure Documentation](https://docs.microsoft.com/azure/) for detailed setup instructions.

## 🎨 Design System

### Color Palette

The app uses an **earthy, agricultural theme**:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#2d5a47` | Main actions, links |
| Background Beige | `#f0efe9` | Page backgrounds |
| Warning Yellow | `#e5b045` | Warnings, alerts |
| Critical Red | `#c94a4a` | Critical alerts |
| Dark Forest Green | `#1a3c2f` | Text, headers |

### Typography

- **Headings**: Serif font (elegant, readable)
- **Body**: Sans-serif font (clean, modern)
- **Font Sizes**: Large for accessibility (16px minimum)

### Components

All UI components follow the **shadcn/ui** design system with customizations for:
- Larger touch targets (min 44×44px)
- High contrast ratios (WCAG AA compliant)
- Smooth animations and transitions
- Mobile-first responsive design

## 🌍 Multilingual Support

### Supported Languages

| Language | Code | Voice | Status |
|----------|------|-------|--------|
| English | `en` | AvaNeural (en-US) | ✅ |
| Kiswahili | `sw` | ZuriNeural (sw-KE) | ✅ |
| Français | `fr` | DeniseNeural (fr-FR) | ✅ |

### Translation Flow

1. **User Input** → Detected in user's language
2. **Translation** → Azure Translator converts to English
3. **AI Processing** → GPT-4 generates response in English
4. **Translation** → Response translated back to user's language
5. **Voice Output** → Azure Speech synthesizes in user's language

## 📊 Features Breakdown

### ✅ Implemented Features

- [x] Smart dashboard with weather and soil data
- [x] Farm digital twin with interactive map
- [x] GPT-4 powered AI chat advisor
- [x] Multilingual support (EN, SW, FR)
- [x] Voice input and output with Azure Speech
- [x] Plant disease detection with Computer Vision
- [x] Alert system with priority levels
- [x] Soil health monitoring
- [x] Farm task calendar
- [x] Auto-translation pipeline
- [x] Modern UI with animations
- [x] Mobile-responsive design
- [x] Dark mode support

### 🚧 Planned Features

- [ ] Offline mode support
- [ ] Historical data tracking and charts
- [ ] Market price integration
- [ ] Weather forecasting (7-day)
- [ ] SMS/WhatsApp notifications
- [ ] Multiple farm support
- [ ] Crop rotation planning
- [ ] Harvest tracking
- [ ] Financial tracking (expenses/income)
- [ ] Community forum

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Test on mobile devices
- Ensure accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Team

### Hackathon Team
- **Kalanza Victor** - [@GitHub](https://github.com/KalanzaVictor)
- **Lewis Machabe** - [@1239sachet](https://github.com/1239sachet)
- **Joram Mwanyika** - [@JoramMwanyika](https://github.com/JoramMwanyika)

## 🙏 Acknowledgments

- **Azure AI Services** for providing powerful AI capabilities
- **shadcn/ui** for beautiful, accessible components
- **Next.js Team** for the amazing framework
- **Smallholder farmers** who inspired this project
- **Hackathon Organizers** for the opportunity to build impactful solutions

## 📞 Support

For questions or support:
- Open an [issue](https://github.com/JoramMwanyika/My-Farm-Twin/issues)
- Contact team members via GitHub

---

## 🎯 Hackathon Submission Reminder

**Submit your project here:** [https://github.com/armely/Hackathon/issues](https://github.com/armely/Hackathon/issues)

**Submission Checklist:**
- [ ] Upload project demo video to YouTube
- [ ] Fill out submission form with:
  - [ ] Project description
  - [ ] Repository URL: `https://github.com/JoramMwanyika/My-Farm-Twin`
  - [ ] Demo video URL
  - [ ] Team members: Kalanza Victor, Lewis Machabe (1239sachet), Joram Mwanyika (JoramMwanyika)
- [ ] Verify all links work correctly
- [ ] Submit before deadline

---

**Made with ❤️ for smallholder farmers across Africa** 🌾🌍
