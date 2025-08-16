import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QRCodeGenerator } from './qr-code-generator';
import { QrCode } from 'lucide-react';
import type { Bot } from '@shared/schema';

interface QRCodeDialogProps {
  bot: Bot;
}

export function QRCodeDialog({ bot }: QRCodeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectionUpdate = (connected: boolean) => {
    setIsConnected(connected);
    if (connected) {
      // Optional: Close dialog when connected
      // setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={isConnected 
            ? "text-green-600 border-green-200 hover:bg-green-50"
            : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }
        >
          <QrCode className="h-3 w-3 mr-1" />
          {isConnected ? 'Conectado' : 'QR Code'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conexão WhatsApp</DialogTitle>
          <DialogDescription>
            Configure e conecte seu bot ao WhatsApp usando QR Code
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <QRCodeGenerator 
            bot={bot} 
            onConnectionUpdate={handleConnectionUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}