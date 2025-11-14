"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface DropdownLink {
  label: string;
  href?: string;
  isLabel?: boolean;
}

interface NavLink {
  key: string;
  label: string;
  href?: string;
  dropdown?: DropdownLink[];
}

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
      { label: 'Our Products', isLabel: true }, // Add label item
      { href: '/', label: 'Analytics Dashboard' },
      { href: '/', label: 'Mobile App' },
      { href: '/', label: 'Weather Detection' },
      { href: '/', label: 'Pest And Diseases Detection' },
      { href: '/', label: 'Soil PH Detection' },
      { href: '/', label: 'Agriculture E-Market' }
    ]
  },
  {
    href: '/',
    key: 'solutions',
    label: 'Solutions',
    dropdown: [
      { label: 'Solutions', isLabel: true }, // Add label item
      { href: '/disease', label: 'Disease Control' },
      { href: '/nutrition', label: 'Nutrition Monitoring' },
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
      { label: 'About ClyCites', isLabel: true }, // Add label item
      { href: '/about', label: 'About Us' },
      { href: '/', label: 'Resources' },
      { href: '/', label: 'Careers' },
      { href: '/', label: 'Contact Us' },
      { href: '/', label: 'Events' },
      { href: '/program', label: 'Programs' }
    ]
  }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { i18n } = useTranslation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);


  const router = useRouter();

  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleMouseEnter = (key: string) => {
    setActiveDropdown(key); // Show the dropdown on hover
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null); // Hide the dropdown when the mouse leaves
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language); // Change the language
    setSelectedLanguage(language); // Update the selected language
    setDropdownOpen(false);
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
            className="text-sm text-gray-600 flex items-center"
          >
            <Image src="" alt="world icon" width={16} height={16} className="mr-2" />
            English
          </button>
        </div>
        <label className="text-sm font-semibold text-gray-600">
          Join the ClyCites Network
        </label>
      </div>

      {/* Navbar For Big screens*/}
      <nav
      className={`hidden lg:flex items-center justify-between max-container padding-container fixed ${scrolled ? 'top-0' : 'top-8'
        } left-0 w-full z-20 py-2 bg-white border-b-2 border-white shadow-lg`}
      style={{ position: 'fixed', zIndex: 50 }}
    >
      <Link href="/">
        <Image src="/images/logo.jpeg" alt="logo" width={80} height={29} className="rounded-full" />
      </Link>

      {/* Navigation Links aligned to the right */}
      <ul className="flex items-center gap-8 ml-auto lg:flex">
        {NAV_LINKS.map((link) => (
          <li
            key={link.key}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(link.key)}  // Show dropdown on hover
            onMouseLeave={handleMouseLeave} // Hide dropdown when leaving
          >
            <button
              className="text-gray-700 hover:text-light-blue flex items-center pb-1.5 transition-all hover:font-bold"
              onClick={() => handleDropdownToggle(link.key)} // Toggle dropdown on click
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
            </button>
            {link.dropdown && activeDropdown === link.key && (
              <ul className="absolute left-0 bg-gray-100 text-gray-800 p-4 w-[500px] grid grid-cols-1 gap-4 shadow-lg">
                {link.dropdown.map((dropdownLink, index) => (
                  <li key={dropdownLink.label} className={`py-1 ${index === 0 && dropdownLink.isLabel ? 'col-span-2' : ''}`}>
                    {dropdownLink.isLabel ? (
                      <span className="block px-4 py-2 text-sm text-gray-600 font-bold">{dropdownLink.label}</span>
                    ) : (
                      <Link
                        href={dropdownLink.href || '#'}
                        className="text-gray-700 hover:bg-blue-100 hover:text-blue-600 block px-4 py-2 text-sm"
                      >
                        {dropdownLink.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Log in
        </Link>
        <button
          type="button"
          className="bg-blue-100 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
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
      {/* // Navbar for Small Devices */}
      <nav
        className={`fixed top-0 left-0 w-full z-20 bg-white border-b-2 ${scrolled ? 'top-0' : 'top-8'} border-white shadow-lg py-2 px-4 lg:hidden`}
        style={{ position: 'fixed', zIndex: 50 }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src="/images/logo.jpeg" alt="logo" width={55} height={29} className="rounded-full" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        {isOpen && (
          <div className="mt-2 bg-gray-100 text-gray-800 p-4">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(link.key)}
                    className="w-full text-gray-700 hover:text-blue-600 block py-2 px-4 transition-colors text-left"
                  >
                    {link.label}
                    {link.dropdown && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline h-5 w-5 ml-2"
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
                  </button>
                  {activeDropdown === link.key && link.dropdown && (
                    <ul className="mt-2 bg-white text-gray-800 p-2 shadow-lg">
                      {link.dropdown.map((dropdownLink) => (
                        <li key={dropdownLink.label}>
                          {dropdownLink.isLabel ? (
                            <span className="block px-4 py-2 text-sm text-gray-600 font-bold">{dropdownLink.label}</span>
                          ) : (
                            <Link
                              href={dropdownLink.href || '#'}
                              className="block text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 text-sm"
                            >
                              {dropdownLink.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>

                  )}
                </li>
              ))}
            </ul>
          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex ">
              <button type="button" className="bg-blue-100 hover:bg-green-700 text-black font-bold py-2 px-4 rounded w-[600px]" >
                Get Involved
                <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
            <div className="flex">
              <button type="button" className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[600px]" >
                Explore Data
                <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
          </div>
        )}
      </nav>



    </div>
  );
};

export default Navbar;
