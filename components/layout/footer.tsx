import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'Electronics', href: '/products?category=electronics' },
      { name: 'Fashion', href: '/products?category=fashion' },
      { name: 'Home & Garden', href: '/products?category=home-garden' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };
  
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary-400">Shop</span>
              <span className="text-2xl font-bold text-white">Assistant</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Your premium e-commerce destination for quality products and exceptional service.
            </p>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-400">
              © {currentYear} ShopAssistant. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-neutral-400">We accept:</span>
              <div className="flex space-x-3">
                <div className="bg-neutral-800 px-3 py-1 rounded text-xs">VISA</div>
                <div className="bg-neutral-800 px-3 py-1 rounded text-xs">MC</div>
                <div className="bg-neutral-800 px-3 py-1 rounded text-xs">AMEX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
