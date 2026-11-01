/* ============================================================
   模块五：个人信息库（编辑态 / 预览态 / 附件折叠）
   ============================================================ */

const SECTION_META = {
  projects: { title: '项目经历', nameLabel: '项目名称', descLabel: '项目描述', placeholder: '负责了什么、取得了什么成果', icon: 'folder-open' },
  awards: { title: '获奖经历 / 资格证书', nameLabel: '证书名称', descLabel: '获奖说明', placeholder: '获奖时间、组别、等级', icon: 'award' },
  works: { title: '个人作品集', nameLabel: '作品名称', descLabel: '作品描述', placeholder: '作品内容、你的角色、链接', icon: 'palette' },
};

const InfoLibraryPage = () => {
  const app = useApp();
  const lib = app.library;

  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(lib.base);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [avatarSheet, setAvatarSheet] = useState(false);

  const [entry, setEntry] = useState(null); // { section, id }
  const [form, setForm] = useState({ name: '', desc: '', attachments: [] });
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(null); // 'image' | 'file'
  const [viewer, setViewer] = useState(null);

  const toggleEdit = () => {
    if (edit) {
      app.setLibrary(prev => ({ ...prev, base: draft }));
      app.toast('基础信息已保存');
      setEdit(false);
    } else {
      setDraft(lib.base);
      setEdit(true);
    }
  };

  const openEntry = (section, item) => {
    setForm(item
      ? { name: item.name, desc: item.desc || '', attachments: [...(item.attachments || [])] }
      : { name: '', desc: '', attachments: [] });
    setEntry({ section, id: item ? item.id : null });
  };

  const closeEntry = () => { setEntry(null); setSheet(false); setPicker(null); };

  const saveEntry = () => {
    if (!entry) return;
    const meta = SECTION_META[entry.section];
    if (!form.name.trim()) { app.toast(`请填写${meta.nameLabel}`); return; }
    const item = {
      id: entry.id || Date.now(),
      name: form.name.trim(),
      desc: form.desc.trim(),
      attachments: form.attachments,
    };
    app.setLibrary(prev => ({
      ...prev,
      [entry.section]: entry.id
        ? prev[entry.section].map(x => x.id === entry.id ? item : x)
        : [...prev[entry.section], item],
    }));
    app.toast(entry.id ? '已保存修改' : '已添加，预览态会折叠展示');
    closeEntry();
  };

  const removeEntry = (section, id) => {
    app.setLibrary(prev => ({ ...prev, [section]: prev[section].filter(x => x.id !== id) }));
    app.toast('已删除');
  };

  const changeAvatar = () => {
    const idx = Math.max(0, AVATARS.findIndex(a => a.emoji === draft.avatar.emoji));
    setDraft(d => ({ ...d, avatar: AVATARS[(idx + 1) % AVATARS.length] }));
  };

  const attachText = (a) => a.kind === 'link' ? `🔗 链接：${a.name}` : a.kind === 'image' ? `🖼️ 查看附件：${a.name}` : `📄 查看附件：${a.name}`;

  const Row = ({ label, view }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#F3F7F5] last:border-0">
      <span className="text-[11px] text-[#9CA3AF] w-[62px] shrink-0 pt-1.5">{label}</span>
      <div className="flex-1 min-w-0 text-[12px] text-[#1F2937] leading-relaxed break-all">{view}</div>
    </div>
  );

  const inputCls = 'w-full bg-[#F4FAF8] rounded-lg px-2.5 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-brand/40';

  const SectionHead = ({ title, icon, right }) => (
    <div className="flex items-center gap-2 mb-1">
      <Icon name={icon} size={14} className="text-brand" />
      <span className="text-[13px] font-semibold text-[#1F2937] flex-1">{title}</span>
      {right}
    </div>
  );

  const renderItems = (section) => {
    const items = lib[section];
    const meta = SECTION_META[section];
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <SectionHead
          title={meta.title}
          icon={meta.icon}
          right={
            <button onClick={() => openEntry(section)} className="text-[11px] text-[#0F9F76] bg-[#E6F7F2] px-2.5 py-1 rounded-full active:scale-95 transition-transform flex items-center gap-0.5">
              <Icon name="plus" size={11} /> 添加
            </button>
          }
        />
        {items.length === 0 && (
          <div className="text-[11px] text-[#C4CDD5] text-center py-5">还没有添加{meta.title}，点击右上角「添加」</div>
        )}
        {items.map((it, idx) => (
          <div key={it.id} className="mt-3 pt-3 border-t border-[#F3F7F5] first:mt-1">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-[#1F2937]">{it.name}</div>
                {it.desc && <p className="text-[11px] text-[#4B5563] leading-[1.8] mt-1">{it.desc}</p>}
              </div>
              {edit && (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEntry(section, it)} className="text-[10px] text-[#0F9F76] bg-[#E6F7F2] px-2 py-1 rounded-full">✏️ 编辑</button>
                  <button onClick={() => removeEntry(section, it.id)} className="text-[10px] text-[#EF4444] bg-[#FEF2F2] px-2 py-1 rounded-full">删除</button>
                </div>
              )}
            </div>

            {(it.attachments || []).length > 0 && (
              <div className="mt-2 space-y-1.5">
                {edit ? (
                  <div className="flex flex-wrap gap-1.5">
                    {it.attachments.map((a, i) => <AttachChip key={i} a={a} />)}
                  </div>
                ) : (
                  it.attachments.map((a, i) => (
                    <button key={i} onClick={() => setViewer(a)}
                      className="block text-[11px] text-[#0F9F76] bg-[#E6F7F2] rounded-lg px-2.5 py-1.5 active:scale-[0.98] transition-transform">
                      [{attachText(a)}]
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Page
      overlays={
        <>
          {/* 经历 / 证书 / 作品 编辑弹窗 */}
          <Modal
            open={!!entry}
            onClose={closeEntry}
            title={entry ? `${SECTION_META[entry.section].title} · ${entry.id ? '编辑' : '添加'}` : ''}
            maxH="max-h-[84%]"
            footer={
              <div className="p-4 border-t border-[#EEF5F2] shrink-0">
                <button onClick={saveEntry} className="w-full bg-brand text-white py-3.5 rounded-xl text-[14px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">
                  保存
                </button>
              </div>
            }
          >
            {entry && (
              <div className="p-4 space-y-3.5">
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1.5">{SECTION_META[entry.section].nameLabel}</div>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={`请输入${SECTION_META[entry.section].nameLabel}`}
                    className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-3 text-[13px] focus:outline-none" />
                </div>
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1.5">{SECTION_META[entry.section].descLabel}</div>
                  <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                    rows={4} placeholder={SECTION_META[entry.section].placeholder}
                    className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-3 text-[13px] leading-relaxed focus:outline-none resize-none" />
                </div>
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1.5">附件 / 链接</div>
                  {form.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.attachments.map((a, i) => (
                        <AttachChip key={i} a={a} onRemove={() => setForm(f => ({ ...f, attachments: f.attachments.filter((_, j) => j !== i) }))} />
                      ))}
                    </div>
                  )}
                  <button onClick={() => setSheet(true)}
                    className="w-full border-2 border-dashed border-[#DDE7E3] rounded-xl py-5 flex flex-col items-center justify-center gap-1 active:bg-[#F8FBFA] transition-colors">
                    <Icon name="paperclip" size={20} className="text-[#9CA3AF]" />
                    <span className="text-[11px] text-[#9CA3AF]">📎 上传附件 / 链接</span>
                  </button>
                </div>
              </div>
            )}
          </Modal>

          <ActionSheet
            open={sheet}
            onClose={() => setSheet(false)}
            actions={[
              { label: '从相册选择图片', onClick: () => setPicker('image') },
              { label: '选择文件', onClick: () => setPicker('file') },
              { label: '添加外部链接', onClick: () => setForm(f => ({ ...f, attachments: [...f.attachments, { name: 'GitHub 仓库链接', kind: 'link' }] })) },
            ]}
          />

          <MockMediaPicker
            open={!!picker}
            onClose={() => setPicker(null)}
            mode={picker || 'image'}
            onPick={(f) => setForm(fm => ({ ...fm, attachments: [...fm.attachments, f] }))}
          />

          <SchoolPicker
            open={schoolOpen}
            onClose={() => setSchoolOpen(false)}
            value={{ name: draft.school, campus: draft.campus }}
            onSelect={(s) => { setDraft(d => ({ ...d, school: s.name, campus: s.campus })); setSchoolOpen(false); }}
          />

          {/* 预览态点击附件 */}
          <Modal open={!!viewer} onClose={() => setViewer(null)} title="附件预览" maxH="max-h-[70%]">
            {viewer && (
              <div className="p-5">
                {viewer.kind === 'image' ? (
                  <div className="rounded-2xl bg-gradient-to-br from-[#D1FAE5] to-[#10B981] h-44 flex flex-col items-center justify-center text-white">
                    <span className="text-4xl">🖼️</span>
                    <span className="text-[12px] mt-2">{viewer.name}</span>
                  </div>
                ) : viewer.kind === 'link' ? (
                  <div className="rounded-2xl bg-[#F4FAF8] p-6 text-center">
                    <Icon name="link" size={30} className="text-brand mx-auto mb-2" />
                    <div className="text-[13px] font-medium text-[#1F2937]">{viewer.name}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">https://github.com/zhouran/match-demo</div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#F4FAF8] p-6 text-center">
                    <Icon name="file-text" size={34} className="text-brand mx-auto mb-2" />
                    <div className="text-[13px] font-medium text-[#1F2937]">{viewer.name}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">该附件仅你本人与组队成员可见</div>
                  </div>
                )}
                <p className="text-[10px] text-[#9CA3AF] text-center mt-4">附件已存入个人信息库，仅在组队自证时使用</p>
              </div>
            )}
          </Modal>

          <ActionSheet
            open={avatarSheet}
            onClose={() => setAvatarSheet(false)}
            actions={[
              { label: '拍照', onClick: changeAvatar },
              { label: '从相册选择', onClick: changeAvatar },
            ]}
          />

          <SplitSkillPicker
            open={skillOpen}
            onClose={() => setSkillOpen(false)}
            value={lib.skills}
            onConfirm={(v) => {
              app.setLibrary(prev => ({ ...prev, skills: v }));
              setSkillOpen(false);
              app.toast('技能标签已更新');
            }}
          />
        </>
      }
    >
      <Header
        title="个人信息库"
        subtitle={edit ? '编辑态 · 修改后记得保存' : '预览态 · 附件已折叠'}
        onBack={() => app.back()}
        right={
          <button onClick={toggleEdit} className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full active:scale-95 transition-transform ${edit ? 'bg-brand text-white' : 'bg-[#E6F7F2] text-[#0F9F76]'}`}>
            {edit ? '预览' : '编辑'}
          </button>
        }
      />

      <div className="px-4 pt-3 space-y-3 pb-6">
        {/* 1. 基础信息 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHead
            title="基础信息"
            icon="user"
            right={
              <button onClick={toggleEdit} className="text-[11px] text-[#0F9F76] bg-[#E6F7F2] px-2.5 py-1 rounded-full active:scale-95 transition-transform">
                {edit ? '✓ 保存' : '✏️ 编辑'}
              </button>
            }
          />

          <div className="flex items-center gap-3 py-2.5 border-b border-[#F3F7F5]">
            <span className="text-[11px] text-[#9CA3AF] w-[62px] shrink-0">头像</span>
            <Avatar src={draft.avatar} size={48} />
            {edit && (
              <button onClick={() => setAvatarSheet(true)} className="text-[10px] text-[#0F9F76] bg-[#E6F7F2] px-2.5 py-1 rounded-full">更换头像</button>
            )}
          </div>

          <Row label="网名" view={edit
            ? <input value={draft.nickname} onChange={e => setDraft(d => ({ ...d, nickname: e.target.value }))} className={inputCls} />
            : draft.nickname} />

          <Row label="真实姓名" view={edit
            ? <div className="flex items-center gap-1.5">
                <input value={draft.realName} onChange={e => setDraft(d => ({ ...d, realName: e.target.value }))} className={inputCls} />
                <Icon name="shield-check" size={13} className="text-brand shrink-0" />
              </div>
            : <span className="inline-flex items-center gap-1">{draft.realName}<Icon name="shield-check" size={13} className="text-brand" /></span>} />

          <Row label="学校 / 校区" view={edit
            ? <button onClick={() => setSchoolOpen(true)} className="w-full flex items-center justify-between bg-[#F4FAF8] rounded-lg px-2.5 py-2 text-[12px] text-left">
                <span>{draft.school}({draft.campus})</span>
                <Icon name="chevron-down" size={13} className="text-[#9CA3AF]" />
              </button>
            : `${draft.school}(${draft.campus})`} />

          <Row label="专业班级" view={edit
            ? <input value={draft.majorClass} onChange={e => setDraft(d => ({ ...d, majorClass: e.target.value }))} className={inputCls} />
            : draft.majorClass} />

          <Row label="年级" view={edit
            ? <input value={draft.grade} onChange={e => setDraft(d => ({ ...d, grade: e.target.value }))} className={inputCls} />
            : draft.grade} />

          <Row label="微信" view={edit
            ? <input value={draft.wechat} onChange={e => setDraft(d => ({ ...d, wechat: e.target.value }))} className={inputCls} />
            : draft.wechat} />

          <Row label="QQ" view={edit
            ? <input value={draft.qq} onChange={e => setDraft(d => ({ ...d, qq: e.target.value }))} className={inputCls} />
            : draft.qq} />

          <Row label="邮箱" view={edit
            ? <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} className={inputCls} />
            : draft.email} />

          {!edit && (
            <div className="mt-2 bg-[#F8FBFA] rounded-xl px-3 py-2">
              <p className="text-[10px] text-[#9CA3AF] leading-relaxed">🔒 联系方式仅在你主动交换后对搭子可见，不会公开展示。</p>
            </div>
          )}
        </div>

        {/* 2. 技能标签 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHead
            title="技能标签"
            icon="zap"
            right={
              <button onClick={() => setSkillOpen(true)} className="text-[11px] text-[#0F9F76] bg-[#E6F7F2] px-2.5 py-1 rounded-full active:scale-95 transition-transform flex items-center gap-0.5">
                <Icon name="plus" size={11} /> 添加
              </button>
            }
          />
          {lib.skills.length === 0 ? (
            <div className="text-[11px] text-[#C4CDD5] text-center py-5">还没有技能标签</div>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {lib.skills.map(t => (
                <span key={t} className="inline-flex items-center gap-1 bg-[#E6F7F2] border border-[#20C997] text-[#0F9F76] rounded-full px-2.5 py-1 text-[11px]">
                  #{t}
                  {edit && (
                    <button onClick={() => app.setLibrary(prev => ({ ...prev, skills: prev.skills.filter(x => x !== t) }))}>
                      <Icon name="x" size={10} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3、4、5 经历 / 证书 / 作品集 */}
        {renderItems('projects')}
        {renderItems('awards')}
        {renderItems('works')}

        <div className="text-center text-[10px] text-[#C4CDD5] pt-1 pb-2 leading-relaxed">
          所有经历与附件均为选填 · 附件默认折叠，仅组队自证时查看
        </div>
      </div>
    </Page>
  );
};
