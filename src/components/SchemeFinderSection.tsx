import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Volume2,
  FileText,
  MapPin,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Flame,
  Scissors,
  GraduationCap,
  Baby,
  PiggyBank,
  HeartPulse,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { schemeSearchService } from '../services/schemeSearchService';
import { SchemeDatabaseRecord } from '../data/schemesDatabase';
import { SpeakerButton } from './SpeakerButton';
import { WhatToSayModal } from './WhatToSayModal';
import { ExternalLinkModal } from './ExternalLinkModal';

interface SchemeFinderSectionProps {
  currentLanguage: LanguageCode;
  onSelectSchemeDetail?: (schemeId: string) => void;
  initialQuery?: string;
}

export const SchemeFinderSection: React.FC<SchemeFinderSectionProps> = ({
  currentLanguage,
  onSelectSchemeDetail,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeWhatToSayScheme, setActiveWhatToSayScheme] = useState<SchemeDatabaseRecord | null>(null);
  const [externalModalUrl, setExternalModalUrl] = useState<{ url: string; portalName: string } | null>(null);

  const categories = [
    { label: 'All Schemes', value: 'All' },
    { label: 'Savings & Education', value: 'Savings & Education', icon: PiggyBank },
    { label: 'Household Help', value: 'Household Help', icon: Flame },
    { label: 'College & Education', value: 'College & Education', icon: GraduationCap },
    { label: 'Motherhood & Health', value: 'Motherhood & Health', icon: Baby },
    { label: 'Jobs & Business', value: 'Jobs & Business', icon: Scissors },
  ];

  const quickPillPrompts = [
    { label: '🔥 Free Gas Cylinder', query: 'gas cylinder' },
    { label: '🧵 Free Sewing Machine', query: 'sewing machine' },
    { label: '🎓 ₹50,000 Pragati Scholarship', query: 'pragati scholarship' },
    { label: '🤱 ₹5,000 Pregnancy Grant', query: 'pregnancy matru' },
    { label: '🌸 Sukanya Samriddhi (SSY)', query: 'sukanya samriddhi' },
    { label: '👵 Old Age Pension', query: 'pension' },
    { label: '🏥 Ayushman Health Card', query: 'ayushman health' },
  ];

  // Execute live search over the 2025 schemes database
  const searchResults = useMemo(() => {
    return schemeSearchService.search(searchQuery, {
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      limit: 12,
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#141B3B] via-[#1A234E] to-[#141B3B] p-5 rounded-3xl border-2 border-[#9B5DE5]/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B5DE5]/20 border border-[#9B5DE5]/40 text-[#F3A6C8] text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>Imported 2025 Government Schemes Database</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white m-0 tracking-tight">
            Find Schemes According to Your Need
          </h3>
          <p className="text-xs sm:text-sm text-[#B7BDD3] mt-1 m-0">
            Type or tap your need — instant eligibility, documents, and application steps.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#45C27C]/15 text-[#45C27C] border border-[#45C27C]/30 font-bold">
            ⚡ {searchResults.length} Schemes Matching
          </span>
        </div>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search size={22} className="absolute left-4 text-[#9B5DE5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your request: e.g. gas, sewing machine, college fees, pregnancy, pension..."
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-[#0D1333] border-2 border-[#9B5DE5]/40 hover:border-[#9B5DE5] focus:border-[#F3A6C8] focus:outline-none text-white placeholder-[#7882A4] text-base font-medium transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#141B3B] text-[#B7BDD3] hover:text-white border border-[#9B5DE5]/30 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Prompt Filter Chips */}
      <div>
        <span className="text-xs font-bold text-[#C9A7FF] block mb-2 uppercase tracking-wider">
          Suggested requests to try:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPillPrompts.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSearchQuery(pill.query)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                searchQuery.toLowerCase().includes(pill.query.toLowerCase())
                  ? 'bg-[#9B5DE5] text-white border-[#F3A6C8] shadow-md shadow-[#9B5DE5]/30'
                  : 'bg-[#141B3B] text-[#B7BDD3] hover:text-white border-[#9B5DE5]/30 hover:bg-[#1A234E]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#9B5DE5] to-[#8338EC] text-white border-[#F3A6C8] shadow-md shadow-[#9B5DE5]/40'
                  : 'bg-[#141B3B] text-[#B7BDD3] hover:text-white border-[#9B5DE5]/30 hover:bg-[#1A234E]'
              }`}
            >
              {cat.icon && <cat.icon size={14} />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchResults.map((scheme) => {
          const voiceSummary = `${scheme.scheme_name}. For: ${scheme.who_is_it_for}. Main benefit: ${scheme.main_benefit}. How to apply: ${scheme.how_to_apply}.`;

          return (
            <div
              key={scheme.id}
              className="p-5 rounded-3xl bg-gradient-to-br from-[#141B3B] to-[#0D1333] border-2 border-[#9B5DE5]/30 hover:border-[#F3A6C8] transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Header: Title + Category badge + Speaker */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-[#9B5DE5]/20 text-[#F3A6C8] border border-[#9B5DE5]/30 mb-1.5">
                      {scheme.category}
                    </span>
                    <h4 className="text-lg font-bold text-white group-hover:text-[#F3A6C8] transition-colors leading-snug">
                      {scheme.scheme_name}
                    </h4>
                  </div>
                  <SpeakerButton
                    textToSpeak={voiceSummary}
                    langCode={currentLanguage}
                    size="sm"
                    ariaLabel={`Listen to ${scheme.scheme_name} details`}
                  />
                </div>

                {/* Who is it for */}
                <div className="mb-3 p-2.5 rounded-xl bg-[#090D24] border border-[#9B5DE5]/20 flex items-start gap-2">
                  <span className="text-xs font-bold text-[#45C27C] shrink-0 mt-0.5">👤 For:</span>
                  <p className="text-xs text-[#E1E5F2] font-medium m-0 leading-relaxed">
                    {scheme.who_is_it_for}
                  </p>
                </div>

                {/* Main Benefit */}
                <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#9B5DE5]/15 to-[#F3A6C8]/10 border border-[#F3A6C8]/30">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#F3A6C8] block mb-1 flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Main Benefit</span>
                  </span>
                  <p className="text-xs sm:text-sm text-white font-semibold m-0 leading-relaxed">
                    {scheme.main_benefit}
                  </p>
                </div>

                {/* Documents Needed */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A7FF] block mb-1 flex items-center gap-1">
                    <FileText size={12} />
                    <span>Documents Needed:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.documents_needed.split(',').map((doc, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-[#141B3B] text-[#B7BDD3] border border-[#9B5DE5]/25 flex items-center gap-1"
                      >
                        <CheckCircle size={10} className="text-[#45C27C]" />
                        {doc.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How to Apply */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#45C27C] block mb-1 flex items-center gap-1">
                    <MapPin size={12} />
                    <span>How to Apply:</span>
                  </span>
                  <p className="text-xs text-[#B7BDD3] m-0 italic leading-relaxed">
                    {scheme.how_to_apply}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#9B5DE5]/20 flex items-center justify-between gap-2 flex-wrap">
                {/* Button: What to Say */}
                <button
                  type="button"
                  onClick={() => setActiveWhatToSayScheme(scheme)}
                  className="px-3 py-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-xs font-bold text-[#C9A7FF] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle size={14} className="text-[#F3A6C8]" />
                  <span>What to Say</span>
                </button>

                <div className="flex items-center gap-2">
                  {scheme.official_url && (
                    <button
                      type="button"
                      onClick={() =>
                        setExternalModalUrl({
                          url: scheme.official_url || '',
                          portalName: scheme.scheme_name,
                        })
                      }
                      className="p-1.5 rounded-xl bg-[#141B3B] hover:bg-[#1A234E] border border-[#9B5DE5]/30 text-[#C9A7FF] hover:text-white transition-colors"
                      title="Visit official portal"
                    >
                      <ExternalLink size={15} />
                    </button>
                  )}

                  {onSelectSchemeDetail && (
                    <button
                      type="button"
                      onClick={() => {
                        // Map core schemes to detail view ids
                        const idMap: Record<number, string> = {
                          1: 'scheme-education-girl',
                          2: 'scheme-education-girl',
                          3: 'scheme-education-girl',
                          4: 'scheme-maternity-poshan',
                          5: 'scheme-education-girl',
                        };
                        onSelectSchemeDetail(idMap[scheme.id] || 'scheme-education-girl');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#9B5DE5] hover:bg-[#8338EC] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-[#9B5DE5]/30"
                    >
                      <span>Full Guide</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: What to say at the counter */}
      {activeWhatToSayScheme && (
        <WhatToSayModal
          isOpen={!!activeWhatToSayScheme}
          onClose={() => setActiveWhatToSayScheme(null)}
          schemeTitle={activeWhatToSayScheme.scheme_name}
          messageText={`Namaste. I want to apply for ${activeWhatToSayScheme.scheme_name}. I have brought my ${activeWhatToSayScheme.documents_needed}. Please help me with the application form.`}
          currentLanguage={currentLanguage}
        />
      )}

      {/* Modal: External Link Modal with Safety Check */}
      {externalModalUrl && (
        <ExternalLinkModal
          isOpen={!!externalModalUrl}
          onClose={() => setExternalModalUrl(null)}
          scheme={{
            id: 'external-portal',
            title: externalModalUrl.portalName,
            category: 'education',
            description: `Official government portal for ${externalModalUrl.portalName}`,
            tagline: 'Official government portal',
            benefits: [],
            eligibility: [],
            documents: [],
            officialUrl: externalModalUrl.url,
            officialPortalName: externalModalUrl.portalName,
            offlineCenterTypes: [],
            whatToSayText: '',
            slowExplanationSteps: [],
          }}
          currentLanguage={currentLanguage}
          onSavePlan={() => {}}
        />
      )}
    </section>
  );
};
