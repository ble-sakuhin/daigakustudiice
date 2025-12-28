
import React, { useRef } from 'react';
import { User, Camera, Target, Star, Heart, Image as ImageIcon, Sparkles, RefreshCcw, Map } from 'lucide-react';

interface SettingsViewProps {
  userName: string;
  setUserName: (val: string) => void;
  targetSchool: string;
  setTargetSchool: (val: string) => void;
  roadmapGoal: string;
  setRoadmapGoal: (val: string) => void;
  profileImage: string | null;
  onProfileImageChange: (base64: string) => void;
  mentorImage: string | null;
  onMentorImageChange: (base64: string) => void;
  visionBoardImage: string | null;
  onVisionBoardImageChange: (base64: string) => void;
  onResetAll: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  setUserName,
  targetSchool,
  setTargetSchool,
  roadmapGoal,
  setRoadmapGoal,
  profileImage,
  onProfileImageChange,
  mentorImage,
  onMentorImageChange,
  visionBoardImage,
  onVisionBoardImageChange,
  onResetAll,
}) => {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const mentorInputRef = useRef<HTMLInputElement>(null);
  const visionInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-pink-100 p-2 rounded-xl">
          <Star className="text-pink-500 w-6 h-6 fill-pink-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">プロデューサー設定</h2>
      </div>

      {/* プロフィール設定 */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-slate-100 ring-4 ring-pink-50 shadow-inner">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg border-2 border-white"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={profileInputRef} onChange={(e) => handleFileChange(e, onProfileImageChange)} className="hidden" accept="image/*" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">あなたのアイコン</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-pink-50 ring-4 ring-pink-100 shadow-inner">
                {mentorImage ? (
                  <img src={mentorImage} alt="Mentor" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-300">
                    <Sparkles className="w-10 h-10 fill-pink-300" />
                  </div>
                )}
              </div>
              <button
                onClick={() => mentorInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-pink-500 hover:bg-pink-600 text-white p-2.5 rounded-xl shadow-lg border-2 border-white"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={mentorInputRef} onChange={(e) => handleFileChange(e, onMentorImageChange)} className="hidden" accept="image/*" />
            </div>
            <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">あいすのアイコン</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User className="w-3 h-3" />
              お名前 / プロデューサー名
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例: たなかプロデューサー"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Target className="w-3 h-3" />
              第一志望校
            </label>
            <input
              type="text"
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              placeholder="例: 日本大学"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-pink-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Map className="w-3 h-3" />
              ロードマップの最終目標
            </label>
            <input
              type="text"
              value={roadmapGoal}
              onChange={(e) => setRoadmapGoal(e.target.value)}
              placeholder="例: 早稲田大学合格！"
              className="w-full bg-pink-50/30 border-2 border-pink-50 focus:border-pink-300 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          ビジョンボード設定
        </h3>
        <div 
          onClick={() => visionInputRef.current?.click()}
          className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 cursor-pointer group hover:ring-4 ring-pink-100 transition-all border-2 border-dashed border-slate-200"
        >
          {visionBoardImage ? (
            <img src={visionBoardImage} alt="Vision Board" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
              <ImageIcon className="w-10 h-10 opacity-50" />
              <p className="text-xs font-bold">志望校の写真や理想の姿を追加</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-xs font-bold flex items-center gap-2">
              <Camera className="w-4 h-4" />
              写真を変更する
            </div>
          </div>
          <input type="file" ref={visionInputRef} onChange={(e) => handleFileChange(e, onVisionBoardImageChange)} className="hidden" accept="image/*" />
        </div>
      </section>

      <section className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
        <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          データの管理
        </h3>
        <button 
          onClick={onResetAll}
          className="w-full bg-white hover:bg-rose-500 hover:text-white text-rose-500 border-2 border-rose-200 font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          すべてのデータをリセットする
        </button>
      </section>

      <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-6 rounded-3xl text-white shadow-lg shadow-pink-100">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-2xl shrink-0">
            {mentorImage ? (
              <img src={mentorImage} alt="Aice" className="w-6 h-6 rounded-lg object-cover" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm flex items-center gap-1">
              あいすからのアドバイス
              <Heart className="w-3 h-3 fill-white" />
            </h4>
            <p className="text-xs mt-2 leading-relaxed opacity-95">
              「プロデューサーさん、設定の見直しもお疲れ様っ☆ あいすのアイコン、素敵にしてくれてありがとうっ♪ これでますます応援に力が入っちゃうよ！さあ、目標に向かってレッツゴー！」
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
