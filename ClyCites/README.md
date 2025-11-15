<div align="center">
  <h1>🌱 ClyCites - Digital Agriculture Platform</h1>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </div>
  
  <p>Empowering farmers with digital solutions for marketing and selling farm produce</p>
</div>

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Introduction <a name="introduction"></a>

ClyCites is an open-source digital agriculture platform designed to connect farmers with potential buyers, providing tools for marketing and selling farm produce efficiently. Our platform bridges the gap between farmers and consumers, making agricultural trade more accessible and transparent.

## Features <a name="features"></a>

- **Digital Marketplace**: Connect with buyers and sellers across multiple African cities
- **Community Network**: Join over 1,500+ community champions
- **Data Insights**: Access to comprehensive agricultural data and research
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Multilingual Support**: Available in multiple languages for better accessibility

## Tech Stack <a name="tech-stack"></a>

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API
- **Internationalization**: i18next
- **UI Components**: Custom components with shadcn/ui

## Getting Started <a name="getting-started"></a>

### Prerequisites <a name="prerequisites"></a>

- Node.js 16.8 or later
- npm 8.0.0 or later
- Git

### Installation <a name="installation"></a>

1. Clone the repository:
   ```bash
   git clone https://github.com/KubanjaElijahEldred/ClyCites-Frontend.git
   cd ClyCites-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Project <a name="running-the-project"></a>

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Contributing <a name="contributing"></a>

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License <a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support <a name="support"></a>

For support, please open an issue in our [GitHub repository](https://github.com/KubanjaElijahEldred/ClyCites-Frontend/issues) or contact us at [support@clycites.com](mailto:support@clycites.com).

---

<div align="center">
  <p>Made with ❤️ by the ClyCites Team</p>
  <p>© 2023 ClyCites. All rights reserved.</p>
</div>

  .bold-20 {
    @apply text-[20px] font-[700];
  }

  .bold-18 {
    @apply text-[18px] font-[700];
  }

  .bold-16 {
    @apply text-[16px] font-[700];
  }

  /* Hero */
  .hero-map {
    @apply absolute right-0 top-0 h-screen w-screen bg-pattern-2 bg-cover bg-center md:-right-28 xl:-top-60;
  }

  /* Camp */
  .camp-quote {
    @apply absolute -right-6 bottom-4 w-[140px] lg:bottom-10 xl:-right-8 xl:w-[186px] 3xl:right-0;
  }

  /* Feature */
  .feature-phone {
    @apply absolute top-[13%] z-10 hidden max-w-[1500px] rotate-[15deg] md:-left-16 lg:flex  3xl:left-20;
  }

  /* Get App */
  .get-app {
    @apply max-container relative flex w-full  flex-col justify-between gap-32 overflow-hidden bg-green-90 bg-pattern bg-cover bg-center bg-no-repeat px-6 py-12 text-white sm:flex-row sm:gap-12 sm:py-24 lg:px-20 xl:max-h-[598px] 2xl:rounded-5xl;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
```

</details>

<details>
<summary><code>tailwind.config.ts</code></summary>

```typescript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#30AF5B',
          90: '#292C27',
        },
        gray: {
          10: '#EEEEEE',
          20: '#A2A2A2',
          30: '#7B7B7B',
          50: '#585858',
          90: '#141414',
        },
        orange: {
          50: '#FF814C',
        },
        blue: {
          70: '#021639',
        },
        yellow: {
          50: '#FEC601',
        },
      },
      backgroundImage: {
        'bg-img-1': "url('/img-1.png')",
        'bg-img-2': "url('/img-2.png')",
        'feature-bg': "url('/feature-bg.png')",
        pattern: "url('/pattern.png')",
        'pattern-2': "url('/pattern-bg.png')",
      },
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
      maxWidth: {
        '10xl': '1512px',
      },
      borderRadius: {
        '5xl': '40px',
      },
    },
  },
  plugins: [],
};
```

</details>

## <a name="links">🔗 Links</a>

Assets used in the project are here [here](https://drive.google.com/file/d/10bwdMeLAl7scTjrorqtG3v2Z6b4b7S-w/view?usp=sharing)

## <a name="more">🚀 More</a>

**Advance your skills with Next.js 14 Pro Course**

Enjoyed creating this project? Dive deeper into our PRO courses for a richer learning adventure. They're packed with detailed explanations, cool features, and exercises to boost your skills. Give it a go!

<a href="https://jsmastery.pro/next14" target="_blank">
<img src="https://github.com/sujatagunale/EasyRead/assets/151519281/557837ce-f612-4530-ab24-189e75133c71" alt="Project Banner">
</a>

<br />
<br />

**Accelerate your professional journey with the Expert Training program**

And if you're hungry for more than just a course and want to understand how we learn and tackle tech challenges, hop into our personalized masterclass. We cover best practices, different web skills, and offer mentorship to boost your confidence. Let's learn and grow together!

<a href="https://www.jsmastery.pro/masterclass" target="_blank">
<img src="https://github.com/sujatagunale/EasyRead/assets/151519281/fed352ad-f27b-400d-9b8f-c7fe628acb84" alt="Project Banner">
</a>

#
