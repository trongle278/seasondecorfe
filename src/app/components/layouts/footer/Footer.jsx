"use client"
import Logo from "../../Logo";
import Link from "next/link";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isSeller= pathname.startsWith("/seller/");
  const isPay= pathname === "/pay" || pathname === "/payment/success" ;

  if (isSeller) {
    return null;
  }

  if (isPay) {
    return null;
  }

  return (
    <div className="border-t border-neutral-100 dark:border-white px-8 py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start ">
        <div>
          <div className="mr-4  md:flex mb-4 flex flex-col">
            <Logo />
            <p className="text-slate-500 my-4 text-sm font-light text-left">
              © 2025 Seasonal House Decor <br />
              All rights reserved.
            </p>
            <Link
              href="#"
              className="text-slate-500 mb-4 text-sm font-light text-left"
            >
              contact@seasonhousedecor.com
            </Link>
            <div className="text-sm flex space-x-2 items-center font-light text-left text-slate-500 mb-8 lg:mb-0">
              <Link href="#">
                <FaFacebook />
              </Link>
              <span>/</span>
              <Link href="#">
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link href="/pricing" className="transition-colors hover:text-red">
              Pricing
            </Link>
            <Link
              href="/providers"
              className="transition-colors hover:text-red"
            >
              Providers
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-red"
            >
              Categories
            </Link>
            <Link href="/blog" className="transition-colors hover:text-red">
              Blog
            </Link>
            <Link href="/showcase" className="transition-colors hover:text-red">
              Showcase
            </Link>
          </div>
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link href="#" className="transition-colors hover:text-red">
              Facebook
            </Link>
            <Link href="#" className="transition-colors hover:text-red">
              Instagram
            </Link>
          </div>
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link href="#" className="transition-colors hover:text-red">
              Pro
            </Link>
            <Link href="#" className="transition-colors hover:text-red">
              Execlusive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
