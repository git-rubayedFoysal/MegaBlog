import { Link } from "react-router";
import { Logo } from "../index";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "Features", href: "/" },
        { name: "Pricing", href: "/" },
        { name: "Affiliate Program", href: "/" },
        { name: "Press Kit", href: "/" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Account", href: "/" },
        { name: "Help", href: "/" },
        { name: "Contact Us", href: "/" },
        { name: "Customer Support", href: "/" },
      ],
    },
    {
      title: "Legals",
      links: [
        { name: "Terms & Conditions", href: "/" },
        { name: "Privacy Policy", href: "/" },
        { name: "Licensing", href: "/" },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-900 border-t border-dark-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col justify-between">
            <div className="mb-4">
              <Link
                to="/"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <Logo width="100px" />
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; Copyright {currentYear}. All Rights Reserved.
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Border */}
        <div className="border-t border-dark-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">Built with ❤️ for developers</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
