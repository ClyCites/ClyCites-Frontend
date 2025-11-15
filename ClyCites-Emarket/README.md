<div align="center">
  <img src="../public/logo.png" alt="ClyCites E-Market Logo" width="200">
  <h1>ClyCites E-Market</h1>
  <p>A comprehensive agricultural marketplace platform connecting farmers directly with buyers</p>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-15.1.5-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.3.2-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Prisma-6.6.0-black?style=for-the-badge&logo=prisma" alt="Prisma">
  </div>
</div>

## 📋 Table of Contents

- [Module Overview](#module-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contribution Guidelines](#contribution-guidelines)

## 🌱 Module Overview

ClyCites E-Market is a dedicated marketplace module within the ClyCites ecosystem that enables farmers to sell their agricultural products directly to buyers. This module eliminates intermediaries, ensuring fair pricing and better market access for farmers while providing buyers with fresh, locally-sourced produce.

The platform features both a customer-facing storefront and an administrative back-office, creating a complete e-commerce solution tailored for agricultural products.

## 🚀 Key Features

### Customer-Facing Features
- **🏪 Product Marketplace**: Browse and search agricultural products by category, location, and season
- **🛒 Shopping Cart**: Add to cart, manage quantities, and checkout seamlessly
- **👤 User Authentication**: Secure login and registration for buyers and farmers
- **📱 Farmer Profiles**: Dedicated dashboards for farmers to manage their products and orders
- **🎯 Local Markets**: Discover and connect with local agricultural markets
- **📦 Order Management**: Track orders, delivery status, and purchase history
- **💬 Customer Support**: Integrated support system for buyer and seller assistance

### Administrative Features
- **📊 Analytics Dashboard**: Comprehensive sales, product, and user analytics
- **👥 User Management**: Manage buyers, farmers, and administrative users
- **📋 Product Management**: Approve, feature, and manage product listings
- **💰 Payment Integration**: Secure payment processing and transaction management
- **📈 Market Insights**: Data-driven insights for market trends and pricing

### Technical Features
- **📱 Responsive Design**: Mobile-first approach with full device compatibility
- **🌙 Dark/Light Theme**: Built-in theme switching capability
- **🔍 Advanced Search**: Filter products by category, location, price, and more
- **📤 File Upload**: Image and document upload for product listings
- **🔄 Real-time Updates**: Live inventory and order status updates

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.1.5** - React framework with App Router and Turbopack
- **React 19** - Modern UI library with latest features
- **TypeScript 5** - Type-safe JavaScript development

### Database & ORM
- **Prisma 6.6.0** - Modern database toolkit and ORM
- **PostgreSQL** - Primary database (configured via DATABASE_URL)

### Authentication & Security
- **NextAuth 4.24.11** - Complete authentication solution
- **bcrypt** - Password hashing and security

### UI & Styling
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React 0.473.0** - Modern icon library
- **Sass 1.89.1** - CSS preprocessor for advanced styling

### E-commerce & Forms
- **React Hook Form 7.54.2** - Performant form handling
- **Uploadthing 7.5.2** - File upload solution
- **React Quill 2.0.0** - Rich text editor for product descriptions

### Data Visualization
- **Chart.js 4.4.7** - Charts and analytics
- **React Chart.js 2 5.3.0** - React integration for Chart.js

### Utilities & Libraries
- **Faker 9.4.0** - Data generation for development
- **clsx & tailwind-merge** - Conditional class utilities
- **React Hot Toast 2.5.1** - Notification system
- **Embla Carousel 8.6.0** - Carousel components

## 📁 Folder Structure

```
ClyCites-Emarket/
├── app/                        # Next.js app directory
│   ├── (front-end)/           # Customer-facing application
│   │   ├── (buyer-dashboard)/ # Buyer dashboard pages
│   │   ├── (farmer-dashboard)/# Farmer dashboard pages
│   │   ├── about/             # About page
│   │   ├── careers/           # Careers page
│   │   ├── cart/              # Shopping cart functionality
│   │   ├── customer-support/  # Customer support pages
│   │   ├── faq/               # Frequently asked questions
│   │   ├── farmer-onboarding/ # Farmer registration flow
│   │   ├── features/          # Feature showcase
│   │   ├── how-it-works/      # How it works guide
│   │   ├── login/             # Login page
│   │   ├── markets/           # Local markets listing
│   │   ├── products/          # Product pages and listings
│   │   ├── register/          # User registration
│   │   ├── shop/              # Main shop interface
│   │   └── page.jsx           # Homepage
│   ├── (back-office)/         # Administrative interface
│   │   ├── dashboard/         # Admin dashboard pages
│   │   └── layout.js          # Admin layout
│   ├── api/                   # API routes
│   ├── layout.tsx             # Root layout
│   └── favicon.ico            # Favicon
├── components/                 # React components
│   ├── frontend/              # Customer-facing components
│   ├── backend/               # Admin components
│   └── ui/                    # Reusable UI components
├── context/                   # React context providers
│   └── Providers.jsx          # Main context provider
├── lib/                       # Utility functions
│   ├── apiRequest.js          # API request utilities
│   ├── db.js                  # Database connection
│   ├── uploadthing.js         # File upload configuration
│   └── utils.ts               # General utilities
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
├── styles/                    # Global styles
│   └── main.scss              # Main stylesheet
├── data.json                  # Sample data for development
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 Setup Instructions

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (for database)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/Saga211/ClyCites-Frontend.git
   cd ClyCites-Frontend/ClyCites-Emarket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Ensure PostgreSQL is running
   # Create database (replace with your credentials)
   createdb clycites_emarket
   
   # Run Prisma migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

4. **Configure environment variables** (see Environment Variables section below)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - The app will automatically detect and route to front-end or back-office based on URL

## 🔧 Environment Variables

Create a `.env.local` file in the root of the ClyCites-Emarket directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clycites_emarket"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Uploadthing (for file uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Optional: External services
# NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### Getting Environment Variables

1. **Database URL**: Set up your PostgreSQL database and use the connection string
2. **NEXTAUTH_SECRET**: Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```
3. **Uploadthing**: Create an account at [uploadthing.com](https://uploadthing.com) to get your credentials

## 📜 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

### Additional Scripts

```bash
npx prisma studio    # Open Prisma Studio for database management
npx prisma migrate dev # Run database migrations
npx prisma generate   # Generate Prisma client
```

## 🤝 Contribution Guidelines

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow coding standards**
   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Use Tailwind CSS for styling
   - Write meaningful component names

3. **Database changes**
   - Modify Prisma schema for database changes
   - Run `npx prisma migrate dev` to create migrations
   - Update TypeScript types if needed

4. **Testing**
   - Test all functionality before submitting
   - Ensure responsive design works on mobile devices
   - Verify database operations work correctly

### Component Guidelines

- **Frontend Components**: Place in `components/frontend/`
- **Backend Components**: Place in `components/backend/`
- **UI Components**: Place in `components/ui/` for reusable elements
- **API Routes**: Place in `app/api/` following RESTful conventions

### Code Style

- **Components**: Use functional components with hooks
- **Styling**: Prefer Tailwind CSS classes over custom CSS
- **State Management**: Use React Context for global state
- **Forms**: Use React Hook Form for form handling
- **API Calls**: Use the provided `apiRequest.js` utility

### Submitting Changes

1. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add farmer dashboard analytics"
   ```

2. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Request review from maintainers

## 📞 Support

For questions or issues related to the E-Market module:
- Create an issue in the main repository
- Contact the development team
- Check existing documentation in the main ClyCites repository

---

<div align="center">
  <p>Built with ❤️ for the agricultural community</p>
  <p>Empowering farmers through digital marketplace solutions</p>
</div>
 
