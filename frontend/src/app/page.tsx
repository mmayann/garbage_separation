import React from 'react';
import { Navigation } from "../app/components/navigation";
import RegionForm from "./components/RegionForm";
import { Footer } from './components/ui/footer';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 flex flex-col items-center justify-center  bg-white">
      <RegionForm />
      </div>
      <Footer />
    </div>
  );
}