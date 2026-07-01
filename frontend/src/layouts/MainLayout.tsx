import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

interface Props {
  children: ReactNode;
}

const routesWithoutBackButton = new Set(["/"]);

export default function MainLayout({ children }: Props) {
  const location = useLocation();
  const showBackButton = !routesWithoutBackButton.has(location.pathname);

  return (
    <>
      <Navbar />

      {showBackButton && (
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <BackButton />
          </div>
        </div>
      )}

      <main>{children}</main>
    </>
  );
}
