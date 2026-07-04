'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageCode: string;
  makkahHotel: string;
  medinahHotel: string;
  departureDateString: string;
  roomType: string;
  price: number;
}

export function BookNowModal({
  isOpen,
  onClose,
  packageCode,
  makkahHotel,
  medinahHotel,
  departureDateString,
  roomType,
  price,
}: BookNowModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    `I'm interested in ${packageCode} — ${makkahHotel} / ${medinahHotel}, departing ${departureDateString}, ${roomType} room.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);

  const getWhatsAppLink = () => {
    // Standard phone number placeholder or can use empty/business number.
    const whatsappNumber = '923000000000'; // Placeholder Pakistani phone number
    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      console.log('Booking Inquiry Submitted:', {
        name,
        phone,
        message,
        packageCode,
        roomType,
        price,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform scale-95 transition-transform duration-300 animate-scaleUp">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-emerald-800 text-white">
          <div>
            <h3 className="font-semibold text-lg">Inquire About Package</h3>
            <p className="text-xs text-emerald-100">{packageCode} · {roomType} Room</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-700/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 dark:bg-emerald-950/30">
                <Send className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xl">Inquiry Submitted!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Thank you for your interest, <strong>{name}</strong>. Our travel consultant will contact you on <strong>{phone}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setPhone('');
                  onClose();
                }}
                className="mt-6 px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Context Summary card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{departureDateString}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Makkah Hotel:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{makkahHotel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medinah Hotel:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{medinahHotel}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Price ({roomType}):</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{formattedPrice}</span>
                </div>
              </div>

              {/* Action 1: WhatsApp (Recommended) */}
              <div>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  Connect Instantly via WhatsApp
                </a>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Opens WhatsApp chat with pre-filled package configuration.
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Or request callback</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Form Callback */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Your Full Name
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmed"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="modal-message" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Message Details
                  </label>
                  <textarea
                    id="modal-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Local animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
