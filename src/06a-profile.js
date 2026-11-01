/* ============================================================
   模块五：我的 / 资产列表 / 收藏 / 他人主页 / 帮助与反馈
   ============================================================ */

const ME_ID = 15;

const CREDIT_REVIEWS = [
  { id: 1, name: '林小满', stars: 5, text: '沟通顺畅，交付准时，代码质量很高，愿意再合作。', at: '2 周前', tag: '合作过' },
  { id: 2, name: '陈墨', stars: 5, text: '需求梳理很清楚，组队过程几乎没有摩擦。', at: '1 个月前', tag: '合作过' },
  { id: 3, name: '苏小棠', stars: 4, text: '思路清晰，偶尔回复慢一点，但整体靠谱。', at: '2 个月前', tag: '沟通过' },
  { id: 4, name: '唐果', stars: 4, text: '愿意带新人，分工明确，守时。', at: '3 个月前', tag: '合作过' },
  { id: 5, name: '江野', stars: 3, text: '合作中途有过一次失联，后来补上了进度。', at: '4 个月前', tag: '合作过' },
];

const assetUsers = (app, type) => {
  if (type === 'chatted') return app.chats.map(c => getUser(c.userId));
  if (type === 'contacted') return app.chats.filter(c => c.messages.some(m => m.type === 'card')).map(c => getUser(c.userId));
  return app.chats.filter(c => c.messages.some(m => m.type === 'contract')).map(c => getUser(c.userId));
};

/* ---------------- 我的主页 ---------------- */
const ProfilePage = () => {
  const app = useApp();
  const me = getUser(ME_ID);
  const lib = app.library;

  const [tab, setTab] = useState('进行中');
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditFilter, setCreditFilter] = useState('全部');
  const [closeTarget, setCloseTarget] = useState(null);
  const [closeReason, setCloseReason] = useState('');

  const myPosts = app.posts.filter(p => p.mine);
  const activePosts = myPosts.filter(p => !p.closed);
  const endedPosts = myPosts.filter(p => p.closed);
  const list = tab === '进行中' ? activePosts : endedPosts;

  const counts = {
    chatted: assetUsers(app, 'chatted').length,
    contacted: assetUsers(app, 'contacted').length,
    cooperated: assetUsers(app, 'cooperated').length,
    favorite: app.favPosts.length,
  };

  const closePost = () => {
    if (!closeReason) { app.toast('请选择关闭原因'); return; }
    app.setPosts(prev => prev.map(p => p.id === closeTarget.id ? { ...p, closed: true } : p));
    app.toast('帖子已关闭，可在「已结束」中查看');
    setCloseTarget(null);
    setCloseReason('');
  };

  const reopenPost = (post) => {
    app.setPosts(prev => prev.map(p => p.id === post.id ? { ...p, closed: false } : p));
    app.toast('帖子已恢复');
  };

  const creditList = CREDIT_REVIEWS.filter(r => creditFilter === '全部' ? true : r.stars === Number(creditFilter[0]));

  return (
    <Page
      tab="profile"
      overlays={
        <>
          <Modal open={creditOpen} onClose={() => setCreditOpen(false)} title="信用分详情" maxH="max-h-[80%]">
            <div className="px-5 pb-5">
              <div className="text-center py-4">
                <div className="text-[34px] font-bold text-[#FBBF24] leading-none">{me.rating}</div>
                <div className="flex justify-center mt-2"><StarRow value={me.rating} size={15} /></div>
                <p className="text-[11px] text-[#9CA3AF] mt-2">来自 {CREDIT_REVIEWS.length} 位搭子的真实评价</p>
              </div>
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                {['全部', '5星', '4星', '3星'].map(f => (
                  <TagChip key={f} small active={creditFilter === f} onClick={() => setCreditFilter(f)}>{f}</TagChip>
                ))}
              </div>
              <div className="space-y-2.5">
                {creditList.length === 0 && <div className="text-center text-[12px] text-[#9CA3AF] py-8">暂无该星级的评价</div>}
                {creditList.map(r => (
                  <div key={r.id} className="bg-[#F8FBFA] rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Avatar src={USERS.find(u => u.name === r.name) ? USERS.find(u => u.name === r.name).avatar : AVATARS[0]} size={26} />
                      <span className="text-[12px] font-medium text-[#1F2937]">{r.name}</span>
                      <span className="text-[9px] bg-[#E6F7F2] text-[#0F9F76] px-1.5 py-0.5 rounded">{r.tag}</span>
                      <span className="ml-auto text-[10px] text-[#B6C2C8]">{r.at}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StarRow value={r.stars} size={11} />
                      <span className="text-[10px] text-[#FBBF24]">{r.stars}.0</span>
                    </div>
                    <p className="text-[11px] text-[#4B5563] leading-relaxed mt-1.5">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Modal>

          <Modal
            open={!!closeTarget}
            onClose={() => setCloseTarget(null)}
            title="关闭帖子"
            maxH="max-h-[66%]"
            footer={
              <div className="p-4 border-t border-[#EEF5F2] shrink-0">
                <button onClick={closePost} className="w-full bg-[#EF4444] text-white py-3 rounded-xl text-[14px] font-medium active:scale-95 transition-transform">
                  确认关闭
                </button>
              </div>
            }
          >
            <div className="p-4">
              <p className="text-[12px] text-[#4B5563] leading-relaxed mb-3">
                关闭后帖子将从广场下架，已沟通的搭子不受影响。请选择关闭原因：
              </p>
              <div className="space-y-1.5">
                {['已招满成员', '项目已结束', '想重新编辑发布', '其他原因'].map(r => (
                  <button key={r} onClick={() => setCloseReason(r)}
                    className={`w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-[13px] ${closeReason === r ? 'bg-[#E6F7F2] text-[#0F9F76] font-medium' : 'bg-[#F4FAF8] text-[#1F2937]'}`}>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${closeReason === r ? 'border-brand bg-brand' : 'border-[#C9D6D1]'}`}>
                      {closeReason === r && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        </>
      }
    >
      <div className="bg-gradient-to-b from-[#2F6B4F] to-[#245539] px-4 pt-3 pb-14 rounded-b-[26px]">
        {!app.isRoot ? (
          <div className="flex items-center justify-between mb-2">
            <RootBack />
            <button onClick={() => app.go('settings')} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform">
              <Icon name="settings" size={18} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex justify-end mb-2">
            <button onClick={() => app.go('settings')} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform">
              <Icon name="settings" size={18} className="text-white" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Avatar src={lib.base.avatar} size={62} ring />
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold truncate">{lib.base.nickname}</span>
              <Icon name="shield-check" size={15} className="text-white" />
            </div>
            <div className="text-[11px] text-white/85 mt-0.5 truncate">{lib.base.school}({lib.base.campus})</div>
            <div className="text-[10px] text-white/70 mt-0.5 truncate">{lib.base.majorClass} · {lib.base.grade}</div>
          </div>
          <button onClick={() => setCreditOpen(true)} className="bg-white/20 rounded-2xl px-3 py-2 text-center active:scale-95 transition-transform">
            <div className="text-[16px] font-bold leading-none">{me.rating}</div>
            <div className="text-[9px] text-white/85 mt-1">信用分 ›</div>
          </button>
        </div>
      </div>

      <div className="px-4 -mt-9">
        <div className="bg-white rounded-2xl shadow-sm p-3 grid grid-cols-4">
          {[
            { key: 'chatted', label: '沟通过', n: counts.chatted },
            { key: 'contacted', label: '换过联系方式', n: counts.contacted },
            { key: 'cooperated', label: '合作过', n: counts.cooperated },
            { key: 'favorite', label: '收藏', n: counts.favorite },
          ].map((a, i) => (
            <button key={a.key}
              onClick={() => a.key === 'favorite' ? app.go('favorites') : app.go('assets', { type: a.key })}
              className="flex flex-col items-center py-1.5 active:scale-95 transition-transform">
              <span className="text-[19px] font-bold text-[#1F2937] leading-none">{a.n}</span>
              <span className="text-[10px] text-[#9CA3AF] mt-1.5 whitespace-nowrap">{a.label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => app.go('library')}
          className="w-full mt-3 bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-[0.99] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-[#E6F7F2] flex items-center justify-center">
            <Icon name="folder-open" size={18} className="text-brand" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-semibold text-[#1F2937]">个人信息库</div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5">基础信息 · 技能 · 经历 · 证书 · 作品集</div>
          </div>
          <Icon name="chevron-right" size={16} className="text-[#CBD5D9]" />
        </button>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button onClick={() => app.go('help')}
            className="bg-white rounded-2xl p-3.5 shadow-sm flex items-center gap-2.5 active:scale-[0.98] transition-transform">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] flex items-center justify-center shrink-0">
              <Icon name="circle-help" size={16} className="text-brand" />
            </div>
            <div className="text-left">
              <div className="text-[12px] font-medium text-[#1F2937]">帮助与反馈</div>
              <div className="text-[9px] text-[#9CA3AF] mt-0.5">FAQ · 意见反馈</div>
            </div>
          </button>
          <button onClick={() => app.go('ai', { mode: 'profile' })}
            className="bg-white rounded-2xl p-3.5 shadow-sm flex items-center gap-2.5 active:scale-[0.98] transition-transform">
            <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] flex items-center justify-center shrink-0">
              <Icon name="sparkles" size={16} className="text-[#8B5CF6]" />
            </div>
            <div className="text-left">
              <div className="text-[12px] font-medium text-[#1F2937]">AI 助手</div>
              <div className="text-[9px] text-[#9CA3AF] mt-0.5">平台问题随便问</div>
            </div>
          </button>
        </div>

        <div className="mt-5 mb-2 flex items-center gap-1.5">
          <span className="text-[17px]">📝</span>
          <h2 className="text-[17px] font-bold text-[#1F2937]">我的帖子</h2>
          <span className="text-[10px] text-[#9CA3AF] ml-1">共 {myPosts.length} 条</span>
        </div>

        <div className="bg-white rounded-2xl p-1 flex mb-3">
          {['进行中', '已结束'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-medium transition-colors ${tab === t ? 'bg-brand text-white' : 'text-[#4B5563]'}`}>
              {t}（{t === '进行中' ? activePosts.length : endedPosts.length}）
            </button>
          ))}
        </div>

        <div className="space-y-3 pb-4">
          {list.length === 0 && (
            <div className="bg-white rounded-2xl py-9 text-center">
              <div className="text-[26px] mb-1.5">🗂️</div>
              <p className="text-[12px] text-[#9CA3AF]">{tab === '进行中' ? '还没有进行中的帖子' : '还没有已结束的帖子'}</p>
              {tab === '进行中' && (
                <button onClick={() => app.go('post')} className="mt-3 text-[12px] text-brand">去发一条 →</button>
              )}
            </div>
          )}
          {list.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl p-4 shadow-sm ${p.closed ? 'opacity-65' : ''}`}>
              <button onClick={() => app.go('detail', { postId: p.id })} className="w-full text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-[#E6F7F2] text-[#0F9F76] px-2 py-0.5 rounded">{p.intent}</span>
                  {p.closed && <span className="text-[10px] bg-[#F4FAF8] text-[#9CA3AF] px-2 py-0.5 rounded">已结束</span>}
                  <span className="ml-auto text-[10px] text-[#B6C2C8]">{p.time}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#1F2937] leading-snug mt-2">
                  <span className="text-[#0F9F76]">【{p.cat}】</span>{p.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.skillTags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] bg-[#F4FAF8] text-[#4B5563] px-2 py-0.5 rounded">#{t}</span>
                  ))}
                </div>
              </button>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#F3F7F5]">
                {p.closed ? (
                  <button onClick={() => reopenPost(p)} className="text-[11px] text-brand border border-[#BFE9DC] px-3 py-1.5 rounded-full active:scale-95 transition-transform">恢复帖子</button>
                ) : (
                  <button onClick={() => setCloseTarget(p)} className="text-[11px] text-[#EF4444] border border-[#FCA5A5] px-3 py-1.5 rounded-full active:scale-95 transition-transform">关闭帖子</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
};

/* ---------------- 资产列表（沟通过 / 换过联系方式 / 合作过） ---------------- */
const ASSET_META = {
  chatted: { title: '沟通过的搭子', desc: '有过聊天记录的搭子', icon: 'message-square', empty: '还没有沟通过的搭子' },
  contacted: { title: '换过联系方式的搭子', desc: '已互相交换微信/手机号的搭子', icon: 'phone', empty: '还没有交换过联系方式' },
  cooperated: { title: '合作过搭子', desc: '已签署组队契约的搭子', icon: 'handshake', empty: '还没有合作过的搭子' },
};

const AssetListPage = () => {
  const app = useApp();
  const type = app.route.params.type || 'chatted';
  const meta = ASSET_META[type] || ASSET_META.chatted;

  /* 沟通过：渲染所有会话（normal + muted），muted 置灰并标记「已静默终止」，点击进入聊天可撤销 */
  const chatted = type === 'chatted';
  const list = chatted
    ? app.chats.map(c => ({ user: getUser(c.userId), chat: c, muted: app.chatStatus(c) === 'muted' }))
    : assetUsers(app, type).map(u => ({ user: u, chat: null, muted: false }));

  const [target, setTarget] = useState(null);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (target) { setStars(0); setText(''); setSubmitted(false); }
  }, [target]);

  const submit = () => {
    if (!stars) { app.toast('请先选择星级'); return; }
    app.rateUser(target.id);
    setSubmitted(true);
    app.toast('评价已提交，感谢反馈');
    setTimeout(() => setTarget(null), 500);
  };

  return (
    <Page
      overlays={
        <Modal
          open={!!target}
          onClose={() => setTarget(null)}
          title="评价搭子"
          maxH="max-h-[76%]"
          footer={
            <div className="p-4 border-t border-[#EEF5F2] shrink-0">
              <button
                onClick={submit}
                disabled={submitted}
                className={`w-full py-3.5 rounded-xl text-[15px] font-medium transition-all ${submitted ? 'bg-[#E5E7EB] text-[#9CA3AF]' : 'bg-brand text-white active:scale-95'}`}
              >
                {submitted ? '已评价' : '提交评价'}
              </button>
            </div>
          }
        >
          <div className="px-5 pt-5 pb-2">
            {target && (
              <>
                <div className="flex flex-col items-center">
                  <Avatar src={target.avatar} size={58} />
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[14px] font-semibold text-[#1F2937]">{target.name}</span>
                    {target.verified && <Icon name="shield-check" size={13} className="text-brand" />}
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] mt-0.5">{target.school}({target.campus})</span>
                </div>

                <div className="flex justify-center gap-4 my-6">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setStars(n)} className="active:scale-90 transition-transform">
                      <Icon name="star" size={34} fill={n <= stars} className={n <= stars ? 'text-[#FBBF24]' : 'text-[#E5E7EB]'} />
                    </button>
                  ))}
                </div>
                <div className="text-center text-[11px] text-[#9CA3AF] -mt-4 mb-4">
                  {stars ? ['', '很不满意', '不太满意', '一般', '比较满意', '非常满意'][stars] : '点击星星打分'}
                </div>

                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder="写下你对Ta的评价（如：技术强/守时/经常失联等）"
                  className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-3 text-[13px] leading-relaxed focus:outline-none resize-none"
                />
              </>
            )}
          </div>
        </Modal>
      }
    >
      <Header title={meta.title} subtitle={meta.desc} onBack={() => app.back()} />
      <div className="px-4 pt-3">
        {list.length === 0 && (
          <EmptyState icon={meta.icon} title={meta.empty} desc="去广场多聊聊，找到合拍的搭子">
            <button onClick={() => app.tab('square')} className="bg-brand text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">去广场</button>
          </EmptyState>
        )}
        <div className="space-y-3">
          {list.map((item, i) => {
            const u = item.user;
            const rated = app.rated.includes(u.id);
            const muted = !!item.muted;
            return (
              <div
                key={`${u.id}-${i}`}
                onClick={() => { if (chatted && item.chat) app.go('chat', { chatId: item.chat.id, from: 'assets' }); }}
                className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 ${chatted ? 'active:scale-[0.99] transition-transform cursor-pointer' : ''} ${muted ? 'opacity-50' : ''}`}
              >
                <button onClick={(e) => { e.stopPropagation(); app.go('otherProfile', { userId: u.id }); }} className="active:scale-95 transition-transform shrink-0">
                  <Avatar src={u.avatar} size={44} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] font-medium text-[#1F2937]">{u.name}</span>
                    {u.verified && <Icon name="shield-check" size={13} className="text-brand" />}
                    <StarRow value={u.rating} size={10} />
                    {muted && <span className="text-[9px] text-[#EF4444] bg-[#FEF2F2] px-1.5 py-0.5 rounded">已静默终止</span>}
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{u.school}({u.campus})</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {u.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] bg-[#F4FAF8] text-[#4B5563] px-1.5 py-0.5 rounded">#{t}</span>)}
                  </div>
                </div>
                {type === 'cooperated' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (!rated) setTarget(u); }}
                    disabled={rated}
                    className={`shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-colors ${rated ? 'bg-[#F4FAF8] text-[#9CA3AF] border-[#EAF2EF]' : 'bg-[#E6F7F2] text-[#0F9F76] border-[#20C997] active:scale-95'}`}
                  >
                    {rated ? '已评价' : '去评价'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
};

/* ---------------- 设置页 ---------------- */
const SettingsPage = () => {
  const app = useApp();
  const [showName, setShowName] = useState(false);
  const [showMajor, setShowMajor] = useState(false);
  const [msgNotify, setMsgNotify] = useState(true);
  const [cache, setCache] = useState('23.6 MB');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const Toggle = ({ on, onChange }) => (
    <button type="button" onClick={() => onChange(!on)} className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${on ? 'bg-[#2F6B4F]' : 'bg-[#DDE7E3]'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );

  /* 二次确认后由全局 logout 清空登录态，并把页面栈替换为隐私引导页 */
  const confirmLogout = () => {
    setLogoutOpen(false);
    app.logout();
  };

  return (
    <Page
      overlays={
        <Modal
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          maxH="max-h-[70%]"
          footer={
            <div className="flex gap-3 px-5 pb-5 pt-1 shrink-0">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 bg-[#F2F4F3] text-[#4A5551] py-3.5 rounded-full text-[15px] font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 bg-[#EF4444] text-white py-3.5 rounded-full text-[15px] font-semibold shadow-[0_8px_20px_rgba(239,68,68,0.22)] active:scale-95 transition-transform"
              >
                确认退出
              </button>
            </div>
          }
        >
          <div className="px-6 pt-1 pb-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-3">
              <Icon name="log-out" size={24} className="text-[#EF4444]" />
            </div>
            <div className="text-[16px] font-semibold text-[#1A2A22]">确定要退出当前账号吗？</div>
            <div className="text-[12px] text-[#8C9A94] leading-relaxed mt-1.5">
              退出后需重新登录才能继续组队与沟通，本地草稿不会丢失。
            </div>
          </div>
        </Modal>
      }
    >
      <Header title="设置" onBack={() => app.back()} />
      <div className="px-4 pt-3 pb-8 space-y-5">
        {/* 账号与安全 */}
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2 px-1">账号与安全</div>
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
            <button onClick={() => app.go('library')} className="w-full flex items-center px-4 py-3.5 active:bg-[#F7FAF8] transition-colors">
              <Icon name="user" size={18} className="text-[#6B7A73] mr-3" />
              <span className="text-sm text-gray-800">个人资料</span>
              <Icon name="chevron-right" size={16} className="text-[#C9D6D1] ml-auto" />
            </button>
            <div className="flex items-center px-4 py-3.5">
              <Icon name="phone" size={18} className="text-[#6B7A73] mr-3" />
              <span className="text-sm text-gray-800">手机号</span>
              <span className="ml-auto text-xs text-gray-400 font-medium">138****8888</span>
            </div>
          </div>
        </div>

        {/* 隐私设置：只保留「展示真实姓名」与「展示专业班级」两个开关 */}
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2 px-1">隐私设置</div>
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex items-center px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800">在主页展示真实姓名</div>
                <div className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">开启后主页会显示你的真实姓名</div>
              </div>
              <Toggle on={showName} onChange={setShowName} />
            </div>
            <div className="flex items-center px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800">在主页展示专业班级</div>
                <div className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">开启后主页会显示你的专业与班级</div>
              </div>
              <Toggle on={showMajor} onChange={setShowMajor} />
            </div>
          </div>
        </div>

        {/* 通用与消息 */}
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2 px-1">通用与消息</div>
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex items-center px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800">消息通知</div>
                <div className="text-xs text-gray-400 font-medium mt-1">接收新消息与系统通知</div>
              </div>
              <Toggle on={msgNotify} onChange={setMsgNotify} />
            </div>
            <button onClick={() => { setCache('0 KB'); app.toast('清理成功'); }} className="w-full flex items-center px-4 py-3.5 active:bg-[#F7FAF8] transition-colors">
              <Icon name="trash-2" size={18} className="text-[#6B7A73] mr-3" />
              <span className="text-sm text-gray-800">清除缓存</span>
              <span className="ml-auto text-xs text-gray-400 font-medium mr-2">{cache}</span>
              <Icon name="chevron-right" size={16} className="text-[#C9D6D1]" />
            </button>
          </div>
        </div>

        {/* 关于与帮助 */}
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2 px-1">关于与帮助</div>
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
            <button onClick={() => app.go('help')} className="w-full flex items-center px-4 py-3.5 active:bg-[#F7FAF8] transition-colors">
              <Icon name="circle-help" size={18} className="text-[#6B7A73] mr-3" />
              <span className="text-sm text-gray-800">帮助与反馈</span>
              <Icon name="chevron-right" size={16} className="text-[#C9D6D1] ml-auto" />
            </button>
            <div className="flex items-center px-4 py-3.5">
              <Icon name="info" size={18} className="text-[#6B7A73] mr-3" />
              <span className="text-sm text-gray-800">当前版本</span>
              <span className="ml-auto text-xs text-gray-400 font-medium">v1.0.0</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full bg-white text-[#EF4444] py-3.5 rounded-2xl text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform"
        >
          退出登录
        </button>
      </div>
    </Page>
  );
};

/* ---------------- 我的收藏 ---------------- */
const FavoritesPage = () => {
  const app = useApp();
  const [tab, setTab] = useState('帖子');
  const posts = app.posts.filter(p => app.favPosts.includes(p.id));
  const users = [2, 4, 9, 7].map(id => getUser(id));

  return (
    <Page>
      <Header title="我的收藏" onBack={() => app.back()} />
      <div className="px-4 pt-3">
        <div className="flex gap-5 mb-3">
          {['帖子', '用户'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`text-[13px] pb-1 relative ${tab === t ? 'text-brand font-medium' : 'text-[#9CA3AF]'}`}>
              {t}
              {tab === t && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-brand rounded-full" />}
            </button>
          ))}
        </div>

        {tab === '帖子' ? (
          posts.length === 0 ? (
            <EmptyState icon="star" title="还没有收藏帖子" desc="在广场点右上角 ⭐ 就能收藏感兴趣的帖子">
              <button onClick={() => app.tab('square')} className="bg-brand text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">去广场</button>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {posts.map(p => {
                const u = getUser(p.userId);
                return (
                  <div key={p.id} className={`bg-white rounded-2xl p-4 shadow-sm ${p.closed ? 'opacity-55' : ''}`}>
                    <div className="flex items-start gap-2">
                      <button onClick={() => app.go('detail', { postId: p.id })} className="flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#E6F7F2] text-[#0F9F76] px-2 py-0.5 rounded">{p.intent}</span>
                          {p.closed && <span className="text-[10px] bg-[#F4FAF8] text-[#9CA3AF] px-2 py-0.5 rounded">已结束</span>}
                        </div>
                        <h3 className="text-[15px] font-bold text-[#1F2937] leading-snug mt-2">
                          <span className="text-[#0F9F76]">【{p.cat}】</span>{p.title}
                        </h3>
                        <div className="text-[10px] text-[#9CA3AF] mt-2">{u.name} · {u.school}({u.campus})</div>
                      </button>
                      <button onClick={() => app.toggleFav(p.id)} className="w-7 h-7 flex items-center justify-center active:scale-90 transition-transform">
                        <Icon name="star" size={18} fill className="text-[#FBBF24]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <button onClick={() => app.go('otherProfile', { userId: u.id })} className="active:scale-95 transition-transform">
                  <Avatar src={u.avatar} size={44} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] font-medium text-[#1F2937]">{u.name}</span>
                    {u.verified && <Icon name="shield-check" size={12} className="text-brand" />}
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">{u.school}({u.campus})</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {u.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] bg-[#F4FAF8] text-[#4B5563] px-1.5 py-0.5 rounded">#{t}</span>)}
                  </div>
                </div>
                <Icon name="star" size={17} fill className="text-[#FBBF24]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

/* ---------------- 他人主页 ---------------- */
const OtherProfilePage = () => {
  const app = useApp();
  const u = getUser(app.route.params.userId || 1);
  const posts = app.posts.filter(p => p.userId === u.id && !p.closed);

  const Fold = ({ title, items }) => (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-[#1F2937]">{title}</span>
        <span className="text-[10px] text-[#9CA3AF]">{items.length} 项</span>
      </div>
      {items.map(it => (
        <div key={it.id} className="bg-white rounded-2xl p-4 shadow-sm mb-2">
          <div className="text-[13px] font-medium text-[#1F2937]">{it.name}</div>
          {it.desc && <p className="text-[11px] text-[#4B5563] leading-relaxed mt-1">{it.desc}</p>}
          {(it.attachments || []).map((a, i) => (
            <div key={i} className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#0F9F76] bg-[#E6F7F2] rounded-lg px-2.5 py-1.5">
              <span>{a.kind === 'link' ? '🔗' : a.kind === 'image' ? '🖼️' : '📄'}</span>
              {a.kind === 'link' ? `链接：${a.name}` : `查看附件：${a.name}`}
            </div>
          ))}
        </div>
      ))}
      {items.length === 0 && <div className="text-[11px] text-[#C4CDD5] bg-white rounded-2xl p-4 text-center">暂无内容</div>}
    </div>
  );

  return (
    <Page
      contentPad="pb-24"
      bottom={
        <button
          onClick={() => app.openChatWith(u.id, posts[0] ? posts[0].id : app.posts[0].id)}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-brand text-white px-9 py-3.5 rounded-full text-[15px] font-medium shadow-xl shadow-brand/30 active:scale-95 transition-transform z-30 flex items-center gap-2"
        >
          <Icon name="message-circle" size={19} /> 立即沟通
        </button>
      }
    >
      <Header title="个人信息" onBack={() => app.back()} />
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex items-center gap-3.5">
          <Avatar src={u.avatar} size={64} ring />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-[#1F2937]">{u.name}</span>
              {u.verified && <Icon name="shield-check" size={15} className="text-brand" />}
            </div>
            <div className="text-[11px] text-[#9CA3AF] mt-0.5">{u.school}({u.campus})</div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5">{u.grade} · {u.major}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <StarRow value={u.rating} size={11} />
              <span className="text-[10px] font-medium text-[#FBBF24]">{u.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {u.tags.map(t => (
            <span key={t} className="text-[11px] bg-[#E6F7F2] text-[#0F9F76] px-2.5 py-1 rounded-full">#{t}</span>
          ))}
        </div>
      </div>

      <div className="px-4">
        <Fold title="项目经历" items={LIB_INIT.projects} />
        <Fold title="获奖经历 / 资格证书" items={LIB_INIT.awards} />
        <Fold title="个人作品集" items={LIB_INIT.works} />

        {posts.length > 0 && (
          <div className="mt-4 pb-2">
            <div className="text-[13px] font-semibold text-[#1F2937] mb-2">Ta 的帖子</div>
            {posts.map(p => (
              <button key={p.id} onClick={() => app.go('detail', { postId: p.id })}
                className="w-full bg-white rounded-2xl p-4 shadow-sm text-left mb-2 active:scale-[0.99] transition-transform">
                <div className="text-[10px] text-[#9CA3AF]">{p.intent} · {p.time}</div>
                <h3 className="text-[14px] font-bold text-[#1F2937] leading-snug mt-1.5">
                  <span className="text-[#0F9F76]">【{p.cat}】</span>{p.title}
                </h3>
              </button>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

/* ---------------- 帮助与反馈 ---------------- */
const HelpPage = () => {
  const app = useApp();
  const [tab, setTab] = useState('帮助（FAQ）');
  const [open, setOpen] = useState('');
  const [text, setText] = useState('');

  return (
    <Page>
      <Header title="帮助与反馈" onBack={() => app.back()} />
      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl p-1 flex mb-4">
          {['帮助（FAQ）', '意见反馈'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-medium transition-colors ${tab === t ? 'bg-brand text-white' : 'text-[#4B5563]'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === '帮助（FAQ）' ? (
          <div className="pb-6">
            {FAQ_DATA.map(g => (
              <div key={g.group} className="mb-4">
                <div className="text-[11px] font-semibold text-[#9CA3AF] mb-2">{g.group}</div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  {g.items.map((it, i) => {
                    const key = `${g.group}-${i}`;
                    const on = open === key;
                    return (
                      <div key={key} className="border-b border-[#F3F7F5] last:border-0">
                        <button onClick={() => setOpen(on ? '' : key)}
                          className="w-full flex items-center gap-2 px-4 py-3.5 text-left">
                          <span className="text-[12px] text-[#1F2937] flex-1">{it.q}</span>
                          <Icon name="chevron-down" size={15} className={`text-[#9CA3AF] transition-transform ${on ? 'rotate-180' : ''}`} />
                        </button>
                        {on && (
                          <div className="px-4 pb-3.5 -mt-1 fade-in">
                            <p className="text-[11px] text-[#4B5563] leading-[1.9] bg-[#F8FBFA] rounded-xl p-3">{it.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="bg-[#E6F7F2] rounded-2xl p-4 text-center">
              <p className="text-[11px] text-[#0F9F76] leading-relaxed">没有找到答案？切换到「意见反馈」告诉我们就好</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-[12px] font-medium text-[#1F2937] mb-2">问题或建议</div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={7}
                placeholder="请描述你遇到的问题或对平台的建议"
                className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-3 text-[13px] leading-relaxed focus:outline-none resize-none"
              />
              <div className="text-[10px] text-[#B6C2C8] text-right mt-1">{text.length}/200</div>
            </div>
            <button
              onClick={() => {
                if (!text.trim()) { app.toast('请先填写反馈内容'); return; }
                setText('');
                app.toast('感谢你的反馈');
              }}
              className="w-full mt-4 bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all"
            >
              提交反馈
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};
