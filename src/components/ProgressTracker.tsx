import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const ProgressTracker: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // 模拟学习数据
  const learningStats = {
    totalWords: 120,
    masteredWords: 45,
    dailyStreak: 7,
    totalMinutes: 156,
    completionRate: 65, // 百分比
  };
  
  // 模拟成就数据
  const achievements = [
    { id: 1, name: '入门学习', icon: 'fa-graduation-cap', completed: true, description: '完成首次学习会话' },
    { id: 2, name: '坚持不懈', icon: 'fa-calendar-check', completed: true, description: '连续学习3天' },
    { id: 3, name: '词汇大师', icon: 'fa-book', completed: false, progress: 45, description: '掌握100个单词' },
    { id: 4, name: '对话高手', icon: 'fa-comments', completed: false, progress: 30, description: '完成10次完整对话' },
  ];
  
  // 切换显示统计或成就
  const [showStats, setShowStats] = useState(true);
  
  return (
    <div className={`border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm px-4 py-3`}>
      <div className="max-w-7xl mx-auto">
        {/* 切换按钮 */}
        <div className="flex justify-center gap-4 mb-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowStats(true)}
            className={`px-4 py-1.5 rounded-full text-sm ${
              showStats
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            学习统计
          </motion.button>
          
           <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowStats(false);
              // 延迟一下再跳转，让用户看到视觉反馈
              setTimeout(() => {
                navigate('/achievements');
              }, 300);
            }}
            className={`px-4 py-1.5 rounded-full text-sm ${
              !showStats
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            成就进度
          </motion.button>
        </div>
        
        {/* 统计数据 */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <i className="fa-solid fa-book"></i>
                <span className="text-sm font-medium">总词汇量</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{learningStats.totalWords}</span>
                <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <i className="fa-solid fa-check-circle"></i>
                <span className="text-sm font-medium">已掌握</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{learningStats.masteredWords}</span>
                <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <i className="fa-solid fa-fire"></i>
                <span className="text-sm font-medium">连续学习</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{learningStats.dailyStreak}</span>
                <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>天</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <i className="fa-solid fa-clock"></i>
                <span className="text-sm font-medium">学习时长</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{learningStats.totalMinutes}</span>
                <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>分钟</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 成就进度 */}
        {!showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      achievement.completed
                        ? 'bg-yellow-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <i className={`fa-solid ${achievement.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{achievement.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    achievement.completed
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {achievement.completed ? '已完成' : `${achievement.progress}%`}
                  </span>
                </div>
                
                {/* 进度条 */}
                {!achievement.completed && (
                  <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;