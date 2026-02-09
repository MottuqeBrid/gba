"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface AboutData {
  organizationName: string;
  description: string;
  contactDetails: {
    address: {
      line1: string;
      line2: string;
      city: string;
      postalCode: string;
      country: string;
    };
    phones: string[];
    emails: string[];
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching footer data:", err));
  }, []);

  return (
    <footer className="bg-base-300 text-base-content pt-16 pb-8 border-t border-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                {data?.organizationName || "GBA"}
              </h3>
            </div>
            <p className="text-base-content/70 leading-relaxed text-sm lg:text-base">
              {data?.description ||
                "Building a stronger community through unity and service. Join us in our journey of excellence."}
            </p>
            <div className="flex space-x-3">
              {data?.socialLinks?.facebook && (
                <SocialLink
                  href={data.socialLinks.facebook}
                  icon={<FaFacebookF />}
                  label="Facebook"
                />
              )}
              {data?.socialLinks?.twitter && (
                <SocialLink
                  href={data.socialLinks.twitter}
                  icon={<FaTwitter />}
                  label="Twitter"
                />
              )}
              {data?.socialLinks?.instagram && (
                <SocialLink
                  href={data.socialLinks.instagram}
                  icon={<FaInstagram />}
                  label="Instagram"
                />
              )}
              {data?.socialLinks?.linkedin && (
                <SocialLink
                  href={data.socialLinks.linkedin}
                  icon={<FaLinkedinIn />}
                  label="LinkedIn"
                />
              )}
              {data?.socialLinks?.youtube && (
                <SocialLink
                  href={data.socialLinks.youtube}
                  icon={<FaYoutube />}
                  label="YouTube"
                />
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary relative flex items-center gap-2">
              {/* <span className="h-2 bg-primary absolute left-0 -bottom-2 w-1/4 sm:w-1/2 rounded-full"></span> */}
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/gallery">Gallery</FooterLink>
              <FooterLink href="/members">Members</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
              {/* <span className="w-8 h-1 bg-secondary rounded-full"></span> */}
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm lg:text-base">
              {data?.contactDetails.phones.map((phone, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="mt-1 text-primary group-hover:scale-110 transition-transform">
                    <FaPhoneAlt />
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              {data?.contactDetails.emails.map((mail, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="mt-1 text-secondary group-hover:scale-110 transition-transform">
                    <FaEnvelope />
                  </span>
                  <a
                    href={`mailto:${mail}`}
                    className="hover:text-secondary transition-colors"
                  >
                    {mail}
                  </a>
                </li>
              ))}
              {data?.contactDetails.address.line1 && (
                <li className="flex items-start gap-3 group">
                  <span className="mt-1 text-accent group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt />
                  </span>
                  <span className="leading-tight">
                    {data.contactDetails.address.line1},{" "}
                    {data.contactDetails.address.city}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-content/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs lg:text-sm text-base-content/60">
          <p>
            &copy; {currentYear} {data?.organizationName || "GBA"}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="btn btn-circle btn-sm btn-ghost bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-base-content/70 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group text-sm lg:text-base"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></span>
        {children}
      </Link>
    </li>
  );
}
