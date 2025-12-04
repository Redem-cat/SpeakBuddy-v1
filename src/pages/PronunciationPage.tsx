import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 模拟发音练习数据
const mockPracticeData = [
  { date: '11-15', score: 72, words: 8 },
  { date: '11-16', score: 78, words: 10 },
  { date: '11-17', score: 75, words: 7 },
  { date: '11-18', score: 82, words: 12 },
  { date: '11-19', score: 85, words: 9 },
  { date: '11-20', score: 88, words: 11 },
];

// 模拟练习单词列表
const practiceWords = [
  { id: 1, word: 'pronunciation', difficulty: 'medium' },
  { id: 2, word: 'difficulty', difficulty: 'medium' },
  { id: 3, word: 'conversation', difficulty: 'medium' },
  { id: 4, word: 'entrepreneur', difficulty: 'hard' },
  { id: 5, word: 'accommodation', difficulty: 'hard' },
  { id: 6, word: 'restaurant', difficulty: 'easy' },
  { id: 7, word: 'appreciate', difficulty: 'medium' },
  { id: 8, word: 'schedule', difficulty: 'medium' },
  { id: 9, word: 'quarantine', difficulty: 'hard' },
  { id: 10, word: 'beautiful', difficulty: 'easy' },
];

// 难度级别
const difficultyLevels = [
  { id: 'all', name: '全部难度' },
  { id: 'easy', name: '简单' },
  { id: 'medium', name: '中等' },
  { id: 'hard', name: '困难' },
];

// 练习模式
const practiceModes = [
  { id: 'word', name: '单词练习', icon: 'fa-book' },
  { id: 'sentence', name: '句子练习', icon: 'fa-paragraph' },
  { id: 'conversation', name: '对话练习', icon: 'fa-comments' },
];

const PronunciationPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMode, setSelectedMode] = useState('word');
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [practiceHistory, setPracticeHistory] = useState(mockPracticeData);
  const [showResults, setShowResults] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    totalWords: 0,
    correctPronunciations: 0,
    averageScore: 0,
    highestScore: 0,
  });
  
  // 麦克风相关
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // 过滤单词
  const filteredWords = practiceWords.filter(word => 
    selectedDifficulty === 'all' || word.difficulty === selectedDifficulty
  );
  
  // 获取当前练习单词
  const currentWord = filteredWords[currentWordIndex];
  
  // 计算统计数据
  const totalScore = practiceHistory.reduce((sum, item) => sum + item.score, 0);
  const averageScore = practiceHistory.length > 0 ? Math.round(totalScore / practiceHistory.length) : 0;
  const highestScore = practiceHistory.length > 0 ? Math.max(...practiceHistory.map(item => item.score)) : 0;
  const totalPracticeWords = practiceHistory.reduce((sum, item) => sum + item.words, 0);
  
  // 处理开始练习
  const handleStartPractice = () => {
    setIsPracticing(true);
    setCurrentWordIndex(0);
    setCurrentScore(null);
    setShowResults(false);
    setPracticeStats({
      totalWords: 0,
      correctPronunciations: 0,
      averageScore: 0,
      highestScore: 0,
    });
    
    // 请求麦克风权限
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          // 处理录音数据 - 实际应用中会发送到服务器进行语音识别和评分
          simulateScoring();
        };
      })
      .catch(err => {
        toast.error(`无法访问麦克风: ${err.message}`);
        setIsPracticing(false);
      });
  };
  
  // 模拟评分过程
  const simulateScoring = () => {
    // 清除录音数据
    audioChunksRef.current = [];
    
    // 模拟评分延迟
    setTimeout(() => {
      // 生成随机分数
      const score = Math.floor(Math.random() * 20) + 75; // 75-95分
      setCurrentScore(score);
      
      // 更新练习统计
      const newStats = {
        totalWords: practiceStats.totalWords + 1,
        correctPronunciations: practiceStats.correctPronunciations + (score >= 80 ? 1 : 0),
        averageScore: Math.round((practiceStats.averageScore * practiceStats.totalWords + score) / (practiceStats.totalWords + 1)),
        highestScore: Math.max(practiceStats.highestScore, score),
      };
      
      setPracticeStats(newStats);
      
      // 延迟进入下一个单词
      setTimeout(() => {
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < filteredWords.length) {
          setCurrentWordIndex(nextIndex);
          setCurrentScore(null);
        } else {
          // 练习结束
          finishPractice(newStats);
        }
      }, 2000);
    }, 1000);
  };
  
  // 处理录音开始
  const handleStartRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 3000); // 3秒录音
    }
  };
  
  // 结束练习
  const finishPractice = (stats: typeof practiceStats) => {
    setShowResults(true);
    
    // 关闭麦克风
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // 更新练习历史
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}-${today.getDate()}`;
    
    const updatedHistory = [...practiceHistory];
    const todayIndex = updatedHistory.findIndex(item => item.date === dateStr);
    
    if (todayIndex >= 0) {
      updatedHistory[todayIndex] = {
        ...updatedHistory[todayIndex],
        score: Math.round((updatedHistory[todayIndex].score * updatedHistory[todayIndex].words + stats.averageScore * stats.totalWords) / (updatedHistory[todayIndex].words + stats.totalWords)),
        words: updatedHistory[todayIndex].words + stats.totalWords
      };
    } else {
      updatedHistory.push({
        date: dateStr,
        score: stats.averageScore,
        words: stats.totalWords
      });
    }
    
    setPracticeHistory(updatedHistory);
    
    toast.success(`练习完成！你的平均分为：${stats.averageScore}分`);
  };
  
  // 处理返回
  const handleBack = () => {
    // 确保关闭麦克风
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    navigate('/');
  };
  
  // 组件卸载时关闭麦克风
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
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
          <h1 className="text-xl font-bold">发音练习</h1>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-grow p-6">
        {!isPracticing ? (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-2 text-blue-500 mb-1">
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="text-sm font-medium">平均评分</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{averageScore}</span>
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>分</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <i className="fa-solid fa-trophy"></i>
                  <span className="text-sm font-medium">最高评分</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{highestScore}</span>
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>分</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <i className="fa-solid fa-book"></i>
                  <span className="text-sm font-medium">练习单词</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{totalPracticeWords}</span>
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-2 text-purple-500 mb-1">
                  <i className="fa-solid fa-calendar-days"></i>
                  <span className="text-sm font-medium">练习天数</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{practiceHistory.length}</span>
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>天</span>
                </div>
              </div>
            </div>

            {/* 练习历史图表 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-blue-500"></i>
                练习历史
              </h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={practiceHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                    <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        color: theme === 'dark' ? '#ffffff' : '#111827'
                      }} 
                    />
                    <Line type="monotone" dataKey="score" name="平均分" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="words" name="练习单词数" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 练习设置 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-purple-500"></i>
                练习设置
              </h2>
              
              {/* 练习模式选择 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">选择练习模式</h3>
                <div className="grid grid-cols-3 gap-3">
                  {practiceModes.map((mode) => (
                    <motion.button
                      key={mode.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-4 rounded-xl text-center ${
                        selectedMode === mode.id
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      <div className="flex justify-center mb-2">
                        <i className={`fa-solid ${mode.icon} text-xl`}></i>
                      </div>
                      <span>{mode.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* 难度选择 */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3">选择难度级别</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`px-4 py-2 rounded-full text-sm ${selectedDifficulty === level.id
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {level.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* 开始练习按钮 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartPractice}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
              >
                <i className="fa-solid fa-microphone"></i>
                开始发音练习
              </motion.button>
            </div>

            {/* 推荐练习 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-star text-yellow-500"></i>
                推荐练习单词
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredWords.slice(0, 10).map((word) => (
                  <motion.div
                    key={word.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl text-center ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-md`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        word.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        word.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        <i className="fa-solid fa-volume-high"></i>
                      </div>
                    </div>
                    <p className="font-medium">{word.word}</p>
                    <p className={`text-xs mt-1 ${
                      word.difficulty === 'easy' ? 'text-green-500' :
                      word.difficulty === 'medium' ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {word.difficulty === 'easy' ? '简单' :
                       word.difficulty === 'medium' ? '中等' :
                       '困难'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : !showResults ? (
          // 练习进行中
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-full max-w-md rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl p-8 text-center`}
            >
              <h2 className="text-2xl font-bold mb-8">发音练习</h2>
              
              {/* 单词显示 */}
              <div className="mb-10">
                <h3 className="text-4xl font-bold mb-2">{currentWord.word}</h3>
                <p className="text-gray-500 dark:text-gray-400 italic">第 {currentWordIndex + 1}/{filteredWords.length} 个单词</p>
              </div>
              
              {/* 难度指示器 */}
              <div className="mb-10">
                <div className={`inline-block px-4 py-2 rounded-full text-sm ${
                  currentWord.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  currentWord.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {currentWord.difficulty === 'easy' ? '简单' :
                   currentWord.difficulty === 'medium' ? '中等' :
                   '困难'}
                </div>
              </div>
              
              {/* 评分显示 */}
              {currentScore !== null && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-10"
                >
                  <div className={`text-5xl font-bold mb-2 ${
                    currentScore >= 90 ? 'text-green-500' :
                    currentScore >= 80 ? 'text-blue-500' :
                    currentScore >= 70 ? 'text-amber-500' :
                    'text-red-500'
                  }`}>
                    {currentScore}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">发音评分</p>
                </motion.div>
              )}
              
              {/* 录音按钮 */}
              {currentScore === null && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRecording}
                  className="w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                >
                  <i className="fa-solid fa-microphone text-3xl"></i>
                </motion.button>
              )}
              
              {/* 退出按钮 */}
              <button 
                onClick={() => {
                  if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                  }
                  setIsPracticing(false);
                }}
                className={`mt-8 text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              >
                退出练习
              </button>
            </motion.div>
          </div>
        ) : (
          // 练习结果
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-full max-w-md rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl p-8 text-center`}
            >
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500 flex items-center justify-center text-white text-3xl mb-4">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h2 className="text-2xl font-bold">练习完成！</h2>
              </div>
              
              {/* 练习统计 */}
              <div className="space-y-4 mb-8">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">平均评分</p>
                  <p className="text-3xl font-bold">{practiceStats.averageScore}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">练习单词</p>
                    <p className="text-xl font-bold">{practiceStats.totalWords}</p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">正确发音</p>
                    <p className="text-xl font-bold">{practiceStats.correctPronunciations}</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">最高评分</p>
                  <p className="text-2xl font-bold">{practiceStats.highestScore}</p>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsPracticing(false)}
                  className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  返回主界面
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartPractice}
                  className={`w-full py-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  再次练习
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* 页脚 */}
       <footer className={`border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'} py-4 px-6 text-center text-sm`}>
        <p>SpeakBuddy - 沉浸式英语学习平台</p>
      </footer>
    </div>
  );
};

export default PronunciationPage;