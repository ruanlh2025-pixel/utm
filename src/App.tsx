/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RotateCcw, Link, Globe, Tag, MousePointer2, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SOURCES = [
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'bing', label: 'Bing' },
  { value: 'custom', label: 'Custom...' },
];

const MEDIUMS = [
  { value: 'cpc', label: 'CPC (Paid Search)' },
  { value: 'organic', label: 'Organic' },
  { value: 'social', label: 'Social' },
  { value: 'email', label: 'Email' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'referral', label: 'Referral' },
  { value: 'display', label: 'Display' },
  { value: 'video', label: 'Video' },
  { value: 'sms', label: 'SMS' },
  { value: 'custom', label: 'Custom...' },
];

export default function App() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [medium, setMedium] = useState('');
  const [customMedium, setCustomMedium] = useState('');
  const [name, setName] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const formatInput = (val: string) => {
    return val.toLowerCase().replace(/\s+/g, '_');
  };

  const getEffectiveValue = (main: string, custom: string) => {
    return main === 'custom' ? formatInput(custom) : main;
  };

  const validateUrl = (val: string) => {
    if (!val) return true;
    try {
      const parsed = new URL(val.startsWith('http') ? val : `https://${val}`);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const generateUTM = useCallback(() => {
    if (!url) {
      setGeneratedUrl('');
      return;
    }

    try {
      const baseUrlStr = url.startsWith('http') ? url : `https://${url}`;
      const baseUrl = new URL(baseUrlStr);
      const params = new URLSearchParams(baseUrl.search);

      const effectiveSource = getEffectiveValue(source, customSource);
      const effectiveMedium = getEffectiveValue(medium, customMedium);

      if (effectiveSource) params.set('utm_source', effectiveSource);
      if (effectiveMedium) params.set('utm_medium', effectiveMedium);
      if (name) params.set('utm_campaign', formatInput(name));

      const finalUrl = `${baseUrl.origin}${baseUrl.pathname}${params.toString() ? '?' + params.toString() : ''}${baseUrl.hash}`;
      setGeneratedUrl(finalUrl);
      setIsValidUrl(true);
    } catch {
      setGeneratedUrl('');
      setIsValidUrl(false);
    }
  }, [url, source, customSource, medium, customMedium, name]);

  useEffect(() => {
    generateUTM();
  }, [generateUTM]);

  useEffect(() => {
    setIsValidUrl(validateUrl(url));
  }, [url]);

  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(generatedUrl);
      } else {
        // Fallback for older browsers or restricted environments
        const textArea = document.createElement("textarea");
        textArea.value = generatedUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleReset = () => {
    setUrl('');
    setSource('');
    setCustomSource('');
    setMedium('');
    setCustomMedium('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#eeeeee] p-8 md:p-10"
        id="generator-card"
      >
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">UTM Generator</h1>
          </div>
          <p className="text-[#888888] text-sm">GA4 compliant link builder | 100% Offline Ready.</p>
        </header>

        <div className="space-y-6">
          {/* Website URL */}
          <div className="space-y-2">
            <label htmlFor="website-url" className="text-xs font-bold uppercase tracking-widest text-[#999999] flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Website URL
            </label>
            <input
              id="website-url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none text-[15px] ${
                !isValidUrl && url 
                ? 'border-red-200 bg-red-50 focus:border-red-400' 
                : 'border-[#eeeeee] focus:border-black focus:ring-4 focus:ring-black/5'
              }`}
            />
            {!isValidUrl && url && (
              <p className="text-red-500 text-[11px] font-medium mt-1">Please enter a valid URL</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Source */}
            <div className="space-y-2">
              <label htmlFor="campaign-source" className="text-xs font-bold uppercase tracking-widest text-[#999999] flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Source
              </label>
              <select
                id="campaign-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#eeeeee] focus:border-black bg-white transition-all duration-200 outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-black/5"
              >
                <option value="">Select Source...</option>
                {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {source === 'custom' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  placeholder="Enter custom source"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full px-4 py-3 mt-2 rounded-xl border border-[#eeeeee] focus:border-black outline-none transition-all"
                />
              )}
            </div>

            {/* Campaign Medium */}
            <div className="space-y-2">
              <label htmlFor="campaign-medium" className="text-xs font-bold uppercase tracking-widest text-[#999999] flex items-center gap-2">
                <MousePointer2 className="w-3.5 h-3.5" /> Medium
              </label>
              <select
                id="campaign-medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#eeeeee] focus:border-black bg-white transition-all duration-200 outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-black/5"
              >
                <option value="">Select Medium...</option>
                {MEDIUMS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              {medium === 'custom' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  placeholder="Enter custom medium"
                  value={customMedium}
                  onChange={(e) => setCustomMedium(e.target.value)}
                  className="w-full px-4 py-3 mt-2 rounded-xl border border-[#eeeeee] focus:border-black outline-none transition-all"
                />
              )}
            </div>
          </div>

          {/* Campaign Name */}
          <div className="space-y-2">
            <label htmlFor="campaign-name" className="text-xs font-bold uppercase tracking-widest text-[#999999] flex items-center gap-2">
              <Type className="w-3.5 h-3.5" /> Campaign Name
            </label>
            <input
              id="campaign-name"
              type="text"
              placeholder="e.g. summer_sale"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#eeeeee] focus:border-black transition-all duration-200 outline-none focus:ring-4 focus:ring-black/5"
            />
          </div>
        </div>

        {/* Live Preview & Actions */}
        <div className="mt-12 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black">Generated Link Preview</h3>
              <button 
                onClick={handleReset}
                className="text-[11px] font-semibold text-[#888888] hover:text-black flex items-center gap-1 transition-colors group"
                id="clear-button"
              >
                <RotateCcw className="w-3 h-3 transition-transform group-hover:-rotate-45" /> Clear All
              </button>
            </div>
            
            <div className="relative group">
              <div 
                className={`w-full min-h-[80px] p-4 rounded-2xl border border-[#eeeeee] bg-[#fafafa] font-mono text-[13px] break-all flex items-center pr-14 transition-all duration-300 ${
                  generatedUrl ? 'text-[#333333]' : 'text-[#cccccc]'
                }`}
              >
                {generatedUrl || 'Your generated link will appear here...'}
              </div>
              
              <button
                onClick={handleCopy}
                disabled={!generatedUrl}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  generatedUrl 
                  ? 'bg-black text-white hover:scale-105 active:scale-95 shadow-lg shadow-black/10' 
                  : 'bg-[#eeeeee] text-[#aaaaaa] cursor-not-allowed'
                }`}
                aria-label="Copy to clipboard"
                id="copy-button"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            {copied && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-bold text-green-600 text-center"
              >
                Copied to clipboard!
              </motion.p>
            )}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-[#f5f5f5]">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">GA4 Compliance</span>
            <p className="text-[12px] text-[#888888] leading-relaxed">
              Auto-formatting converts all inputs to <span className="text-black font-medium">lowercase</span> and replaces spaces with <span className="text-black font-medium">underscores</span> for optimal categorization.
            </p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
