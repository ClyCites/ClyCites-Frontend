# 🆕🐣 First Timers Only – Improve UX with Loading Spinner for Product List

🎉 This issue is reserved for **first-time contributors** to ClyCites or open-source in general. It’s the perfect entry point for learning how to work with real-world React + TypeScript + Next.js projects!

---

## 📘 About ClyCites

ClyCites is an open-source digital platform that empowers both experienced and upcoming farmers to:

- 🌾 Market and sell their farm produce online (`ClyCites-Emarket`)
- 📚 Access agricultural expert advice and content (`ClyCites-Expertportal`)
- 🤖 Get virtual assistance for farm planning and productivity (`ClyCites-AgricAssis`)

This issue focuses on improving the user interface of our Emarket module in the `ClyCites-Frontend` project.

---

## 👾 Issue Description

**Problem**:  
When fetching product data in the Emarket section, users don’t receive any visual cue that data is being loaded. This could result in a confusing experience and make users think nothing is happening.

**Task**:  
Add a loading spinner to the `ProductList` component that shows while product data is being fetched.

---

## 🎯 Goals

- Display a loading spinner when the product list is still loading
- Hide the spinner once the data is fetched
- Ensure accessibility and responsiveness

---

## 📁 Affected File(s)
src/ ├── modules/ │ └── emarket/ │ ├── components/ │ │ └── ProductList.tsx ← modify here │ └── pages/ │ └── emarket.tsx ← might touch here too ├── utils/ │ └── loading.ts (optional helper for reusability)

---

## ✅ Expected Result

A simple, centered spinner or loader text appears on the screen **while products are being fetched** and disappears once products are displayed.

### Spinner Component Example

```tsx
export const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
  </div>
);
```

### 🛠 Tech Stack
- Next.js

- TypeScript

- Tailwind CSS

- Git & GitHub

## 📋 How to Contribute

If this is your first open-source PR, follow these steps carefully:

1. **Comment below** to claim the issue (e.g., _"I'd love to work on this!"_)

2. **Wait for assignment** — a maintainer will assign the issue to you

3. **Fork the repository** to your GitHub account

4. **Clone the repo** locally and set it up:

```bash
   git clone https://github.com/YOUR_USERNAME/ClyCites-Frontend.git
   cd ClyCites-Frontend
   npm install
   npm run dev
```

### 🚀 Create a Feature Branch

Run the following command to create your feature branch:

```bash
git checkout -b issue-XX-productlist-spinner
```

# Replace XX with the actual issue number.

### 🛠️ Implement the Spinner Functionality

- Add the spinner logic to the relevant component as described in the issue.
- Ensure that the spinner displays while data is loading.
- Make sure the spinner disappears once the data has been successfully fetched.
- Verify that the UI remains responsive and functions correctly across different screen sizes and devices.

### 💾 Commit Your Changes (with DCO Sign-Off)

When you're ready to commit, use the `-s` flag to sign off your commit message:

```bash
git commit -s -m "feat: add loading spinner to ProductList component"
```
This is required to meet the Developer Certificate of Origin.
