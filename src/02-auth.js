/* ============================================================
   模块一：准入与认证
   ============================================================ */

/* ---------- 隐私政策 ---------- */
const AGREEMENT_TEXT = [
  { h: '一、服务说明', p: '搭子Match（以下简称"本平台"）是面向在校大学生的校园组队信息服务平台。本平台仅提供信息发布与沟通工具，不参与用户之间的实际合作，不对合作结果作出任何承诺或担保。' },
  { h: '二、账号注册与实名认证', p: '用户需使用真实有效的手机号注册，并完成姓名、学校、专业、班级等信息填写。为保障校园社区的真实性，本平台可能要求用户通过学号或校园邮箱完成身份核验。同一用户不得注册多个账号用于发布重复信息。' },
  { h: '三、用户行为规范', p: '用户不得发布虚假组队信息、虚构项目背景，不得以组队名义收取费用、推销课程或实施诈骗；不得对他人进行骚扰、辱骂、歧视性言论；不得发布与校园组队无关的广告、代写代考等内容。' },
  { h: '四、内容与知识产权', p: '用户发布的文字、图片等内容由用户自行负责，用户应确保拥有相应权利。用户授予本平台在平台范围内展示、存储该内容的非独占许可。' },
  { h: '五、免责声明', p: '本平台不对用户之间因合作产生的纠纷承担责任，但会在能力范围内提供沟通记录、举报处理等协助。因不可抗力、系统故障导致的服务中断，本平台不承担赔偿责任。' },
  { h: '六、协议变更与终止', p: '本平台可根据业务需要更新本协议，更新后将在应用内公示。若用户继续使用，视为接受更新后的协议。用户可随时申请注销账号。' },
];

const PRIVACY_TEXT = [
  { h: '一、我们收集的信息', p: '为完成校园身份核验与组队匹配，我们会收集你主动填写的姓名、学校、校区、专业、班级、年级、联系方式，以及你上传的头像、经历与附件。我们还会记录必要的设备信息与操作日志，用于安全风控。' },
  { h: '二、信息的使用', p: '上述信息仅用于：1）在校生真实身份确认；2）向你推荐更匹配的组队信息；3）处理举报、纠纷与安全事件；4）改进产品体验。我们不会将你的信息用于与上述目的无关的用途。' },
  { h: '三、信息的展示与共享', p: '未经你的同意，我们不会在平台公开展示你的真实姓名与联系方式。你在资料页设置"公开专业/公开姓名"后，相关字段才会对他人可见。除法律法规要求外，我们不会向第三方提供你的个人信息。' },
  { h: '四、存储与保护', p: '你的信息存储于境内服务器，传输过程采用加密通道。我们采用访问控制、脱敏展示等措施保护数据安全。账号注销后，我们将在 30 日内删除或匿名化处理你的个人信息。' },
  { h: '五、你的权利', p: '你有权查询、更正、删除你的个人信息，也有权撤回授权、注销账号。可在"我的-个人信息库"中自行管理，或通过帮助与反馈联系我们。' },
  { h: '六、未成年人保护', p: '本平台面向年满 16 周岁的在校学生。若你未满 16 周岁，请在监护人陪同下阅读本政策并取得同意后使用。' },
  { h: '七、联系我们', p: '如对本政策有任何疑问，可通过"我的-帮助与反馈"提交，我们将在 3 个工作日内回复。' },
];

const AgreementModal = ({ open, onClose, type, onBack }) => {
  const isUser = type === 'user';
  const data = isUser ? AGREEMENT_TEXT : PRIVACY_TEXT;
  return (
    <Modal open={open} onClose={onClose} title={isUser ? '用户协议' : '隐私政策'} maxH="max-h-[86%]"
      footer={
        <div className="p-4 border-t border-[#EEF5F2] shrink-0">
          <button onClick={onClose} className="w-full bg-brand text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform">我已阅读并知晓</button>
        </div>
      }
    >
      <div className="px-4 py-3">
        <div className="text-[11px] text-[#9CA3AF] mb-3">更新日期：2026 年 10 月 1 日 · 生效日期：2026 年 10 月 8 日</div>
        {data.map((sec, i) => (
          <div key={i} className="mb-4">
            <div className="text-[13px] font-semibold text-[#1F2937] mb-1.5">{sec.h}</div>
            <p className="text-[12px] text-[#4B5563] leading-[1.85]">{sec.p}</p>
          </div>
        ))}
        <div className="text-center text-[11px] text-[#C4CDD5] pb-3">—— 成都信息工程大学 · 搭子Match 产品组</div>
      </div>
    </Modal>
  );
};

const PrivacyPage = () => {
  const app = useApp();
  const [modal, setModal] = useState(null);
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#20C997] to-[#12A17A] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 pt-8 pb-6">
        <div className="text-center mb-7">
          <div className="w-[76px] h-[76px] rounded-[24px] bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon name="users" size={38} className="text-brand" />
          </div>
          <h1 className="text-[30px] font-bold text-white tracking-tight">搭子Match</h1>
          <p className="text-white/85 text-[13px] mt-1.5">找到你的校园组队搭子</p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="shield-check" size={18} className="text-brand" />
            <h3 className="text-[15px] font-semibold text-[#1F2937]">隐私政策与用户协议</h3>
          </div>
          <p className="text-[12px] text-[#4B5563] leading-[1.9]">
            欢迎使用搭子Match，我们将收集您的学校、专业等个人信息，用于在校生真实身份确认。我们承诺保护您的个人隐私，不会在您不同意的情况下在平台展示您的真实信息，也不会向第三方泄露。点击同意即表示您已阅读并同意
            <span onClick={() => setModal('user')} className="text-[#10B981] underline underline-offset-2 mx-0.5 active:opacity-70">《用户协议》</span>
            和
            <span onClick={() => setModal('privacy')} className="text-[#10B981] underline underline-offset-2 mx-0.5 active:opacity-70">《隐私政策》</span>
            。
          </p>
          <button
            onClick={() => app.go('register')}
            className="w-full mt-5 bg-brand text-white py-3.5 rounded-2xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all shadow-lg shadow-brand/20"
          >
            同意并继续
          </button>
        </div>
      </div>

      <AgreementModal open={!!modal} onClose={() => setModal(null)} type={modal} />
    </div>
  );
};

/* ---------- 注册 ---------- */
const RegisterPage = () => {
  const app = useApp();
  const [mode, setMode] = useState('login'); // login / register
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const validPhone = /^1\d{10}$/.test(phone);
  const validCode = /^\d{4,6}$/.test(code);
  const canSubmit = validPhone && validCode && (mode === 'login' || name.trim().length >= 1);

  /* 登录与注册是两条完全独立的路径：
     - 登录（老用户）：直接进入广场，不再走实名认证与完善资料；
     - 注册（新用户）：实名认证 → 完善资料三步曲 → 广场。 */
  const submit = () => {
    if (!validPhone) { app.toast('请输入正确的手机号'); return; }
    if (!validCode) { app.toast('请输入验证码'); return; }

    if (mode === 'login') {
      app.tab('square');
      return;
    }

    if (!name.trim()) { app.toast('请设置网名'); return; }
    app.go('auth');
  };

  return (
    <Page>
      <div className="px-6 pt-2">
        <button onClick={() => app.back()} className="w-9 h-9 flex items-center justify-center -ml-2 mb-2">
          <Icon name="chevron-left" size={22} className="text-[#1F2937]" />
        </button>

        {/* 登录 / 注册 双轨 Tab */}
        <div className="flex items-end gap-6 mb-2">
          {[
            { k: 'login', label: '登录' },
            { k: 'register', label: '注册' },
          ].map(t => (
            <button key={t.k} type="button" onClick={() => setMode(t.k)}
              className={`relative pb-1 text-[24px] font-bold transition-colors ${mode === t.k ? 'text-[#1F2937]' : 'text-[#C4CDD5]'}`}>
              {t.label}
              {mode === t.k && <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-brand rounded-full" />}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-[#9CA3AF] mb-8">{mode === 'login' ? '欢迎回来，继续你的校园组队之旅' : '填写信息，开启校园组队之旅'}</p>

        <div className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[12px] text-[#4B5563] mb-1.5 block">网名</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="给自己起个昵称"
                className="w-full bg-white border border-[#EAF2EF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand" />
            </div>
          )}
          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">手机号</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="numeric" maxLength={11} placeholder="请输入手机号"
              className="w-full bg-white border border-[#EAF2EF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">验证码</label>
            <div className="flex gap-2.5">
              <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6 位验证码"
                className="flex-1 bg-white border border-[#EAF2EF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand" />
              <button
                onClick={() => { if (!validPhone) { app.toast('请先输入正确的手机号'); return; } if (countdown === 0) setCountdown(60); }}
                disabled={countdown > 0}
                className="px-4 rounded-xl text-[12px] font-medium bg-[#E6F7F2] text-[#0F9F76] active:scale-95 transition-transform disabled:opacity-60 whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
              </button>
            </div>
          </div>
        </div>

        <button onClick={submit} disabled={!canSubmit}
          className={`w-full mt-8 py-3.5 rounded-xl text-[15px] font-medium transition-all ${canSubmit ? 'bg-brand text-white active:bg-[#12A17A] active:scale-95' : 'bg-[#DDE7E3] text-[#9CA3AF]'}`}>
          {mode === 'login' ? '立即登录' : '注册并进入'}
        </button>
        <p className="text-center text-[11px] text-[#9CA3AF] mt-4">登录即代表同意《用户协议》《隐私政策》</p>
      </div>
    </Page>
  );
};

/* ---------- 实名认证 ---------- */
const AuthPage = () => {
  const app = useApp();
  const [realName, setRealName] = useState('');
  const [school, setSchool] = useState({ name: '成都信息工程大学', campus: '航空港校区' });
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [major, setMajor] = useState('');
  const [cls, setCls] = useState('');
  const [verifyType, setVerifyType] = useState('id');
  const [stuNo, setStuNo] = useState('');
  const [email, setEmail] = useState('');
  const [mailCode, setMailCode] = useState('');
  const [mailCountdown, setMailCountdown] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (mailCountdown <= 0) return;
    const t = setTimeout(() => setMailCountdown(mailCountdown - 1), 1000);
    return () => clearTimeout(t);
  }, [mailCountdown]);

  const clearErr = (k) => setErrors(prev => (prev[k] ? { ...prev, [k]: undefined } : prev));

  /* 表单校验：逐项高亮错误 + 抖动 + 明确文案提示 */
  const startAuth = () => {
    const next = {};
    if (!realName.trim()) next.realName = '请填写真实姓名';
    if (!major.trim()) next.major = '请填写专业';
    if (!cls.trim()) next.cls = '请填写班级';
    if (verifyType === 'id' && !stuNo.trim()) next.stuNo = '请填写学号';
    if (verifyType === 'email' && !email.trim()) next.email = '请填写校园邮箱';
    if (verifyType === 'email' && !mailCode.trim()) next.mailCode = '请填写邮箱验证码';

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setShake(true);
      setTimeout(() => setShake(false), 420);
      const baseMissing = next.realName || next.major || next.cls;
      app.toast(baseMissing ? '请完整填写姓名、专业和班级信息' : '请补充学号或邮箱验证信息');
      return;
    }

    setErrors({});
    setAuthLoading(true);
    setTimeout(() => { setAuthLoading(false); setAuthSuccess(true); }, 2000);
  };

  const fieldCls = (k) => `w-full bg-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${errors[k] ? 'border border-red-500 ring-1 ring-red-500/40' : 'border border-[#EAF2EF] focus:border-brand'}`;

  const FieldError = ({ k }) => errors[k] ? (
    <div className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
      <Icon name="alert-circle" size={11} /> {errors[k]}
    </div>
  ) : null;

  useEffect(() => {
    if (school.emailDisabled && verifyType === 'email') {
      setVerifyType('id');
      app.toast('该校暂不支持邮箱验证，已为你切换为学号验证');
    }
  }, [school]);

  const pickSchool = (s) => {
    setSchool(s);
    setSchoolOpen(false);
  };

  return (
    <Page
      overlays={
        <>
          <SchoolPicker open={schoolOpen} onClose={() => setSchoolOpen(false)} value={school} onSelect={pickSchool} />

          {/* 认证中：全屏雷达扫描 Loading */}
          {authLoading && (
            <div className="absolute inset-0 z-[70] bg-white/95 flex flex-col items-center justify-center fade-in">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#20C997]/30" />
                <div className="absolute inset-3 rounded-full border-2 border-[#20C997]/50" />
                <div className="absolute inset-6 rounded-full border-2 border-[#20C997]/70" />
                <div className="absolute inset-0 rounded-full border-t-2 border-brand animate-spin" />
                <div className="w-6 h-6 rounded-full bg-brand shadow-lg shadow-brand/50 animate-pulse" />
              </div>
              <div className="mt-6 text-[15px] font-medium text-[#1F2937]">正在校验学生身份…</div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">扫描学籍信息中，请稍候</div>
            </div>
          )}

          {/* 认证成功 Modal */}
          <Modal
            open={authSuccess}
            onClose={() => {}}
            maxH="max-h-[56%]"
            footer={
              <div className="p-4">
                <button onClick={() => { setAuthSuccess(false); app.go('setup'); }}
                  className="w-full bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">
                  开始平台旅程
                </button>
              </div>
            }
          >
            <div className="flex flex-col items-center px-6 pt-8 pb-2 text-center">
              <div className="text-[52px] mb-2">🎉</div>
              <div className="text-[17px] font-bold text-[#1F2937]">恭喜你，认证成功！</div>
              <div className="text-[13px] text-[#0F9F76] mt-1.5">获得已实名专属绿盾</div>
              <div className="mt-4 flex items-center gap-1.5 bg-[#E6F7F2] text-[#0F9F76] px-3 py-1.5 rounded-full text-[12px]">
                <Icon name="shield-check" size={15} /> 已实名用户
              </div>
            </div>
          </Modal>
        </>
      }
    >
      <div className="px-6 pt-2">
        <button onClick={() => app.back()} className="w-9 h-9 flex items-center justify-center -ml-2 mb-2">
          <Icon name="chevron-left" size={22} className="text-[#1F2937]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#1F2937]">实名认证</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-1 mb-6">认证后可获得绿盾标识，大幅提升信任度</p>

        <div className={`space-y-3.5 ${shake ? 'shake' : ''}`}>
          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">真实姓名</label>
            <input value={realName} onChange={e => { setRealName(e.target.value); clearErr('realName'); }} placeholder="请输入真实姓名"
              className={fieldCls('realName')} />
            <FieldError k="realName" />
          </div>

          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">学校 · 校区</label>
            <button onClick={() => setSchoolOpen(true)}
              className="w-full bg-white border border-[#EAF2EF] rounded-xl px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-transform">
              <span className="text-sm text-[#1F2937]">{school.name} · {school.campus}</span>
              <Icon name="chevron-down" size={16} className="text-[#9CA3AF]" />
            </button>
            {school.emailDisabled && (
              <div className="text-[11px] text-[#F59E0B] mt-1.5 flex items-center gap-1">
                <Icon name="info" size={12} /> 该校仅支持学号验证
              </div>
            )}
          </div>

          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">专业</label>
            <input value={major} onChange={e => { setMajor(e.target.value); clearErr('major'); }} placeholder="如：软件工程"
              className={fieldCls('major')} />
            <FieldError k="major" />
          </div>
          <div>
            <label className="text-[12px] text-[#4B5563] mb-1.5 block">班级</label>
            <input value={cls} onChange={e => { setCls(e.target.value); clearErr('cls'); }} placeholder="如：软工 2101"
              className={fieldCls('cls')} />
            <FieldError k="cls" />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[12px] text-[#4B5563] mb-2">验证方式</div>
          <div className="flex gap-2.5">
            <button onClick={() => setVerifyType('id')}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5 ${verifyType === 'id' ? 'bg-brand text-white' : 'bg-[#E6F7F2] text-[#0F9F76]'}`}>
              <Icon name="id-card" size={15} /> 学号验证
            </button>
            <button
              onClick={() => {
                if (school.emailDisabled) { app.toast('该校仅支持学号验证'); return; }
                setVerifyType('email');
              }}
              disabled={school.emailDisabled}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-transform ${school.emailDisabled ? 'bg-[#F4FAF8] text-[#C4CDD5] cursor-not-allowed' : verifyType === 'email' ? 'bg-brand text-white active:scale-95' : 'bg-[#E6F7F2] text-[#0F9F76] active:scale-95'}`}
            >
              <Icon name={school.emailDisabled ? 'lock' : 'mail'} size={15} /> 邮箱验证
            </button>
          </div>

          {verifyType === 'id' ? (
            <div className="mt-3 fade-in">
              <input value={stuNo} onChange={e => { setStuNo(e.target.value); clearErr('stuNo'); }} placeholder="请输入学号"
                className={fieldCls('stuNo')} />
              <FieldError k="stuNo" />
              <div className="text-[11px] text-[#9CA3AF] mt-1.5">学号仅用于身份核验，不会公开展示</div>
            </div>
          ) : (
            <div className="mt-3 space-y-2.5 fade-in">
              <div>
                <input value={email} onChange={e => { setEmail(e.target.value); clearErr('email'); }} placeholder="请输入校园邮箱"
                  className={fieldCls('email')} />
                <FieldError k="email" />
              </div>
              <div>
                <div className="flex gap-2.5">
                  <input value={mailCode} onChange={e => { setMailCode(e.target.value); clearErr('mailCode'); }} inputMode="numeric" placeholder="请输入邮箱验证码"
                    className={`flex-1 ${fieldCls('mailCode')}`} />
                  <button onClick={() => { if (mailCountdown === 0) setMailCountdown(60); }} disabled={mailCountdown > 0}
                    className="px-4 rounded-xl text-[12px] font-medium bg-[#E6F7F2] text-[#0F9F76] active:scale-95 transition-transform disabled:opacity-60 whitespace-nowrap">
                    {mailCountdown > 0 ? `${mailCountdown}s` : '获取验证码'}
                  </button>
                </div>
                <FieldError k="mailCode" />
              </div>
            </div>
          )}
        </div>

        <button onClick={startAuth} className="w-full mt-8 bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">
          进行认证
        </button>
      </div>
    </Page>
  );
};

/* ---------- 完善资料：3 步引导 ---------- */
const SETUP_CATS = [
  { key: 'projects', label: '项目经历' },
  { key: 'awards', label: '资格证书与奖状' },
  { key: 'works', label: '个人作品集' },
];

const ProfileSetupPage = () => {
  const app = useApp();
  const [step, setStep] = useState(1);

  // Step1
  const [avatar, setAvatar] = useState(AVATARS[5]);
  const [showMajor, setShowMajor] = useState(false);
  const [showName, setShowName] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('image');

  // Step2
  const [comps, setComps] = useState([]);
  const [compOpen, setCompOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [customIntent, setCustomIntent] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillOpen, setSkillOpen] = useState(false);

  // Step3
  const [cat, setCat] = useState('projects');
  const [entries, setEntries] = useState({
    projects: [{ id: 1, text: '', files: [] }],
    awards: [{ id: 2, text: '', files: [] }],
    works: [{ id: 3, text: '', files: [] }],
  });
  const [upSheet, setUpSheet] = useState(false);
  const [upTarget, setUpTarget] = useState(null);
  const [upPicker, setUpPicker] = useState(false);
  const [upMode, setUpMode] = useState('image');

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const avatarIdx = AVATARS.findIndex(a => a.emoji === avatar.emoji);

  const addEntry = () => {
    const list = entries[cat];
    setEntries({ ...entries, [cat]: [...list, { id: Date.now(), text: '', files: [] }] });
  };
  const updateEntry = (id, patch) => {
    setEntries({ ...entries, [cat]: entries[cat].map(e => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEntry = (id) => {
    setEntries({ ...entries, [cat]: entries[cat].filter(e => e.id !== id) });
  };
  const onUploadPick = (file) => {
    if (!upTarget) return;
    const e = entries[cat].find(x => x.id === upTarget);
    if (!e) return;
    updateEntry(upTarget, { files: [...e.files, file] });
    setUpTarget(null);
  };
  const progress = step;

  return (
    <Page
      overlays={
        <>
          <ActionSheet
            open={sheet}
            onClose={() => setSheet(false)}
            actions={[
              { label: '拍照', onClick: () => { setPickerMode('image'); setPicker(true); } },
              { label: '从相册选择', onClick: () => { setPickerMode('image'); setPicker(true); } },
            ]}
          />
          <MockMediaPicker
            open={picker}
            onClose={() => setPicker(false)}
            mode="image"
            onPick={(f) => {
              const idx = parseInt(f.name.replace(/\D/g, ''), 10) % AVATARS.length;
              setAvatar(AVATARS[idx]);
            }}
          />
          <CompetitionPicker
            open={compOpen}
            onClose={() => setCompOpen(false)}
            value={comps}
            onConfirm={(v) => { setComps(v); setCompOpen(false); }}
          />
          <SplitSkillPicker
            open={skillOpen}
            onClose={() => setSkillOpen(false)}
            value={skills}
            onConfirm={(v) => { setSkills(v); setSkillOpen(false); }}
          />
          <ActionSheet
            open={upSheet}
            onClose={() => setUpSheet(false)}
            actions={[
              { label: '从相册选择图片', onClick: () => { setUpMode('image'); setUpPicker(true); } },
              { label: '选择文件', onClick: () => { setUpMode('file'); setUpPicker(true); } },
            ]}
          />
          <MockMediaPicker
            open={upPicker}
            onClose={() => setUpPicker(false)}
            mode={upMode}
            onPick={onUploadPick}
          />
        </>
      }
    >
      <div className="px-5 pt-2 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <button onClick={() => step > 1 ? setStep(step - 1) : app.back()} className="w-9 h-9 flex items-center justify-center -ml-2">
              <Icon name="chevron-left" size={22} className="text-[#1F2937]" />
            </button>
            <span className="text-[12px] text-[#9CA3AF]">{step}/3</span>
          </div>
          <button onClick={() => app.tab('square')} className="text-[12px] text-[#9CA3AF]">跳过</button>
        </div>

        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= progress ? 'bg-brand' : 'bg-[#E4EDEA]'}`} />)}
        </div>

        {step === 1 && (
          <div className="fade-in">
            <h2 className="text-[21px] font-bold text-[#1F2937]">上传头像</h2>
            <p className="text-[13px] text-[#9CA3AF] mt-1 mb-7">一个舒服的头像会让人更愿意点开你</p>

            <div className="flex flex-col items-center mb-7">
              <div className="relative">
                <button onClick={() => setSheet(true)} className="active:scale-95 transition-transform">
                  <Avatar src={avatar} size={104} />
                </button>
                <button onClick={() => setSheet(true)} className="absolute bottom-0 right-0 w-9 h-9 bg-brand rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <Icon name="camera" size={17} className="text-white" />
                </button>
              </div>
              <button
                onClick={() => setAvatar(AVATARS[(avatarIdx + 1) % AVATARS.length])}
                className="mt-3 text-[12px] text-[#0F9F76] bg-[#E6F7F2] px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                🎲 换一换
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
                <div>
                  <div className="text-[14px] font-medium text-[#1F2937]">公开专业</div>
                  <div className="text-[11px] text-[#9CA3AF] mt-0.5">他人可在你的主页看到专业信息</div>
                </div>
                <button onClick={() => setShowMajor(v => !v)} className={`w-12 h-7 rounded-full p-1 transition-colors ${showMajor ? 'bg-brand' : 'bg-[#DDE7E3]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${showMajor ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
                <div>
                  <div className="text-[14px] font-medium text-[#1F2937]">公开真实姓名</div>
                  <div className="text-[11px] text-[#9CA3AF] mt-0.5">他人可在你的主页看到你的真实姓名</div>
                </div>
                <button onClick={() => setShowName(v => !v)} className={`w-12 h-7 rounded-full p-1 transition-colors ${showName ? 'bg-brand' : 'bg-[#DDE7E3]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${showName ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full mt-8 bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">下一步</button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-[21px] font-bold text-[#1F2937]">选择标签</h2>
            <p className="text-[13px] text-[#9CA3AF] mt-1 mb-5">选择你的意向和个人技能</p>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-medium text-[#1F2937]">意向竞赛</div>
                <button onClick={() => setCompOpen(true)} className="text-[12px] text-brand flex items-center gap-0.5 active:scale-95 transition-transform">
                  <Icon name="plus" size={13} /> 选择
                </button>
              </div>
              {comps.length === 0 ? (
                <div className="text-[11px] text-[#C4CDD5]">还没有选择，可搜索蓝桥杯、挑战杯等</div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {comps.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 bg-[#E6F7F2] border border-[#20C997] text-[#0F9F76] rounded-full px-2.5 py-1 text-[11px]">
                      {c}
                      <button onClick={() => toggle(comps, setComps, c)}><Icon name="x" size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              <div className="text-[13px] font-medium text-[#1F2937] mb-2">意向项目</div>
              <div className="flex flex-wrap gap-1.5">
                {['科研项目', '创业项目', '大创项目', '课程项目', '开源项目', '公益项目'].map(p => (
                  <TagChip key={p} small active={projects.includes(p)} onClick={() => toggle(projects, setProjects, p)}>{p}</TagChip>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              <div className="text-[13px] font-medium text-[#1F2937] mb-2">自定义意向</div>
              <input value={customIntent} onChange={e => setCustomIntent(e.target.value)} placeholder="比如：想做一款校园工具类产品"
                className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-medium text-[#1F2937]">个人技能</div>
                <button onClick={() => setSkillOpen(true)} className="text-[12px] text-brand flex items-center gap-0.5 active:scale-95 transition-transform">
                  <Icon name="plus" size={13} /> 添加技能
                </button>
              </div>
              {skills.length === 0 ? (
                <div className="text-[11px] text-[#C4CDD5]">点「添加技能」，从分类里挑选你擅长的</div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 bg-[#E6F7F2] border border-[#20C997] text-[#0F9F76] rounded-full px-2.5 py-1 text-[11px]">
                      {s}
                      <button onClick={() => setSkills(skills.filter(x => x !== s))}><Icon name="x" size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setStep(3)} className="w-full mt-4 bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all">下一步</button>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h2 className="text-[21px] font-bold text-[#1F2937]">填写经历</h2>
            <p className="text-[13px] text-[#9CA3AF] mt-1 mb-4">展示你的亮点，全部选填</p>

            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {SETUP_CATS.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className={`shrink-0 px-3.5 py-2 rounded-full text-[12px] ${cat === c.key ? 'bg-brand text-white font-medium' : 'bg-white text-[#4B5563] border border-[#EAF2EF]'}`}>
                  {c.label}
                </button>
              ))}
            </div>

            {entries[cat].map((e, idx) => (
              <div key={e.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#9CA3AF]">{SETUP_CATS.find(c => c.key === cat).label} {idx + 1}</span>
                  {entries[cat].length > 1 && (
                    <button onClick={() => removeEntry(e.id)} className="text-[11px] text-[#EF4444]">删除</button>
                  )}
                </div>
                <textarea
                  value={e.text}
                  onChange={ev => updateEntry(e.id, { text: ev.target.value })}
                  rows={3}
                  placeholder={cat === 'projects' ? '项目名称、你的角色、主要成果…' : cat === 'awards' ? '证书/奖状名称、获得时间、级别…' : '作品名称、简介、链接…'}
                  className="w-full bg-[#F4FAF8] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none resize-none"
                />
                {
                  e.files.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {e.files.map((f, i) => (
                        <AttachChip key={i} a={f} onRemove={() => updateEntry(e.id, { files: e.files.filter((_, j) => j !== i) })} />
                      ))}
                    </div>
                  )
                }
                <button
                  onClick={() => { setUpTarget(e.id); setUpSheet(true); }}
                  className="w-full mt-2.5 border-2 border-dashed border-[#DDE7E3] rounded-xl py-3 flex items-center justify-center gap-1.5 text-[12px] text-[#9CA3AF] active:bg-[#F7FBFA]"
                >
                  <Icon name="plus" size={14} /> 点击上传附件
                </button>
              </div>
            ))}

            <button onClick={addEntry} className="w-full py-2.5 rounded-xl border border-dashed border-[#BFE9DC] text-[12px] text-[#0F9F76] mb-4 active:scale-95 transition-transform">
              ＋ 添加一条新的{SETUP_CATS.find(c => c.key === cat).label}
            </button>

            <div className="bg-[#F1F5F9] rounded-xl p-3">
              <p className="text-[11px] text-[#9CA3AF] leading-[1.8]">
                🔒 隐私提示：您上传的附件将存入您的个人信息库。仅作为组队自证使用。如涉及私人信息，请自行打码。所有经历均选填，不填不影响使用。
              </p>
            </div>

            <button
              onClick={() => {
                app.toast('欢迎加入搭子Match！');
                setTimeout(() => app.tab('square'), 300);
              }}
              className="w-full mt-6 bg-brand text-white py-3.5 rounded-xl text-[15px] font-medium active:bg-[#12A17A] active:scale-95 transition-all"
            >
              开启广场之旅
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};
