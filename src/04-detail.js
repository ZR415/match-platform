/* ============================================================
   模块三：帖子详情 / 精准匹配 / AI 对话
   ============================================================ */

const DetailPage = () => {
  const app = useApp();
  const post = app.posts.find(p => p.id === app.route.params.postId) || app.posts[0];
  const u = getUser(post.userId);
  const fav = app.favPosts.includes(post.id);
  const [report, setReport] = useState(false);

  const TagLine = ({ label, tags }) => (
    <div className="flex items-start gap-2 py-2.5">
      <span className="text-[11px] text-[#8C9A94] w-[56px] shrink-0 pt-1">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="text-[11px] bg-[#E8F0EB] text-[#2F6B4F] px-2.5 py-1 rounded-full">#{t}</span>
        ))}
      </div>
    </div>
  );

  return (
    <Page
      contentPad="pb-24"
      bottom={
        <button onClick={() => app.openChatWith(post.userId, post.id)}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#2F6B4F] text-white px-9 py-3.5 rounded-full text-[15px] font-semibold shadow-[0_8px_20px_rgba(47,107,79,0.25)] active:scale-95 active:bg-[#22503A] transition-all z-30 flex items-center gap-2">
          <Icon name="message-circle" size={19} /> 立即沟通
        </button>
      }
      overlays={<ReportForm open={report} onClose={() => setReport(false)} title="投诉举报" onSubmit={() => app.toast('投诉已提交，我们会尽快处理')} />}
    >
      <Header
        title="帖子详情"
        onBack={() => app.back()}
        right={
          <button onClick={() => app.toggleFav(post.id)} className="w-10 h-11 flex items-center justify-center active:scale-90 transition-transform">
            <Icon name="star" size={20} fill={fav} className={fav ? 'text-[#FBBF24]' : 'text-[#CBD5D9]'} />
          </button>
        }
      />

      <div className="bg-white px-4 pt-3 pb-4">
        <span className="inline-block text-[11px] bg-[#E8F0EB] text-[#2F6B4F] px-2.5 py-1 rounded-full">{post.intent}</span>

        <div className="flex items-center gap-3 mt-3">
          <button onClick={() => app.go('otherProfile', { userId: u.id })} className="active:scale-95 transition-transform">
            <Avatar src={u.avatar} size={42} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-medium text-[#1A2A22]">{u.name}</span>
              {u.verified && <Icon name="shield-check" size={14} className="text-[#2F6B4F]" />}
            </div>
            <div className="text-[11px] text-[#8C9A94] mt-0.5">{u.school}({u.campus})</div>
          </div>
          <span className="text-[11px] text-[#B0BBB5] shrink-0">{post.time}</span>
        </div>

        <h1 className="text-lg font-semibold text-[#1A2A22] leading-snug mt-4">
          <span className="text-[#2F6B4F]">【{post.cat}】</span>{post.title}
        </h1>

        <div className="mt-3 divide-y divide-[#F3F6F4]">
          <TagLine label="项目类型" tags={post.projectTags} />
          <TagLine label="所需技能" tags={post.skillTags} />
          <TagLine label="目标要求" tags={post.targetTags} />
        </div>
      </div>

      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="text-sm font-semibold text-[#1A2A22] mb-2">详细描述</div>
          <p className="text-sm text-[#4A5551] leading-relaxed whitespace-pre-line">{post.desc}</p>
        </div>

        <div className="bg-[#FFFBEB] rounded-2xl p-3.5 mt-3">
          <div className="flex items-start gap-2">
            <Icon name="alert-triangle" size={16} className="text-[#D97706] mt-0.5 shrink-0" />
            <div className="text-[11px] text-[#92400E] leading-relaxed">
              防骗提示：请勿在平台外进行任何金钱交易，不要提前支付任何费用。如遇可疑行为，请
              <button onClick={() => setReport(true)} className="text-[#EF4444] font-semibold underline underline-offset-2 mx-0.5">立即投诉</button>。
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

/* ---------------- 精准匹配（Wizard 漏斗流） ----------------
   匹配流程的状态提升到全局 app.matchFlow：
   从「匹配结果」跳转到他人主页 / 聊天页，再返回时 phase 与结果数据仍然保留，
   不会退回到匹配入口页，也不会重置成 idle。 */
const MatchPage = () => {
  const app = useApp();
  const mf = app.matchFlow;
  const setMf = app.setMatchFlow;
  const patch = (obj) => setMf(prev => ({ ...prev, ...obj }));

  const [sourceOpen, setSourceOpen] = useState(false);
  const [pick, setPick] = useState(null); // intent | skill | target
  const [progress, setProgress] = useState(0);

  const myPosts = app.posts.filter(p => p.mine);
  const lib = app.library;

  useEffect(() => {
    if (mf.phase !== 'loading') return;
    setProgress(0);
    const t = setInterval(() => setProgress(p => (p >= 100 ? 100 : p + 4)), 60);
    return () => clearInterval(t);
  }, [mf.phase]);

  useEffect(() => {
    if (mf.phase === 'loading' && progress >= 100) {
      const t = setTimeout(() => patch({ phase: 'result', pool: 0 }), 320);
      return () => clearTimeout(t);
    }
  }, [progress, mf.phase]);

  const pickSource = (key) => {
    setSourceOpen(false);
    patch({ source: key, selPost: null, phase: 'sourceView' });
  };
  const backToEntry = () => patch({ phase: 'idle' });
  const cancelFlow = () => { patch({ phase: 'idle' }); app.toast('已取消匹配'); };
  const nextBatch = () => {
    if (mf.pool < MATCH_POOLS.length - 1) patch({ pool: mf.pool + 1 });
    else patch({ phase: 'empty' });
  };

  const canNext = mf.source === 'post'
    ? !!mf.selPost
    : mf.source === 'manual'
      ? (mf.intents.length + mf.skills.length + mf.targets.length > 0)
      : true;

  const SOURCE_META = {
    profile: { title: '个人信息库', sub: '确认提取以下画像信息' },
    post: { title: '选择我的帖子', sub: '从帖子中提取你的组队需求' },
    manual: { title: '手动筛选条件', sub: '按你的需求自定义搭子画像' },
  };
  const meta = SOURCE_META[mf.source] || SOURCE_META.profile;

  /* 手动筛选的可点选区块：标题 + 已选标签 + 添加/修改入口 */
  const ManualBlock = ({ emoji, title, tags, hint, onEdit, onRemove }) => (
    <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[15px]">{emoji}</span>
          <span className="text-sm font-semibold text-[#1A2A22]">{title}</span>
        </div>
        <button type="button" onClick={onEdit}
          className="text-[11px] font-medium text-[#2F6B4F] bg-[#E8F0EB] px-2.5 py-1 rounded-full active:scale-95 transition-transform">
          + 添加/修改
        </button>
      </div>
      {tags.length === 0 ? (
        <div className="text-[11px] text-[#B0BBB5] bg-[#F9FAFB] rounded-xl px-3 py-2.5">{hint}</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <button key={t} type="button" onClick={() => onRemove(t)}
              className="inline-flex items-center gap-1 bg-[#E8F0EB] text-[#2F6B4F] rounded-full px-2.5 py-1 text-[11px] active:scale-95 transition-transform">
              {t}<Icon name="x" size={9} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderSourceView = () => {
    if (mf.source === 'profile') {
      return (
        <div className="space-y-2.5">
          <div className="text-xs text-[#8C9A94] leading-relaxed">系统将从你的个人信息库中提取以下信息，用于生成匹配画像：</div>
          {[
            { k: '意向竞赛', v: (lib.intentComps || []).join('、') || '未填写' },
            { k: '个人技能', v: (lib.skills || []).join('、') || '未填写' },
            { k: '项目经历', v: (lib.projects || []).map(e => e.name || e.text).filter(Boolean).slice(0, 3).join('、') || '未填写' },
            { k: '证书作品', v: (lib.awards || []).length + (lib.works || []).length + ' 项' },
          ].map(row => (
            <div key={row.k} className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start gap-3">
              <span className="text-[11px] text-[#8C9A94] w-[60px] shrink-0 pt-0.5">{row.k}</span>
              <span className="text-[13px] text-[#1A2A22] flex-1 leading-relaxed">{row.v}</span>
            </div>
          ))}
        </div>
      );
    }
    if (mf.source === 'post') {
      return (
        <div className="space-y-2.5">
          <div className="text-xs text-[#8C9A94]">选择一条你的帖子，系统会提取其中的需求用于匹配：</div>
          {myPosts.length === 0 && (
            <EmptyState icon="file-text" title="还没有发布帖子" desc="先去发一条招募，再回来匹配吧">
              <button type="button" onClick={() => app.go('post')} className="bg-[#2F6B4F] text-white text-[13px] px-5 py-2.5 rounded-full active:scale-95 transition-transform">去发帖</button>
            </EmptyState>
          )}
          {myPosts.map(p => {
            const on = mf.selPost === p.id;
            return (
              <button key={p.id} type="button" onClick={() => patch({ selPost: p.id })}
                className={`w-full text-left rounded-2xl p-4 border transition-all active:scale-[0.99] ${on ? 'bg-[#E8F0EB] border-[#2F6B4F]' : 'bg-white border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}>
                <div className="flex items-start gap-2.5">
                  <span className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? 'border-[#2F6B4F] bg-[#2F6B4F]' : 'border-[#C9D6D1]'}`}>
                    {on && <Icon name="check" size={10} className="text-white" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[#1A2A22] leading-snug">
                      <span className="text-[#2F6B4F]">【{p.cat}】</span>{p.title}
                    </div>
                    <div className="text-[10px] text-[#8C9A94] mt-1 truncate">{p.intent} · {p.time}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <ManualBlock emoji="🎯" title="意向项目" tags={mf.intents} hint="还没有选择，点右上角添加你感兴趣的比赛或项目"
          onEdit={() => setPick('intent')}
          onRemove={(t) => patch({ intents: mf.intents.filter(x => x !== t) })} />
        <ManualBlock emoji="🛠️" title="所需技能" tags={mf.skills} hint="还没有选择，点右上角添加你需要的技能"
          onEdit={() => setPick('skill')}
          onRemove={(t) => patch({ skills: mf.skills.filter(x => x !== t) })} />
        <ManualBlock emoji="⏱️" title="目标要求" tags={mf.targets} hint="年级、时间投入、地点、周期等"
          onEdit={() => setPick('target')}
          onRemove={(t) => patch({ targets: mf.targets.filter(x => x !== t) })} />
      </div>
    );
  };

  const timeline = ['idle', 'sourceView', 'weight', 'loading', 'result'];
  const stepIndex = timeline.indexOf(mf.phase);

  return (
    <Page
      tab={mf.phase === 'idle' ? 'match' : undefined}
      contentPad={mf.phase === 'idle' ? '' : 'pb-32'}
      bottom={
        (mf.phase === 'sourceView' || mf.phase === 'weight') ? (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur px-4 pt-3 pb-5 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => mf.phase === 'weight' ? patch({ phase: 'loading' }) : patch({ phase: 'weight' })}
              disabled={mf.phase === 'sourceView' && !canNext}
              className={`w-full py-4 rounded-full text-[15px] font-bold transition-all ${(mf.phase === 'sourceView' && !canNext)
                ? 'bg-[#E1E8E4] text-[#9FAEA7]'
                : 'bg-[#2F6B4F] text-white shadow-[0_8px_20px_rgba(47,107,79,0.2)] active:scale-95 active:bg-[#22503A]'}`}
            >
              {mf.phase === 'weight' ? '确认并开始匹配' : '提取并下一步'}
            </button>
          </div>
        ) : null
      }
      overlays={
        <>
          {/* 数据源选择 */}
          <Drawer open={sourceOpen} onClose={() => setSourceOpen(false)} title="选择匹配数据源" h="58%">
            <div className="space-y-2.5">
              {[
                { key: 'profile', icon: 'user-circle', t: '基于个人信息库', d: '利用主页已填写的技能、意向与经历' },
                { key: 'post', icon: 'file-text', t: '基于发布帖子', d: myPosts.length ? `已发布 ${myPosts.length} 条帖子` : '暂无帖子，可先去发帖', disabled: myPosts.length === 0 },
                { key: 'manual', icon: 'sliders-horizontal', t: '手动筛选', d: '完全按你自己的条件选择意向、技能与目标' },
              ].map(o => (
                <button key={o.key} type="button" onClick={() => { if (!o.disabled) pickSource(o.key); }}
                  disabled={o.disabled}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${o.disabled ? 'bg-[#F9FAFB] opacity-60' : 'bg-[#F5F7F5] active:scale-[0.99]'}`}>
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <Icon name={o.icon} size={18} className="text-[#2F6B4F]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#1A2A22]">{o.t}</div>
                    <div className="text-[11px] text-[#8C9A94] mt-1 leading-relaxed">{o.d}</div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-[#C4CDD5] self-center" />
                </button>
              ))}
            </div>
          </Drawer>

          {/* 手动筛选：复用分类选择器 */}
          <CompetitionPicker open={pick === 'intent'} onClose={() => setPick(null)}
            value={mf.intents} onConfirm={(v) => { patch({ intents: v }); setPick(null); }} />
          <SplitSkillPicker open={pick === 'skill'} onClose={() => setPick(null)}
            value={mf.skills} onConfirm={(v) => { patch({ skills: v }); setPick(null); }} />
          <MultiTagModal open={pick === 'target'} onClose={() => setPick(null)}
            title="选择目标要求" groups={TARGET_GROUPS} value={mf.targets}
            onConfirm={(v) => { patch({ targets: v }); setPick(null); }} />
        </>
      }
    >
      {/* ---------------- 入口页 ---------------- */}
      {mf.phase === 'idle' && (
        <div className="relative min-h-[640px] flex flex-col items-center justify-center px-6 pt-4 pb-10">
          {/* 背景点缀 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="float-dot absolute left-10 top-24 w-2 h-2 rounded-full bg-[#C7DAD0]" />
            <span className="float-dot absolute right-12 top-40 w-1.5 h-1.5 rounded-full bg-[#D7E5DD]" style={{ animationDelay: '1.4s' }} />
            <span className="float-dot absolute left-16 bottom-40 w-1.5 h-1.5 rounded-full bg-[#CFE0D7]" style={{ animationDelay: '2.6s' }} />
            <span className="float-dot absolute right-16 bottom-28 w-2 h-2 rounded-full bg-[#DDE9E2]" style={{ animationDelay: '3.4s' }} />
          </div>

          <h1 className="text-3xl font-bold text-[#1A2A22] tracking-wide whitespace-nowrap text-center">遇见神仙队友</h1>
          <p className="text-sm text-[#8C9A94] mt-2 mb-10 text-center leading-relaxed">基于你的画像，为你精准推荐最合拍的校园搭子</p>

          <div className="relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(47,107,79,0.06)] w-full">
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#E8F0EB] breath blur-2xl" />
              <div className="absolute inset-4 rounded-full bg-[#F0F6F2] blur-md" />
              <Icon name="radar" size={64} className="relative text-[#2F6B4F]" />
            </div>

            <div className="space-y-4">
              {[
                { emoji: '📍', title: '同校圈层优先', desc: '同校区同学，见面与协作都更方便' },
                { emoji: '🛠️', title: '技能完美互补', desc: '补齐团队最缺的那块能力' },
                { emoji: '🎯', title: '目标高度一致', desc: '方向、节奏与投入时间完全对齐' },
              ].map(row => (
                <div key={row.title} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F7F5] flex items-center justify-center text-[16px] shrink-0">{row.emoji}</div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#4A5551] leading-tight">{row.title}</div>
                    <div className="text-[11px] text-[#8C9A94] mt-1 leading-relaxed">{row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => setSourceOpen(true)}
            className="mt-8 w-full bg-[#2F6B4F] text-white py-4 rounded-full font-bold text-lg shadow-[0_8px_20px_rgba(47,107,79,0.2)] active:scale-95 active:bg-[#22503A] transition-all">
            开启精准匹配
          </button>
          <p className="text-[11px] text-[#A8B3AD] mt-3">全程约 10 秒 · 随时可取消</p>
        </div>
      )}

      {/* ---------------- 数据源预览 / 手动筛选 ---------------- */}
      {mf.phase === 'sourceView' && (
        <div>
          <Header
            title={meta.title}
            subtitle={meta.sub}
            onBack={backToEntry}
            right={
              <button type="button" onClick={cancelFlow} className="text-[13px] text-[#8C9A94] px-2 active:scale-95 transition-transform">取消</button>
            }
          />
          <div className="px-4 pt-4">{renderSourceView()}</div>
        </div>
      )}

      {/* ---------------- 权重页 ---------------- */}
      {mf.phase === 'weight' && (
        <div>
          <Header title="匹配权重" subtitle={`第 ${stepIndex} / 3 步`} onBack={() => patch({ phase: 'sourceView' })} right={
            <button type="button" onClick={cancelFlow} className="text-[13px] text-[#8C9A94] px-2 active:scale-95 transition-transform">取消</button>
          } />
          <div className="px-4 pt-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#1A2A22]">选择匹配权重</h2>
            <p className="text-sm text-[#8C9A94] mt-1 mb-5">我们会按你最看重的维度优先排序</p>
            <div className="space-y-3">
              {[
                { k: '同校优先', d: '优先推荐本校区的同学', icon: 'map-pin' },
                { k: '技能互补', d: '优先补齐你缺失的能力', icon: 'wrench' },
                { k: '目标一致', d: '优先方向目标完全对齐', icon: 'target' },
              ].map(w => {
                const on = mf.weight === w.k;
                return (
                  <button key={w.k} type="button" onClick={() => patch({ weight: w.k })}
                    className={`w-full rounded-2xl p-4 text-left flex items-center gap-3 border transition-all active:scale-[0.99] ${on ? 'bg-[#E8F0EB] border-[#2F6B4F]' : 'bg-white border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Icon name={w.icon} size={18} className="text-[#2F6B4F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1A2A22]">{w.k}</div>
                      <div className="text-xs text-[#8C9A94] mt-0.5">{w.d}</div>
                    </div>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? 'border-[#2F6B4F] bg-[#2F6B4F]' : 'border-[#C9D6D1]'}`}>
                      {on && <Icon name="check" size={11} className="text-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 匹配中 ---------------- */}
      {mf.phase === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[560px] px-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#E8F0EB] breath blur-xl" />
            <div className="absolute inset-0 rounded-full border border-[#CFE0D7]" />
            <div className="absolute inset-5 rounded-full border border-[#BFD5C9]" />
            <div className="absolute inset-10 rounded-full border border-[#AFCBBE]" />
            <div className="absolute inset-0 rounded-full border-t-2 border-[#2F6B4F] animate-spin" />
            <Icon name="radar" size={38} className="relative text-[#2F6B4F]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A2A22] mt-8">正在为你精准匹配</h3>
          <p className="text-xs text-[#8C9A94] mt-1.5">按「{mf.weight}」权重扫描校园搭子库…</p>
          <div className="w-52 h-1.5 bg-[#E8F0EB] rounded-full overflow-hidden mt-5">
            <div className="h-full bg-[#2F6B4F] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[11px] text-[#8C9A94] mt-2">{progress}%</div>
        </div>
      )}

      {/* ---------------- 结果页 ---------------- */}
      {mf.phase === 'result' && (
        <div>
          <Header title="匹配结果" subtitle={`第 ${mf.pool + 1} 批 · 命中 ${MATCH_POOLS[mf.pool].length} 位`} onBack={backToEntry} />
          <div className="px-4 pt-4 pb-6 flex flex-col items-center">
            {MATCH_POOLS[mf.pool].map((item, idx) => {
              const u = getUser(item.userId);
              const percent = 88 + ((item.userId + mf.pool * 7) % 12);
              return (
                <div key={item.userId} className="w-full bg-white rounded-[26px] shadow-[0_10px_34px_rgba(47,107,79,0.08)] p-5 mb-4 scale-in" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} size={54} ring />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold text-[#1A2A22] truncate">{u.name}</span>
                        {u.verified && <Icon name="shield-check" size={14} className="text-[#2F6B4F] shrink-0" />}
                      </div>
                      <div className="text-xs text-[#8C9A94] mt-1 truncate">{u.school}({u.campus})</div>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="text-[30px] font-bold text-[#2F6B4F] leading-none">{percent}<span className="text-[13px]">%</span></div>
                      <div className="text-[10px] text-[#8C9A94] mt-1">匹配度</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 bg-[#F7F9F7] rounded-2xl p-3.5">
                    {['同校', '技能', '目标'].map(dim => {
                      const val = 60 + ((item.userId + dim.length) % 40);
                      return (
                        <div key={dim} className="flex items-center gap-2.5">
                          <span className="text-[10px] text-[#4A5551] w-8 shrink-0">{dim}</span>
                          <div className="flex-1 h-1.5 bg-[#E4EBE7] rounded-full overflow-hidden">
                            <div className="h-full bg-[#2F6B4F] rounded-full" style={{ width: `${val}%` }} />
                          </div>
                          <span className="text-[10px] text-[#8C9A94] w-8 text-right shrink-0">{val}%</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {u.tags.slice(0, 4).map(t => (
                      <span key={t} className="text-[10px] bg-[#E8F0EB] text-[#2F6B4F] px-2.5 py-1 rounded-full">#{t}</span>
                    ))}
                  </div>

                  <div className="bg-[#F3EEFF] rounded-xl p-3 flex items-start gap-1.5 mt-3">
                    <Icon name="sparkles" size={12} className="text-[#8B5CF6] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#6D28D9] leading-relaxed">命中理由：{item.reason}</p>
                  </div>

                  <div className="flex gap-2.5 mt-4">
                    <button type="button" onClick={() => app.go('otherProfile', { userId: u.id })}
                      className="flex-1 bg-[#F5F7F5] text-[#2F6B4F] py-2.5 rounded-full text-[13px] font-semibold active:scale-95 transition-transform">查看主页</button>
                    <button type="button" onClick={() => app.openChatWith(u.id, 1)}
                      className="flex-1 bg-[#2F6B4F] text-white py-2.5 rounded-full text-[13px] font-semibold active:scale-95 active:bg-[#22503A] transition-all">立即沟通</button>
                  </div>
                </div>
              );
            })}

            <button type="button" onClick={nextBatch}
              className="w-full bg-white text-[#2F6B4F] py-3.5 rounded-full text-[13px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform flex items-center justify-center gap-1.5">
              <Icon name="refresh-cw" size={15} /> 换一批
            </button>
            <button type="button" onClick={cancelFlow} className="mt-3 text-[11px] text-[#A8B3AD]">退出匹配</button>
          </div>
        </div>
      )}

      {/* ---------------- 换完的空状态 ---------------- */}
      {mf.phase === 'empty' && (
        <div className="px-6">
          <Header title="匹配结果" onBack={backToEntry} />
          <div className="text-center pt-20">
            <div className="text-[52px] mb-3">🫧</div>
            <h2 className="text-lg font-semibold text-[#1A2A22] mb-2">暂时没有更匹配的搭子啦</h2>
            <p className="text-xs text-[#8C9A94] leading-relaxed mb-7">去完善主页标签，或者去广场逛逛吧～</p>
            <button type="button" onClick={() => patch({ phase: 'idle' })}
              className="bg-[#2F6B4F] text-white px-7 py-3 rounded-full text-sm font-semibold active:scale-95 transition-transform">重新匹配</button>
          </div>
        </div>
      )}
    </Page>
  );
};

/* ---------------- AI 对话页（广场入口 / 我的AI助手 共用） ---------------- */
/* 聊天数据提升到 App 全局状态，路由切换（含快捷卡片跳转再返回）不丢失 */
const AI_MSGS_INIT = {
  square: [
    { type: 'text', self: true, text: '我想找个同校区的人打蓝桥杯。' },
    { type: 'text', self: false, text: '没问题，为你整理了匹配入口，点击下方卡片即可前往匹配大厅或发帖。' },
    { type: 'jump', label: '快捷跳转', buttons: [{ text: '去匹配大厅', target: 'match' }, { text: '去发帖', target: 'post' }] },
  ],
  profile: [
    { type: 'text', self: true, text: '这个平台怎么实名认证啊？' },
    { type: 'text', self: false, text: '同学你好，在注册时填写姓名、学校并完成学号或邮箱验证，即可获得【已实名】小绿盾哦~' },
    { type: 'jump', label: '实名认证指引', buttons: [{ text: '去个人中心认证', target: 'profile' }] },
  ],
};

const AIPage = () => {
  const app = useApp();
  const mode = app.route.params.mode || 'square';
  const scrollRef = useRef(null);

  const msgs = app.aiChat[mode] || [];
  const setMsgs = (updater) => app.setAiChat(prev => ({
    ...prev,
    [mode]: typeof updater === 'function' ? updater(prev[mode] || []) : updater,
  }));
  const [input, setInput] = useState('');

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs(prev => [...prev, { type: 'text', self: true, text: t }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, {
        type: 'text', self: false,
        text: mode === 'profile'
          ? '收到～你可以告诉我具体想做什么，比如「想找人做挑战杯」或「不知道怎么关闭帖子」，我来帮你。'
          : '收到～我帮你提炼了关键词：同校区、蓝桥杯、算法。你可以点上面的卡片直达匹配大厅，也可以直接去发帖。',
      }]);
    }, 800);
  };

  /* 快捷卡片跳转：push 入栈，返回时顺着历史栈回到 AI 对话页 */
  const jump = (target) => app.go(target);

  return (
    <Page
      scrollRef={scrollRef}
      contentPad="pb-[84px]"
      bottom={
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur px-3 py-2.5 pb-5 flex items-center gap-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button className="w-9 h-9 flex items-center justify-center shrink-0">
            <Icon name="mic" size={21} className="text-[#A8B3AD]" />
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="说说你想找什么搭子…"
            className="flex-1 bg-[#F9FAFB] rounded-full px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20" />
          <button onClick={send} className="w-9 h-9 rounded-full bg-[#2F6B4F] flex items-center justify-center shrink-0 active:scale-95 transition-transform">
            <Icon name="send" size={16} className="text-white" />
          </button>
        </div>
      }
    >
      <Header title="搭子 AI 助手" subtitle="校园组队专属" onBack={() => app.back()} />

      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl p-3.5 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] flex items-center justify-center shrink-0">
              <Icon name="sparkles" size={14} className="text-white" />
            </div>
            <p className="text-[11px] text-[#8C9A94] leading-relaxed">
              你好！我是你的专属 AI 组队助手。你可以：<br />
              1. 让我帮你梳理组队意向<br />
              2. 问我任何平台使用问题<br />
              3. 直接告诉我你想干嘛，我会给你快捷跳转
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {msgs.map((m, i) => {
            if (m.type === 'jump') {
              return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[86%] bg-white rounded-2xl rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon name="link" size={13} className="text-[#8B5CF6]" />
                      <span className="text-[11px] text-[#8B5CF6] font-medium">🔗 {m.label}</span>
                    </div>
                    <div className="flex gap-2">
                      {m.buttons.map(b => (
                        <button key={b.text} onClick={() => jump(b.target)}
                          className="flex-1 bg-[#2F6B4F] text-white text-[12px] py-2.5 rounded-xl active:scale-95 transition-transform whitespace-nowrap px-2">
                          {b.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed ${m.self ? 'bg-[#2F6B4F] text-white rounded-2xl rounded-tr-sm' : 'bg-white text-[#1A2A22] rounded-2xl rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
};
