# 🩺 Pulse — AI Personal Health Coach

### Your body's data, coached by AI.

Pulse is an AI-powered personal health coaching web application designed to help users understand their health and build healthier habits. By combining Google Fit integration with AI-powered guidance, Pulse aims to turn everyday health data into actionable insights and personalized wellness plans.

🌐 **Live Demo:** [fitwise-health.lovable.app](https://fitwise-health.lovable.app)  
💻 **GitHub Repository:** [MANMOHAN14/fitwise-health](https://github.com/MANMOHAN14/fitwise-health)

---

## ✨ Features

- **📊 Health Activity Dashboard** — Bring key health metrics, including steps, heart rate, sleep, and calories, into one place.
- **🤖 AI Health Coach** — Interact with an AI-powered assistant to get personalized guidance based on available health information.
- **🏋️ Personalized Workout Plans** — Generate workout suggestions tailored to your fitness goals.
- **🥗 Meal Planning** — Get personalized meal suggestions to support your wellness and fitness journey.
- **🎯 Goal Tracking** — Set health and fitness goals and monitor your progress.
- **🔗 Google Fit Integration** — Connect supported health data to make your coaching experience more personalized.
- **📱 Modern Web Experience** — Access the application through a clean, responsive interface designed for convenient use.

## 🎯 Problem Statement

Many people collect health and fitness data but struggle to understand what it means or how to use it to improve their daily routines. Generic fitness plans may not reflect an individual's activity levels, sleep patterns, or personal goals.

Pulse aims to bridge this gap by bringing health data, AI-assisted coaching, and personalized wellness planning together in a single application.

## 💡 Our Solution

Pulse provides a centralized health coaching experience that helps users:

1. Understand their daily activity and available health metrics.
2. Get AI-assisted answers to health and fitness questions.
3. Explore personalized workout and meal plans.
4. Set realistic wellness goals and work toward them consistently.

The goal is to make health insights easier to understand and healthy habits easier to maintain.

## 🛠️ Tech Stack

The project uses a modern TypeScript-based web development stack.

| Technology | Purpose |
|---|---|
| React | Building interactive user interfaces |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| TanStack Start / Router | Application framework and routing |
| Supabase | Backend and data services |
| Google Fit | Health data integration |
| AI SDK | AI-powered application features |
| Drizzle ORM | Database interaction |
| Vitest | Testing |

*Note: The technologies above are based on the repository's declared dependencies and project description. The exact implementation and configuration of each integration may vary.*

## 🚀 Getting Started

For Vercel hosting, follow [the deployment guide](./DEPLOYMENT.md).

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — a compatible version for the project dependencies
- npm — included with Node.js
- Git

### 1. Clone the repository

```bash
git clone https://github.com/MANMOHAN14/fitwise-health.git
cd fitwise-health
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the environment variables required by your enabled services.

For example, if your local setup uses Supabase:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add any additional variables required by your AI provider, authentication service, database, or Google Fit integration according to the project configuration.

**Important:** These are example variable names, not a verified list of the project's required environment variables. Check the existing configuration and Supabase client setup before running the application. Never commit real API keys, passwords, access tokens, or other secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal to access the application.

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📂 Project Structure

The repository is organized around the application source code, public assets, database configuration, and backend integrations.

```text
fitwise-health/
├── public/          # Public assets and static files
├── src/             # Application source code
├── supabase/        # Supabase configuration and resources
├── drizzle/         # Database-related resources
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation
```

The exact contents of each directory may change as the project evolves.

## 🔐 Privacy and Security

Pulse works with health-related information, so privacy and security are important considerations.

- Request only the permissions needed for the application's functionality.
- Keep API keys and private credentials out of source control.
- Protect user authentication and health data with appropriate access controls.
- Explain clearly how health data is accessed, processed, and stored.
- Follow the relevant Google Fit and backend provider requirements.

Users should review the application's privacy policy and data permissions before connecting personal health information.

## 🗺️ Future Improvements

Potential enhancements for future versions include:

- 📈 Advanced health analytics and trend visualizations.
- 💤 Personalized sleep insights and recommendations.
- 🔔 Daily reminders and healthy habit tracking.
- 📅 Weekly and monthly wellness reports.
- 🥑 More detailed nutrition and meal-planning options.
- 🔄 Improved health data synchronization.
- 📱 Progressive Web App (PWA) support.
- 🧑‍⚕️ More contextual and evidence-informed AI coaching.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork this repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and test them.
4. Commit your changes:

   ```bash
   git commit -m "Add: your feature description"
   ```

5. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request describing your changes.

## ⚠️ Disclaimer

Pulse is intended for general wellness and fitness support. AI-generated recommendations are informational and are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

## 📄 License

No license has been specified in this README. Add a `LICENSE` file and update this section before distributing the project under an open-source license.

---

## 💙 Built to make personal health insights more actionable.

**Explore Pulse:** [Live Application](https://fitwise-health.lovable.app)

**Explore the Code:** [GitHub Repository](https://github.com/MANMOHAN14/fitwise-health)

If you find this project interesting, consider giving the repository a ⭐ on GitHub!