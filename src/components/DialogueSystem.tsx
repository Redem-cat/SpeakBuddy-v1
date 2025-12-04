import { useState, useRef, useEffect } from 'react';
import { useLearningContext } from '@/contexts/learningContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

  // 预设快捷语句
  const QUICK_PHRASES = {
    restaurant: {
      customer: [
        'Could I see the menu, please?',
        'What would you recommend today?',
        'Can I have the steak medium-rare?',
        'Do you have any vegetarian options?',
        'Could I get a glass of water, please?'
      ],
      waiter: [
        'Welcome to our restaurant! How many people are in your party?',
        'May I take your order?',
        'Would you like some wine with your meal?',
        'Is everything to your liking?',
        'Would you like dessert today?'
      ]
    },
    airport: {
      passenger: [
        'Where is the check-in counter for my flight?',
        'How many bags can I check for free?',
        'What time does boarding start?',
        'Is there a lounge I can use?',
        'What gate is my flight departing from?'
      ],
      checkin_agent: [
        'Good morning! May I see your passport and ticket?',
        'Would you like a window or aisle seat?',
        'Do you have any baggage to check?',
        'Your flight is on time. Have a nice trip!',
        'Your boarding pass and passport, please.'
      ]
    },
    taxi: {
      passenger: [
        'Could you take me to the central station?',
        'How much will the fare be?',
        'Is the meter running?',
        'Could you drive a bit faster? I\'m in a hurry.',
        'Could you please stop here?'
      ],
      driver: [
        'Where to?',
        'Hop in!',
        'We should be there in about 15 minutes.',
        'That\'ll be $20, please.',
        'Do you need a receipt?'
      ]
    },
    hospital: {
      patient: [
        'I\'ve been feeling sick for a few days.',
        'I have a fever and a sore throat.',
        'How often should I take this medication?',
        'Is there anything I should avoid eating?',
        'When should I come back for a follow-up?'
      ],
      doctor: [
        'What seems to be the problem?','How long have you been experiencing these symptoms?',
        'Let me examine you.',
        'I\'ll prescribe some medication for you.',
        'You should rest and drink plenty of fluids.'
      ],
      nurse: [
        'I\'m here to take your vital signs.',
        'The doctor will see you shortly.',
        'Please take this medication after meals.',
        'Do you have any allergies?',
        'Let me bandage that wound for you.'
      ]
    },
    coffee_shop: {
      customer: [
        'Can I get a latte, please?',
        'What\'s your special today?',
        'Can I have it with almond milk?',
        'Do you have any pastries?',
        'How much is this?'
      ],
      barista: [
        'Welcome! What can I get for you today?',
        'Would you like that hot or iced?',
        'Do you want any syrup in it?',
        'That\'ll be $4.50, please.',
        'Enjoy your coffee!'
      ]
    },
    store: {
      customer: [
        'Where are the fitting rooms?',
        'Do you have this in a smaller size?',
        'Is there a discount on this item?',
        'Can I pay with a credit card?',
        'Do you offer refunds?',
      ],
      salesperson: [
        'Can I help you find anything?',
        'What size are you looking for?',
        'This style is very popular right now.',
        'We have a sale going on this week.',
        'Would you like me to gift-wrap it?',
      ]
    },
    business: {
      participant: [
        'Could you elaborate on that point?',
        'What are our next steps?',
        'I agree with your assessment.',
        'We need to consider the budget constraints.',
        'Let\'s schedule a follow-up meeting.'
      ],
      presenter: [
        'Let me walk you through our proposal.',
        'As you can see from the chart...',
        'Our key objectives are...',
        'This will help us achieve...',
        'Are there any questions so far?'
      ],
      chair: [
        'Let\'s get started with today\'s agenda.',
        'First, let\'s hear from the marketing team.',
        'Could you summarize the main points?',
        'Let\'s move on to the next item.',
        'Thank you everyone for your contributions.'
      ]
    },
    default: [
      'Could you please explain that in more detail?',
      'I understand what you mean.',
      'That\'s a great point!',
      'I have a question about that.',
      'I agree with you completely.'
    ]
  };

  const DialogueSystem: React.FC = () => {
  const { scene, dialogues, bilingualMode, setBilingualMode, handleAddMessage, selectedRole, aiRole } = useLearningContext();
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [typingError, setTypingError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogues]);

  // 模拟实时纠错
  useEffect(() => {
    // 简单的模拟纠错逻辑 - 实际应用中可以集成更复杂的语法检查库
    const errorWords = ['teh', 'wrok', 'beleive', 'recieve', 'adress'];
    const lowerMessage = message.toLowerCase();
    
    for (const error of errorWords) {
      if (lowerMessage.includes(error)) {
        setTypingError(`您可能拼写错误："${error}"，正确拼写可能是：` + 
          (error === 'teh' ? 'the' : error === 'wrok' ? 'work' : 
           error === 'beleive' ? 'believe' : error === 'recieve' ? 'receive' : 'address'));
        return;
      }
    }
    
    setTypingError(null);
  }, [message]);

  // 处理发送消息
  const handleSendMessage = () => {
    if (message.trim()) {
      handleAddMessage(message.trim());
      setMessage('');
      setTypingError(null);
      setShowQuickPhrases(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理快捷语句选择
  const handleQuickPhraseSelect = (phrase: string) => {
    setMessage(phrase);
    setShowQuickPhrases(false);
  };

  if (!scene) return null;

    // 获取当前场景和角色的快捷语句
    const sceneQuickPhrases = QUICK_PHRASES[scene.id as keyof typeof QUICK_PHRASES] || {};
    const quickPhrases = selectedRole 
      ? (sceneQuickPhrases as any)[selectedRole] || QUICK_PHRASES.default 
      : QUICK_PHRASES.default;

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80'} backdrop-blur-sm rounded-xl shadow-lg overflow-hidden`}>
      {/* 对话历史区域 */}
       <div className="flex-grow overflow-y-auto p-4 space-y-6 no-scrollbar">
        {dialogues.map((msg, index) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'ai' ? 'flex gap-3' : ''}`}>
              {/* AI头像 */}
                   {msg.sender === 'ai' && (
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                       {msg.role && scene?.characters?.find((char: any) => char.id === msg.role)?.avatar || scene.aiAvatar}
                     </div>
                   )}
              
              {/* 消息内容 */}
              <div>
                {/* 角色名称 */}
                {msg.sender === 'ai' && (
                   <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                     {msg.role && scene?.characters?.find((char: any) => char.id === msg.role)?.name || scene.aiName}
                   </div>
                )}
                
                {/* 消息气泡 */}
                <div 
                  className={`p-3 rounded-xl ${
                    msg.sender === 'ai' 
                      ? `${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-tl-none` 
                      : `${theme === 'dark' ? 'bg-blue-800 text-blue-50' : 'bg-blue-500 text-white'} rounded-tr-none`
                  }`}
                >
                  {/* 英语文本 */}
                  <p className="font-medium">{msg.text}</p>
                  
                  {/* 中文翻译（如果开启双语模式） */}
                  <AnimatePresence>
                    {bilingualMode && msg.translation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-2 text-sm ${
                          theme === 'dark' 
                            ? 'text-gray-300' 
                            : msg.sender === 'ai' 
                              ? 'text-gray-600' 
                              : 'text-blue-100'
                        }`}
                      >
                        {msg.translation}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* 用于自动滚动的参考点 */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 快捷语句提示 */}
      <AnimatePresence>
        {showQuickPhrases && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex flex-wrap gap-2">
              {quickPhrases.map((phrase, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleQuickPhraseSelect(phrase)}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {phrase}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 输入区域 */}
       <div className={`p-4 border-t flex-shrink-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* 输入错误提示 */}
        {typingError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-500 mb-2"
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            {typingError}
          </motion.div>
        )}
        
        <div className="flex items-center gap-2">
          {/* 快捷语句按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQuickPhrases(!showQuickPhrases)}
            className={`p-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
            aria-label="Toggle quick phrases"
          >
            <i className="fa-solid fa-comment-dots"></i>
          </motion.button>
          
          {/* 双语切换按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setBilingualMode(!bilingualMode)}
            className={`p-2 rounded-full ${
              bilingualMode 
                ? 'bg-blue-500 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
            aria-label="Toggle bilingual mode"
          >
            <i className="fa-solid fa-language"></i>
          </motion.button>
          
          {/* 输入框 */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的回复..."
            className={`flex-grow px-4 py-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-gray-100 text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow`}
          />
          
          {/* 发送按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${
              message.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-500' 
                  : 'bg-gray-100 text-gray-400'
            } transition-colors`}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DialogueSystem;