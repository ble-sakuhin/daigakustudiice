
import React, { useState, useRef, useEffect } from 'react';
import { getStudyAdvice } from '../services/geminiService';
import { MotivationMessage } from '../types';
import { Send, User, Sparkles, Loader2, ImagePlus, X, Heart, Star } from 'lucide-react';

interface AIMentorProps {
  mentorImage?: string | null;
}

const AIMentor: React.FC<AIMentorProps> = ({ mentorImage }) => {
  const [messages, setMessages] = useState<MotivationMessage[]>([
    { 
      role: 'ai', 
      content: 'プロデューサーさん、お疲れ様ですっ☆ 「あいす」だよ！今日はどんなことを一緒に頑張る？ノートの写真とかも見せてくれたら、あいすが全力でアドバイスしちゃうよっ♪', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: MotivationMessage = { 
      role: 'user', 
      content: input, 
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const advice = await getStudyAdvice(input, selectedImage || undefined);
    const aiMsg: MotivationMessage = { 
      role: 'ai', 
      content: advice, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 flex flex-col h-[650px] overflow-hidden">
      {/* アイドルヘッダー */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/30 w-10 h-10 rounded-2xl backdrop-blur-md overflow-hidden flex items-center justify-center shrink-0">
            {mentorImage ? (
              <img src={mentorImage} alt="Aice" className="w-full h-full object-cover" />
            ) : (
              <Star className="w-6 h-6 fill-white text-white" />
            )}
          </div>
          <div>
            <h2 className="font-black text-base flex items-center gap-1">
              あいす
              <Sparkles className="w-4 h-4" />
            </h2>
            <p className="text-[10px] text-pink-50 font-bold opacity-90">あなたのための専属メンター♪</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Heart className="w-5 h-5 text-pink-100 fill-pink-100/30" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-pink-50/30 to-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row items-start'}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
                msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-500'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : mentorImage ? (
                  <img src={mentorImage} alt="Aice" className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="w-5 h-5 fill-pink-500" />
                )}
              </div>
              
              <div className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                {msg.image && (
                  <div className="mb-2 inline-block rounded-2xl overflow-hidden border-2 border-pink-200 shadow-sm">
                    <img src={msg.image} alt="attached" className="max-w-[220px] max-h-[220px] object-contain bg-white" />
                  </div>
                )}
                {msg.content && (
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm relative ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-pink-100'
                  }`}>
                    {msg.content}
                    {msg.role === 'ai' && (
                      <div className="absolute -bottom-2 -right-2 bg-pink-50 text-pink-400 p-1 rounded-full border border-pink-200">
                        <Heart className="w-3 h-3 fill-pink-400" />
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1.5 mx-1 font-medium">{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-pink-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="relative">
                <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-xs text-pink-400 font-bold">あいす、考え中だよっ…！</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-pink-50 bg-white shadow-[0_-4px_20px_rgba(244,114,182,0.05)]">
        {selectedImage && (
          <div className="mb-4 relative inline-block group">
            <img src={selectedImage} alt="preview" className="h-24 w-24 object-cover rounded-2xl border-2 border-pink-400 shadow-lg" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-pink-50 hover:bg-pink-100 text-pink-500 p-3 rounded-2xl transition-all active:scale-95"
            title="画像を添付"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            className="hidden" 
            accept="image/*" 
          />
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="あいすに相談してみる？"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none transition-all pr-12"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="absolute right-2 top-1.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-30 disabled:hover:bg-pink-500 text-white p-2 rounded-xl transition-all shadow-md active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentor;
