import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// 模拟成就数据
const mockAchievements = [
  { id: 1, name: '入门学习', icon: 'fa-graduation-cap', completed: true, description: '完成首次学习会话', unlockedAt: '2025-11-10', category: 'learning' },
  { id: 2, name: '坚持不懈', icon: 'fa-calendar-check', completed: true, description: '连续学习3天', unlockedAt: '2025-11-13', category: 'learning' },
  { id: 3, name: '词汇大师', icon: 'fa-book', completed: false, progress: 45, target: 100, description: '掌握100个单词', category: 'vocabulary' },
  { id: 4, name: '对话高手', icon: 'fa-comments', completed: false, progress: 30, target: 10, description: '完成10次完整对话', category: 'conversation' },
  { id: 5, name: '完美发音', icon: 'fa-microphone-lines', completed: false, progress: 60, target: 85, description: '发音评分达到85分以上', category: 'pronunciation' },
  { id: 6, name: '场景探索者', icon: 'fa-map', completed: false, progress: 2, target: 4, description: '探索所有学习场景', category: 'learning' },
  { id: 7, name: '学习达人', icon: 'fa-trophy', completed: false, progress: 30, target: 100, description: '累计学习100分钟', category: 'learning' },
  { id: 8, name: '每日坚持', icon: 'fa-fire', completed: false, progress: 7, target: 30, description: '连续学习30天', category: 'learning' },
];

// 分类数据
const categories = [
  { id: 'all', name: '全部成就', icon: 'fa-award' },
  { id: 'learning', name: '学习成就', icon: 'fa-book-open' },
  { id: 'vocabulary', name: '词汇成就', icon: 'fa-book' },
  { id: 'conversation', name: '对话成就', icon: 'fa-comments' },
  { id: 'pronunciation', name: '发音成就', icon: 'fa-microphone-lines' },
];

// 统计数据
const statsData = [
  { name: '已完成', value: 2 },
  { name: '进行中', value: 6 },
];

// 学习进度数据（用于图表）
const progressData = [
  { name: '词汇量', current: 45, target: 100 },
  { name: '对话次数', current: 3, target: 10 },
  { name: '发音评分', current: 60, target: 85 },
  { name: '学习时长', current: 30, target: 100 },
  { name: '连续天数', current: 7, target: 30 },
];

// 颜色
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

const AchievementsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState(mockAchievements);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  
  // 筛选成就
  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );
  
  // 计算已完成成就
  const completedAchievements = achievements.filter(a => a.completed);
  
  // 计算总成就数
  const totalAchievements = achievements.length;
  
  // 计算完成百分比
  const completionRate = Math.round((completedAchievements.length / totalAchievements) * 100);
  
  // 获取最近解锁的成就
  useEffect(() => {
    const recent = achievements
      .filter(a => a.completed && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 3);
    
    setRecentAchievements(recent);
  }, [achievements]);
  
  // 处理成就点击
  const handleAchievementClick = (achievement: any) => {
    if (achievement.completed) {
      toast.success(`恭喜！你已在 ${achievement.unlockedAt} 解锁了「${achievement.name}」成就`);
    } else {
      toast.info(`${achievement.name}: 完成度 ${achievement.progress}/${achievement.target}`);
    }
  };
  
  // 处理返回
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800/70 text-white' : 'bg-gray-200/70 text-gray-800'}`}
            aria-label="Back to home"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </motion.button>
          <h1 className="text-xl font-bold">成就系统</h1>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-grow p-6">
        {/* 成就总览 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 成就统计卡片 */}
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md lg:col-span-1`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-trophy text-yellow-500"></i>
              成就总览
            </h2>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-48 h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{completionRate}%</span>
                  <span className="text-sm">完成度</span>
                </div>
              </div>
              
              <div className="flex gap-6 w-full justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedAchievements.length}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>已解锁</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalAchievements}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总成就</div>
                </div>
              </div>
            </div>
            
            {/* 最近解锁的成就 */}
            {recentAchievements.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">最近解锁</h3>
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAchievementClick(achievement)}
                      className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} cursor-pointer flex items-center gap-3`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-yellow-500 text-white">
                        <i className={`fa-solid ${achievement.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          解锁于 {achievement.unlockedAt}
                        </p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 学习进度图表 */}
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md lg:col-span-2`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-blue-500"></i>
              学习进度
            </h2>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#ffffff' : '#111827'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="current" name="当前进度" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="目标" fill={theme === 'dark' ? '#4b5563' : '#e5e7eb'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors`}
              >
                <i className={`fa-solid ${category.icon}`}></i>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 成就列表 */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <h2 className="font-semibold">成就列表 ({filteredAchievements.length})</h2>
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`}>
                <i className="fa-solid fa-check-circle mr-1"></i> 已解锁
              </span>
              <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`}>
                <i className="fa-solid fa-spinner mr-1"></i> 进行中
              </span>
            </div>
          </div>
          
          {filteredAchievements.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <i className="fa-solid fa-award text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium mb-1">没有找到成就</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                请尝试更改筛选条件
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                  onClick={() => handleAchievementClick(achievement)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      achievement.completed
                        ? 'bg-yellow-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <i className={`fa-solid ${achievement.icon}`}></i>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{achievement.name}</h3>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          achievement.completed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {achievement.completed ? '已解锁' : `${achievement.progress}%`}
                        </span>
                      </div>
                      
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      
                      {/* 进度条 */}
                      {!achievement.completed && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {achievement.progress} / {achievement.target}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {achievement.progress}%
                            </span>
                          </div>
                          <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ duration: 1 }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 解锁日期 */}
                      {achievement.completed && achievement.unlockedAt && (
                        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                          解锁于: {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* 成就墙 */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-th text-purple-500"></i>
            成就墙
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAchievementClick(achievement)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-3 cursor-pointer transition-all ${
                  achievement.completed
                    ? `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md border-2 border-yellow-500`
                    : `${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'} opacity-60`
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                  achievement.completed
                    ? 'bg-yellow-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <i className={`fa-solid ${achievement.icon}`}></i>
                </div>
                <h3 className="text-sm font-medium text-center">{achievement.name}</h3>
                {achievement.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 2 
                    }}
                    className="absolute top-2 right-2 text-yellow-500"
                  >
                    <i className="fa-solid fa-crown"></i>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* 页脚 */}
       <footer className={`border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'} py-4 px-6 text-center text-sm`}>
        <p>SpeakBuddy - 沉浸式英语学习平台</p>
      </footer>
    </div>
  );
};

export default AchievementsPage;