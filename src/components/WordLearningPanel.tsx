import { useState } from 'react';
import { useLearningContext} from '@/contexts/learningContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const WordLearningPanel: React.FC = () => {
  const { words } = useLearningContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [reviewMode, setReviewMode] = useState<'flashcard' | 'quiz' | 'test'>('flashcard');

  // --- 新增：记录已掌握单词的 ID 集合 ---
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());

  // 获取当前单词
  const currentWord = words[currentWordIndex];
  
  // --- 修改：动态计算进度 ---
  const totalWords = words.length;
  const masteredCount = masteredIds.size;
  // 防止除以0，计算百分比
  const progressPercentage = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;
  
  // 判断当前单词是否已掌握
  const isCurrentMastered = currentWord ? masteredIds.has(currentWord.id) : false;

  const handleNextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
    setShowMeaning(false);
  };
  
  const handlePrevWord = () => {
    setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length);
    setShowMeaning(false);
  };
  
  // --- 修改：处理"标记为掌握" ---
  const toggleMastered = () => {
    if (!currentWord) return;

    const newSet = new Set(masteredIds);
    if (newSet.has(currentWord.id)) {
      newSet.delete(currentWord.id); // 如果已掌握，点击则取消
      // toast.info('已取消掌握');
    } else {
      newSet.add(currentWord.id); // 如果未掌握，点击则添加
      toast.success('🎉 已标记为掌握！');
      // 可选：自动跳到下一个
      // setTimeout(handleNextWord, 500); 
    }
    setMasteredIds(newSet);
  };
  
  if (!currentWord) return null;
  
  return (
     <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80'} backdrop-blur-sm rounded-xl shadow-lg overflow-hidden`}>
      
      {/* --- 顶部进度条 (动态) --- */}
      <div className={`flex-shrink-0 px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">学习进度</span>
          <div className="flex items-center gap-2">
            {/* 动态数据显示 */}
            <span className="text-xs text-gray-400">{masteredCount}/{totalWords}</span>
            <span className="text-sm font-bold text-blue-500">{progressPercentage}%</span>
          </div>
        </div>
        <div className={`h-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            // 关键：这里绑定动态百分比
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
          />
        </div>
      </div>
      
      {/* --- Tab 栏 --- */}
      <div className={`flex-shrink-0 px-2 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-1">
          {[
            { id: 'flashcard', label: '单词卡', icon: 'fa-clone' },
            { id: 'quiz', label: '选择', icon: 'fa-list-check' },
            { id: 'test', label: '拼写', icon: 'fa-pencil' }
          ].map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => setReviewMode(mode.id as any)}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium ${
                reviewMode === mode.id
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } transition-colors`}
            >
              <i className={`fa-solid ${mode.icon}`}></i>
              {mode.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* --- 主要内容区 --- */}
      <div className="flex-grow overflow-y-auto no-scrollbar p-3 flex flex-col items-center relative">
        {reviewMode === 'flashcard' && (
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-full flex flex-col items-center p-4 rounded-xl border mb-2 relative ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            {/* --- 新增：掌握状态标记按钮 (右上角) --- */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={toggleMastered}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isCurrentMastered 
                  ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg' 
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={isCurrentMastered ? "取消掌握" : "标记为已掌握"}
            >
              <i className={`fa-solid ${isCurrentMastered ? 'fa-check' : 'fa-check'}`}></i>
            </motion.button>

            {/* 单词主体 */}
            <div className="text-center mt-2 mb-4 pr-6 pl-6"> 
               <h3 className={`text-2xl font-bold mb-1 ${isCurrentMastered ? 'text-green-500' : ''}`}>{currentWord.word}</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 italic">/{currentWord.pronunciation}/</p>
            </div>
            
            {/* 释义区域 */}
            <div className="w-full">
               {!showMeaning ? (
                  <button 
                    onClick={() => setShowMeaning(true)}
                    className={`w-full py-6 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 transition-all group ${
                        theme === 'dark' ? 'border-gray-600 hover:bg-gray-700/50' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                     <i className="fa-regular fa-eye text-gray-400 group-hover:text-blue-500 text-lg"></i>
                     <span className="text-xs text-gray-400 group-hover:text-blue-500">点击查看释义</span>
                  </button>
               ) : (
                 <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                 >
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <h4 className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">MEANING</h4>
                      <p className="text-base font-medium">{currentWord.meaning}</p>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <h4 className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">EXAMPLE</h4>
                      <p className="text-sm leading-relaxed italic text-gray-600 dark:text-gray-300">
                        "{currentWord.example}"
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setShowMeaning(false)}
                      className="w-full py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      隐藏释义
                    </button>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
        
        {/* 其他模式占位 */}
        {reviewMode !== 'flashcard' && (
           <div className="flex-grow flex flex-col items-center justify-center text-gray-400 text-sm">
             <i className="fa-solid fa-code mb-2 text-xl"></i>
             <p>功能开发中...</p>
           </div>
        )}
        
        {/* 导航按钮 */}
        <div className="mt-auto pt-4 w-full flex items-center justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevWord}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </motion.button>
           <span className="text-xs font-mono text-gray-400">
             {currentWordIndex + 1} / {words.length}
           </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNextWord}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </motion.button>
        </div>
      </div>
      
      {/* --- 底部按钮 --- */}
      <div className={`flex-shrink-0 p-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex gap-2`}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/pronunciation')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
        >
          <i className="fa-solid fa-microphone text-blue-500"></i>
          评分
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wordbook')}
          className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          <i className="fa-solid fa-book"></i>
          全表
        </motion.button>
      </div>
      
    </div>
  );
};

export default WordLearningPanel;