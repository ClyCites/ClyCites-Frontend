import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="flexCenter mb-4">
      <div className="padding-container max-container flex w-full flex-col gap-14">
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          <div className="flex flex-col gap-5 items-center justify-center">
            <Link href="/" className="mb-10">
              <Image src="/images/logo.jpeg" alt="logo" width={150} height={29} />
            </Link>
            <div className="flex items-center justify-center">
              <Link
                href="https://www.facebook.com"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* Facebook Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M11.300781 2 C6.1645496 2 2 6.1645496 2 11.300781 L2 38.800781 C2 43.937013 6.1645496 48.099609 11.300781 48.099609 L38.800781 48.099609 C43.937013 48.099609 48.099609 43.937013 48.099609 38.800781 L48.099609 11.289062 L48.099609 11.277344 C47.988214 6.1531405 43.848929 2 38.800781 2 L11.300781 2 z" fill="white" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com/UnivBugema"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* Twitter Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M5.9199219 6 L20.582031 27.375 L6.2304688 44 L9.4101562 44 L21.986328 29.421875 L31.986328 44 L44 44 L28.681641 21.669922 L42.199219 6 L39.029297 6 L27.275391 19.617188 L17.933594 6 L5.9199219 6 z" fill="white" />
                </svg>
              </Link>
              <Link
                href="https://youtube.com/@bugemauniversity3502"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* YouTube Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M24.402344 9 C17.800781 9 11.601563 9.5 8.300781 10.199219 C6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C3.402344 16.898438 3 20.5 3 25 C3 29.5 3.398438 33 3.898438 35.5 C4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C11.902344 40.5 17.898438 41 24.5 41 C31.101563 41 37.097656 40.5 40.597656 39.800781 C42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C45.5 33 46 29.402344 46.097656 24.902344 C46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C44.699219 12.101563 42.800781 10.5 40.597656 10 C37.097656 9.5 31 9 24.402344 9 Z" fill="white" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* LinkedIn Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M9 4 C6.2504839 4 4 6.2504839 4 9 L4 41 C4 43.749516 6.2504839 46 9 46 L41 46 C43.749516 46 46 43.749516 46 41 L46 9 C46 6.2504839 43.749516 4 41 4 L9 4 z" fill="white" />
                </svg>
              </Link>
              <Link
                href="https://www.tiktok.com/@BugemaUniv"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* TikTok Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M9 4 C6.2495759 4 4 6.2495759 4 9 L4 41 C4 43.750424 6.2495759 46 9 46 L41 46 C43.750424 46 46 43.750424 46 41 L46 9 C46 6.2495759 43.750424 4 41 4 L9 4 z" fill="white" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com"
                aria-label="social-link"
                className="mr-6 text-[#CED3F6] hover:text-primary"
              >
                {/* Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path d="M16 3 C8.832483... (complete the rest of Instagram path)" fill="white" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
