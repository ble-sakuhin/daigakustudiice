
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Target, Trophy, Plus, Star, Camera, User, Heart, Sparkles, X, BookOpen } from 'lucide-react';
import { ReferenceBook, Todo, RoadmapStep } from './types';
import { INITIAL_BOOKS, NAV_ITEMS, INITIAL_ROADMAP_STEPS } from './constants';
import BookProgress from './components/BookProgress';
import AIMentor from './components/AIMentor';
import TodoSection from './components/TodoSection';
import RoadmapView from './components/RoadmapView';
import SettingsView from './components/SettingsView';
import { getDailyQuote } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Safe JSON Parsing helper
  const safeParse = (key: string, fallback: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error parsing ${key}`, e);
      return fallback;
    }
  };

  const [books, setBooks] = useState<ReferenceBook[]>(() => safeParse('exampilot_books', INITIAL_BOOKS));
  const [roadmapEnglish, setRoadmapEnglish] = useState<RoadmapStep[]>(() => safeParse('exampilot_roadmap_english', INITIAL_ROADMAP_STEPS));
  const [roadmapModernJp, setRoadmapModernJp] = useState<RoadmapStep[]>(() => safeParse('exampilot_roadmap_modern_jp', INITIAL_ROADMAP_STEPS));
  const [roadmapClassicJp, setRoadmapClassicJp] = useState<RoadmapStep[]>(() => safeParse('exampilot_roadmap_classic_jp', INITIAL_ROADMAP_STEPS));
  const [roadmapWorldHistory, setRoadmapWorldHistory] = useState<RoadmapStep[]>(() => safeParse('exampilot_roadmap_world_history', INITIAL_ROADMAP_STEPS));
  const [todos, setTodos] = useState<Todo[]>(() => safeParse('exampilot_todos', []));

  const [visionBoardImage, setVisionBoardImage] = useState<string | null>(() => localStorage.getItem('exampilot_vision_board'));
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem('exampilot_profile_image'));
  const [mentorImage, setMentorImage] = useState<string | null>(() => localStorage.getItem('exampilot_mentor_image'));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('exampilot_user_name') || 'プロデューサーさん');
  const [targetSchool, setTargetSchool] = useState<string>(() => localStorage.getItem('exampilot_target_school') || '志望校を入力');
  const [roadmapGoal, setRoadmapGoal] = useState<string>(() => localStorage.getItem('exampilot_roadmap_goal') || '第一志望校合格！');
  const [quote, setQuote] = useState("今日もあいすと一緒に、ハッピーに頑張ろうねっ！");
  
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', subject: 'Math', totalChapters: 10, difficulty: 'Intermediate' as const });

  const visionInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('exampilot_books', JSON.stringify(books));
    localStorage.setItem('exampilot_todos', JSON.stringify(todos));
    localStorage.setItem('exampilot_roadmap_english', JSON.stringify(roadmapEnglish));
    localStorage.setItem('exampilot_roadmap_modern_jp', JSON.stringify(roadmapModernJp));
    localStorage.setItem('exampilot_roadmap_classic_jp', JSON.stringify(roadmapClassicJp));
    localStorage.setItem('exampilot_roadmap_world_history', JSON.stringify(roadmapWorldHistory));
    localStorage.setItem('exampilot_user_name', userName);
    localStorage.setItem('exampilot_target_school', targetSchool);
    localStorage.setItem('exampilot_roadmap_goal', roadmapGoal);
    if (visionBoardImage) localStorage.setItem('exampilot_vision_board', visionBoardImage);
    if (profileImage) localStorage.setItem('exampilot_profile_image', profileImage);
    if (mentorImage) localStorage.setItem('exampilot_mentor_image', mentorImage);
  }, [books, todos, roadmapEnglish, roadmapModernJp, roadmapClassicJp, roadmapWorldHistory, userName, targetSchool, roadmapGoal, visionBoardImage, profileImage, mentorImage]);

  useEffect(() => {
    getDailyQuote().then(setQuote);
  }, []);

  const totalProgress = useMemo(() => {
    const total = books.reduce((acc, b) => acc + b.totalChapters, 0);
    const completed = books.reduce((acc, b) => acc + b.completedChapters, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [books]);

  // Chart Data
  const weeklyCompletionData = useMemo(() => {
    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const today = new Date().getDay(); // 0 is Sunday
    const completionRate = todos.length > 0 
      ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
      : 0;

    return days.map((day, i) => {
      // Mock past data, real data for today
      const isToday = i === (today === 0 ? 6 : today - 1);
      return {
        name: day,
        value: isToday ? completionRate : Math.floor(Math.random() * 40) + 30
      };
    });
  }, [todos]);

  const updateBookProgress = (id: string, completed: number) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, completedChapters: completed, lastStudied: new Date().toISOString().split('T')[0] } : b));
  };

  const updateBookImage = (id: string, base64: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, coverImage: base64 } : b));
  };

  const deleteBook = (id: string) => {
    if (window.confirm('この参考書を削除してもよろしいですか？')) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleAddBook = () => {
    if (!newBook.title) return;
    const book: ReferenceBook = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBook.title,
      subject: newBook.subject,
      totalChapters: Number(newBook.totalChapters),
      completedChapters: 0,
      difficulty: newBook.difficulty,
      lastStudied: new Date().toISOString().split('T')[0]
    };
    setBooks(prev => [...prev, book]);
    setIsBookModalOpen(false);
    setNewBook({ title: '', subject: 'Math', totalChapters: 10, difficulty: 'Intermediate' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTodo = (text: string, priority: Todo['priority']) => {
    const newTodo: Todo = { id: Math.random().toString(36).substr(2, 9), text, completed: false, priority, createdAt: new Date().toISOString() };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearAllData = () => {
    if (window.confirm('すべてのデータをリセットします。よろしいですか？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div 
              onClick={() => visionInputRef.current?.click()}
              className="relative h-64 md:h-80 rounded-3xl overflow-hidden group cursor-pointer border-4 border-white shadow-xl bg-slate-200"
            >
              {visionBoardImage ? (
                <img src={visionBoardImage} alt="Vision Board" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Camera className="w-12 h-12" />
                  <p className="font-bold">合格へのイメージ画像をアップロード</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                  <h2 className="text-3xl font-black drop-shadow-lg">GOAL: {roadmapGoal}</h2>
                </div>
                <p className="text-indigo-200 font-bold italic drop-shadow-md flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  "{quote}"
                </p>
              </div>
              <input type="file" ref={visionInputRef} onChange={(e) => handleImageUpload(e, setVisionBoardImage)} className="hidden" accept="image/*" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-1">Current Progress</p>
                      <h4 className="text-3xl font-black">{totalProgress}%</h4>
                    </div>
                    <Trophy className="w-12 h-12 text-yellow-400 opacity-50" />
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-[10px] font-black uppercase tracking-widest mb-1">Target School</p>
                      <h4 className="text-2xl font-black truncate">{targetSchool}</h4>
                    </div>
                    <Target className="w-12 h-12 text-white opacity-40" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">週間完了トレンド (%)</h3>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Weekly Performance</span>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyCompletionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                        />
                        <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
                          {weeklyCompletionData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) ? '#6366f1' : '#e2e8f0'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <TodoSection todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} compact />
              </div>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">参考書ライブラリ</h2>
              <button 
                onClick={() => setIsBookModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm font-bold shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>新規追加</span>
              </button>
            </div>
            {books.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">まだ参考書が登録されていません。<br/>「新規追加」から勉強する本を登録しよう！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <BookProgress key={book.id} book={book} onUpdate={updateBookProgress} onImageChange={updateBookImage} onDelete={deleteBook} />
                ))}
              </div>
            )}
          </div>
        );
      case 'roadmap-english':
        return <RoadmapView title="英語ロードマップ" themeColor="indigo" currentBooks={books} roadmap={roadmapEnglish} onUpdateRoadmap={setRoadmapEnglish} roadmapGoal={roadmapGoal} />;
      case 'roadmap-modern-jp':
        return <RoadmapView title="現代文ロードマップ" themeColor="emerald" currentBooks={books} roadmap={roadmapModernJp} onUpdateRoadmap={setRoadmapModernJp} roadmapGoal={roadmapGoal} />;
      case 'roadmap-classic-jp':
        return <RoadmapView title="古文ロードマップ" themeColor="amber" currentBooks={books} roadmap={roadmapClassicJp} onUpdateRoadmap={setRoadmapClassicJp} roadmapGoal={roadmapGoal} />;
      case 'roadmap-world-history':
        return <RoadmapView title="世界史ロードマップ" themeColor="rose" currentBooks={books} roadmap={roadmapWorldHistory} onUpdateRoadmap={setRoadmapWorldHistory} roadmapGoal={roadmapGoal} />;
      case 'tasks':
        return <TodoSection todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />;
      case 'ai-mentor':
        return (
          <div className="animate-in zoom-in-95 duration-500">
            <AIMentor mentorImage={mentorImage} />
          </div>
        );
      case 'settings':
        return (
          <SettingsView
            userName={userName} setUserName={setUserName}
            targetSchool={targetSchool} setTargetSchool={setTargetSchool}
            roadmapGoal={roadmapGoal} setRoadmapGoal={setRoadmapGoal}
            profileImage={profileImage} onProfileImageChange={setProfileImage}
            mentorImage={mentorImage} onMentorImageChange={setMentorImage}
            visionBoardImage={visionBoardImage} onVisionBoardImageChange={setVisionBoardImage}
            onResetAll={clearAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/50">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 space-y-8 sticky top-0 h-screen overflow-y-auto shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-xl shadow-lg shadow-pink-100">
            <Star className="text-white w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">ExamPilot</h1>
        </div>

        <div className="px-2">
          <div 
            onClick={() => setActiveTab('settings')}
            className="group relative w-20 h-20 rounded-3xl overflow-hidden cursor-pointer bg-slate-100 ring-4 ring-white shadow-md hover:ring-pink-100 transition-all mb-4"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <User className="w-10 h-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-slate-800 truncate">{userName}</h3>
          <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest truncate">Target: {targetSchool}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-pink-50 text-pink-600 shadow-sm border border-pink-100' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <span className={activeTab === item.id ? 'text-pink-600' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-3xl border border-indigo-100 shadow-sm">
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Total Progress</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-black text-indigo-700">{totalProgress}%</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{width: `${totalProgress}%`}}></div>
            </div>
          </div>
        </div>
      </aside>

      <header className="md:hidden bg-white/90 backdrop-blur-md border-b border-pink-100 p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Star className="text-pink-500 w-6 h-6 fill-pink-500" />
          <h1 className="text-lg font-black text-slate-800 tracking-tighter">ExamPilot</h1>
        </div>
        <div 
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm cursor-pointer"
        >
          {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-5 h-5 m-2.5 text-slate-300" />}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {isBookModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-pink-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-pink-500" />
                参考書を追加
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Title / 参考書名</label>
                <input 
                  type="text" 
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                  placeholder="例: 文系数学の良問プラチカ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Subject</label>
                  <select 
                    value={newBook.subject}
                    onChange={(e) => setNewBook({...newBook, subject: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all appearance-none"
                  >
                    <option value="Math">数学</option>
                    <option value="English">英語</option>
                    <option value="Physics">物理</option>
                    <option value="Chemistry">化学</option>
                    <option value="History">歴史</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Chapters / 章数</label>
                  <input 
                    type="number" 
                    value={newBook.totalChapters}
                    onChange={(e) => setNewBook({...newBook, totalChapters: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddBook}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 mt-4"
              >
                ライブラリに追加するっ☆
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-pink-50 flex justify-around p-3 z-50 shadow-[0_-4px_20px_rgba(244,114,182,0.1)] overflow-x-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all min-w-[60px] ${activeTab === item.id ? 'text-pink-600' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
