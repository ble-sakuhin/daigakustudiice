
import React, { useState } from 'react';
import { RoadmapStep, ReferenceBook } from '../types';
import { MapPin, Trophy, Edit2, Plus, Trash2, X, Save, Sparkles, CheckCircle2, Book as BookIcon } from 'lucide-react';

interface RoadmapViewProps {
  title: string;
  themeColor: 'indigo' | 'emerald' | 'amber' | 'rose';
  currentBooks: ReferenceBook[];
  roadmap: RoadmapStep[];
  onUpdateRoadmap: React.Dispatch<React.SetStateAction<RoadmapStep[]>>;
  roadmapGoal: string;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ 
  title, 
  themeColor, 
  currentBooks, 
  roadmap, 
  onUpdateRoadmap, 
  roadmapGoal 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStep, setEditingStep] = useState<RoadmapStep | null>(null);

  const overallProgress = currentBooks.length > 0 
    ? Math.round(currentBooks.reduce((acc, b) => acc + (b.completedChapters / b.totalChapters), 0) / currentBooks.length * 100)
    : 0;

  const colors = {
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-600', bgLight: 'bg-indigo-50', border: 'border-indigo-400', ring: 'ring-indigo-50', icon: 'fill-indigo-600/10', stroke: '#6366f1' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-400', ring: 'ring-emerald-50', icon: 'fill-emerald-600/10', stroke: '#10b981' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-400', ring: 'ring-amber-50', icon: 'fill-amber-600/10', stroke: '#f59e0b' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-600', bgLight: 'bg-rose-50', border: 'border-rose-400', ring: 'ring-rose-50', icon: 'fill-rose-600/10', stroke: '#f43f5e' },
  }[themeColor];

  const handleAddStep = () => {
    const newStep: RoadmapStep = {
      id: Math.random().toString(36).substr(2, 9),
      label: '新しい目標',
      description: '目標の説明を入れるっ☆',
      requiredBooks: [],
      level: Math.min(100, (roadmap[roadmap.length - 1]?.level || 0) + 10)
    };
    onUpdateRoadmap(prev => [...prev, newStep]);
    setEditingStep(newStep);
  };

  const handleUpdateStep = (updated: RoadmapStep) => {
    onUpdateRoadmap(prev => {
      const next = prev.map(s => s.id === updated.id ? updated : s);
      return [...next].sort((a, b) => a.level - b.level);
    });
    setEditingStep(null);
  };

  const handleDeleteStep = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // 編集モードでの誤発火を防止
    if (window.confirm('このステップを削除してもいいかな？(>_<)')) {
      onUpdateRoadmap(prev => prev.filter(s => s.id !== id));
      if (editingStep?.id === id) setEditingStep(null);
    }
  };

  const sortedRoadmap = [...roadmap].sort((a, b) => a.level - b.level);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
          {title}
          <Sparkles className={`w-5 h-5 ${colors.text}`} />
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            isEditing ? `${colors.bg} text-white shadow-lg` : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? '保存' : '編集'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
          <div className="text-center mb-8 w-full">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target Goal</h3>
            <div className={`flex items-center justify-center gap-2 ${colors.text}`}>
              <Trophy className={`w-6 h-6 shrink-0 ${colors.icon}`} />
              <span className="text-lg font-black truncate">{roadmapGoal}</span>
            </div>
          </div>

          <div className="relative h-[450px] w-full flex justify-center">
            <svg viewBox="0 0 100 400" className="h-full w-24 overflow-visible">
              <path d="M50 400 Q 10 300 50 200 Q 90 100 50 0" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
              <path d="M50 400 Q 10 300 50 200 Q 90 100 50 0" fill="none" stroke={colors.stroke} strokeWidth="14" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 - (500 * overallProgress / 100)} className="transition-all duration-1000 ease-in-out" />
              
              {sortedRoadmap.map((step) => {
                const y = 400 - (400 * step.level / 100);
                const isReached = overallProgress >= step.level;
                return (
                  <g key={step.id} transform={`translate(0, ${y})`}>
                    <circle cx="50" cy="0" r="7" className={`${isReached ? colors.bg : 'fill-slate-300'} transition-colors duration-500`} />
                    <foreignObject x="65" y="-12" width="120" height="40">
                      <div className={`text-[10px] font-black leading-tight truncate ${isReached ? colors.text : 'text-slate-400'}`}>
                        {step.label}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              <g transform={`translate(0, ${400 - (400 * overallProgress / 100)})`} className="transition-all duration-1000 ease-in-out">
                <circle cx="50" cy="0" r="16" fill="white" className="shadow-lg" />
                <foreignObject x="36" y="-14" width="28" height="28">
                  <div className={`${colors.bg} text-white rounded-full p-1.5 shadow-lg animate-bounce border-2 border-white`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                </foreignObject>
              </g>
            </svg>
          </div>

          <div className="mt-8 text-center">
            <p className="text-4xl font-black text-slate-800">{overallProgress}%</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">到達度</p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {editingStep ? (
            <div className={`bg-white p-8 rounded-3xl border-2 ${colors.border} shadow-xl animate-in zoom-in-95 duration-200`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-base">
                  <Edit2 className={`w-5 h-5 ${colors.text}`} />
                  ステップ編集
                </h3>
                <button onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">見出し / Step Title</label>
                  <input 
                    type="text" 
                    value={editingStep.label}
                    onChange={(e) => setEditingStep({...editingStep, label: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">説明文</label>
                  <textarea 
                    value={editingStep.description}
                    onChange={(e) => setEditingStep({...editingStep, description: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">目標レベル (%)</label>
                    <input 
                      type="number" 
                      value={editingStep.level}
                      onChange={(e) => setEditingStep({...editingStep, level: Math.min(100, Math.max(0, Number(e.target.value)))})}
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">参考書 (カンマ区切り)</label>
                    <input 
                      type="text" 
                      value={editingStep.requiredBooks.join(', ')}
                      onChange={(e) => setEditingStep({...editingStep, requiredBooks: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                      placeholder="例: 青チャート, ネクステ"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleUpdateStep(editingStep)} 
                  className={`w-full ${colors.bg} hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg transition-all mt-4 active:scale-95`}
                >
                  保存するっ☆
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRoadmap.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                  ステップがありません。<br/>右上の「編集」から追加してねっ☆
                </div>
              ) : (
                sortedRoadmap.map((step, idx) => {
                  const isCompleted = overallProgress >= step.level;
                  const isCurrent = overallProgress < step.level && (idx === 0 || overallProgress >= sortedRoadmap[idx-1].level);
                  
                  return (
                    <div key={step.id} className={`p-6 rounded-3xl border transition-all group relative ${isCompleted ? 'bg-white border-green-100 opacity-75 shadow-sm' : isCurrent ? `bg-white ${colors.border} ring-4 ${colors.ring} shadow-xl` : 'bg-slate-50 border-slate-200'}`}>
                      {isEditing && (
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingStep(step); }}
                            className={`p-2 bg-white ${colors.text} rounded-xl hover:bg-slate-50 transition-colors shadow-sm border border-slate-100`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteStep(e, step.id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors shadow-sm border border-rose-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : isCurrent ? `${colors.bg} text-white shadow-lg` : 'bg-slate-200 text-slate-400'}`}>
                            {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : step.level + '%'}
                          </div>
                          <div>
                            <h4 className={`font-black text-base ${isCurrent ? colors.text : 'text-slate-800'}`}>{step.label}</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className={`${colors.bg} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm hidden md:inline-block`}>
                            Next Step
                          </span>
                        )}
                      </div>
                      
                      {step.requiredBooks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 pl-16">
                          {step.requiredBooks.map(b => (
                            <span key={b} className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-500 flex items-center gap-1.5 shadow-xs">
                              <BookIcon className="w-3.5 h-3.5 opacity-60" /> {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isEditing && (
                <button 
                  onClick={handleAddStep} 
                  className={`w-full py-8 border-4 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:${colors.text} hover:${colors.border} hover:${colors.bgLight} transition-all flex flex-col items-center gap-3 group`}
                >
                  <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">新しいステップを追加</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
