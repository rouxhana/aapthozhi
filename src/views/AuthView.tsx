import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  HelpCircle,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface AuthViewProps {
  currentLanguage: LanguageCode;
  onLoginSuccess: (phoneNumber?: string) => void;
  onContinueGuest: () => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentLanguage,
  onLoginSuccess,
  onContinueGuest,
  onBack,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  useEffect(() => {
    if (step === 'phone') {
      speechService.speak(`${t.loginSafeHeading}. ${t.mobileLoginVoice}`, currentLanguage);
    } else {
      speechService.speak(`${t.otpHeading}. ${t.otpVoice}`, currentLanguage);
    }
    return () => {
      speechService.stop();
    };
  }, [step, currentLanguage]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDemoFillOtp = () => {
    setOtp(['4', '8', '2', '6']);
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length === 4) {
      speechService.speak('Verification successful. Welcome to AapThozhi.', currentLanguage);
      onLoginSuccess(phoneNumber);
    } else {
      setErrorMsg('Please enter the 4-digit code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-white flex flex-col justify-between p-4 sm:p-6 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#9B5DE5]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-[#F3A6C8]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={step === 'otp' ? () => setStep('phone') : onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <SpeakerButton
            textToSpeak={step === 'phone' ? `${t.loginSafeHeading}. ${t.mobileLoginVoice}` : `${t.otpHeading}. ${t.otpVoice}`}
            langCode={currentLanguage}
            size="md"
          />
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#C9A7FF]"
            title="Login Help"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F3A6C8] bg-[#9B5DE5]/20 px-3 py-1 rounded-full">
            {step === 'phone' ? 'Step 1 of 2 • Mobile Login' : 'Step 2 of 2 • Secure Verification'}
          </span>
          <span className="text-xs text-[#B7BDD3]">
            {step === 'phone' ? '1 / 2' : '2 / 2'}
          </span>
        </div>

        {step === 'phone' ? (
          /* Phone Number Screen */
          <div className="bg-[#131A3B] border-2 border-[#9B5DE5]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] flex items-center justify-center text-white shadow-lg shadow-[#9B5DE5]/30">
                <Phone size={24} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white m-0">
                  {t.loginSafeHeading}
                </h2>
                <p className="text-xs text-[#B7BDD3] m-0 mt-0.5">
                  Safe, private & voice-assisted
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F7F5FA] mb-6 leading-relaxed bg-[#0B1026]/50 p-3.5 rounded-2xl border border-[#9B5DE5]/20">
              {t.mobileLoginVoice}
            </p>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="phone-input" className="text-xs font-bold text-[#C9A7FF] flex items-center gap-1.5">
                    <Phone size={14} /> Mobile Number (10 digits)
                  </label>
                  <SpeakerButton
                    textToSpeak="Enter your 10 digit phone number"
                    langCode={currentLanguage}
                    size="sm"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#B7BDD3]">
                    +91
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-14 pr-4 py-3.5 rounded-2xl bg-[#0B1026] border-2 border-[#9B5DE5]/40 text-white font-mono text-lg tracking-wider focus:outline-none focus:border-[#F3A6C8] transition-colors"
                  />
                </div>
                {errorMsg && <p className="text-xs text-[#EF6A7B] mt-1.5 font-medium">{errorMsg}</p>}
              </div>

              {/* Quick Demo Fill Button */}
              <button
                type="button"
                onClick={() => setPhoneNumber('9840123456')}
                className="text-xs text-[#C9A7FF] hover:text-[#F3A6C8] underline text-left block"
              >
                ⚡ Use demo phone number: 9840123456
              </button>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9B5DE5] to-[#F3A6C8] text-[#0B1026] font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#9B5DE5]/30 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Get OTP Code</span>
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#9B5DE5]/20" />
              </div>
              <span className="relative px-3 bg-[#131A3B] text-xs text-[#B7BDD3] uppercase font-bold tracking-wider">
                or
              </span>
            </div>

            {/* Continue as Guest Button */}
            <button
              type="button"
              onClick={onContinueGuest}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0D1333] hover:bg-[#1A234E] border border-[#9B5DE5]/40 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <User size={18} className="text-[#45C27C]" />
              <span>{t.guestLoginTitle}</span>
            </button>
            <p className="text-[11px] text-[#B7BDD3] text-center mt-2">
              {t.guestLoginVoice}
            </p>
          </div>
        ) : (
          /* OTP Screen */
          <div className="bg-[#131A3B] border-2 border-[#9B5DE5]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white m-0">
                  {t.otpHeading}
                </h2>
                <p className="text-xs text-[#B7BDD3] m-0 mt-0.5">
                  Sent to +91 {phoneNumber || '9840123456'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#F7F5FA] mb-5 leading-relaxed bg-[#0B1026]/50 p-3 rounded-2xl border border-[#9B5DE5]/20">
              {t.otpVoice}
            </p>

            {/* 4 OTP Input Boxes */}
            <div className="flex justify-center gap-3 my-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-14 h-16 rounded-2xl bg-[#0B1026] border-2 border-[#9B5DE5]/50 text-white font-mono text-2xl font-bold text-center focus:outline-none focus:border-[#F3A6C8] shadow-inner"
                />
              ))}
            </div>

            {/* Quick Demo Fill */}
            <div className="text-center mb-5">
              <button
                type="button"
                onClick={handleDemoFillOtp}
                className="text-xs text-[#F3A6C8] hover:underline font-semibold"
              >
                ⚡ Auto-fill Demo OTP (4826)
              </button>
            </div>

            {errorMsg && <p className="text-xs text-[#EF6A7B] mb-4 text-center font-medium">{errorMsg}</p>}

            {/* Anti-Fraud Warning Box */}
            <div className="p-3.5 rounded-2xl bg-[#EF6A7B]/15 border-2 border-[#EF6A7B]/40 flex items-start gap-2.5 mb-6">
              <ShieldAlert size={22} className="text-[#EF6A7B] shrink-0 mt-0.5" />
              <div className="text-xs text-white leading-relaxed">
                <strong className="text-[#EF6A7B] block mb-0.5">Never Share Your PIN or OTP!</strong>
                {t.otpWarning}
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-4 rounded-2xl bg-[#45C27C] hover:bg-[#3db270] text-[#0B1026] font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#45C27C]/30 transition-all cursor-pointer"
            >
              <Check size={20} strokeWidth={3} />
              <span>{t.verifyOtpBtn}</span>
            </button>

            <div className="flex items-center justify-between mt-4 text-xs text-[#B7BDD3]">
              <button
                type="button"
                onClick={() => speechService.speak(t.otpVoice, currentLanguage)}
                className="hover:text-white flex items-center gap-1"
              >
                <Volume2 size={14} /> {t.readAgainBtn}
              </button>
              <button
                type="button"
                onClick={() => setOtp(['4', '8', '2', '6'])}
                className="text-[#C9A7FF] hover:underline"
              >
                {t.resendOtpBtn}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Voice-guided Help Modal */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-[#0D1333] border-2 border-[#9B5DE5] rounded-3xl p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#F3A6C8] font-bold">
                <Users size={20} />
                <span>AapThozhi Safety Promise</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full bg-[#1A234E] text-[#B7BDD3] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#B7BDD3] leading-relaxed mb-4">
              AapThozhi connects women with official welfare services. We never ask for sensitive financial credentials like ATM PIN, UPI PIN, or bank passwords. If you don't want to use a phone number, tap <strong>"Continue as Guest"</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#9B5DE5] text-white text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      <footer className="max-w-md mx-auto w-full text-center pb-2 text-xs text-[#B7BDD3]">
        🛡 AapThozhi does not claim official form submission. All services are prototype demonstrations.
      </footer>
    </div>
  );
};
