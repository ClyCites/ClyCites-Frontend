
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
- **Radix UI** - Accessible component primitives (multiple components)
- **Framer Motion 12.9.1** - Animation library
- **Lucide React 0.503.0** - Icon library
- **next-themes 0.4.6** - Theme switching
- **Tailwind CSS Animate** - Animation utilities
- **Tailwind Merge 3.2.0** - Utility class merging
- **Class Variance Authority 0.7.1** - Component variant styling
- **Clsx 2.1.1** - Conditional class names

### Form & Data Handling
- **React Hook Form** - Form handling (via dependencies)
- **Zod** - Schema validation (via dependencies)
- **Sonner 1.5.0** - Toast notifications
- **Recharts 2.15.3** - Chart components
- **React Day Picker 9.6.7** - Date picker component
- **Embla Carousel 8.6.0** - Carousel components

### Internationalization & Utilities
- **i18next 23.15.1** - Internationalization
- **react-i18next 15.0.1** - React i18n bindings
- **React Intersection Observer 9.16.0** - Intersection detection
- **Cmdk 1.1.1** - Command palette component

### Development Tools
- **ESLint** - Code linting
- **PostCSS 8.5.3** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing
- **TypeScript 5** - Type-safe JavaScript

## 📁 Project Structure

```
ClyCites-Frontend/
├── ClyCites/                    # Main frontend application
│   ├── app/                     # Next.js app directory
│   │   ├── about/              # About page
│   │   ├── community-resources/ # Community resources page
│   │   ├── contact/            # Contact page
│   │   ├── disease/            # Disease detection page
│   │   ├── developer-resources/ # Developer resources page
│   │   ├── get-started/        # Getting started page
│   │   ├── login/              # Login page
│   │   ├── nutrition/          # Nutrition resources page
│   │   ├── partner-signup/     # Partner signup page
│   │   ├── policy-resources/   # Policy resources page
│   │   ├── program/            # Program information page
│   │   ├── research-tools/     # Research tools page
│   │   ├── resources/          # General resources page
│   │   ├── search/             # Search functionality
│   │   ├── signup/             # Signup page
│   │   ├── submodules/         # Submodule integrations
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components (Radix UI based)
│   │   ├── BelowHero/         # Below hero section components
│   │   ├── Features/          # Feature showcase components
│   │   ├── Hero/              # Hero section components
│   │   └── ...                # Other feature components
│   ├── lib/                   # Utility functions and configurations
│   ├── public/                # Static assets (images, icons, etc.)
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # Application constants
│   ├── locales/               # Internationalization files
│   └── assets/                # Additional assets
├── ClyCites-AgricAssis/       # Agricultural Assistant (sub-application)
├── ClyCites-Emarket/          # E-Market (sub-application)
├── ClyCites-Expertportal/     # Expert Portal (sub-application)
├── ClyCites-accounts/         # Accounts management (sub-application)
├── .github/                   # GitHub workflows and templates
├── assets/                    # Project-wide assets
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

2. **Install dependencies**
   ```bash
   cd ClyCites
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

## 📜 Available Scripts

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
- **Styling**: Use Tailwind CSS with component variants
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update README and component documentation
- **Internationalization**: Use i18next for multi-language support

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
- **GitHub Issues**: [Create an issue](https://github.com/ClyCites/ClyCites-Frontend/issues)
- **Discussions**: [Join the discussion](https://github.com/ClyCites/ClyCites-Frontend/discussions)

---

<div align="center">
  <p>Built with ❤️ for the agricultural community</p>
  <p>Empowering farmers through technology</p>
</div>

