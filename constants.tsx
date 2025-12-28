
import React from 'react';
import { Book, Target, MessageCircle, Home, CheckSquare, Map, Settings, GraduationCap, Languages, ScrollText, Globe } from 'lucide-react';
import { RoadmapStep } from './types';

export const INITIAL_BOOKS = [];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'ダッシュボード', icon: <Home className="w-5 h-5" /> },
  { id: 'library', label: '参考書', icon: <Book className="w-5 h-5" /> },
  { id: 'roadmap-english', label: '英語ロードマップ', icon: <Languages className="w-5 h-5" /> },
  { id: 'roadmap-modern-jp', label: '現代文ロードマップ', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'roadmap-classic-jp', label: '古文ロードマップ', icon: <ScrollText className="w-5 h-5" /> },
  { id: 'roadmap-world-history', label: '世界史ロードマップ', icon: <Globe className="w-5 h-5" /> },
  { id: 'tasks', label: 'タスク', icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'ai-mentor', label: 'AIメンター', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'settings', label: '設定', icon: <Settings className="w-5 h-5" /> },
];

export const SUBJECT_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 text-blue-700',
  English: 'bg-indigo-100 text-indigo-700',
  Physics: 'bg-purple-100 text-purple-700',
  Chemistry: 'bg-orange-100 text-orange-700',
  History: 'bg-rose-100 text-rose-700',
};

export const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-600 border-red-200',
  Medium: 'bg-amber-100 text-amber-600 border-amber-200',
  Low: 'bg-blue-100 text-blue-600 border-blue-200',
};

export const INITIAL_ROADMAP_STEPS: RoadmapStep[] = [
  { id: '1', label: '基礎固め', description: '入門書を1周する', requiredBooks: [], level: 20 },
  { id: '2', label: '標準レベル', description: 'センター試験レベルの問題を解く', requiredBooks: [], level: 50 },
  { id: '3', label: '応用レベル', description: 'MARCHレベルの過去問に挑戦', requiredBooks: [], level: 80 },
  { id: '4', label: '最終目標', description: '志望校の合格点突破', requiredBooks: [], level: 100 },
];
