import { useState } from "react";
// Dialog not needed for full-screen auth
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<"login" | "signup">(initialView);

  const handleSuccess = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </Button>
      
      {currentView === "login" ? (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToSignup={() => setCurrentView("signup")}
        />
      ) : (
        <SignupForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setCurrentView("login")}
        />
      )}
    </div>
  );
}
