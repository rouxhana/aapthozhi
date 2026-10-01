import React, { useEffect, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  FileQuestion,
  FileText,
  GraduationCap,
  IdCard,
  Image,
  Info,
  Scan,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SpeakerButton } from '../components/SpeakerButton';
import { speechService } from '../services/speechService';

interface PointAndAskViewProps {
  currentLanguage: LanguageCode;
  onBack: () => void;
}

interface PaperSample {
  id: string;
  name: string;
  nativeTitle: string;
  icon: React.ReactNode;
  isNeededForScholarship: boolean;
  explanation: string;
  audioGuide: string;
  samplePreview: string;
}

export const PointAndAskView: React.FC<PointAndAskViewProps> = ({
  currentLanguage,
  onBack,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<PaperSample | null>(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const introVoice =
    'Point and Ask. Show AapThozhi a paper or certificate. AapThozhi will explain what the paper is and whether you need it.';

  useEffect(() => {
    speechService.speak(introVoice, currentLanguage);
    return () => {
      speechService.stop();
    };
  }, [currentLanguage]);

  const paperSamples: PaperSample[] = [
    {
      id: 'paper-aadhaar',
      name: 'Identity Document (Aadhaar Card)',
      nativeTitle: 'ஆதார் அட்டை / आधार कार्ड',
      icon: <IdCard className="text-[#9B5DE5]" size={32} />,
      isNeededForScholarship: true,
      explanation:
        'This 12-digit identity card proves your citizenship and residence. It is mandatory for direct bank benefit transfers (DBT) from the government.',
      audioGuide:
        'This is an Aadhaar identity card. It is required for almost all government welfare benefits and scholarship transfers.',
      samplePreview: 'GOVERNMENT OF INDIA • UNIQUE IDENTIFICATION AUTHORITY',
    },
    {
      id: 'paper-passbook',
      name: 'Bank Passbook / Account Statement',
      nativeTitle: 'வங்கி கணக்குப் புத்தகம் / बैंक पासबुक',
      icon: <FileText className="text-[#45C27C]" size={32} />,
      isNeededForScholarship: true,
      explanation:
        'The first printed page shows your bank name, account number, and IFSC code. The government deposits scheme money directly here.',
      audioGuide:
        'This is a bank passbook. The first page with your account number and IFSC code is needed so money can be credited to your account.',
      samplePreview: 'SAVINGS BANK ACCOUNT PASSBOOK • IFSC: SBIN0001234',
    },
    {
      id: 'paper-bonafide',
      name: 'School Study / Bonafide Certificate',
      nativeTitle: 'பள்ளி படிப்பு சான்றிதழ் / स्कूल बोनाफाइड',
      icon: <GraduationCap className="text-[#F3A6C8]" size={32} />,
      isNeededForScholarship: true,
      explanation:
        'Issued by your school headmaster or principal. It proves your daughter is currently studying in the stated class for the academic year.',
      audioGuide:
        'This is a school study certificate signed by the principal. It proves your daughter is currently enrolled in school.',
      samplePreview: 'BONAFIDE CERTIFICATE • CERTIFIED THAT STUDENT IS ENROLLED',
    },
    {
      id: 'paper-photo',
      name: 'Passport-size Photographs',
      nativeTitle: 'புகைப்படம் / पासपोर्ट फोटो',
      icon: <Image className="text-amber-400" size={32} />,
      isNeededForScholarship: false,
      explanation:
        'Recent color photos. While many portals accept digital uploads, keeping 2 physical photos is helpful when visiting an offline help desk.',
      audioGuide:
        'These are passport size photos. Good to have two copies when visiting the local counter.',
      samplePreview: 'COLOR PASSPORT PHOTOGRAPH • 3.5cm x 4.5cm',
    },
    {
      id: 'paper-unknown',
      name: 'Unknown Document / Official Notice',
      nativeTitle: 'தெரியாத அரசு கடிதம் / अनजान सरकारी कागज़',
      icon: <FileQuestion className="text-[#EF6A7B]" size={32} />,
      isNeededForScholarship: false,
      explanation:
        'Unsure what this paper is? Don’t worry! Take it to your local Anganwadi didi or Seva Kendra helper. They will read it for you free of cost.',
      audioGuide:
        'If you do not recognize this paper, do not worry. Your nearby Anganwadi worker or Seva Kendra can explain it for you safely.',
      samplePreview: 'OFFICIAL NOTICE / UNKNOWN CIRCULAR',
    },
  ];

  const handleSimulateScan = (paper: PaperSample) => {
    setIsSimulatingCamera(true);
    speechService.speak('Scanning document...', currentLanguage);

    setTimeout(() => {
      setIsSimulatingCamera(false);
      setSelectedPaper(paper);
      speechService.speak(paper.audioGuide, currentLanguage);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs text-[#C9A7FF] font-medium"
        >
          ← Back
        </button>

        <SpeakerButton
          textToSpeak={introVoice}
          langCode={currentLanguage}
          size="md"
        />
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1B1A42] to-[#0E102E] border-2 border-[#9B5DE5]/50 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#F3A6C8] flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-[#9B5DE5]/30">
          <Camera size={32} />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#F3A6C8] bg-[#9B5DE5]/20 px-3 py-0.5 rounded-full inline-block mb-1">
          {t.pointAndAskTitle}
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
          {t.pointAndAskSub}
        </h2>
        <p className="text-xs sm:text-sm text-[#B7BDD3] max-w-md mx-auto">
          Tap any sample paper below to see how AapThozhi analyzes documents and explains them through voice.
        </p>
      </div>

      {/* Simulated Scanner View */}
      {isSimulatingCamera && (
        <div className="p-8 rounded-3xl bg-[#0D1333] border-2 border-[#F3A6C8] text-center animate-pulse space-y-3">
          <Scan size={48} className="mx-auto text-[#F3A6C8] animate-spin" />
          <h3 className="text-base font-bold text-white">Analyzing Paper...</h3>
          <p className="text-xs text-[#B7BDD3]">
            AapThozhi is identifying the seal, title, and relevance in your language.
          </p>
        </div>
      )}

      {/* Selected Paper Analysis Result Card */}
      {selectedPaper && !isSimulatingCamera && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#16214C] to-[#0E1535] border-3 border-[#45C27C] shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#0B1026] border border-[#9B5DE5]/30">
                {selectedPaper.icon}
              </div>
              <div>
                <span className="text-[11px] text-[#C9A7FF] font-medium block">
                  {selectedPaper.nativeTitle}
                </span>
                <h3 className="text-lg font-bold text-white m-0">
                  {selectedPaper.name}
                </h3>
              </div>
            </div>

            <SpeakerButton
              textToSpeak={selectedPaper.audioGuide}
              langCode={currentLanguage}
              size="md"
            />
          </div>

          {/* Is Needed Badge */}
          <div className="mb-4">
            {selectedPaper.isNeededForScholarship ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#45C27C]/20 border border-[#45C27C]/40 text-[#45C27C] text-xs font-bold">
                <CheckCircle2 size={16} /> Needed for this application
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
                <Info size={16} /> Optional or informational
              </span>
            )}
          </div>

          <p className="text-sm text-[#F7F5FA] leading-relaxed bg-[#0B1026]/60 p-4 rounded-2xl border border-[#9B5DE5]/20 mb-4">
            {selectedPaper.explanation}
          </p>

          <div className="p-3 rounded-xl bg-[#0D1333] border border-[#9B5DE5]/20 flex items-center justify-between text-xs text-[#B7BDD3]">
            <span className="font-mono text-[11px] truncate">{selectedPaper.samplePreview}</span>
            <span className="text-[#C9A7FF] font-semibold shrink-0">Safe Document</span>
          </div>
        </div>
      )}

      {/* Grid of 5 Sample Documents */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#C9A7FF] block">
          Choose a document to inspect:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paperSamples.map((paper) => (
            <div
              key={paper.id}
              onClick={() => handleSimulateScan(paper)}
              className="p-4 rounded-2xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 hover:border-[#F3A6C8] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-xl bg-[#0B1026] shrink-0 group-hover:scale-105 transition-transform">
                  {paper.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate m-0">
                    {paper.name}
                  </h4>
                  <p className="text-[11px] text-[#B7BDD3] truncate m-0 mt-0.5">
                    {paper.nativeTitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <SpeakerButton
                  textToSpeak={paper.audioGuide}
                  langCode={currentLanguage}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
