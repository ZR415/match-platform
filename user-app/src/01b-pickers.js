/* ---------------- 学校选择器：可搜索 + A-Z 分组 + 校区合并 ---------------- */
const SchoolPicker = ({ open, onClose, value, onSelect }) => {
  const [q, setQ] = useState('');
  useEffect(() => { if (open) setQ(''); }, [open]);

  const full = (s) => `${s.name || ''} · ${s.campus || ''}`;
  const keyword = q.trim();

  /* 相关性排序：校名以关键字开头 → 校名包含 → 校区包含 → 其他包含 */
  const rank = (s) => {
    if (!keyword) return 0;
    const name = s.name || '';
    if (name.startsWith(keyword)) return 0;
    if (name.includes(keyword)) return 1;
    if ((s.campus || '').includes(keyword)) return 2;
    if (full(s).includes(keyword)) return 3;
    return 9;
  };

  const list = SCHOOLS
    .filter(s => !keyword || rank(s) < 9)
    .sort((a, b) => (keyword ? rank(a) - rank(b) || a.name.localeCompare(b.name, 'zh') : 0));

  const groups = {};
  list.forEach(s => {
    const k = keyword ? '搜索结果' : (s.letter || '其他');
    (groups[k] = groups[k] || []).push(s);
  });
  /* 输入关键字但没有命中时不能返回不存在的分组，否则 groups[k] 为 undefined 会让页面白屏 */
  const groupKeys = keyword ? (groups['搜索结果'] ? ['搜索结果'] : []) : Object.keys(groups).sort();

  return (
    <Modal open={open} onClose={onClose} title="选择学校与校区" maxH="max-h-[84%]">
      <div className="sticky top-0 z-10 bg-white px-4 pt-3 pb-3 border-b border-[#EEF5F2]">
        <div className="flex items-center gap-2 bg-[#F4FAF8] rounded-full px-3.5 py-2.5">
          <Icon name="search" size={16} className="text-[#9CA3AF]" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="输入学校名，如「成都」"
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
          {q && <button type="button" onClick={() => setQ('')}><Icon name="x" size={14} className="text-[#9CA3AF]" /></button>}
        </div>
      </div>
      <div className="px-4 pb-6">
        {groupKeys.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-sm text-[#9CA3AF]">没有找到相关学校</div>
            <div className="text-[11px] text-[#C4CDD5] mt-1.5">试试只输入校名中的两个字，如「成都」</div>
          </div>
        )}
        {groupKeys.map(k => (
          <div key={k}>
            <div className="text-[11px] font-semibold text-[#9CA3AF] mt-3 mb-1">{k}</div>
            {(groups[k] || []).map((s, i) => {
              const active = value && value.name === s.name && value.campus === s.campus;
              return (
                <button
                  key={`${s.name}-${s.campus}-${i}`}
                  onClick={() => onSelect(s)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl mb-1 ${active ? 'bg-[#E6F7F2]' : 'active:bg-[#F7FBFA]'}`}
                >
                  <div className="text-left">
                    <div className={`text-sm ${active ? 'text-[#0F9F76] font-medium' : 'text-[#1F2937]'}`}>{s.name}</div>
                    <div className="text-[11px] text-[#9CA3AF]">{s.campus}{s.emailDisabled ? ' · 仅支持学号验证' : ''}</div>
                  </div>
                  {active && <Icon name="check" size={16} className="text-brand" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
};

/* ---------------- 多选标签弹窗（目标要求等） ---------------- */
const MultiTagModal = ({ open, onClose, title, groups, value = [], onConfirm }) => {
  const [sel, setSel] = useState(value);
  useEffect(() => { if (open) setSel(value); }, [open]);
  const toggle = (t) => setSel(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  return (
    <Modal
      open={open} onClose={onClose} title={title} maxH="max-h-[78%]"
      footer={
        <div className="p-4 border-t border-[#EEF5F2] shrink-0">
          <button onClick={() => onConfirm(sel)} className="w-full bg-brand text-white py-3 rounded-xl text-sm font-medium active:bg-[#12A17A] active:scale-95 transition-all">
            确定{sel.length ? `（${sel.length}）` : ''}
          </button>
        </div>
      }
    >
      <div className="p-4 space-y-4">
        {groups.map(g => (
          <div key={g.name}>
            <div className="text-[12px] font-medium text-[#1F2937] mb-2">{g.name}</div>
            <div className="flex flex-wrap gap-2">
              {g.tags.map(t => <TagChip key={t} active={sel.includes(t)} onClick={() => toggle(t)}>{t}</TagChip>)}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

/* ---------------- 技能选择器：左右分栏 ---------------- */
const SplitSkillPicker = ({ open, onClose, value = [], onConfirm }) => {
  const [picked, setPicked] = useState(value);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(0);
  useEffect(() => { if (open) { setPicked(value); setQ(''); setCat(0); } }, [open]);

  const keyword = q.trim();
  const list = useMemo(() => {
    if (keyword) {
      return SKILL_GROUPS.flatMap(g => g.tags.map(t => ({ t, g: g.name }))).filter(x => x.t.includes(keyword));
    }
    return SKILL_GROUPS[cat].tags.map(t => ({ t, g: SKILL_GROUPS[cat].name }));
  }, [q, cat]);

  const toggle = (t) => setPicked(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <Modal
      open={open} onClose={onClose} maxH="max-h-[88%]"
      footer={
        <div className="p-4 border-t border-[#EEF5F2] shrink-0 bg-white">
          <button onClick={() => onConfirm(picked)} className="w-full bg-brand text-white py-3 rounded-xl text-sm font-medium active:bg-[#12A17A] active:scale-95 transition-all">
            确定添加{picked.length ? `（${picked.length}）` : ''}
          </button>
        </div>
      }
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-[#1F2937]">添加个人技能</div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <Icon name="x" size={18} className="text-[#9CA3AF]" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#F4FAF8] rounded-full px-3.5 py-2.5 mb-3">
          <Icon name="search" size={16} className="text-[#9CA3AF]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜索技能名称" className="flex-1 text-sm bg-transparent focus:outline-none" />
        </div>

        <div className="mb-3">
          <div className="text-[11px] text-[#9CA3AF] mb-1.5">已选标签（点击 × 可取消）</div>
          {picked.length === 0 ? (
            <div className="text-[11px] text-[#C4CDD5] bg-[#F4FAF8] rounded-xl px-3 py-2.5">还没有选择技能，去右侧点选吧</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {picked.map(t => (
                <span key={t} className="inline-flex items-center gap-1 bg-[#E6F7F2] border border-[#20C997] text-[#0F9F76] rounded-full px-2.5 py-1 text-[11px]">
                  {t}
                  <button onClick={() => toggle(t)} className="w-3.5 h-3.5 rounded-full bg-[#BFE9DC] flex items-center justify-center">
                    <Icon name="x" size={9} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-[#EEF5F2] pt-3" style={{ height: 330 }}>
          <div className="w-[30%] overflow-y-auto no-scrollbar pr-1">
            {SKILL_GROUPS.map((g, i) => (
              <button
                key={g.name}
                onClick={() => { setCat(i); setQ(''); }}
                className={`w-full text-left text-[12px] py-2.5 px-2 rounded-lg mb-1 ${i === cat && !keyword ? 'bg-[#E6F7F2] text-[#0F9F76] font-medium' : 'text-[#4B5563]'}`}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="w-[70%] overflow-y-auto no-scrollbar pl-1">
            {keyword && <div className="text-[11px] text-[#9CA3AF] mb-1.5">共 {list.length} 个结果</div>}
            {list.length === 0 && <div className="text-[11px] text-[#9CA3AF] py-6 text-center">没有匹配的技能</div>}
            <div className="grid grid-cols-2 gap-2">
              {list.map(({ t, g }) => {
                const on = picked.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggle(t)}
                    className={`relative rounded-lg border px-2.5 py-2 text-[11px] text-left leading-tight ${on ? 'bg-[#E6F7F2] border-[#20C997] text-[#0F9F76] font-medium' : 'bg-white border-[#E7EDEA] text-[#4B5563]'}`}
                  >
                    <div className="truncate">{t}</div>
                    {keyword && <div className="text-[9px] text-[#9CA3AF] truncate mt-0.5">{g}</div>}
                    {on && (
                      <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-[#20C997] text-white flex items-center justify-center">
                        <Icon name="check" size={9} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* ---------------- 竞赛选择器（搜索 + 多选） ---------------- */
const COMPETITION_GROUPS = [
  { name: '计算机类', tags: ['蓝桥杯', 'ACM-ICPC', 'CCPC 中国大学生程序设计竞赛', '团体程序设计天梯赛', '中国大学生计算机设计大赛', '中国高校计算机大赛', '全国大学生信息安全竞赛', '华为软件精英挑战赛', '百度之星程序设计大赛', '睿抗机器人开发者大赛'] },
  { name: '创新创业类', tags: ['互联网+', '挑战杯', '挑战杯-创业计划', '大创项目', '创青春', '三创赛', '创客中国', '中国创新创业大赛', '服务外包创新创业大赛', '青年红色筑梦之旅'] },
  { name: '数学建模类', tags: ['全国大学生数学建模竞赛', '美赛 MCM/ICM', '统计建模大赛', '全国大学生数学竞赛', '物理实验竞赛', '电工数学建模竞赛', '五一数学建模竞赛'] },
  { name: '商科类', tags: ['市场调查与分析大赛', '企业竞争模拟大赛', '商业案例分析大赛', '沙盘模拟经营大赛', '金融挑战赛', '会计技能大赛', '电子商务三创赛'] },
  { name: '外语类', tags: ['外研社杯英语演讲大赛', '外研社杯英语写作大赛', '外研社杯英语阅读大赛', '全国大学生英语竞赛', '21世纪杯英语演讲比赛', '词达人杯词汇大赛', '跨文化能力大赛'] },
  { name: '设计·传媒类', tags: ['大广赛', '学院奖', '数字媒体艺术大赛', 'UI/UX 设计大赛', '新媒体创意大赛', '工业设计大赛', '米兰设计周高校作品展'] },
  { name: '其他', tags: ['全国大学生电子设计竞赛', '机械创新设计大赛', '中国机器人大赛', '化学实验竞赛', '志愿服务项目大赛', '辩论赛', '大学生职业规划大赛'] },
];

const CompetitionPicker = ({ open, onClose, value = [], onConfirm }) => {
  const [sel, setSel] = useState(value);
  const [cat, setCat] = useState(0);
  const [q, setQ] = useState('');
  useEffect(() => { if (open) { setSel(value); setCat(0); setQ(''); } }, [open]);
  const toggle = (c) => setSel(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const keyword = q.trim();
  /* 搜索态跨分类平铺结果，非搜索态只看当前分类 */
  const tags = keyword
    ? [...new Set(COMPETITION_GROUPS.reduce((acc, g) => acc.concat(g.tags), []))].filter(t => t.toLowerCase().includes(keyword.toLowerCase()))
    : (COMPETITION_GROUPS[cat]?.tags || []);

  return (
    <Drawer open={open} onClose={onClose} title="选择意向竞赛" h="76%">
      <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-full px-3.5 py-2.5 mb-3">
        <Icon name="search" size={15} className="text-[#8C9A94]" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="搜索比赛，如「蓝桥杯」「建模」"
          className="flex-1 text-[12px] bg-transparent focus:outline-none"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} className="active:scale-90 transition-transform">
            <Icon name="x" size={13} className="text-[#8C9A94]" />
          </button>
        )}
      </div>
      <div className="flex gap-2" style={{ height: 400 }}>
        {/* 左侧分类 30% */}
        <div className="w-[30%] overflow-y-auto no-scrollbar pr-1">
          {COMPETITION_GROUPS.map((g, i) => (
            <button key={g.name} onClick={() => { setCat(i); setQ(''); }}
              className={`w-full text-left text-[12px] py-2.5 px-2 rounded-lg mb-1 transition-colors ${i === cat && !keyword ? 'bg-[#E8F0EB] text-[#2F6B4F] font-semibold' : 'text-[#4A5551] active:bg-[#F7FAF8]'}`}>
              {g.name}
            </button>
          ))}
        </div>
        {/* 右侧标签 70% */}
        <div className="w-[70%] overflow-y-auto no-scrollbar pl-1">
          {sel.length > 0 && (
            <div className="text-[11px] text-[#8C9A94] mb-1.5">已选 {sel.length} 项</div>
          )}
          {tags.length === 0 && <div className="text-[12px] text-[#B0BBB5] py-6 text-center">没有找到相关比赛</div>}
          <div className="flex flex-wrap gap-2">
            {tags.map(t => {
              const on = sel.includes(t);
              return (
                <button key={t} onClick={() => toggle(t)}
                  className={`px-3 py-2 rounded-xl text-[12px] transition-all active:scale-95 ${on ? 'bg-[#E8F0EB] text-[#2F6B4F] font-semibold ring-1 ring-[#2F6B4F]/40' : 'bg-[#F9FAFB] text-[#4A5551]'}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pt-3 mt-1 border-t border-[#F3F6F4]">
        <button onClick={() => onConfirm(sel)} className="w-full bg-[#2F6B4F] text-white py-3.5 rounded-full text-sm font-semibold shadow-[0_8px_20px_rgba(47,107,79,0.2)] active:scale-95 transition-transform">
          确定{sel.length ? `（${sel.length}）` : ''}
        </button>
      </div>
    </Drawer>
  );
};

/* ---------------- 模拟相册 / 文件选择 ---------------- */
const MockMediaPicker = ({ open, onClose, mode = 'image', onPick }) => {
  const images = [
    { name: 'IMG_2031.jpg', emoji: '🏅', bg: 'from-[#FDE68A] to-[#F59E0B]' },
    { name: 'IMG_2032.jpg', emoji: '📊', bg: 'from-[#BFDBFE] to-[#3B82F6]' },
    { name: 'IMG_2033.jpg', emoji: '🧑‍💻', bg: 'from-[#D1FAE5] to-[#10B981]' },
    { name: 'IMG_2034.jpg', emoji: '🏫', bg: 'from-[#E9D5FF] to-[#8B5CF6]' },
    { name: 'IMG_2035.jpg', emoji: '📱', bg: 'from-[#FECDD3] to-[#F43F5E]' },
    { name: 'IMG_2036.jpg', emoji: '📝', bg: 'from-[#FEF3C7] to-[#D97706]' },
    { name: 'IMG_2037.jpg', emoji: '🎓', bg: 'from-[#CFFAFE] to-[#0891B2]' },
    { name: 'IMG_2038.jpg', emoji: '🚀', bg: 'from-[#FFE4E6] to-[#E11D48]' },
    { name: 'IMG_2039.jpg', emoji: '📁', bg: 'from-[#E5E7EB] to-[#6B7280]' },
  ];
  const files = [
    { name: '项目计划书.pdf', size: '1.2MB' },
    { name: '个人简历_周冉.pdf', size: '480KB' },
    { name: '获奖证书扫描件.pdf', size: '2.4MB' },
    { name: '作品集_2024.pdf', size: '8.6MB' },
  ];
  return (
    <Drawer open={open} onClose={onClose} title={mode === 'image' ? '从相册选择' : '选择文件'} h="68%">
      {mode === 'image' ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map(img => (
            <button
              key={img.name}
              onClick={() => { onPick({ name: img.name, kind: 'image' }); onClose(); }}
              className={`aspect-square rounded-xl bg-gradient-to-br ${img.bg} flex flex-col items-center justify-center active:scale-95 transition-transform`}
            >
              <span className="text-2xl">{img.emoji}</span>
              <span className="text-[9px] text-white/90 mt-1">{img.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(f => (
            <button
              key={f.name}
              onClick={() => { onPick({ name: f.name, kind: 'file' }); onClose(); }}
              className="w-full flex items-center gap-3 bg-[#F4FAF8] rounded-xl p-3 active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Icon name="file-text" size={20} className="text-brand" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm text-[#1F2937] truncate">{f.name}</div>
                <div className="text-[11px] text-[#9CA3AF]">{f.size}</div>
              </div>
              <Icon name="chevron-right" size={16} className="text-[#9CA3AF]" />
            </button>
          ))}
        </div>
      )}
    </Drawer>
  );
};

/* ---------------- 举报 / 投诉表单 ---------------- */
const ReportForm = ({ open, onClose, title = '投诉举报', onSubmit }) => {
  const [reason, setReason] = useState('');
  const [text, setText] = useState('');
  const [imgs, setImgs] = useState([]);
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);

  useEffect(() => { if (open) { setReason(''); setText(''); setImgs([]); } }, [open]);

  return (
    <>
      <Drawer open={open} onClose={onClose} title={title} h="80%">
        <div className="space-y-4">
          <div>
            <div className="text-[12px] font-medium text-[#1F2937] mb-2">请选择原因</div>
            <div className="space-y-1.5">
              {REPORT_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full flex items-center gap-3 text-left py-2.5 px-3.5 rounded-xl text-sm ${reason === r ? 'bg-[#E6F7F2] text-[#0F9F76] font-medium' : 'bg-[#F4FAF8] text-[#1F2937]'}`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${reason === r ? 'border-brand bg-brand' : 'border-[#C9D6D1]'}`}>
                    {reason === r && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#1F2937] mb-2">补充说明</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              placeholder="请描述具体情况，便于我们核实"
              className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-3 text-sm focus:outline-none resize-none"
            />
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#1F2937] mb-2">上传截图（选填）</div>
            <div className="flex gap-2 flex-wrap">
              {imgs.map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D1FAE5] to-[#10B981] flex items-center justify-center relative">
                  <span className="text-xl">🖼️</span>
                  <button onClick={() => setImgs(imgs.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
                    <Icon name="x" size={11} className="text-[#EF4444]" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSheet(true)} className="w-16 h-16 rounded-xl border-2 border-dashed border-[#DDE7E3] flex items-center justify-center">
                <Icon name="image-plus" size={20} className="text-[#9CA3AF]" />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              if (!reason) return;
              onClose();
              onSubmit && onSubmit(reason);
            }}
            className={`w-full py-3.5 rounded-xl text-sm font-medium active:scale-95 transition-transform ${reason ? 'bg-[#EF4444] text-white' : 'bg-[#FCA5A5] text-white'}`}
          >
            提交举报
          </button>
        </div>
      </Drawer>

      <ActionSheet
        open={sheet}
        onClose={() => setSheet(false)}
        actions={[
          { label: '从相册选择图片', onClick: () => setPicker(true) },
          { label: '选择文件', onClick: () => setPicker(true) },
        ]}
      />
      <MockMediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        mode="image"
        onPick={(f) => setImgs(prev => [...prev, f])}
      />
    </>
  );
};
