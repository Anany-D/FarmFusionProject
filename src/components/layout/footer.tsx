import { Link } from "wouter";
import { Leaf, Facebook, Twitter, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Leaf className="text-primary h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-lg">AgroChain</span>
            </div>
            <p className="text-neutral-medium text-sm mb-4">
              Connecting farmers, industries, and government bodies through blockchain and DeFi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-medium hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-medium hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-medium hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace"><span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Marketplace</span></Link></li>
              <li><Link href="/barter"><span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Barter System</span></Link></li>
              <li><Link href="/microjobs"><span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Microjobs</span></Link></li>
              <li><Link href="/governance"><span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">DAO Governance</span></Link></li>
              <li><Link href="/education"><span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Web3 Education</span></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Community Forums</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Blockchain Explorer</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Tutorials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-gray border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-medium text-sm mb-4 md:mb-0">
            &copy; 2023 AgroChain Network. All rights reserved.
          </p>
          <div className="flex items-center">
            <select className="bg-neutral-dark border border-neutral-gray text-neutral-medium rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
              <option>हिन्दी</option>
              <option>中文</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
