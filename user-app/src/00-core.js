const { useState, useEffect, useRef, useMemo, useContext, createContext } = React;

/* ---------- 头像（本地 emoji 卡通头像，避免外链失败） ---------- */
const AVATARS = [
  { emoji: '🐰', bg: '#FFE4E6' },
  { emoji: '🐻', bg: '#FDE68A' },
  { emoji: '🐱', bg: '#DBEAFE' },
  { emoji: '🦊', bg: '#FFEDD5' },
  { emoji: '🐼', bg: '#E5E7EB' },
  { emoji: '🐨', bg: '#E0E7FF' },
  { emoji: '🐯', bg: '#FEF3C7' },
  { emoji: '🐸', bg: '#D1FAE5' },
];

const Avatar = ({ src, size = 40, ring = false, className = '' }) => {
  const a = src || AVATARS[0];
  return (
    <div
      className={`rounded-full flex items-center justify-center select-none shrink-0 ${ring ? 'ring-2 ring-brand ring-offset-2' : ''} ${className}`}
      style={{ width: size, height: size, background: a.bg, fontSize: Math.round(size * 0.54), lineHeight: 1 }}
    >
      {a.emoji}
    </div>
  );
};

/* ---------- 图标（用 React 直接渲染 lucide SVG，保证状态更新正常） ---------- */
const ICON_ALIAS = {
  'alert-triangle': 'TriangleAlert',
  'alert-circle': 'CircleAlert',
  'plus-circle': 'CirclePlus',
  'check-circle': 'CircleCheck',
  'upload-cloud': 'CloudUpload',
  'more-horizontal': 'Ellipsis',
};
const pascal = (s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

const Icon = ({ name, size = 18, className = '', fill = false }) => {
  const icons = (typeof lucide !== 'undefined' && lucide.icons) || {};
  const key = ICON_ALIAS[name] || pascal(name);
  const node = icons[key] || icons[pascal(name)] || null;

  /* lucide 的图标节点有两种结构：
     [tag, attrs, children]（新版）或 [[tag, attrs], ...]（旧版），这里统一处理 */
  let list = [];
  if (node) {
    if (Array.isArray(node) && node[0] === 'svg' && Array.isArray(node[2])) list = node[2];
    else if (Array.isArray(node) && typeof node[0] === 'string') list = [node];
    else if (Array.isArray(node)) list = node;
  }
  const children = list
    .filter(c => Array.isArray(c) && typeof c[0] === 'string')
    .map((c, i) => React.createElement(c[0], { key: i, ...(c[1] || {}) }));

  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" className={className}
      fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {children.length > 0 ? children : <circle cx="12" cy="12" r="4" opacity="0.35" />}
    </svg>
  );
};

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/* ---------- 状态栏 ---------- */
const StatusBar = ({ light }) => (
  <div className={`absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between z-40 pointer-events-none ${light ? 'text-white' : 'text-[#1F2937]'}`}>
    <span className="text-[14px] font-semibold tracking-wide">10:30</span>
    <div className="flex items-center gap-1.5">
      <Icon name="signal" size={15} />
      <Icon name="wifi" size={15} />
      <Icon name="battery-full" size={17} />
    </div>
  </div>
);

/* ---------- 底部导航 ---------- */
const TABS = [
  { key: 'square', icon: 'house', label: '广场' },
  { key: 'match', icon: 'target', label: '匹配' },
  { key: 'post', icon: 'plus', label: '发帖', special: true },
  { key: 'messages', icon: 'message-square', label: '消息' },
  { key: 'profile', icon: 'user', label: '我的' },
];

const TabBar = ({ active, onChange }) => (
  <div className="absolute bottom-0 left-0 right-0 h-[74px] bg-white/95 backdrop-blur border-t border-[#EEF1EF] flex items-start justify-around px-2 pt-2 pb-4 z-30">
    {TABS.map(t => {
      const on = active === t.key;
      if (t.special) {
        return (
          <button key={t.key} onClick={() => onChange(t.key)} className="flex flex-col items-center -mt-6 active:scale-95 transition-transform">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(47,107,79,0.22)] transition-colors ${on ? 'bg-[#22503A]' : 'bg-[#2F6B4F]'}`}>
              <Icon name="plus" size={26} className="text-white" />
            </div>
            <span className="text-[10px] text-[#8C9A94] mt-0.5">发帖</span>
          </button>
        );
      }
      return (
        <button key={t.key} onClick={() => onChange(t.key)} className="flex flex-col items-center gap-1 pt-1 active:scale-95 transition-transform">
          <Icon name={t.icon} size={22} className={on ? 'text-[#2F6B4F]' : 'text-[#A8B3AD]'} />
          <span className={`text-[10px] ${on ? 'text-[#2F6B4F] font-semibold' : 'text-[#A8B3AD]'}`}>{t.label}</span>
        </button>
      );
    })}
  </div>
);

/* ---------- 页面容器：滚动区 + 底部栏 + 浮层 ---------- */
const Page = ({ children, tab, bottom, overlays, contentPad = '', scrollRef, bg = 'bg-[#F5F7F5]' }) => {
  const app = useApp();
  return (
    <div className={`absolute inset-0 ${bg}`}>
      <div ref={scrollRef} className={`absolute inset-x-0 top-11 bottom-0 overflow-y-auto no-scrollbar ${tab ? 'pb-[92px]' : ''} ${contentPad}`}>
        {children}
      </div>
      {tab && <TabBar active={tab} onChange={app.onTab} />}
      {bottom}
      {overlays}
    </div>
  );
};

/* ---------- 通用子页 Header ---------- */
const Header = ({ title, onBack, right, subtitle, bg = 'bg-white/95 backdrop-blur', close = false }) => {
  const app = useApp();
  /* 统一返回处理器：阻止事件冒泡/默认行为，避免被父级滚动或弹层拦截 */
  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBack) onBack();
    else app.back();
  };
  return (
    <div className={`sticky top-0 z-20 ${bg} shadow-[0_1px_0_rgba(0,0,0,0.03)]`}>
      <div className="h-12 px-1 flex items-center">
        <button
          type="button"
          aria-label={close ? '关闭' : '返回'}
          onClick={handleBack}
          className="w-12 h-12 -ml-1 flex items-center justify-center rounded-xl active:bg-[#E8F0EB] active:scale-95 transition-transform touch-manipulation"
        >
          <Icon name={close ? 'x' : 'chevron-left'} size={close ? 21 : 22} className="text-[#1F2937]" />
        </button>
        <div className="flex-1 text-center min-w-0">
          <div className="text-[15px] font-semibold text-[#1A2A22] leading-tight truncate">{title}</div>
          {subtitle && <div className="text-[11px] text-[#8C9A94] mt-0.5 truncate">{subtitle}</div>}
        </div>
        <div className="min-w-[48px] h-12 flex items-center justify-center px-1">{right}</div>
      </div>
    </div>
  );
};

/* ---------- 一级页被压栈时显示的轻量返回按钮 ---------- */
const RootBack = () => {
  const app = useApp();
  if (app.isRoot) return null; // 底部 Tab 直接进入的一级页不带返回
  return (
    <button
      type="button"
      aria-label="返回"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); app.back(); }}
      className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center active:scale-95 transition-transform touch-manipulation shrink-0"
    >
      <Icon name="chevron-left" size={20} className="text-[#1F2937]" />
    </button>
  );
};

/* ---------- 通用小组件 ---------- */
const TagChip = ({ children, active, onClick, small }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center rounded-full transition-all active:scale-95 ${small ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs'} ${active ? 'bg-[#2F6B4F] text-white font-medium shadow-[0_4px_12px_rgba(47,107,79,0.18)]' : 'bg-[#E8F0EB] text-[#2F6B4F]'}`}
  >
    {children}
  </button>
);

const StarRow = ({ value, size = 12 }) => (
  <div className="flex items-center gap-0.5 text-[#FBBF24]">
    {[1, 2, 3, 4, 5].map(n => (
      <Icon key={n} name="star" size={size} fill={n <= Math.round(value)} className={n <= Math.round(value) ? 'text-[#FBBF24]' : 'text-[#E5E7EB]'} />
    ))}
  </div>
);

const AttachChip = ({ a, onRemove }) => (
  <div className="flex items-center gap-1.5 bg-[#E6F7F2] text-[#0F9F76] rounded-lg px-2.5 py-1.5 text-[11px] max-w-full">
    <span>{a.kind === 'image' ? '🖼️' : a.kind === 'link' ? '🔗' : '📄'}</span>
    <span className="truncate">{a.name}</span>
    {onRemove && (
      <button onClick={onRemove} className="w-4 h-4 rounded-full bg-[#BFE9DC] flex items-center justify-center shrink-0">
        <Icon name="x" size={10} />
      </button>
    )}
  </div>
);

const EmptyState = ({ icon = 'search-x', title, desc, children }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="w-20 h-20 rounded-full bg-[#E8F0EB] flex items-center justify-center mb-4">
      <Icon name={icon} size={32} className="text-[#2F6B4F]" />
    </div>
    <p className="text-sm font-semibold text-[#1A2A22] mb-1">{title}</p>
    {desc && <p className="text-xs text-[#8C9A94] leading-relaxed mb-5">{desc}</p>}
    {children}
  </div>
);

/* ---------- Toast ---------- */
const Toast = ({ msg }) => (
  <div className="absolute top-[64px] left-1/2 -translate-x-1/2 z-[70] fade-in pointer-events-none">
    <div className="bg-[#111827]/90 backdrop-blur text-white text-[13px] px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
      <Icon name="check-circle" size={15} className="text-[#7ED9B5]" />
      {msg}
    </div>
  </div>
);

/* ---------- Modal ---------- */
const Modal = ({ open, onClose, title, children, footer, maxH = 'max-h-[82%]', blur = true }) => {
  if (!open) return null;
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center px-5 fade-in ${blur ? 'bg-[#0F1F19]/30 backdrop-blur-[6px]' : 'bg-black/40'}`} onClick={onClose}>
      <div className={`bg-white rounded-3xl w-full ${maxH} overflow-hidden scale-in flex flex-col shadow-[0_20px_60px_rgba(15,40,30,0.18)]`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="px-5 pt-4 pb-3 text-center text-[15px] font-semibold text-[#1A2A22] shrink-0">
            {title}
          </div>
        )}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        {footer}
      </div>
    </div>
  );
};

/* ---------- Drawer ---------- */
const Drawer = ({ open, onClose, title, children, h = '64%' }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-[#0F1F19]/30 backdrop-blur-[6px] flex flex-col justify-end" onClick={onClose}>
      <div className="bg-white rounded-t-3xl slide-up flex flex-col w-full shadow-[0_-10px_40px_rgba(15,40,30,0.12)]" style={{ maxHeight: h }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-[#DDE7E3] rounded-full mx-auto mt-2.5 mb-1 shrink-0" />
        {title && (
          <div className="px-5 py-2.5 text-center text-[15px] font-semibold text-[#1A2A22] shrink-0">
            {title}
          </div>
        )}
        <div className="p-4 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

/* ---------- ActionSheet ---------- */
const ActionSheet = ({ open, onClose, actions }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1F19]/30 backdrop-blur-[6px] flex flex-col justify-end" onClick={onClose}>
      <div className="bg-white rounded-t-2xl overflow-hidden slide-up" onClick={e => e.stopPropagation()}>
        <div className="py-2.5 text-center text-[11px] text-[#8C9A94]">请选择操作</div>
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => { onClose(); a.onClick && a.onClick(); }}
            className={`w-full py-3.5 text-center text-[15px] border-t border-[#F1F4F2] active:bg-[#F7FAF8] ${a.danger ? 'text-[#EF4444]' : 'text-[#1A2A22]'}`}
          >
            {a.label}
          </button>
        ))}
        <div className="h-2 bg-[#F5F7F5]" />
        <button onClick={onClose} className="w-full py-3.5 text-center text-[15px] text-[#4A5551] border-t border-[#F1F4F2]">取消</button>
        <div className="h-4" />
      </div>
    </div>
  );
};
