/* ============================================================
   模块四：消息列表 / 聊天详情
   ============================================================ */

const chatPreview = (chat) => {
  const last = [...chat.messages].reverse().find(m => m.type !== 'post');
  if (!last) return '你们已成功建立沟通，点击上方按钮可交换联系方式';
  if (last.type === 'text') return last.text;
  if (last.type === 'file') return `[文件] ${last.name}`;
  if (last.type === 'contract') return '🎉 你们已成功签署组队契约';
  if (last.type === 'card') return '[名片] 已交换联系方式';
  return '...';
};
const chatLastAt = (chat) => {
  const last = [...chat.messages].reverse().find(m => m.type !== 'post');
  return last ? last.at : '刚刚';
};

/* 能力凭证：组队场景下只证明「实力」，不涉及身份隐私（身份已由实名认证解决） */
const CREDENTIAL_GROUPS = [
  {
    key: 'award', emoji: '🏆', title: '获奖证书', icon: 'trophy',
    items: [
      { id: 'cw1', name: '蓝桥杯省一证书.jpg', size: '2.4MB', kind: 'image' },
      { id: 'cw2', name: '大创国家级立项.pdf', size: '1.8MB', kind: 'pdf' },
      { id: 'cw3', name: '大英赛二等奖.png', size: '0.9MB', kind: 'image' },
    ],
  },
  {
    key: 'work', emoji: '💻', title: '项目作品', icon: 'folder',
    items: [
      { id: 'wk1', name: '前端项目源码（GitHub链接）', size: '链接', kind: 'link' },
      { id: 'wk2', name: '商赛策划书.pdf', size: '3.6MB', kind: 'pdf' },
      { id: 'wk3', name: 'UI设计稿展示.pdf', size: '5.2MB', kind: 'pdf' },
    ],
  },
  {
    key: 'resume', emoji: '📄', title: '经历简历', icon: 'file-text',
    items: [
      { id: 'rs1', name: '个人完整版简历.pdf', size: '1.2MB', kind: 'pdf' },
    ],
  },
];
const CREDENTIAL_ALL = CREDENTIAL_GROUPS.reduce((acc, g) => acc.concat(g.items.map(it => ({ ...it, groupIcon: g.icon }))), []);

/* 文件卡片视觉：按类型区分图标与配色 */
const FILE_META = {
  pdf: { icon: 'file-text', label: 'PDF 文档', bg: 'bg-[#FEF2F2]', color: 'text-[#DC2626]' },
  image: { icon: 'image', label: '图片', bg: 'bg-[#EFF6FF]', color: 'text-[#2563EB]' },
  link: { icon: 'link', label: '外部链接', bg: 'bg-[#E8F0EB]', color: 'text-[#2F6B4F]' },
};

const MessagesPage = () => {
  const app = useApp();
  const [tab, setTab] = useState('全部');

  /* 消息列表只展示 status === 'normal' 的会话；被标记为「不感兴趣」的会话从这里隐藏，沉淀到「沟通过」 */
  const chats = useMemo(() => app.chats.filter(c => app.chatStatus(c) === 'normal'), [app.chats]);

  return (
    <Page tab="messages">
      <div className="sticky top-0 z-10 bg-[#F4FAF8] px-4 pt-2 pb-2.5">
        <h1 className="text-[23px] font-bold text-[#1F2937] mb-2.5">消息</h1>
        <div className="flex gap-5">
          {['全部', '仅沟通'].map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`text-[13px] pb-1 relative ${tab === t ? 'text-brand font-medium' : 'text-[#9CA3AF]'}`}>
              {t}
              {tab === t && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-brand rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white">
        {chats.length === 0 && (
          <EmptyState icon="message-square" title="还没有聊天" desc="去广场看看，找到合适的搭子吧">
            <button type="button" onClick={() => app.tab('square')} className="bg-brand text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">去广场</button>
          </EmptyState>
        )}
        {chats.map(c => {
          const u = getUser(c.userId);
          return (
            <button key={c.id} type="button" onClick={() => app.go('chat', { chatId: c.id })}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#F5F8F6] text-left active:bg-[#F8FBFA] transition-colors">
              <Avatar src={u.avatar} size={46} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-medium text-[#1F2937]">{u.name}</span>
                  {u.verified && <Icon name="shield-check" size={12} className="text-brand" />}
                </div>
                <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">{chatPreview(c)}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-[#B6C2C8]">{chatLastAt(c)}</span>
                {c.unread > 0 && (
                  <span className="bg-brand text-white text-[9px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{c.unread}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Page>
  );
};

/* ---------------- 聊天详情 ---------------- */
const ChatPage = () => {
  const app = useApp();
  const rawId = app.route.params.chatId;
  const chat = app.chats.find(c => String(c.id) === String(rawId)) || null;
  const u = chat ? getUser(chat.userId) : null;
  const post = (chat && app.posts.find(p => p.id === chat.postId)) || app.posts[0] || null;

  const scrollRef = useRef(null);

  const [input, setInput] = useState('');
  const [menu, setMenu] = useState(false);
  const [report, setReport] = useState(false);
  const [contract, setContract] = useState(false);
  const [credential, setCredential] = useState(false);
  const [credSel, setCredSel] = useState([]);

  /* 返回绝对兜底：正常出栈；没有上一页或出栈异常 → 回广场首页，绝不锁死路由 */
  const goBack = () => {
    try {
      if (app.history.length > 1) app.back();
      else app.tab('square');
    } catch (err) {
      app.tab('square');
    }
  };

  const chatId = chat ? chat.id : null;

  /* 进入聊天清零未读：仅在确有未读时更新，避免无意义全局 setState 引发重渲染循环 */
  useEffect(() => {
    if (!chatId) return;
    app.setChats(prev => {
      const target = prev.find(c => c.id === chatId);
      if (!target || target.unread === 0) return prev;
      return prev.map(c => (c.id === chatId ? { ...c, unread: 0 } : c));
    });
  }, [chatId]);

  /* 卸载时无需清理延时（已移除 leaving 机制） */

  const msgCount = chat ? chat.messages.length : 0;
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatId, msgCount]);

  const mutate = (fn) => {
    if (!chat) return;
    app.setChats(prev => prev.map(c => (c.id === chat.id ? fn(c) : c)));
  };
  const addMsg = (msg) => mutate(c => ({ ...c, messages: [...c.messages, { ...msg, at: nowHM() }] }));

  const usedIce = chat ? (chat.usedIce || []) : [];
  const iceList = (post && post.iceBreakers) || [];
  const availableIce = iceList.map((t, i) => ({ t, i })).filter(x => !usedIce.includes(x.i));

  const sendIce = (idx, text) => {
    mutate(c => ({
      ...c,
      usedIce: [...(c.usedIce || []), idx],
      messages: [...c.messages, { type: 'text', self: true, text, at: nowHM() }],
    }));
  };

  const sendText = () => {
    const t = input.trim();
    if (!t) return;
    addMsg({ type: 'text', self: true, text: t });
    setInput('');
  };

  /* 换联系方式：无需确认，直接生成绿色微信名片 */
  const sendCreditCard = () => {
    addMsg({ type: 'card' });
    app.toast('已交换联系方式');
  };

  /* 合作组队：签署后关闭弹层，在聊天流里生成契约卡 */
  const signContract = () => {
    setContract(false);
    addMsg({ type: 'contract' });
    app.toast('组队契约已签署');
  };

  /* 发凭证：确认后关闭弹窗，把每一项都生成为一条「文件传输」卡片消息 */
  const sendCredential = () => {
    const picked = CREDENTIAL_ALL.filter(it => credSel.includes(it.id));
    if (picked.length === 0) {
      app.toast('请先勾选要发送的凭证');
      return;
    }
    mutate(c => ({
      ...c,
      messages: [...c.messages, ...picked.map(it => ({
        type: 'file', name: it.name, size: it.size, kind: it.kind, at: nowHM(),
      }))],
    }));
    setCredential(false);
    setCredSel([]);
    app.toast(`已发送 ${picked.length} 项能力凭证`);
  };

  const toggleCred = (id) => {
    setCredSel(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  /* 不感兴趣：设为 muted → 从消息列表隐藏、沉淀到沟通过，并自动退回上一页 */
  const mute = () => {
    app.setChatStatus(chat.id, 'muted');
    app.toast('已移入沟通过列表');
    setTimeout(() => app.back(), 260);
  };

  /* 取消不感兴趣：恢复 normal，按钮变回灰色「不感兴趣」 */
  const unmute = () => {
    app.setChatStatus(chat.id, 'normal');
    app.toast('已恢复沟通');
  };

  /* 会话不存在（深链失效 / 数据被清空）：安全兜底，不渲染空白页 */
  if (!chat || !u) {
    return (
      <Page contentPad="pb-10">
        <Header title="聊天" onBack={goBack} />
        <EmptyState icon="message-square" title="会话不存在" desc="这条对话可能已被移除，去消息列表看看吧">
          <button type="button" onClick={() => app.tab('messages')} className="bg-brand text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">回到消息列表</button>
        </EmptyState>
      </Page>
    );
  }

  const isMuted = app.chatStatus(chat) === 'muted';

  const contractInfo = [
    { k: '项目名称', v: post ? `${post.cat} · ${post.title}` : '校园合作项目' },
    { k: '合作周期', v: '3 个月（可续约）' },
    { k: '分工安排', v: (post && post.skillTags && post.skillTags.length) ? post.skillTags.join(' / ') : '双方共同推进' },
    { k: '投入时间', v: (post && post.targetTags && (post.targetTags.find(t => t.includes('每周') || t.includes('周末') || t.includes('晚上'))) || '每周 8 小时以上') },
  ];

  /* 初始帖子卡片：进入聊天时自动生成的第一条，可点击回到详情页 */
  const renderPostCard = (at) => {
    if (!post) return null;
    return (
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#F1F5F3]">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[9px] bg-[#E6F7F2] text-[#0F9F76] px-1.5 py-0.5 rounded">来自帖子</span>
          <span className="text-[10px] text-[#9CA3AF] ml-auto">{at}</span>
        </div>
        <button
          type="button"
          onClick={() => app.go('detail', { postId: post.id })}
          className="w-full text-left active:opacity-70 transition-opacity"
        >
          <div className="text-[13px] font-semibold text-[#1F2937] leading-snug">
            <span className="text-[#0F9F76]">【{post.cat}】</span>{post.title}
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(post.skillTags || []).slice(0, 3).map(t => (
              <span key={t} className="text-[10px] bg-[#F4FAF8] text-[#4B5563] px-1.5 py-0.5 rounded">#{t}</span>
            ))}
          </div>
          <div className="text-[11px] text-brand mt-2">查看详情 →</div>
        </button>
      </div>
    );
  };

  return (
    <Page
      scrollRef={scrollRef}
      contentPad="pb-[136px]"
      overlays={
        <>
          {/* 右上角「...」：只有举报这一个选项 */}
          <Drawer open={menu} onClose={() => setMenu(false)} title="更多操作" h="30%">
            <button
              type="button"
              onClick={() => { setMenu(false); setTimeout(() => setReport(true), 120); }}
              className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-[14px] text-[#EF4444] active:bg-[#FEF2F2]"
            >
              <Icon name="flag" size={17} /> 举报该用户
            </button>
          </Drawer>

          {/* 举报表单：原因 + 文本 + 传图，提交后 Toast */}
          <ReportForm
            open={report}
            onClose={() => setReport(false)}
            title="举报该用户"
            onSubmit={() => app.toast('举报已提交，我们会尽快核实')}
          />

          {/* 合作组队：居中契约 Modal */}
          <Modal
            open={contract}
            onClose={() => setContract(false)}
            title="组队契约确认"
            maxH="max-h-[76%]"
            footer={
              <div className="p-4 border-t border-[#EEF5F2] shrink-0">
                <button type="button" onClick={signContract} className="w-full bg-brand text-white py-3.5 rounded-xl text-[14px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">
                  同意并签署
                </button>
              </div>
            }
          >
            <div className="p-4">
              <div className="flex items-center gap-2.5 bg-[#F4FAF8] rounded-2xl p-3.5 mb-4">
                <Avatar src={u.avatar} size={38} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#1F2937] truncate">{u.name}</div>
                  <div className="text-[10px] text-[#9CA3AF] truncate">{u.school}{u.campus ? `(${u.campus})` : ''}</div>
                </div>
                <span className="ml-auto text-[10px] bg-[#E6F7F2] text-[#0F9F76] px-2 py-0.5 rounded-full shrink-0">待签署</span>
              </div>
              <div className="space-y-3">
                {contractInfo.map(c => (
                  <div key={c.k} className="flex items-start gap-3">
                    <span className="text-[11px] text-[#9CA3AF] w-[56px] shrink-0 pt-0.5">{c.k}</span>
                    <span className="text-[12px] text-[#1F2937] leading-relaxed flex-1">{c.v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#FFFBEB] rounded-xl p-3 mt-4">
                <p className="text-[10px] text-[#92400E] leading-relaxed">签署后双方将受到平台合作信用约束，无故失联会影响信用分。</p>
              </div>
            </div>
          </Modal>

          {/* 发凭证：能力自证（获奖证书 / 项目作品 / 经历简历），Checkbox 多选 */}
          <Modal
            open={credential}
            onClose={() => setCredential(false)}
            title="选择你要发送的能力凭证"
            maxH="max-h-[80%]"
            footer={
              <div className="px-5 pt-2 pb-5 shrink-0">
                <button
                  type="button"
                  onClick={sendCredential}
                  className={`w-full py-3.5 rounded-full text-[15px] font-semibold transition-all active:scale-95 ${credSel.length ? 'bg-[#2F6B4F] text-white shadow-[0_8px_20px_rgba(47,107,79,0.2)]' : 'bg-[#E8F0EB] text-[#8C9A94]'}`}
                >
                  确认发送{credSel.length ? `（${credSel.length}）` : ''}
                </button>
              </div>
            }
          >
            <div className="px-5 pb-1">
              <p className="text-[11px] text-[#8C9A94] leading-relaxed mb-3">
                身份已通过实名认证，这里只需展示你的能力证明，对方仅可查看、不可下载。
              </p>
              {CREDENTIAL_GROUPS.map(g => (
                <div key={g.key} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[14px]">{g.emoji}</span>
                    <span className="text-[12px] font-semibold text-[#1A2A22]">{g.title}</span>
                    <span className="text-[10px] text-[#B0BBB5] ml-0.5">{g.items.length} 项</span>
                  </div>
                  <div className="space-y-2">
                    {g.items.map(it => {
                      const on = credSel.includes(it.id);
                      const fm = FILE_META[it.kind] || FILE_META.pdf;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => toggleCred(it.id)}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-2xl text-left transition-all active:scale-[0.99] ${on ? 'bg-[#E8F0EB]' : 'bg-[#F9FAFB]'}`}
                        >
                          <span className={`w-[18px] h-[18px] rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-[#2F6B4F]' : 'bg-white ring-1 ring-[#D6E0DC]'}`}>
                            {on && <Icon name="check" size={11} className="text-white" />}
                          </span>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fm.bg}`}>
                            <Icon name={it.kind === 'link' ? 'link' : g.icon} size={15} className={fm.color} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-medium text-[#1A2A22] truncate">{it.name}</span>
                            <span className="block text-[10px] text-[#8C9A94] mt-0.5">{fm.label} · {it.kind === 'link' ? '链接' : it.size}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </>
      }
      bottom={
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EEF5F2] z-30">
          {/* 破冰气泡：点击后消失，文字直接作为「我」的消息发出 */}
          {availableIce.length > 0 && (
            <div className="px-3 pt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {availableIce.map(({ t, i }) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendIce(i, t)}
                  className="shrink-0 inline-flex items-center gap-1 bg-[#F3EEFF] text-[#7C3AED] text-[11px] px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                >
                  <Icon name="sparkles" size={11} /> {t}
                </button>
              ))}
            </div>
          )}
          <div className="pl-3 pr-3 pt-2 pb-5 flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendText(); }}
              placeholder="输入消息…"
              className="flex-1 bg-[#F4FAF8] rounded-full px-4 py-2.5 text-[13px] focus:outline-none"
            />
            <button type="button" onClick={sendText} className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0 active:scale-95 transition-transform">
              <Icon name="send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      }
    >
      {/* 顶部 Header + 正下方快捷工具栏 */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EEF5F2]">
        <div className="h-12 px-1 flex items-center">
          <button
            type="button"
            aria-label="返回"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goBack(); }}
            className="w-12 h-12 -ml-1 flex items-center justify-center rounded-xl active:bg-[#F4FAF8] active:scale-95 transition-transform touch-manipulation"
          >
            <Icon name="chevron-left" size={23} className="text-[#1F2937]" />
          </button>
          <div className="flex-1 text-center min-w-0 px-1">
            <div className="flex items-center justify-center gap-1">
              <span className="text-[14px] font-semibold text-[#1F2937] truncate">{u.name}</span>
              {u.verified && <Icon name="shield-check" size={13} className="text-brand shrink-0" />}
            </div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{u.school}{u.campus ? `(${u.campus})` : ''}</div>
          </div>
          <button
            type="button"
            aria-label="更多"
            onClick={() => setMenu(true)}
            className="w-12 h-12 -mr-1 flex items-center justify-center rounded-xl active:bg-[#F4FAF8] active:scale-95 transition-transform touch-manipulation"
          >
            <Icon name="more-horizontal" size={20} className="text-[#4B5563]" />
          </button>
        </div>

        <div className="flex items-center px-1.5 pb-2 gap-0.5">
          {[
            { icon: 'users', label: '合作组队', onClick: () => setContract(true), danger: false },
            { icon: 'phone', label: '换联系方式', onClick: sendCreditCard, danger: false },
            { icon: 'file-check', label: '发凭证', onClick: () => { setCredSel([]); setCredential(true); }, danger: false },
            { icon: 'thumbs-down', label: isMuted ? '取消不感兴趣' : '不感兴趣', onClick: isMuted ? unmute : mute, danger: isMuted },
          ].map(a => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              <Icon name={a.icon} size={17} className={a.danger ? 'text-[#EF4444]' : 'text-[#9CA3AF]'} />
              <span className={`text-[9px] whitespace-nowrap ${a.danger ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 pt-3 space-y-3">
        {/* 第一条永远是初始帖子卡片 */}
        {renderPostCard(chat.messages[0] && chat.messages[0].type === 'post' ? chat.messages[0].at : '刚刚')}

        {chat.messages.map((m, i) => {
          if (m.type === 'post') return null; // 已在最上方统一渲染
          if (m.type === 'card') {
            return (
              <div key={i} className="flex justify-end">
                <div className="w-[76%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#2F6B4F] to-[#245539] p-3.5 text-white shadow-[0_6px_18px_rgba(47,107,79,0.18)]">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Avatar src={u.avatar} size={36} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold truncate">{u.name}</div>
                      <div className="text-[10px] text-white/80 truncate">{u.school}</div>
                    </div>
                    <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded shrink-0">名片</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5"><Icon name="message-circle" size={12} /> 微信：{u.name === '林小满' ? 'lxm_2024' : 'campus_' + u.id}</div>
                    <div className="flex items-center gap-1.5"><Icon name="phone" size={12} /> 手机：138****{String(1000 + u.id).slice(-4)}</div>
                  </div>
                </div>
              </div>
            );
          }

          if (m.type === 'file') {
            const fm = FILE_META[m.kind] || FILE_META.pdf;
            return (
              <div key={i} className="flex justify-end">
                <div className="w-[74%] bg-white rounded-2xl rounded-tr-sm p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fm.bg}`}>
                      <Icon name={fm.icon} size={19} className={fm.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-[#1A2A22] truncate">{m.name}</div>
                      <div className="text-[10px] text-[#8C9A94] mt-0.5">{fm.label} · {m.size || '1.0MB'}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F3F6F4]">
                    <span className="text-[10px] text-[#8C9A94]">能力凭证</span>
                    <button
                      type="button"
                      onClick={() => app.toast('凭证预览为 Demo 效果')}
                      className="text-[11px] font-medium text-[#2F6B4F] bg-[#E8F0EB] px-3 py-1 rounded-full active:scale-95 transition-transform"
                    >
                      查看
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (m.type === 'contract') {
            return (
              <div key={i} className="flex justify-center">
                <div className="w-[86%] bg-white rounded-2xl border border-[#BFE9DC] p-4 text-center shadow-sm">
                  <div className="text-[22px] mb-1">🎉</div>
                  <div className="text-[13px] font-semibold text-[#0F9F76]">你们已成功签署组队契约</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1.5">{post ? `${post.cat} · ` : ''}{contractInfo[3].v}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Avatar src={u.avatar} size={18} />
                    <Avatar src={getUser(15).avatar} size={18} />
                    <span className="text-[10px] text-[#4B5563] ml-1">已绑定合作信用</span>
                  </div>
                </div>
              </div>
            );
          }

          if (m.type === 'text') {
            return (
              <div key={i} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[76%]">
                  <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${m.self ? 'bg-brand text-white rounded-2xl rounded-tr-sm' : 'bg-white text-[#1F2937] rounded-2xl rounded-tl-sm shadow-sm'}`}>
                    {m.text}
                  </div>
                  <div className={`text-[9px] text-[#B6C2C8] mt-0.5 ${m.self ? 'text-right' : 'text-left'}`}>{m.at}</div>
                </div>
              </div>
            );
          }

          return null;
        })}

        {chat.messages.filter(m => m.type !== 'post').length === 0 && (
          <div className="flex justify-center">
            <div className="text-[10px] text-[#9CA3AF] bg-[#F4FAF8] px-3 py-2 rounded-xl text-center leading-relaxed">
              你们已成功建立沟通，点击上方按钮可交换联系方式
            </div>
          </div>
        )}

        {iceList.length > 0 && usedIce.length >= iceList.length && (
          <div className="text-center text-[10px] text-[#C4CDD5] py-1">破冰话术已用完，直接聊吧～</div>
        )}
      </div>
    </Page>
  );
};
