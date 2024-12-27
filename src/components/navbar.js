"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun, Github, Save, FolderOpen, Share2 } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar({ onSaveCollection, onLoadCollection, onShare }) {
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 pl-32 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">WebPost</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2">
          {/* Collection Management */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSaveCollection}>
              <Save className="h-4 w-4 mr-2" />
              Save Collection
            </Button>
            <Button variant="ghost" size="sm" onClick={onLoadCollection}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Load Collection
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* GitHub link */}
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/SamsShow/webman"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
