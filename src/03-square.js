/* ============================================================
   模块二：广场 / 搜索 / 发帖
   ============================================================ */

const CIRCLES = ['本校区', '本校', '同城高校', '同省高校', '全国高校', '自定义范围'];

const PostCard = ({ post, fav, onFav, onOpen, onAvatar }) => {
  const u = getUser(post.userId);
  const tags = [...post.skillTags, ...post.targetTags].slice(0, 4);
  return (
    <div onClick={onOpen} className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-transform duration-150 active:scale-95 cursor-pointer">
      <div className="flex items-start gap-2">
        <h3 className="flex-1 text-[16px] font-semibold text-[#1A2A22] leading-snug pr-1">
          <span className="text-[#2F6B4F]">【{post.cat}】</span>{post.title}
        </h3>
        <button
          onClick={(e) => { e.stopPropagation(); onFav(); }}
          className="w-7 h-7 -mt-0.5 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Icon name="star" size={19} fill={fav} className={fav ? 'text-[#FBBF24]' : 'text-[#CBD5D9]'} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {tags.map(t => (
          <span key={t} className="text-[11px] bg-[#F5F7F5] text-[#4A5551] px-2.5 py-1 rounded-full">#{t}</span>
        ))}
      </div>

      <div className="flex items-end justify-between mt-3.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <button onClick={(e) => { e.stopPropagation(); onAvatar(u.id); }} className="active:scale-95 transition-transform">
            <Avatar src={u.avatar} size={22} />
          </button>
          <span className="text-xs font-medium text-[#4A5551] max-w-[70px] truncate">{u.name}</span>
          {u.verified && <Icon name="shield-check" size={12} className="text-[#2F6B4F]" />}
        </div>
        <span className="text-[10px] text-[#B0BBB5] text-right leading-tight">{u.school}({u.campus})</span>
      </div>
    </div>
  );
};

const SquarePage = () => {
  const app = useApp();
  const [tab, setTab] = useState(app.route.params.intent || '队伍招募');
  const [circle, setCircle] = useState('本校');
  const [drawer, setDrawer] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [startD, setStartD] = useState('武侯区');
  const [endD, setEndD] = useState('双流区');

  const list = app.posts.filter(p => p.intent === tab && !p.closed);

  return (
    <Page tab="square">
      <div className="sticky top-0 z-10 bg-[#F5F7F5] px-4 pt-2 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RootBack />
            {['队伍招募', '个人寻伴'].map(t => (
              <button key={t} onClick={() => setTab(t)} className="relative pb-1.5">
                <span className={`text-2xl font-bold tracking-tight ${tab === t ? 'text-[#1A2A22]' : 'text-[#B0BBB5]'}`}>{t}</span>
                {tab === t && <span className="absolute bottom-0 left-0 w-6 h-[3px] bg-[#2F6B4F] rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => app.go('search')} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
              <Icon name="search" size={16} className="text-[#1A2A22]" />
            </button>
            <button onClick={() => app.go('ai', { mode: 'square' })} className="flex items-center gap-1.5 bg-white pl-2 pr-2.5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
              <Icon name="sparkles" size={13} className="text-[#8B5CF6]" />
              <span className="text-[11px] font-medium text-[#8B5CF6] whitespace-nowrap">找搭子</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <button onClick={() => { setCustomMode(false); setDrawer(true); }} className="flex items-center gap-1 text-xs font-medium text-[#1A2A22] active:scale-95 transition-transform">
            <Icon name="map-pin" size={13} className="text-[#2F6B4F]" />
            {circle}
            <Icon name="chevron-down" size={13} className="text-[#8C9A94]" />
          </button>
          <span className="text-xs text-[#8C9A94] font-medium">共 {list.length} 条</span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {list.length === 0 && (
          <EmptyState icon="inbox" title="这个分类还没有帖子" desc="换个分类看看，或者自己发一条招募" >
            <button onClick={() => app.go('post')} className="bg-[#2F6B4F] text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">去发帖</button>
          </EmptyState>
        )}
        {list.map(p => (
          <PostCard
            key={p.id}
            post={p}
            fav={app.favPosts.includes(p.id)}
            onFav={() => app.toggleFav(p.id)}
            onOpen={() => app.go('detail', { postId: p.id })}
            onAvatar={(uid) => app.go('otherProfile', { userId: uid })}
          />
        ))}
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title={customMode ? '自定义圈层范围' : '选择圈层'} h="62%">
        {!customMode ? (
          <div className="space-y-1.5">
            {CIRCLES.map(c => (
              <button
                key={c}
                onClick={() => { if (c === '自定义范围') { setCustomMode(true); } else { setCircle(c); setDrawer(false); } }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm transition-colors ${circle === c ? 'bg-[#E8F0EB] text-[#2F6B4F] font-semibold' : 'text-[#1A2A22] active:bg-[#F7FAF8]'}`}
              >
                <span>{c}</span>
                {circle === c ? <Icon name="check" size={16} className="text-[#2F6B4F]" /> : <Icon name="chevron-right" size={15} className="text-[#CBD5D9]" />}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-xs text-[#8C9A94] mb-3">选择起止区域，系统会按区域范围推荐搭子</p>
            <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-2xl p-4">
              <div className="flex-1">
                <div className="text-[11px] text-[#8C9A94] mb-1.5">起始区域</div>
                <select value={startD} onChange={e => setStartD(e.target.value)} className="w-full bg-white rounded-xl px-3 py-2.5 text-[13px] focus:outline-none">
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <Icon name="arrow-right" size={16} className="text-[#8C9A94] mt-4" />
              <div className="flex-1">
                <div className="text-[11px] text-[#8C9A94] mb-1.5">结束区域</div>
                <select value={endD} onChange={e => setEndD(e.target.value)} className="w-full bg-white rounded-xl px-3 py-2.5 text-[13px] focus:outline-none">
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setCustomMode(false)} className="flex-1 py-3 rounded-full bg-[#F5F7F5] text-[#4A5551] text-sm font-medium">返回</button>
              <button
                onClick={() => { setCircle(`${startD}-${endD}`); setDrawer(false); }}
                className="flex-1 py-3 rounded-full bg-[#2F6B4F] text-white text-sm font-semibold active:scale-95 active:bg-[#22503A] transition-all"
              >
                确认范围
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </Page>
  );
};

/* ---------------- 搜索页 ----------------
   1) Tab（搜帖子 / 搜用户）在输入框「上方」；
   2) 模糊匹配（includes + 别名），预设关键词一定能命中；
   3) 搜不到时用兜底数据，绝不留空白；
   4) 两套完全不同的热门标签 / 大家都在搜，随 Tab 联动。 */
const SEARCH_ALIAS = {
  '成信大': '成都信息工程大学',
  'cuit': '成都信息工程大学',
  '大创': '大创项目',
  '互联网+': '互联网+ 创新创业大赛',
};

const SEARCH_HOT = {
  post: ['大创招募', '蓝桥杯', '缺前端', '急招', '商赛', '科研项目'],
  user: ['Python', 'UI设计', '算法大佬', '靠谱队长', '国奖得主', '产品经理'],
};

const SEARCH_TRENDING = {
  post: ['成信大 大创 急招', '蓝桥杯 算法 组队', '挑战杯 找导师'],
  user: ['计科 前端 大二', '商赛 国奖 队友', '航空港 可靠队友'],
};

const searchTokens = (kw) => {
  const base = kw.trim().replace(/#/g, '').toLowerCase().split(/\s+/).filter(Boolean);
  const extra = base.map(t => SEARCH_ALIAS[t]).filter(Boolean).map(t => t.toLowerCase());
  return [...new Set([...base, ...extra])];
};

const SearchPage = () => {
  const app = useApp();
  const [kw, setKw] = useState('');
  const [type, setType] = useState('post'); // post | user

  const keyword = kw.trim();
  const showDefault = keyword.length === 0;
  const tokens = keyword ? searchTokens(keyword) : [];
  const hit = (haystack) => tokens.some(tok => haystack.toLowerCase().includes(tok));

  const allPosts = app.posts.filter(p => !p.closed);
  const matchedPosts = keyword ? allPosts.filter(p => {
    const u = getUser(p.userId);
    return hit([p.title, p.cat, p.intent, p.desc, u.name, u.school, ...p.projectTags, ...p.skillTags, ...p.targetTags].join(' '));
  }) : [];
  const matchedUsers = keyword ? USERS.filter(u =>
    hit([u.name, u.school, u.campus, u.major, u.grade, ...u.tags].join(' '))
  ) : [];

  /* 兜底：搜不到也至少给 3 条，避免 Demo 演示穿帮 */
  const fallbackPosts = allPosts.slice(0, 3);
  const fallbackUsers = USERS.slice(0, 3);
  const isPost = type === 'post';
  const exact = isPost ? matchedPosts : matchedUsers;
  const fallback = isPost ? fallbackPosts : fallbackUsers;
  const results = exact.length ? exact : fallback;
  const usedFallback = keyword && exact.length === 0;

  const applyKeyword = (t) => setKw(t);

  const headerTabs = [
    { k: 'post', label: '搜帖子' },
    { k: 'user', label: '搜用户' },
  ];

  return (
    <Page>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pt-2 pb-3 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        {/* 第一行：取消 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8C9A94] font-medium">搜索</span>
          <button onClick={() => app.back()} className="text-sm text-[#4A5551] active:scale-95 transition-transform">取消</button>
        </div>

        {/* 第二行：Tab 在输入框正上方 */}
        <div className="flex items-center gap-7 mt-1 mb-3">
          {headerTabs.map(t => {
            const on = type === t.k;
            return (
              <button key={t.k} onClick={() => setType(t.k)} className="relative pb-1.5">
                <span className={`text-lg ${on ? 'font-bold text-[#2F6B4F]' : 'font-medium text-[#A8B3AD]'}`}>{t.label}</span>
                {on && <span className="absolute bottom-0 left-0 w-7 h-[3px] bg-[#2F6B4F] rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* 第三行：输入框 + 搜索 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#F9FAFB] rounded-full px-4 py-2.5">
            <Icon name="search" size={16} className="text-[#A8B3AD]" />
            <input
              autoFocus
              value={kw}
              onChange={e => setKw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={isPost ? '搜索帖子标题、标签、竞赛…' : '搜索用户网名、学校、技能…'}
              className="flex-1 text-[13px] bg-transparent focus:outline-none"
            />
            {kw && (
              <button onClick={() => setKw('')}>
                <Icon name="x-circle" size={15} className="text-[#CBD5D9]" />
              </button>
            )}
          </div>
          <button onClick={() => { }} className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-full text-[13px] font-semibold active:scale-95 active:bg-[#22503A] transition-all">搜索</button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {showDefault ? (
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Icon name="flame" size={14} className="text-[#D97706]" />
              <span className="text-sm font-semibold text-[#1A2A22]">热门标签</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {SEARCH_HOT[type].map(t => (
                <button key={t} onClick={() => applyKeyword(t)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F2F5F3] text-[#4A5551] text-xs font-medium active:scale-95 transition-transform">
                  #{t}
                </button>
              ))}
            </div>

            <div className="mt-7 bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1.5 mb-3">
                <Icon name="trending-up" size={14} className="text-[#2F6B4F]" />
                <span className="text-sm font-semibold text-[#1A2A22]">大家都在搜</span>
              </div>
              <div className="space-y-1">
                {SEARCH_TRENDING[type].map((s, i) => (
                  <button key={s} onClick={() => applyKeyword(s)}
                    className="w-full flex items-center justify-between py-2 text-xs text-[#4A5551] active:opacity-70 transition-opacity">
                    <span className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center text-white ${i === 0 ? 'bg-[#F87171]' : i === 1 ? 'bg-[#FBBF24]' : 'bg-[#B0BBB5]'}`}>{i + 1}</span>
                      {s}
                    </span>
                    <Icon name="chevron-right" size={13} className="text-[#CBD5D9]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-1">
            <div className="text-xs text-[#8C9A94] font-medium mb-3">
              {usedFallback
                ? `关键词「${keyword}」没有完全命中，为你推荐 ${results.length} 个相关内容`
                : `为你找到 ${results.length} 个相关结果`}
            </div>

            {isPost ? (
              <div className="space-y-3">
                {results.map(p => (
                  <PostCard
                    key={p.id}
                    post={p}
                    fav={app.favPosts.includes(p.id)}
                    onFav={() => app.toggleFav(p.id)}
                    onOpen={() => app.go('detail', { postId: p.id })}
                    onAvatar={(uid) => app.go('otherProfile', { userId: uid })}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(u => (
                  <button key={u.id} onClick={() => app.go('otherProfile', { userId: u.id })}
                    className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center gap-3 transition-transform duration-150 active:scale-95">
                    <Avatar src={u.avatar} size={44} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-[#1A2A22]">{u.name}</span>
                        {u.verified && <Icon name="shield-check" size={13} className="text-[#2F6B4F]" />}
                      </div>
                      <div className="text-xs text-[#8C9A94] mt-1 truncate">{u.school} · {u.grade} · {u.major}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {u.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] bg-[#F5F7F5] text-[#4A5551] px-2 py-0.5 rounded-full">#{t}</span>)}
                      </div>
                    </div>
                    <Icon name="chevron-right" size={16} className="text-[#CBD5D9]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};

/* ---------------- 发帖页 ---------------- */
const PostPage = () => {
  const app = useApp();
  const [intent, setIntent] = useState('队伍招募');
  const [cat, setCat] = useState('蓝桥杯');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState([]);
  const [targets, setTargets] = useState([]);
  const [desc, setDesc] = useState('');
  const [imgs, setImgs] = useState([]);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);

  const [compOpen, setCompOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);

  const aiTimer = useRef(null);
  useEffect(() => () => { if (aiTimer.current) clearTimeout(aiTimer.current); }, []);

  const openAi = () => { setAiInput(''); setAiBusy(false); setVoiceOn(false); setAiOpen(true); };
  const closeAi = () => { if (aiBusy) return; setAiOpen(false); setVoiceOn(false); };

  /* 语音输入 Demo：2 秒后自动关闭并回填一句预埋文案 */
  const startVoice = () => {
    if (aiBusy) return;
    setVoiceOn(true);
    if (aiTimer.current) clearTimeout(aiTimer.current);
    aiTimer.current = setTimeout(() => {
      setAiInput('我想找个懂算法的队友，一起打蓝桥杯');
      setVoiceOn(false);
    }, 2000);
  };

  /* 一键转化：1.5s Loading → 润色文案回填到「详细描述」 */
  const aiGenerate = () => {
    const raw = aiInput.trim();
    if (!raw) return;
    setAiBusy(true);
    if (aiTimer.current) clearTimeout(aiTimer.current);
    aiTimer.current = setTimeout(() => {
      const isRecruit = intent === '队伍招募';
      const skillHit = ['前端', '后端', 'Python', 'UI设计', '算法', '数据分析', 'Java', 'React']
        .filter(k => raw.includes(k));
      const catHit = ['蓝桥杯', '大创', '挑战杯', '互联网+', '数学建模', 'ACM', '电子设计', '商赛']
        .find(k => raw.includes(k));
      if (catHit) setCat(catHit === '大创' ? '大创项目' : catHit);
      if (skillHit.length) setSkills(skillHit);

      const body = isRecruit
        ? `【项目背景】\n我们正在推进一个认真做的项目，目前已有基础方案与清晰的分工，需要补上关键的一环。\n\n【招募需求】\n${raw}\n\n【合作方式】\n每周固定投入时间，进度透明、分工明确，线上同步 + 线下讨论。\n\n【你能获得】\n一段完整的项目经历、可写进简历的实战成果，以及一群靠谱的队友。`
        : `【自我介绍】\n${raw}\n\n【我想找】\n一支真正想做事的队伍，方向不限，竞赛、大创、创业项目都可以。\n\n【时间投入】\n周中晚上与周末都在，每周可投入 8h 以上，能长期跟。\n\n【我能提供】\n按时交付、主动沟通，遇到问题一起解决。`;

      setDesc(body);
      setAiBusy(false);
      setAiOpen(false);
      setVoiceOn(false);
      app.toast('AI 已为你生成文案');
    }, 1500);
  };

  const publish = () => {
    const finalCat = cat || '自由发挥';
    if (!title.trim()) { app.toast('请填写小标题'); return; }
    if (!desc.trim()) { app.toast('请填写详细描述'); return; }
    const post = {
      id: Date.now(),
      userId: 15,
      intent,
      cat: finalCat,
      title: title.trim(),
      time: '刚刚',
      projectTags: [finalCat],
      skillTags: skills.length ? skills : ['不限技能'],
      targetTags: targets.length ? targets : ['不限要求'],
      desc: desc.trim(),
      iceBreakers: [
        `你好，我在${finalCat}方向有经验，可以聊聊吗？`,
        '请问目前项目进行到哪一步了？',
        '我时间比较稳定，可以长期跟',
      ],
      mine: true,
      closed: false,
    };
    app.setPosts(prev => [post, ...prev]);
    app.toast('发布成功');
    setTimeout(() => app.tab('square', { intent }), 300);
  };

  return (
    <Page
      contentPad="pb-6"
      overlays={
        <>
          {/* AI 帮写：真实 textarea + 语音 + 一键转化 */}
          {aiOpen && (
            <div className="absolute inset-0 z-[60] bg-[#0F1F19]/30 backdrop-blur-[6px] flex items-center justify-center px-5 fade-in"
              onClick={closeAi}>
              <div className="bg-white rounded-3xl w-full p-5 shadow-[0_20px_60px_rgba(15,40,30,0.18)] scale-in"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[16px] font-bold text-[#1A2A22]">
                    <Icon name="sparkles" size={17} className="text-[#8B5CF6]" /> AI 帮写招募文案
                  </div>
                  <button type="button" onClick={closeAi} className="w-8 h-8 -mr-1 flex items-center justify-center rounded-full active:bg-[#F5F7F5]">
                    <Icon name="x" size={18} className="text-[#8C9A94]" />
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    rows={5}
                    placeholder="请用大白话输入你的需求，例如：我想找个会前端的人一起打大创，我负责写文档"
                    className="w-full bg-[#F9FAFB] rounded-2xl px-4 py-3 pb-11 text-sm text-[#1A2A22] leading-relaxed placeholder:text-[#B0BBB5] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                  />
                  <button type="button" onClick={startVoice}
                    className="absolute right-3 bottom-3 inline-flex items-center gap-1 bg-[#E8F0EB] text-[#2F6B4F] text-[11px] font-medium px-2.5 py-1.5 rounded-full active:scale-95 transition-transform">
                    <Icon name="mic" size={12} /> 语音输入
                  </button>
                </div>

                {voiceOn && (
                  <div className="mt-3 flex items-center gap-2.5 bg-[#F5F7F5] rounded-2xl px-3.5 py-3 fade-in">
                    <div className="flex items-end gap-[3px] h-4">
                      {[0, 1, 2, 3, 4].map(i => (
                        <span key={i} className="w-[3px] h-4 bg-[#2F6B4F] rounded-full origin-bottom wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#4A5551]">语音输入中… 请说话</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={aiGenerate}
                  disabled={!aiInput.trim() || aiBusy}
                  className={`mt-4 w-full py-3.5 rounded-full text-[15px] font-bold transition-all flex items-center justify-center gap-2 ${(!aiInput.trim() || aiBusy) ? 'bg-[#E1E8E4] text-[#9FAEA7]' : 'bg-[#2F6B4F] text-white shadow-[0_8px_20px_rgba(47,107,79,0.2)] active:scale-95 active:bg-[#22503A]'}`}
                >
                  {aiBusy ? (
                    <>
                      <Icon name="loader" size={16} className="animate-spin" /> AI 正在润色中…
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size={16} /> 一键转化
                    </>
                  )}
                </button>
                <p className="text-[10px] text-[#B0BBB5] text-center mt-2">生成后会自动回填到「详细描述」</p>
              </div>
            </div>
          )}

          <CompetitionPicker open={compOpen} onClose={() => setCompOpen(false)} value={[cat]}
            onConfirm={(v) => { if (v.length) setCat(v[v.length - 1]); setCompOpen(false); }} />
          <SplitSkillPicker open={skillOpen} onClose={() => setSkillOpen(false)} value={skills}
            onConfirm={(v) => { setSkills(v); setSkillOpen(false); }} />
          <MultiTagModal open={targetOpen} onClose={() => setTargetOpen(false)} title="选择目标要求"
            groups={TARGET_GROUPS} value={targets} onConfirm={(v) => { setTargets(v); setTargetOpen(false); }} />

          <ActionSheet
            open={sheet}
            onClose={() => setSheet(false)}
            actions={[
              { label: '从相册选择图片', onClick: () => setPicker(true) },
              { label: '选择文件', onClick: () => setPicker(true) },
            ]}
          />
          <MockMediaPicker open={picker} onClose={() => setPicker(false)} mode="image" onPick={(f) => setImgs(prev => [...prev, f])} />
        </>
      }
    >
      <Header title="发布帖子" close onBack={() => app.back()} />

      <div className="px-4 pt-4 space-y-4">
        <div className="bg-[#E8F0EB] rounded-full p-1 flex">
          {['队伍招募', '个人寻伴'].map(t => (
            <button key={t} onClick={() => setIntent(t)}
              className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all ${intent === t ? 'bg-[#2F6B4F] text-white shadow-[0_4px_12px_rgba(47,107,79,0.18)]' : 'text-[#2F6B4F]'}`}>
              {t}
            </button>
          ))}
        </div>

        <div>
          <div className="text-sm font-semibold text-[#1A2A22] mb-2">竞赛 / 项目</div>
          <button type="button" onClick={() => setCompOpen(true)}
            className="w-full bg-[#F9FAFB] rounded-2xl px-4 py-3.5 flex items-center justify-between active:scale-[0.99] transition-transform">
            <span className="flex items-center gap-2 text-[13px] text-[#1A2A22]">
              <Icon name="trophy" size={15} className="text-[#2F6B4F]" /> {cat}
            </span>
            <span className="text-[11px] font-medium text-[#2F6B4F]">选择 / 更换</span>
          </button>
          <div className="text-[10px] text-[#B0BBB5] mt-1.5 px-1">内置 40+ 竞赛与项目，支持分类挑选</div>
        </div>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="写一句吸引人的小标题"
          className="w-full bg-white rounded-2xl px-4 py-3.5 text-[14px] font-medium text-[#1A2A22] placeholder:text-[#B0BBB5] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 shadow-[0_2px_10px_rgba(0,0,0,0.03)]" />

        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#1A2A22]">所需技能</div>
            <button onClick={() => setSkillOpen(true)} className="text-[11px] font-medium text-[#2F6B4F] bg-[#E8F0EB] px-2.5 py-1 rounded-full active:scale-95 transition-transform">
              + 选择
            </button>
          </div>
          {skills.length === 0
            ? <div className="text-[11px] text-[#B0BBB5] bg-[#F9FAFB] rounded-xl px-3 py-2.5">点击「选择」添加需要的技能标签</div>
            : <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 bg-[#E8F0EB] text-[#2F6B4F] rounded-full px-2.5 py-1 text-[11px]">
                    #{s}
                    <button onClick={() => setSkills(skills.filter(x => x !== s))}><Icon name="x" size={10} /></button>
                  </span>
                ))}
              </div>}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#1A2A22]">目标要求</div>
            <button onClick={() => setTargetOpen(true)} className="text-[11px] font-medium text-[#2F6B4F] bg-[#E8F0EB] px-2.5 py-1 rounded-full active:scale-95 transition-transform">
              + 选择
            </button>
          </div>
          {targets.length === 0
            ? <div className="text-[11px] text-[#B0BBB5] bg-[#F9FAFB] rounded-xl px-3 py-2.5">年级、时间投入、地点、周期等</div>
            : <div className="flex flex-wrap gap-1.5">
                {targets.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 bg-[#E8F0EB] text-[#2F6B4F] rounded-full px-2.5 py-1 text-[11px]">
                    #{s}
                    <button onClick={() => setTargets(targets.filter(x => x !== s))}><Icon name="x" size={10} /></button>
                  </span>
                ))}
              </div>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-[#1A2A22]">详细描述</div>
            <button onClick={openAi} className="flex items-center gap-1 text-[#8B5CF6] text-[11px] font-medium bg-[#F3EEFF] px-2.5 py-1 rounded-full active:scale-95 transition-transform">
              <Icon name="sparkles" size={12} /> AI 帮我写
            </button>
          </div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={8} placeholder="项目背景、目前进度、需要什么样的人、你能提供什么…"
            className="w-full bg-[#F9FAFB] rounded-2xl px-4 py-3 text-sm text-[#1A2A22] placeholder:text-[#B0BBB5] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20" />
        </div>

        <div>
          <div className="text-sm font-semibold text-[#1A2A22] mb-2">附加信息</div>
          <div className="flex flex-wrap gap-2">
            {imgs.map((im, i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-[#E8F0EB] flex items-center justify-center relative">
                <span className="text-xl">🖼️</span>
                <button onClick={() => setImgs(imgs.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
                  <Icon name="x" size={11} className="text-[#EF4444]" />
                </button>
              </div>
            ))}
            <button onClick={() => setSheet(true)} className="w-16 h-16 rounded-xl bg-[#F9FAFB] flex flex-col items-center justify-center gap-0.5">
              <Icon name="plus" size={18} className="text-[#A8B3AD]" />
              <span className="text-[9px] text-[#A8B3AD]">图片/链接</span>
            </button>
          </div>
        </div>

        <button onClick={publish} className="w-full bg-[#2F6B4F] text-white py-4 rounded-full text-[15px] font-bold shadow-[0_8px_20px_rgba(47,107,79,0.2)] active:scale-95 active:bg-[#22503A] transition-all">
          确认发布
        </button>
      </div>
    </Page>
  );
};
