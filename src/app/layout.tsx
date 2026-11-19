import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

import { Toaster } from "react-hot-toast";



export const metadata: Metadata = {
  title: "Equipment Rental Platform",
  description: "A platform to rent and manage equipment easily.",

};

export default function RootLayout({ children }:

  Readonly<{ children: React.ReactNode }>) {

  return (
    <html
      lang="en" 
      
      className="bg-background font-sans text-foreground antialiased  h-full"
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
       
        <TooltipProvider>{children}</TooltipProvider>
      

      </body>
    </html>
  );
}
