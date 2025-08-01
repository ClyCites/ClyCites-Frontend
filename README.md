
<div align="center">
  <img src="https://raw.githubusercontent.com/Saga211/ClyCites-Frontend/staging/public/logo.png" alt="ClyCites Logo" width="200">
  <h1>ClyCites Frontend</h1>
  <p>A comprehensive agricultural technology platform designed to empower farmers in Uganda and beyond</p>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  </div>
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## 🌱 About

ClyCites is an open-source platform designed to empower professional and aspiring farmers by bringing their trade into the digital realm. It enables farmers to market and sell their produce online directly from their farms, fostering communication with potential customers. ClyCites also aims to build a digital community of farmers and customers by acting as a central marketplace.

The platform addresses critical challenges in the agricultural sector by providing innovative digital solutions for market access, expert consultation, and farming assistance.

## 🚀 Features

### Core Platform Features
- **📱 E-Market**: Connect directly with buyers and sell your produce at fair market prices without intermediaries
- **👨‍🌾 Expert Portal**: Access agricultural experts for advice on crop management, disease control, and best practices
- **🤖 Agric Assistant**: AI-powered assistant to help with farming decisions, crop planning, and market timing
- **📊 Price Monitoring**: Track real-time market prices to make informed decisions about when to sell your produce
- **🌤️ Weather Detection**: Get accurate weather forecasts and alerts to protect your crops from adverse conditions
- **🐛 Pest & Disease Detection**: Identify and manage crop diseases and pests early with AI-powered image recognition

### Technical Features
- **Responsive Design**: Mobile-first approach with full responsive support
- **Dark/Light Theme**: Built-in theme switching with next-themes
- **Internationalization**: Multi-language support with i18next
- **Real-time Updates**: Live data updates and notifications
- **Progressive Web App**: PWA capabilities for offline access
- **Accessibility**: WCAG compliant components and navigation

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.3.1** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion 12.9.1** - Animation library
- **Lucide React** - Icon library
- **next-themes** - Theme switching

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Additional Libraries
- **Recharts** - Chart components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **i18next** - Internationalization

## 📁 Project Structure

```
ClyCites-Frontend/
├── ClyCites/                    # Main frontend application
│   ├── app/                     # Next.js app directory
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── disease/            # Disease detection
│   │   ├── nutrition/          # Nutrition resources
│   │   ├── program/            # Program information
│   │   └── resources/          # General resources
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── Hero.tsx           # Hero section
│   │   ├── Features.tsx       # Features showcase
│   │   └── ...                # Other components
│   ├── lib/                   # Utility functions
│   ├── public/                # Static assets
│   └── types/                 # TypeScript definitions
├── ClyCites-Emarket/          # E-Market sub-application
├── ClyCites-AgricAssis/       # Agricultural Assistant
├── ClyCites-Expertportal/     # Expert Portal
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saga211/ClyCites-Frontend.git
   cd ClyCites-Frontend
   ```

2. **Install dependencies for the main application**
   ```bash
   cd ClyCites
   npm install
   ```

3. **Install dependencies for sub-applications (optional)**
   ```bash
   # E-Market
   cd ../ClyCites-Emarket
   npm install
   
   # Agricultural Assistant
   cd ../ClyCites-AgricAssis
   npm install
   ```

### Running the Application

1. **Start the development server**
   ```bash
   # From the ClyCites directory
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file in the root of each sub-application with the following variables:

### Main Application (ClyCites)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# External Services
NEXT_PUBLIC_WEATHER_API_KEY=your-weather-api-key
NEXT_PUBLIC_MAPS_API_KEY=your-maps-api-key
```

### E-Market Application
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clycites_emarket"

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001

# File Upload
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### Agricultural Assistant
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEATHER_API_KEY=your-weather-api-key

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3002
```

## 📜 Available Scripts

### Main Application
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### E-Market Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Agricultural Assistant
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/ClyCites-Frontend.git
   cd ClyCites-Frontend
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Include any relevant issue numbers
   - Request reviews from maintainers

### Development Guidelines

- **Code Style**: Follow the existing ESLint configuration
- **TypeScript**: Use strict TypeScript for all new code
- **Components**: Use Radix UI primitives for accessibility
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update README and component documentation

### Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Management Team** - For vision and leadership
- **All Contributors** - For their valuable contributions
- **Agricultural Experts** - For domain knowledge and insights
- **Open Source Community** - For the amazing tools and libraries

## 📞 Contact

- **Email**: clycites@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Saga211/ClyCites-Frontend/issues)
- **Discussions**: [Join the discussion](https://github.com/Saga211/ClyCites-Frontend/discussions)

---

<div align="center">
  <p>Built with ❤️ for the agricultural community</p>
  <p>Empowering farmers through technology</p>
</div>

