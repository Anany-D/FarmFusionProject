import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Leaf, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Leaf className="text-primary h-6 w-6" />
          </div>
          <Link href="/">
            <span className="text-white font-heading font-bold text-xl cursor-pointer">
              AgroChain
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <span className="text-white hover:text-accent-light font-medium transition-colors cursor-pointer">
              Dashboard
            </span>
          </Link>
          <Link href="/marketplace">
            <span className="text-white hover:text-accent-light font-medium transition-colors cursor-pointer">
              Marketplace
            </span>
          </Link>
          <Link href="/barter">
            <span className="text-white hover:text-accent-light font-medium transition-colors cursor-pointer">
              Barter
            </span>
          </Link>
          <Link href="/microjobs">
            <span className="text-white hover:text-accent-light font-medium transition-colors cursor-pointer">
              MicroJobs
            </span>
          </Link>
          <Link href="/governance">
            <span className="text-white hover:text-accent-light font-medium transition-colors cursor-pointer">
              Governance
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-primary-foreground/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="User avatar" />
                  <AvatarFallback>JF</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Farmer</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    farmer_john
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">
                  <span className="cursor-pointer">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/education">
                  <span className="cursor-pointer">Education</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-primary-foreground/20"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
