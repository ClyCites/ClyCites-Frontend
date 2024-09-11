"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export const NAV_LINKS = [
  {
    href: '/',
    key: 'home',
    label: 'Home'
  },
  {
    href: '/',
    key: 'products',
    label: 'Products',
    dropdown: [
      { href: '/', label: 'Product 1' },
      { href: '/', label: 'Product 2' },
      { href: '/', label: 'Product 3' },
      { href: '/', label: 'Product 4' },
      { href: '/', label: 'Product 5' },
      { href: '/', label: 'Product 6' }
    ]
  },
  {
    href: '/',
    key: 'solutions',
    label: 'Solutions',
    dropdown: [
      { href: '/', label: 'Solution 1' },
      { href: '/', label: 'Solution 2' },
      { href: '/', label: 'Solution 3' },
      { href: '/', label: 'Solution 4' },
      { href: '/', label: 'Solution 5' },
      { href: '/', label: 'Solution 6' }
    ]
  },
  {
    href: '/',
    key: 'contact_us',
    label: 'About',
    dropdown: [
      { href: '/', label: 'About Us' },
      { href: '/', label: 'Contact Us' },
      { href: '/', label: 'FAQs' },
      { href: '/', label: 'Terms of Service' },
      { href: '/', label: 'Privacy Policy' },
      { href: '/', label: 'Site Map' }
    ]
  }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  const router = useRouter();

  const handleLanguageClick = (language: string) => {
    setSelectedLanguage(language);

    // Language switching logic
    const locale = language === 'English' ? 'en' : language.slice(0, 2).toLowerCase();
    router.push(router.pathname, router.asPath, { locale });
    console.log(`Language switched to: ${language}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Language Selector */}
      <div className="top-0 left-0 w-full h-8 bg-gray-300 border-b-2 border-white shadow-lg flex justify-between items-center px-4">
        <div className="relative">
          <button
            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            className="text-sm text-gray-600 flex items-center"
          >
            <Image src="/world-icon.svg" alt="world icon" width={16} height={16} className="mr-2" />
            {selectedLanguage}
          </button>
          {languageMenuOpen && (
            <div className="absolute top-full mt-2 w-32 bg-white border border-gray-300 shadow-lg">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageClick(language)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
        <label className="text-sm text-gray-600">Join the ClyCites Network</label>
      </div>

      {/* Navbar */}
      <nav
        className={`flex items-center justify-between max-container padding-container fixed ${scrolled ? 'top-0' : 'top-8'
          } left-0 w-full z-20 py-2 bg-white border-b-2 border-white shadow-lg`}
        style={{ position: 'fixed', zIndex: 50 }}
      >
        <Link href="/">
          <Image src="/images/logo.jpeg" alt="logo" width={80} height={29} className="rounded-full" />
        </Link>

        {/* Navigation Links aligned to the right */}
        <ul className="flex items-center gap-8 ml-auto lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.key} className="relative group">
              <Link
                href={link.href}
                className="text-gray-700 hover:text-light-blue flex items-center pb-1.5 transition-all hover:font-bold"
              >
                {link.label}
                {link.dropdown && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
              {link.dropdown && (
                <ul className="absolute left-0 bg-white text-gray-800 p-4 w-[500px] shadow-lg opacity-0 transition-opacity group-hover:opacity-100 grid grid-cols-2 gap-2">
                  {link.dropdown.map((dropdownLink) => (
                    <li key={dropdownLink.label} className="py-1">
                      <Link href={dropdownLink.href} className="text-gray-700 hover:text-light-blue block">
                        {dropdownLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-dark_green hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
          >
            Get Involved
            <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
          </button>
          <button
            type="button"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Explore Data
            <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;