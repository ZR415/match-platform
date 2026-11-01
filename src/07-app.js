/* ============================================================
   App：路由栈 + 全局状态
   ============================================================ */

/* 支持通过分享链接直接进入深层页面：?page=detail&postId=1
   没有有效参数时从隐私引导页开始；此时页面栈只有一层，返回会兜底回广场 */
const VALID_PAGES = ['square', 'search', 'post', 'detail', 'match', 'messages', 'chat', 'profile', 'library', 'assets', 'favorites', 'otherProfile', 'help', 'ai', 'setup', 'auth', 'register', 'privacy', 'settings'];
const initialRoute = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    const page = q.get('page');
    if (page && VALID_PAGES.includes(page)) {
      const params = {};
      ['postId', 'userId', 'chatId'].forEach(k => { if (q.get(k)) params[k] = Number(q.get(k)); });
      ['type', 'mode', 'intent'].forEach(k => { if (q.get(k)) params[k] = q.get(k); });
      return [{ name: page, params }];
    }
  } catch (e) {}
  return [{ name: 'privacy', params: {} }];
};

/* 页面渲染函数必须定义在 App 外部：
   若在 App 内部声明成组件，App 每次 setState 都会生成新的组件类型，
   导致整棵子树卸载重挂，页面内副作用（如聊天已读、输入框）会陷入重挂死循环 */
const renderScreen = (route) => {
  switch (route.name) {
    case 'privacy': return <PrivacyPage />;
    case 'register': return <RegisterPage />;
    case 'auth': return <AuthPage />;
    case 'setup': return <ProfileSetupPage />;
    case 'square': return <SquarePage key={`sq-${route.params.intent || ''}`} />;
    case 'search': return <SearchPage />;
    case 'post': return <PostPage />;
    case 'detail': return <DetailPage />;
    case 'match': return <MatchPage />;
    case 'ai': return <AIPage />;
    case 'messages': return <MessagesPage />;
    case 'chat': return <ChatPage />;
    case 'profile': return <ProfilePage />;
    case 'library': return <InfoLibraryPage />;
    case 'assets': return <AssetListPage />;
    case 'favorites': return <FavoritesPage />;
    case 'otherProfile': return <OtherProfilePage />;
    case 'help': return <HelpPage />;
    case 'settings': return <SettingsPage />;
    default: return <SquarePage />;
  }
};

const App = () => {
  const [history, setHistory] = useState(initialRoute);
  const [posts, setPosts] = useState(POSTS);
  const [chats, setChats] = useState(CHATS_INIT);
  const [favPosts, setFavPosts] = useState([3, 7]);
  const [library, setLibrary] = useState(LIB_INIT);
  const [rated, setRated] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  /* 登录态 + 匹配流程状态都提升到全局：
     1) 匹配结果页跳转到他人主页/聊天页再返回时，phase 与结果数据不会因为组件重挂而丢失；
     2) 退出登录时可直接清空。 */
  const [loggedIn, setLoggedIn] = useState(true);
  const [matchFlow, setMatchFlow] = useState({
    phase: 'idle',      // idle | sourceView | weight | loading | result | empty
    source: 'profile',  // profile | post | manual
    selPost: null,
    intents: [],
    skills: [],
    targets: [],
    weight: '同校优先',
    pool: 0,
  });

  const [aiChat, setAiChat] = useState(() => ({
    square: AI_MSGS_INIT.square.map(m => ({ ...m })),
    profile: AI_MSGS_INIT.profile.map(m => ({ ...m })),
  }));
  const timerRef = useRef(null);

  const route = history[history.length - 1];

  /* 入栈：所有「点卡片 / 按钮 / 快捷指令」的跳转都走 push，绝不做 replace */
  const go = (name, params = {}) => setHistory(prev => [...prev, { name, params }]);

  /* 出栈：有上一页就精准退回；没有上一页（刷新/分享直进）则兜底回一级页 */
  const back = () => setHistory(prev => {
    if (prev.length > 1) return prev.slice(0, -1);
    return [{ name: 'square', params: {} }];
  });

  /* 底部 Tab：一级页面切换，清空页面栈，不产生可返回的历史 */
  const tab = (name, params = {}) => setHistory([{ name, params }]);

  /* 底部 + 号是「发帖弹层」，属于二级页面：压栈，关闭后回到原页面 */
  const onTab = (name) => {
    if (name === 'post') go('post');
    else tab(name);
  };

  const toast = (msg) => {
    setToastMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastMsg(null), 2100);
  };

  const toggleFav = (id) => {
    setFavPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const rateUser = (id) => setRated(prev => prev.includes(id) ? prev : [...prev, id]);

  const openChatWith = (userId, postId) => {
    const exist = chats.find(c => c.userId === userId);
    if (exist) { go('chat', { chatId: exist.id }); return; }
    const at = nowHM();
    const chat = {
      id: Date.now(),
      userId,
      postId,
      unread: 0,
      status: 'normal',
      dismissed: false,
      usedIce: [],
      messages: [
        { type: 'post', at },
        { type: 'text', self: true, text: '你好，我对这个帖子很感兴趣，方便聊聊吗？', at },
        { type: 'text', self: false, text: '可以的，你方便说下你的情况吗？', at },
      ],
    };
    setChats(prev => [chat, ...prev]);
    go('chat', { chatId: chat.id });
  };

  /* 会话关系状态：normal（正常，显示在消息列表）/ muted（静默，从消息列表隐藏，沉淀到沟通过） */
  const chatStatus = (chat) => (chat && chat.status) || (chat && chat.dismissed ? 'muted' : 'normal');
  const setChatStatus = (chatId, status) => {
    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, status, dismissed: status === 'muted' } : c)));
  };

  /* 退出登录：清空登录态与匹配流程，然后「替换」整个页面栈到隐私引导页。
     使用 tab() 等价于 replace —— 栈被重置为单层，按返回键无法回到已退出的设置页。 */
  const logout = () => {
    setLoggedIn(false);
    setMatchFlow({
      phase: 'idle', source: 'profile', selPost: null,
      intents: [], skills: [], targets: [], weight: '同校优先', pool: 0,
    });
    setHistory([{ name: 'privacy', params: {} }]);
    toast('已退出登录');
  };

  const ctx = {
    route, history, go, back, tab, onTab,
    posts, setPosts,
    chats, setChats,
    favPosts, toggleFav,
    library, setLibrary,
    rated, rateUser,
    toast,
    openChatWith,
    chatStatus,
    setChatStatus,
    aiChat, setAiChat,
    loggedIn, logout,
    matchFlow, setMatchFlow,
    isRoot: history.length === 1,
  };

  return (
    <AppCtx.Provider value={ctx}>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#E7EEEA] py-6">
        <div className="relative bg-white overflow-hidden" style={{ width: 390, height: 844, borderRadius: 44, boxShadow: '0 26px 70px rgba(15,60,45,0.22)' }}>
          <StatusBar light={route.name === 'privacy'} />
          {renderScreen(route)}
          {toastMsg && <Toast msg={toastMsg} />}
        </div>
      </div>
    </AppCtx.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
