import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface PurchaseEvent {
  productName: string;
  city: string;
}

const socket = io(import.meta.env.VITE_SOCKET_URL || '', {
  transports: ['websocket'],
  autoConnect: true,
});

const LivePurchaseFeed: React.FC = () => {
  const [feed, setFeed] = useState<(PurchaseEvent & { id: string }) | null>(null);

  useEffect(() => {
    socket.on('purchase', (data: PurchaseEvent) => {
      const item = { ...data, id: Math.random().toString(36).slice(2) };
      setFeed(item);
      setTimeout(() => setFeed(null), 5000);
    });
    return () => { socket.off('purchase'); };
  }, []);

  if (!feed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white border border-gray-100 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 max-w-xs animate-slide-up">
      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse" />
      <p className="font-montserrat text-xs text-gray-700">
        Someone in <span className="font-semibold">{feed.city}</span> just purchased{' '}
        <span className="font-semibold text-royal-gold">{feed.productName}</span>
      </p>
    </div>
  );
};

export default LivePurchaseFeed;
