
import React, { useState, useMemo } from 'react';
import { Todo } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { Plus, Trash2, CheckCircle2, Circle, Target } from 'lucide-react';

interface TodoSectionProps {
  todos: Todo[];
  onAdd: (text: string, priority: Todo['priority']) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const TodoSection: React.FC<TodoSectionProps> = ({ todos, onAdd, onToggle, onDelete, compact = false }) => {
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('Medium');

  // 本日のタスクのみをフィルタリング
  const todayStr = new Date().toLocaleDateString();
  const todayTodos = useMemo(() => {
    return todos.filter(t => new Date(t.createdAt).toLocaleDateString() === todayStr);
  }, [todos, todayStr]);

  const completionRate = useMemo(() => {
    if (todayTodos.length === 0) return 0;
    const completedCount = todayTodos.filter(t => t.completed).length;
    return Math.round((completedCount / todayTodos.length) * 100);
  }, [todayTodos]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo.trim(), priority);
      setNewTodo('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 日本語入力(IME)の変換中でない場合のみ、Enterキーで送信
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSubmit();
    }
  };

  const displayTodos = compact ? todayTodos.slice(0, 5) : todayTodos;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${compact ? '' : 'min-h-[500px]'}`}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">今日のタスク</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{todayStr}</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${completionRate === 100 ? 'text-green-500' : 'text-indigo-600'}`}>
              {completionRate}%
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase">完了度</p>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out ${completionRate === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        
        {completionRate === 100 && todayTodos.length > 0 && (
          <p className="text-center text-green-600 text-[10px] font-bold mt-2 animate-bounce">
            🎉 今日の目標をすべて達成しました！
          </p>
        )}
      </div>

      {!compact && (
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="今日やるべきことを追加..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as Todo['priority'][]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-bold ${
                      priority === p 
                        ? `${PRIORITY_COLORS[p]} ring-2 ring-indigo-100` 
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p === 'High' ? '高' : p === 'Medium' ? '中' : '低'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleSubmit()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {displayTodos.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="text-sm font-medium">まだ今日のタスクがありません。<br/>小さな一歩から始めましょう！</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {displayTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors group">
                <button 
                  onClick={() => onToggle(todo.id)}
                  className={`shrink-0 transition-all ${todo.completed ? 'text-green-500' : 'text-slate-300 hover:text-indigo-400'}`}
                >
                  {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold transition-all truncate ${todo.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-black border tracking-tighter ${PRIORITY_COLORS[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>

                {!compact && (
                  <button 
                    onClick={() => onDelete(todo.id)}
                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {compact && todayTodos.length > 5 && (
        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400">他 {todayTodos.length - 5} 件のタスクがあります</p>
        </div>
      )}
    </div>
  );
};

export default TodoSection;
