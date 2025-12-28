
import React, { useRef } from 'react';
import { ReferenceBook } from '../types';
import { SUBJECT_COLORS } from '../constants';
import { ImagePlus, Trash2 } from 'lucide-react';

interface BookProgressProps {
  book: ReferenceBook;
  onUpdate: (id: string, completed: number) => void;
  onImageChange?: (id: string, base64: string) => void;
  onDelete: (id: string) => void;
}

const BookProgress: React.FC<BookProgressProps> = ({ book, onUpdate, onImageChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const percentage = Math.round((book.completedChapters / book.totalChapters) * 100);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(book.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex gap-4 group relative">
      <div 
        onClick={handleImageClick}
        className="w-20 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0 cursor-pointer relative group-hover:ring-2 ring-indigo-500 transition-all"
      >
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImagePlus className="w-8 h-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <p className="text-[10px] text-white font-bold">画像変更</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase border tracking-tighter ${SUBJECT_COLORS[book.subject] || 'bg-slate-100 text-slate-700'}`}>
              {book.subject}
            </span>
            <button 
              onClick={() => onDelete(book.id)}
              className="p-1 text-slate-200 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-800 mt-1 truncate pr-4">{book.title}</h3>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
              <span className="text-[10px] font-black text-indigo-600">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-bold text-slate-500">{book.completedChapters}/{book.totalChapters} 章</span>
          <div className="flex gap-1">
            <button 
              onClick={() => onUpdate(book.id, Math.max(0, book.completedChapters - 1))}
              className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors text-lg font-bold"
            >
              -
            </button>
            <button 
              onClick={() => onUpdate(book.id, Math.min(book.totalChapters, book.completedChapters + 1))}
              className="w-7 h-7 flex items-center justify-center bg-indigo-50 hover:bg-indigo-200 rounded-lg text-indigo-600 transition-colors text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookProgress;
