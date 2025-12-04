import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { LearningContextProvider } from '@/contexts/learningContext';
import SceneHeader from '@/components/SceneHeader';
import DialogueSystem from '@/components/DialogueSystem';
import WordLearningPanel from '@/components/WordLearningPanel';
import ProgressTracker from '@/components/ProgressTracker';

import restaurantImg from '@/assets/images/restaurant.png';
import airportImg from '@/assets/images/airport.png';
import taxiImg from '@/assets/images/taxi.png';
import hospitalImg from '@/assets/images/hospital.png';
import coffeeShopImg from '@/assets/images/coffee_shop.png';
import storeImg from '@/assets/images/store.png';
import businessImg from '@/assets/images/business.png';
  // 场景数据
const SCENES = [
  {
    id: 'coffee_shop',
    title: '咖啡馆聊天',
    description: '在咖啡馆与朋友或店员交流，练习日常英语对话',
    level: '入门',
    vocabulary: '咖啡、饮品、聊天、休闲',
    background: coffeeShopImg , 
    characters: [
        { id: 'customer', name: '顾客', description: '在咖啡馆消费的顾客', avatar: '👤' },
        { id: 'barista', name: '咖啡师', description: '咖啡馆的工作人员', avatar: '☕' },
      ],
  },
  {
    id: 'store',
    title: '商场购物',
    description: '在商场购物时与店员交流，练习购物相关英语',
    level: '初级',
    vocabulary: '商品、价格、尺码、支付',
    background: storeImg ,
    characters: [
        { id: 'customer', name: '顾客', description: '在商店购物的顾客', avatar: '👜' },
        { id: 'salesperson', name: '店员', description: '商店的销售人员', avatar: '👨‍💼' },
      ],
  },
  {
    id: 'restaurant',
    title: '餐馆点餐',
    description: '在西餐厅体验点餐过程，练习餐饮相关英语表达',
    level: '初级',
    vocabulary: '菜单、食物、饮品、点餐用语',
    background: restaurantImg ,
    characters: [
        { id: 'customer', name: '顾客', description: '餐厅顾客，需要点餐和询问菜品', avatar: '👤' },
        { id: 'waiter', name: '服务员', description: '餐厅服务员，提供菜单和服务', avatar: '👨‍🍳' },
      ],
  },
  {
    id: 'taxi',
    title: '出租车出行',
    description: '乘坐出租车时与司机交流，练习方位和交通相关英语',
    level: '初级',
    vocabulary: '地点、方向、交通、时间',
    background: taxiImg ,
    characters: [
        { id: 'passenger', name: '乘客', description: '需要前往特定地点的乘客', avatar: '👤' },
        { id: 'driver', name: '司机', description: '出租车司机，提供接送服务', avatar: '🚕' },
      ],
  },
  {
    id: 'airport',
    title: '机场办理',
    description: '在机场办理登机手续，练习旅行相关英语对话',
    level: '中级',
    vocabulary: '登机、行李、航班、航站楼',
    background: airportImg ,
    characters: [
        { id: 'passenger', name: '乘客', description: '需要办理登机手续的旅客', avatar: '🧳' },
        { id: 'checkin_agent', name: '地勤人员', description: '机场办理登机手续的工作人员', avatar: '👩‍✈️' },
      ],
  },
  {
    id: 'hospital',
    title: '医院就诊',
    description: '在医院看病时与医生交流，学习医疗相关英语表达',
    level: '中级',
    vocabulary: '症状、疾病、药品、治疗',
    background: hospitalImg,
    characters: [
        { id: 'patient', name: '病人', description: '前往医院就诊的患者', avatar: '🤒' },
        { id: 'doctor', name: '医生', description: '为病人诊断和治疗的医生', avatar: '👨‍⚕️' },
        { id: 'nurse', name: '护士', description: '协助医生并照顾病人的护士', avatar: '👩‍⚕️' },
      ],
  },
  {
    id: 'business',
    title: '商务会议',
    description: '参与商务会议，学习商务英语表达和谈判技巧',
    level: '高级',
    vocabulary: '商务术语、会议用语、谈判技巧',
    background: businessImg,
    characters: [
        { id: 'participant', name: '参会者', description: '参加会议的商务人士', avatar: '👨‍💼' },
        { id: 'presenter', name: '主讲人', description: '在会议上做演示的人', avatar: '📊' },
        { id: 'chair', name: '主持人', description: '主持会议的人', avatar: '👥' },
      ],
  },
];

  // 模拟对话数据
  const generateMockDialogues = (sceneId: string, userRole: string) => {
    const dialogues = {
      restaurant: {
        customer: [
          { id: 1, sender: 'ai', text: 'Good evening! Welcome to our restaurant. May I show you to your table?', translation: '晚上好！欢迎光临我们的餐厅。我可以带您到座位吗？', role: 'waiter' },
          { id: 2, sender: 'user', text: 'Yes, thank you. Can we get a table by the window?', translation: '好的，谢谢。我们能要一张靠窗的桌子吗？', role: 'customer' },
          { id: 3, sender: 'ai', text: 'Of course! Right this way, please. Here\'s our menu. Would you like to start with some drinks?', translation: '当然可以！这边请。这是我们的菜单。您想先喝点什么吗？', role: 'waiter' },
        ],
        waiter: [
          { id: 1, sender: 'ai', text: 'Good evening! My name is John. I\'m here to enjoy a nice dinner. Do you have any recommendations?', translation: '晚上好！我叫约翰。我来这里享用一顿美味的晚餐。你有什么推荐吗？', role: 'customer' },
          { id: 2, sender: 'user', text: 'Welcome, John! Our chef\'s special tonight is the grilled salmon with lemon butter sauce. It\'s very popular.', translation: '欢迎，约翰！我们今晚的主厨推荐是烤三文鱼配柠檬黄油酱。非常受欢迎。', role: 'waiter' },
          { id: 3, sender: 'ai', text: 'That sounds delicious. I\'ll have that, please. What side dishes would you recommend?', translation: '听起来很美味。请给我来一份。你推荐什么配菜？', role: 'customer' },
        ]
      },
      airport: {
        passenger: [
          { id: 1, sender: 'ai', text: 'Good morning! Welcome to Sky Airlines. May I see your passport and flight ticket, please?', translation: '早上好！欢迎光临天空航空公司。请出示您的护照和机票好吗？', role: 'checkin_agent' },
          { id: 2, sender: 'user', text: 'Good morning! Here you are. I\'m flying to New York today.', translation: '早上好！给你。我今天要飞往纽约。', role: 'passenger' },
          { id: 3, sender: 'ai', text: 'Thank you. Let me check... Your flight is on time. How many bags would you like to check in?', translation: '谢谢。让我查一下...您的航班准点。您有多少件行李要托运？', role: 'checkin_agent' },
        ],
        checkin_agent: [
          { id: 1, sender: 'ai', text: 'Hi there! I\'m flying to London today. How do I check in for my flight?', translation: '你好！我今天要飞往伦敦。我该如何办理登机手续？', role: 'passenger' },
          { id: 2, sender: 'user', text: 'Hello! I can help you with that. May I see your passport and flight details, please?', translation: '你好！我可以帮你办理。请出示您的护照和航班信息好吗？', role: 'checkin_agent' },
          { id: 3, sender: 'ai', text: 'Sure, here you go. I have one suitcase to check in.', translation: '当然，给你。我有一个手提箱要托运。', role: 'passenger' },
        ]
      },
      taxi: {
        passenger: [
          { id: 1, sender: 'ai', text: 'Hello! Where are you heading today?', translation: '你好！今天你要去哪里？', role: 'driver' },
          { id: 2, sender: 'user', text: 'Hi! I need to get to the central station. What\'s the fare?', translation: '你好！我需要去中央车站。费用是多少？', role: 'passenger' },
          { id: 3, sender: 'ai', text: 'It should be around $15, depending on traffic. Hop in, please!', translation: '视交通情况而定，大约15美元。请上车！', role: 'driver' },
        ],
        driver: [
          { id: 1, sender: 'ai', text: 'Hi driver! Can you take me to the airport, please? I\'m in a bit of a hurry.', translation: '嗨，司机！请你送我去机场好吗？我有点赶时间。', role: 'passenger' },
          { id: 2, sender: 'user', text: 'No problem! Buckle up and I\'ll get you there as quickly as possible. Which terminal do you need?', translation: '没问题！系好安全带，我会尽快送你到那里。你需要去哪个航站楼？', role: 'driver' },
          { id: 3, sender: 'ai', text: 'Terminal 3, please. How long do you think it will take?', translation: '请去3号航站楼。你认为需要多长时间？', role: 'passenger' },
        ]
      },
      hospital: {
        patient: [
          { id: 1, sender: 'ai', text: 'Good morning. I\'m Dr. Smith. What seems to be the problem today?', translation: '早上好。我是史密斯医生。今天有什么不舒服吗？', role: 'doctor' },
          { id: 2, sender: 'user', text: 'Good morning, doctor. I\'ve been feeling feverish and have a sore throat for the past two days.', translation: '早上好，医生。过去两天我一直发烧，喉咙痛。', role: 'patient' },
          { id: 3, sender: 'ai', text: 'Let me check your temperature and examine your throat. Please open wide...', translation: '让我量一下你的体温，检查一下你的喉咙。请张大嘴...', role: 'doctor' },
        ],
        doctor: [
          { id: 1, sender: 'ai', text: 'Hello doctor. I\'ve been having a terrible headache and feeling dizzy.', translation: '你好，医生。我头痛得厉害，感觉头晕。', role: 'patient' },
          { id: 2, sender: 'user', text: 'Hello. I\'m Dr. Johnson. How long have you been experiencing these symptoms?', translation: '你好。我是约翰逊医生。你出现这些症状有多久了？', role: 'doctor' },
          { id: 3, sender: 'ai', text: 'About three days now. It started with a mild headache, but it\'s getting worse.', translation: '大约三天了。一开始只是轻微头痛，但现在越来越严重了。', role: 'patient' },
        ],
        nurse: [
          { id: 1, sender: 'ai', text: 'Nurse, I don\'t feel well. My stomach is hurting a lot.', translation: '护士，我感觉不舒服。我的胃疼得很厉害。', role: 'patient' },
          { id: 2, sender: 'user', text: 'I\'m Nurse Lisa. I\'ll let the doctor know. Can you tell me more about your pain?', translation: '我是丽莎护士。我会告诉医生的。你能详细说说你的疼痛情况吗？', role: 'nurse' },
          { id: 3, sender: 'ai', text: 'It\'s a sharp pain in my upper abdomen. It started after lunch.', translation: '上腹部剧痛。午饭后开始的。', role: 'patient' },
        ]
      },
      coffee_shop: {
        customer: [
          { id: 1, sender: 'ai', text: 'Welcome to Brew Haven! What can I get for you today?', translation: '欢迎来到Brew Haven！今天我能为您做些什么？', role: 'barista' },
          { id: 2, sender: 'user', text: 'Hi! I\'d like a latte, please. With almond milk if possible.', translation: '你好！我想要一杯拿铁。如果可能的话，用杏仁奶。', role: 'customer' },
          { id: 3, sender: 'ai', text: 'Absolutely! A latte with almond milk. Would you like anything else? A pastry or a cookie?', translation: '当然可以！一杯杏仁奶拿铁。你还想要别的吗？糕点或饼干？', role: 'barista' },
        ],
        barista: [
          { id: 1, sender: 'ai', text: 'Hey there! What\'s your specialty today? I\'m looking for something new.', translation: '嘿！今天有什么特色饮品？我想尝试点新的东西。', role: 'customer' },
          { id: 2, sender: 'user', text: 'We have a new seasonal special: the pumpkin spice latte. It\'s very popular right now.', translation: '我们有一款新的季节性特色饮品：南瓜香料拿铁。现在非常受欢迎。', role: 'barista' },
          { id: 3, sender: 'ai', text: 'That sounds perfect! I\'ll try that. Make it a large, please.', translation: '听起来很完美！我要试试那个。请做成大杯的。', role: 'customer' },
        ]
      },
      store: {
        customer: [
          { id: 1, sender: 'ai', text: 'Welcome to Style Shop! Is there anything specific you\'re looking for today?', translation: '欢迎来到Style Shop！今天您有什么特别想找的吗？', role: 'salesperson' },
          { id: 2, sender: 'user', text: 'Hi! I\'m looking for a new winter jacket. Do you have any recommendations?', translation: '你好！我想买一件新的冬季夹克。你有什么推荐吗？', role: 'customer' },
          { id: 3, sender: 'ai', text: 'Absolutely! We have a great selection over here. What size do you wear?', translation: '当然！我们这边有很多选择。您穿什么尺码？', role: 'salesperson' },
        ],
        salesperson: [
          { id: 1, sender: 'ai', text: 'Excuse me, could you help me find a dress for a formal event?', translation: '打扰一下，你能帮我找一件正式场合穿的连衣裙吗？', role: 'customer' },
          { id: 2, sender: 'user', text: 'Of course! I\'d be happy to help. What style are you looking for? Long or short?', translation: '当然可以！我很乐意帮忙。您想要什么风格的？长款还是短款？', role: 'salesperson' },
          { id: 3, sender: 'ai', text: 'I think a long dress would be better. Maybe something in navy blue?', translation: '我觉得长款会更好。也许是藏青色的？', role: 'customer' },
        ]
      },
      business: {
        participant: [
          { id: 1, sender: 'ai', text: 'Good morning everyone. Let\'s start our meeting. First, I\'d like to hear updates from each team.', translation: '大家早上好。让我们开始会议。首先，我想听听每个团队的最新情况。', role: 'chair' },
          { id: 2, sender: 'user', text: 'Good morning. Our team has made significant progress on the marketing campaign. We\'re ready to launch next week.', translation: '早上好。我们团队在营销活动方面取得了重大进展。我们准备下周启动。', role: 'participant' },
          { id: 3, sender: 'ai', text: 'Excellent news! Could you share some key details about the campaign strategy?', translation: '好消息！你能分享一些关于活动策略的关键细节吗？', role: 'chair' },
        ],
        presenter: [
          { id: 1, sender: 'ai', text: 'Now, let\'s welcome our product manager to present the new features.', translation: '现在，让我们欢迎我们的产品经理来介绍新功能。', role: 'chair' },
          { id: 2, sender: 'user', text: 'Thank you. Today I\'ll be presenting our Q4 roadmap. Let me start with an overview of our key objectives...', translation: '谢谢。今天我将介绍我们的第四季度路线图。让我先概述一下我们的关键目标...', role: 'presenter' },
          { id: 3, sender: 'ai', text: 'That looks impressive. Could you elaborate on the timeline for the mobile app update?', translation: '看起来很令人印象深刻。你能详细说明一下移动应用更新的时间线吗？', role: 'participant' },
        ],
        chair: [
          { id: 1, sender: 'ai', text: 'Thanks for organizing this meeting. I think we need to discuss the budget allocation first.', translation: '谢谢你组织这次会议。我认为我们首先需要讨论预算分配问题。', role: 'participant' },
          { id: 2, sender: 'user', text: 'Thank you for joining today. Let\'s start with the agenda. First item: budget allocation for Q3.', translation: '感谢今天的参与。让我们从议程开始。第一项：第三季度的预算分配。', role: 'chair' },
          { id: 3, sender: 'ai', text: 'Our team has prepared a detailed proposal. Would you like me to walk everyone through it?', translation: '我们团队已经准备了一份详细的提案。你想让我向大家详细介绍一下吗？', role: 'participant' },
        ]
      },
    };
  
  return dialogues[sceneId as keyof typeof dialogues] || dialogues['restaurant'];
};

  // 模拟单词数据
  const generateMockWords = (sceneId: string) => {
    const words = {
      restaurant: [
        { id: 1, word: 'menu', pronunciation: '/ˈmenjuː/', meaning: '菜单', example: 'Can I see the menu, please?', progress: 0 },
        { id: 2, word: 'order', pronunciation: '/ˈɔːrdər/', meaning: '点餐', example: 'I\'d like to order the steak.', progress: 0 },
        { id: 3, word: 'recommend', pronunciation: '/ˌrekəˈmend/', meaning: '推荐', example: 'What would you recommend?', progress: 0 },
      ],
      airport: [
        { id: 1, word: 'boarding pass', pronunciation: '/ˈbɔːrdɪŋ pæs/', meaning: '登机牌', example: 'Do I need to print my boarding pass?', progress: 0 },
        { id: 2, word: 'check in', pronunciation: '/tʃek ɪn/', meaning: '办理登机手续', example: 'When should I check in for my flight?', progress: 0 },
        { id: 3, word: 'baggage', pronunciation: '/ˈbæɡɪdʒ/', meaning: '行李', example: 'How many pieces of baggage can I check?', progress: 0 },
      ],
      taxi: [
        { id: 1, word: 'fare', pronunciation: '/fer/', meaning: '费用', example: 'What\'s the fare to the airport?', progress: 0 },
        { id: 2, word: 'destination', pronunciation: '/ˌdestɪˈneɪʃn/', meaning: '目的地', example: 'My destination is the central station.', progress: 0 },
        { id: 3, word: 'traffic', pronunciation: '/ˈtræfɪk/', meaning: '交通', example: 'Is there a lot of traffic today?', progress: 0 },
      ],
      hospital: [
        { id: 1, word: 'symptom', pronunciation: '/ˈsɪmptəm/', meaning: '症状', example: 'What are your symptoms?', progress: 0 },
        { id: 2, word: 'prescription', pronunciation: '/prɪˈskrɪpʃn/', meaning: '处方', example: 'The doctor gave me a prescription.', progress: 0 },
        { id: 3, word: 'examine', pronunciation: '/ɪɡˈzæmɪn/', meaning: '检查', example: 'The doctor will examine you now.', progress: 0 },
      ],
      coffee_shop: [
        { id: 1, word: 'latte', pronunciation: '/ˈlɑːteɪ/', meaning: '拿铁咖啡', example: 'I\'d like a latte with almond milk.', progress: 0 },
        { id: 2, word: 'pastry', pronunciation: '/ˈpeɪstri/', meaning: '糕点', example: 'Can I get a pastry with my coffee?', progress: 0 },
        { id: 3, word: 'barista', pronunciation: '/bəˈriːstə/', meaning: '咖啡师', example: 'The barista makes excellent coffee.', progress: 0 },
      ],
      store: [
        { id: 1, word: 'size', pronunciation: '/saɪz/', meaning: '尺码', example: 'What size do you wear?', progress: 0 },
        { id: 2, word: 'discount', pronunciation: '/ˈdɪskaʊnt/', meaning: '折扣', example: 'Is there a discount on this item?', progress: 0 },
        { id: 3, word: 'fitting room', pronunciation: '/ˈfɪtɪŋ ruːm/', meaning: '试衣间', example: 'Where is the fitting room?', progress: 0 },
      ],
      business: [
        { id: 1, word: 'update', pronunciation: '/ˈʌpdeɪt/', meaning: '更新', example: 'Could you give me an update on the project?', progress: 0 },
        { id: 2, word: 'launch', pronunciation: '/lɔːntʃ/', meaning: '推出', example: 'We plan to launch the new product next month.', progress: 0 },
        { id: 3, word: 'strategy', pronunciation: '/ˈstrætədʒi/', meaning: '策略', example: 'What\'s our marketing strategy?', progress: 0 },
      ],
    };
  
  return words[sceneId as keyof typeof words] || words['restaurant'];
};

const LearningScene = () => {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [scene, setScene] = useState<any>(null);
  const [dialogues, setDialogues] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [showWordPanel, setShowWordPanel] = useState(true);
  const [bilingualMode, setBilingualMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [aiRole, setAiRole] = useState<string>('');
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载数据
  useEffect(() => {
    if (!sceneId) {
      navigate('/');
      return;
    }

    // 查找场景数据
    const foundScene = SCENES.find(s => s.id === sceneId);
    if (!foundScene) {
      toast.error('场景不存在');
      navigate('/');
      return;
    }

    // 模拟加载延迟
    const timer = setTimeout(() => {
      setScene(foundScene);
      // 先不设置对话，等用户选择角色后再设置
      setWords(generateMockWords(sceneId));
      setIsLoading(false);
      // 默认显示角色选择界面
      setShowRoleSelection(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sceneId, navigate]);

  // 处理角色选择
  const handleRoleSelect = (roleId: string) => {
    if (!scene) return;
    
    // 设置用户选择的角色
    setSelectedRole(roleId);
    
    // 选择AI要扮演的角色（选择第一个可用的非用户角色）
    const aiAvailableRoles = scene.characters.filter((char: any) => char.id !== roleId);
    setAiRole(aiAvailableRoles[0]?.id || '');
    
    // 根据选择的角色生成对话
      const dialoguesObj = generateMockDialogues(sceneId as string, roleId);
      setDialogues(dialoguesObj[roleId as keyof typeof dialoguesObj] || []);
    
    // 隐藏角色选择界面，开始对话
    setShowRoleSelection(false);
  };

// 处理沉浸式模式切换
  const toggleImmersiveMode = () => {
    if (isImmersiveMode) {
      // 当前是沉浸模式 -> 执行退出逻辑
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
      setIsImmersiveMode(false);
    } else {
      // 当前是普通模式 -> 执行进入逻辑
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`全屏模式错误: ${err.message}`);
      });
      setIsImmersiveMode(true);
    }
  };

  // 退出全屏时重置沉浸式模式
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsImmersiveMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 处理返回首页
  const handleBackToHome = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/');
  };

  // 处理添加新对话
  const handleAddMessage = (text: string) => {
    const newUserMessage = {
      id: dialogues.length + 1,
      sender: 'user',
      text,
      translation: '这是您的消息翻译示例',
      role: selectedRole,
    };
    
    setDialogues([...dialogues, newUserMessage]);
    
    // 模拟AI回复延迟
    setTimeout(() => {
      const newAIMessage = {
        id: dialogues.length + 2,
        sender: 'ai',
        text: generateAiResponse(sceneId as string, selectedRole, text),
        translation: generateChineseResponse(sceneId as string, selectedRole, text),
        role: aiRole,
      };
      setDialogues(prev => [...prev, newAIMessage]);
    }, 1500);
  };

  // 生成AI回复（根据场景和角色）
  const generateAiResponse = (sceneId: string, userRole: string, userMessage: string) => {
    // 简单根据场景和角色生成不同的回复
    const responses: Record<string, Record<string, string[]>> = {
      restaurant: {
        customer: [
          'Your order will be ready in about 15 minutes. Would you like some bread while you wait?',
          'I\'m happy to hear that! Is there anything else I can get for you?',
          'Our chef makes the best desserts. Would you like to see the dessert menu?',
        ],
        waiter: [
          'That sounds delicious. Can I also get a glass of red wine to go with it?',
          'The service here is excellent. How long have you been working here?',
          'I think I\'m ready for the bill now. Could you bring it please?',
        ],
      },
      airport: {
        passenger: [
          'Here\'s your boarding pass. Your gate is A12, and boarding starts in 45 minutes.',
          'Your luggage will be checked through to your final destination. Have a nice flight!',
          'If you need any assistance in the terminal, please don\'t hesitate to ask our staff.',
        ],
        checkin_agent: [
          'Thank you. How much time should I allow to get to the gate?',
          'Is there a lounge I can use before my flight?',
          'What time do I need to be at the gate for boarding?',
        ],
      },
      taxi: {
        passenger: [
          'We should be there in about 20 minutes if traffic stays good.',
          'Would you like me to take the highway to get there faster?',
          'Here we are. That\'ll be $15.50. Do you need a receipt?',
        ],
        driver: [
          'Could you please drive a bit slower? I\'m not in a hurry.',
          'Do you know any good restaurants in this area?',
          'How long have you been driving a taxi?',
        ],
      },
      // 其他场景的回复也可以在这里添加
    };

    const sceneResponses = responses[sceneId] || {};
    const roleResponses = sceneResponses[userRole] || [];
    
    if (roleResponses.length > 0) {
      // 随机选择一个回复
      return roleResponses[Math.floor(Math.random() * roleResponses.length)];
    }
    
    // 默认回复
    return 'Thank you for sharing that with me! Could you tell me more about it?';
  };

  // 生成中文翻译回复
  const generateChineseResponse = (sceneId: string, userRole: string, userMessage: string) => {
    // 简单根据场景和角色生成不同的回复翻译
    const translations: Record<string, Record<string, string[]>> = {
      restaurant: {
        customer: [
          '您的订单将在15分钟左右准备好。您想在等待时来点面包吗？',
          '很高兴听到您这么说！我还能为您拿点什么吗？',
          '我们的厨师做的甜点最好吃。您想看看甜点菜单吗？',
        ],
        waiter: [
          '听起来很美味。我还能来一杯红葡萄酒搭配吗？',
          '这里的服务很棒。您在这里工作多久了？',
          '我想现在可以结账了。请拿账单给我好吗？',
        ],
      },
      airport: {
        passenger: [
          '这是您的登机牌。您的登机口是A12，登机将在45分钟后开始。',
          '您的行李将直接托运到您的最终目的地。祝您旅途愉快！',
          '如果您在航站楼内需要任何帮助，请随时询问我们的工作人员。',
        ],
        checkin_agent: [
          '谢谢。我需要留出多少时间到达登机口？',
          '在飞行前我可以使用休息室吗？',
          '我需要什么时候到达登机口准备登机？',
        ],
      },
      taxi: {
        passenger: [
          '如果交通保持良好，我们应该在20分钟左右到达那里。',
          '您想让我走高速公路更快到达那里吗？',
          '我们到了。总共是15.50美元。您需要收据吗？',
        ],
        driver: [
          '请您开慢一点好吗？我不赶时间。',
          '您知道这附近有什么好的餐厅吗？',
          '您开出租车多久了？',
        ],
      },
    };

    const sceneTranslations = translations[sceneId] || {};
    const roleTranslations = sceneTranslations[userRole] || [];
    
    if (roleTranslations.length > 0) {
      // 随机选择一个翻译
      return roleTranslations[Math.floor(Math.random() * roleTranslations.length)];
    }
    
    // 默认翻译
    return '感谢您与我分享！您能告诉我更多关于它的信息吗？';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold">加载学习场景...</h2>
      </div>
    );
  }

  if (!scene) {
    return <div className="text-center text-xl py-10">场景加载失败</div>;
  }

  const learningContextValue = {
    scene,
    dialogues,
    words,
    isImmersiveMode,
    bilingualMode,
    setBilingualMode,
    handleAddMessage,
    toggleImmersiveMode,
    showWordPanel,
    setShowWordPanel,
    selectedRole,
    aiRole
  };

  return (
    <LearningContextProvider value={learningContextValue}>
      <div className={`min-h-screen flex flex-col ${isImmersiveMode ? 'overflow-hidden' : ''}`}>
        {/* 背景图 */}
        <div 
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${scene.background})`,
            filter: theme === 'dark' ? 'brightness(0.7)' : 'brightness(0.95)',
            transform: 'scale(1.02)', // 轻微放大增加沉浸感
          }}
        />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        
        {/* 场景头部 */}
        <SceneHeader onBack={handleBackToHome} />
        
         <main className={`flex-grow h-0 w-full flex flex-col lg:flex-row p-2 lg:p-3 gap-3 overflow-hidden relative transition-all duration-300 ${isImmersiveMode ? 'opacity-0' : 'opacity-100'}`}>
           {/* 角色选择界面 */}
           {showRoleSelection && scene && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="flex-1 flex flex-col items-center justify-center"
             >
               <div className={`w-full max-w-md rounded-2xl ${theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm shadow-xl p-8 text-center`}>
                 <h2 className="text-2xl font-bold mb-6">选择角色</h2>
                 <p className="mb-8 text-gray-500 dark:text-gray-400">请选择您想扮演的角色，开始沉浸式对话练习</p>
                 
                 <div className="grid grid-cols-1 gap-4 mb-8">
                   {scene.characters.map((character: any) => (
                     <motion.button
                       key={character.id}
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.97 }}
                       onClick={() => handleRoleSelect(character.id)}
                       className={`p-5 rounded-xl flex flex-col items-center text-left ${
                         theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                       } transition-colors`}
                     >
                       <div className="text-4xl mb-3">{character.avatar}</div>
                       <h3 className="text-xl font-medium mb-1">{character.name}</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{character.description}</p>
                     </motion.button>
                   ))}
                 </div>
                 
                 <button
                   onClick={() => navigate('/')}
                   className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                 >
                   返回场景选择
                 </button>
               </div>
             </motion.div>
           )}
           
           {/* 对话界面 */}
           {!showRoleSelection && (
             <>
           {/* 中央对话区域 */}
          <div 
        className={`flex flex-col h-full transition-all duration-500 ease-in-out
          ${showWordPanel 
            ? 'w-full lg:w-[65%] xl:w-[70%]' // 有侧边栏时的宽度
            : 'w-full max-w-5xl mx-auto'     // 无侧边栏时：全宽但限制最大宽 + 居中
          }
        `}
      >
        <DialogueSystem />
      </div>
          
           {/* 右侧辅助功能区域 */}
          <div 
        className={`flex flex-col h-full transition-all duration-500 ease-in-out
          ${showWordPanel 
            ? 'w-full lg:w-[35%] xl:w-[30%] opacity-100' // 显示状态
            : 'w-0 opacity-0 overflow-hidden p-0 m-0 border-0' // 隐藏状态：完全塌缩
          }
        `}
      >
            {/* 单词学习面板 */}
             <div className="h-full flex flex-col gap-4">
           <AnimatePresence mode="wait">
             {showWordPanel && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="h-full" 
               >
                 <WordLearningPanel />
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </>
  )}
</main>
        
        {/* 学习进度追踪 */}
        {!isImmersiveMode && (
          <ProgressTracker />
        )}
        
              <AnimatePresence>
        {isImmersiveMode && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }} // 从下方滑入，像接电话一样
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col bg-gray-900/90 backdrop-blur-xl"
          >
            {/* 1. 背景装饰：巨大的模糊光晕，营造氛围 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

            {/* 2. 顶部信息栏 */}
            <div className="relative z-10 pt-12 px-6 flex justify-between items-start text-white/80">
              <div className="flex flex-col">
                <span className="text-sm font-medium tracking-widest uppercase opacity-70">Voice Call</span>
                <span className="text-xl font-bold">{scene?.title}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                04:20
              </div>
            </div>

            {/* 3. 中间核心区：AI 角色头像 + 实时字幕 */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8">
              
              {/* 角色头像 (带呼吸光环) */}
              <div className="relative">
                {/* 动态波纹 */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-400 rounded-full blur-xl"
                ></motion.div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  {/* 这里显示对方的头像，如果没有选角色，就显示默认图标 */}
                  {selectedRole && scene ? (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl">
                        {/* 查找 AI 的角色头像 */}
                        {scene.characters.find((c:any) => c.id === aiRole)?.avatar || '🤖'}
                      </div>
                  ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-5xl">?</div>
                  )}
                </div>
                <h3 className="text-center text-white text-2xl font-bold mt-6 drop-shadow-md">
                  {selectedRole && scene ? scene.characters.find((c:any) => c.id === aiRole)?.name : 'AI Assistant'}
                </h3>
                <p className="text-center text-blue-200 text-sm mt-1">Speaking...</p>
              </div>

              {/* 字幕区域 (显示最后一条 AI 的消息) */}
              <div className="w-full max-w-2xl text-center space-y-3">
                {dialogues.length > 0 ? (
                  <motion.div
                    key={dialogues[dialogues.length - 1].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                  >
                      <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                        "{dialogues[dialogues.length - 1].text}"
                      </p>
                      {/* 如果开启双语，显示中文 */}
                      {bilingualMode && (
                        <p className="text-gray-400 mt-3 text-base">
                          {dialogues[dialogues.length - 1].translation}
                        </p>
                      )}
                  </motion.div>
                ) : (
                  <p className="text-white/50">通话已连接，请开始说话...</p>
                )}
              </div>
            </div>

            {/* 4. 底部控制栏 (仿 iOS 通话界面) */}
            <div className="relative z-10 pb-12 px-6 flex justify-center items-end gap-6 md:gap-12">
              
              {/* 静音按钮 */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl group-hover:bg-white/20 transition-all">
                  <i className="fa-solid fa-microphone-slash"></i>
                </div>
                <span className="text-xs text-white/70">静音</span>
              </button>

              {/* 核心功能：挂断 (退出沉浸模式) */}
              <button 
                onClick={toggleImmersiveMode}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-red-500/40 transform group-hover:scale-110 transition-all">
                  <i className="fa-solid fa-phone-slash"></i>
                </div>
                <span className="text-xs text-white/70">结束通话</span>
              </button>

              {/* 切换字幕按钮 */}
              <button 
                onClick={() => setBilingualMode(!bilingualMode)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center text-xl transition-all ${bilingualMode ? 'bg-white text-gray-900' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                  <i className="fa-solid fa-language"></i>
                </div>
                <span className="text-xs text-white/70">{bilingualMode ? '隐藏翻译' : '显示翻译'}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </LearningContextProvider>
  );
};

export default LearningScene;