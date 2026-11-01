/* ---------------- 学校 Mock 数据（按拼音首字母 A-Z 排序） ---------------- */
const SCHOOLS = [
  { name: '北京大学', campus: '燕园校区', letter: 'B', emailDisabled: true },
  { name: '北京航空航天大学', campus: '学院路校区', letter: 'B' },
  { name: '成都信息工程大学', campus: '航空港校区', letter: 'C' },
  { name: '成都信息工程大学', campus: '龙泉校区', letter: 'C' },
  { name: '重庆大学', campus: '沙坪坝校区', letter: 'C' },
  { name: '电子科技大学', campus: '清水河校区', letter: 'D' },
  { name: '电子科技大学', campus: '沙河校区', letter: 'D' },
  { name: '复旦大学', campus: '邯郸校区', letter: 'F' },
  { name: '哈尔滨工业大学', campus: '主校区', letter: 'H' },
  { name: '华中科技大学', campus: '主校区', letter: 'H' },
  { name: '吉林大学', campus: '前卫校区', letter: 'J' },
  { name: '南京大学', campus: '仙林校区', letter: 'N' },
  { name: '南开大学', campus: '八里台校区', letter: 'N' },
  { name: '清华大学', campus: '主校区', letter: 'Q', emailDisabled: true },
  { name: '山东大学', campus: '中心校区', letter: 'S' },
  { name: '上海交通大学', campus: '闵行校区', letter: 'S' },
  { name: '四川大学', campus: '江安校区', letter: 'S' },
  { name: '四川大学', campus: '望江校区', letter: 'S' },
  { name: '同济大学', campus: '四平路校区', letter: 'T' },
  { name: '武汉大学', campus: '珞珈山校区', letter: 'W' },
  { name: '西安交通大学', campus: '兴庆校区', letter: 'X' },
  { name: '西南财经大学', campus: '柳林校区', letter: 'X' },
  { name: '西南交通大学', campus: '犀浦校区', letter: 'X' },
  { name: '西南交通大学', campus: '九里校区', letter: 'X' },
  { name: '厦门大学', campus: '思明校区', letter: 'X' },
  { name: '浙江大学', campus: '紫金港校区', letter: 'Z' },
  { name: '中国人民大学', campus: '中关村校区', letter: 'Z' },
  { name: '中山大学', campus: '广州南校园', letter: 'Z' },
];

/* ---------------- 竞赛 / 技能 / 目标要求 ---------------- */
const COMPETITIONS = ['蓝桥杯', 'ACM-ICPC 程序设计竞赛', '中国大学生计算机设计大赛', '全国大学生数学建模竞赛', '挑战杯', '互联网+ 创新创业大赛', '大学生创新创业训练计划', '全国大学生电子设计竞赛', '外研社杯英语演讲大赛', '全国大学生英语竞赛', '中国机器人大赛', '全国大学生机械创新设计大赛', '中国高校计算机大赛', '全国大学生信息安全竞赛', '华为软件精英挑战赛', '百度之星程序设计大赛', '全国大学生广告艺术大赛', '全国大学生化学实验竞赛'];

const SKILL_GROUPS = [
  { name: 'IT·编程', tags: ['前端', '后端', 'Java', 'Python', 'C++', 'Go', 'React', 'Vue', '小程序', '数据库', 'Linux'] },
  { name: 'AI·算法', tags: ['机器学习', '深度学习', '计算机视觉', 'NLP', '算法竞赛', '数据分析'] },
  { name: '设计·创意', tags: ['UI设计', 'UX设计', '平面设计', '插画', '视频剪辑', '3D建模', 'Figma'] },
  { name: '语言·英语', tags: ['大学英语四级', '大学英语六级', '雅思', '托福', '日语N2', '英语口语', '英文写作'] },
  { name: '项目·管理', tags: ['产品经理', '需求分析', '项目管理', 'PPT制作', '文档撰写', '路演表达'] },
  { name: '财务·商业', tags: ['会计', '财务管理', '市场调研', '商业分析', '审计'] },
  { name: '其他特长', tags: ['摄影', '播音主持', '文案策划', '演讲表达', '视频拍摄'] },
];

const TARGET_GROUPS = [
  { name: '年级要求', tags: ['不限年级', '大二及以上', '大三及以上', '研究生'] },
  { name: '时间投入', tags: ['每周5h', '每周8h', '周末有空', '晚上有空'] },
  { name: '期望地点', tags: ['校内', '线上协作', '校外咖啡厅'] },
  { name: '项目周期', tags: ['1个月', '3个月', '半年以上'] },
];

const REPORT_REASONS = ['发布虚假信息', '恶意骚扰/辱骂', '涉嫌诈骗或收费', '内容违规', '冒充他人身份', '其他'];
const DISTRICTS = ['武侯区', '双流区', '青羊区', '锦江区', '成华区', '龙泉驿区', '温江区', '新都区', '郫都区', '金牛区'];

/* ---------------- 用户 ---------------- */
const USERS = [
  { id: 1, name: '林小满', school: '成都信息工程大学', campus: '航空港校区', grade: '大三', major: '软件工程', rating: 4.9, verified: true, avatar: AVATARS[0], tags: ['前端', 'React', '产品经理'] },
  { id: 2, name: '陈墨', school: '电子科技大学', campus: '清水河校区', grade: '大二', major: '计算机科学', rating: 4.8, verified: true, avatar: AVATARS[1], tags: ['Python', '算法竞赛', '机器学习'] },
  { id: 3, name: '王一诺', school: '四川大学', campus: '江安校区', grade: '大四', major: '电子信息', rating: 4.7, verified: false, avatar: AVATARS[2], tags: ['后端', 'Java', '硬件'] },
  { id: 4, name: '苏小棠', school: '西南交通大学', campus: '犀浦校区', grade: '大三', major: '工业设计', rating: 5.0, verified: true, avatar: AVATARS[3], tags: ['UI设计', 'Figma', '交互设计'] },
  { id: 5, name: '周子航', school: '四川大学', campus: '望江校区', grade: '大三', major: '数学与应用数学', rating: 4.9, verified: true, avatar: AVATARS[4], tags: ['数学建模', '写作', '数据分析'] },
  { id: 6, name: '何嘉', school: '电子科技大学', campus: '沙河校区', grade: '大二', major: '通信工程', rating: 4.6, verified: true, avatar: AVATARS[5], tags: ['硬件', 'PCB', '嵌入式'] },
  { id: 7, name: '唐果', school: '成都信息工程大学', campus: '龙泉校区', grade: '大二', major: '软件工程', rating: 4.8, verified: true, avatar: AVATARS[6], tags: ['前端', '小程序', 'Java'] },
  { id: 8, name: '沈知', school: '西南交通大学', campus: '九里校区', grade: '大三', major: '统计学', rating: 4.9, verified: true, avatar: AVATARS[7], tags: ['Python', '数学建模', '写作'] },
  { id: 9, name: '白露', school: '西南财经大学', campus: '柳林校区', grade: '大二', major: '视觉传达', rating: 4.7, verified: true, avatar: AVATARS[0], tags: ['UI设计', '插画', '视频剪辑'] },
  { id: 10, name: '江野', school: '成都信息工程大学', campus: '航空港校区', grade: '大一', major: '人工智能', rating: 4.5, verified: false, avatar: AVATARS[1], tags: ['Python', '机器学习', '数据标注'] },
  { id: 11, name: '赵一鸣', school: '电子科技大学', campus: '沙河校区', grade: '大一', major: '软件工程', rating: 4.6, verified: true, avatar: AVATARS[2], tags: ['C++', '算法竞赛'] },
  { id: 12, name: '许愿', school: '四川大学', campus: '江安校区', grade: '大三', major: '汉语言文学', rating: 4.8, verified: true, avatar: AVATARS[3], tags: ['写作', '文案策划', 'PPT制作'] },
  { id: 13, name: '顾南', school: '西南财经大学', campus: '柳林校区', grade: '大四', major: '市场营销', rating: 4.7, verified: true, avatar: AVATARS[4], tags: ['商业分析', '市场调研', '路演表达'] },
  { id: 14, name: '罗一', school: '四川大学', campus: '望江校区', grade: '大四', major: '工商管理', rating: 4.6, verified: false, avatar: AVATARS[5], tags: ['项目管理', '需求分析', '演讲表达'] },
];

const getUser = (id) => USERS.find(u => u.id === id) || USERS[0];

/* ---------------- 帖子（队伍招募 8 条 / 个人寻伴 8 条） ---------------- */
const POSTS = [
  {
    id: 1, userId: 1, intent: '队伍招募', cat: '大创项目', title: '急缺一名前端', time: '2小时前',
    projectTags: ['大创', '校园二手交易'], skillTags: ['前端', 'React'], targetTags: ['大二及以上', '周末有空', '每周8h'],
    desc: '我们是校级大创立项团队，做校园二手交易平台，产品原型和 UI 已经完成，后端接口搭了一半。\n\n现在急缺一名前端同学，负责 React 端页面开发与接口联调。团队每周开一次线上会，进度比较稳，不画饼。\n\n【你能获得】\n1. 一段完整的大创项目经历与立项证书\n2. 可写进简历的 React 实战经验\n3. 氛围很好的队友，遇到问题一起解决',
    iceBreakers: ['我是资深前端，有 React 项目经验', '同校的，请问目前项目进度怎么样了？', '每周能投入 10h，可以长期跟'],
    mine: false, closed: false,
  },
  {
    id: 2, userId: 2, intent: '队伍招募', cat: '蓝桥杯', title: '寻算法大佬一起冲省一', time: '5小时前',
    projectTags: ['蓝桥杯', '算法竞赛'], skillTags: ['C++', '算法竞赛'], targetTags: ['大三及以上', '每周8h'],
    desc: '去年省二，今年想冲省一。目前队伍两人，都是计科专业，主要做动态规划与图论。\n\n希望找一位有算法竞赛经验的同学，能一起刷题、讲题、复盘。每周固定两次线上训练，周末线下图书馆。\n\n【要求】\n1. 刷题量 300+，能独立完成中等难度题\n2. 愿意长期一起训练，不是临时抱佛脚\n3. 有省赛经验优先',
    iceBreakers: ['我是计科的，之前拿过省二，可以聊聊吗', '我刷过 600+ 题，主要做动态规划', '请问你们现在每天训练多久？'],
    mine: false, closed: false,
  },
  {
    id: 3, userId: 3, intent: '队伍招募', cat: '互联网+', title: '智能农业项目补一名后端', time: '昨天',
    projectTags: ['互联网+', '农业科技'], skillTags: ['后端', 'Java'], targetTags: ['大二及以上', '3个月'],
    desc: '项目方向是智能农业监测，已有硬件原型和一项实用新型专利，导师也愿意挂名。\n\n现在缺一名后端同学，负责设备数据接收、存储与看板接口。技术栈 SpringBoot + MySQL，有现成文档。\n\n【项目进度】\n硬件 70%，算法 60%，后端 30%，计划 12 月冲校赛。',
    iceBreakers: ['我会 SpringBoot，做过类似的数据看板', '请问后端需要独立搭服务吗？', '可以看看目前的需求文档吗？'],
    mine: false, closed: false,
  },
  {
    id: 4, userId: 4, intent: '队伍招募', cat: '挑战杯', title: '无障碍出行项目招募 UI 设计', time: '昨天',
    projectTags: ['挑战杯', '公益无障碍'], skillTags: ['UI设计', 'Figma'], targetTags: ['不限年级', '周末有空'],
    desc: '项目做视障人群出行辅助，已完成用户访谈 23 份，方向明确，正在打磨产品原型。\n\n希望找一位 UI 设计同学，负责整体视觉与高保真原型，最好有作品集。设计方向是温暖、克制、易读性优先。\n\n【团队现状】\n产品 1 人，开发 2 人，指导老师 1 人，缺设计。',
    iceBreakers: ['我是设计专业的，可以看看现有原型吗？', '做过无障碍相关设计，很感兴趣', '方便约个时间聊一下视觉方向吗？'],
    mine: false, closed: false,
  },
  {
    id: 5, userId: 5, intent: '队伍招募', cat: '数学建模', title: '国赛在即，缺一名论文写作', time: '2天前',
    projectTags: ['数学建模', '国赛'], skillTags: ['写作', '数据分析'], targetTags: ['大三及以上', '每周8h'],
    desc: '去年美赛 M 奖，今年国赛目标省一以上。队伍两人：一人建模、一人编程，缺一名写作。\n\n希望你能把模型讲清楚、把图表排明白，熟悉 LaTeX 更好。比赛期间需要全天在校，我们会提前一周磨合。\n\n【已有储备】\n近三年真题整理、常用模型模板、绘图脚本。',
    iceBreakers: ['我写过三篇建模论文，可以带作品来聊', '熟悉 LaTeX 排版，能负责摘要和图表', '请问你们往年最好成绩是多少？'],
    mine: false, closed: false,
  },
  {
    id: 6, userId: 6, intent: '队伍招募', cat: '电子设计', title: '硬件组补两人，PCB 已画好', time: '3天前',
    projectTags: ['电子设计竞赛', '嵌入式'], skillTags: ['硬件', '嵌入式'], targetTags: ['大二及以上', '每周8h'],
    desc: '电赛硬件方向，题目方向已确定。PCB 已经画好并打样，主控用 STM32。\n\n现在补两名同学：一名焊接调试、一名写驱动。有实验室工位，器件基本齐全，可以随时来练。\n\n【要求】\n能连续投入两周，赛前需要通宵调试。',
    iceBreakers: ['我焊过板子，调试也能上手', '会 STM32 驱动开发，可以聊聊', '请问实验室在哪个校区？我过去看看'],
    mine: false, closed: false,
  },
  {
    id: 7, userId: 13, intent: '队伍招募', cat: '创业项目', title: '校园团购小程序找技术合伙人', time: '3天前',
    projectTags: ['创业项目', '校园电商'], skillTags: ['前端', '小程序', '后端'], targetTags: ['不限年级', '半年以上'],
    desc: '校园团购方向，已在两个宿舍楼跑通试点，单月流水 1.2 万，模式验证完成。\n\n想找一位技术合伙人，负责小程序与后端，可以给到 10% 股份。希望你愿意长期做，不只是接个活。\n\n【我能提供】\n校园渠道、供应链资源、地推团队 3 人。',
    iceBreakers: ['我做过三个小程序项目，可以聊合作', '请问目前的订单量和复购率怎么样？', '股份怎么安排？可以约线下聊'],
    mine: false, closed: false,
  },
  {
    id: 8, userId: 12, intent: '队伍招募', cat: '科研项目', title: '大模型方向科研，招数据标注', time: '4天前',
    projectTags: ['科研项目', '大模型'], skillTags: ['Python', '数据标注'], targetTags: ['大二及以上', '每周5h'],
    desc: '导师课题做中文多模态数据清洗，已有一批未标注数据，需要同学做数据标注与简单脚本处理。\n\n工作不复杂，但需要细致、有耐心，愿意长期跟。表现好可以挂名论文，也可以带你入门科研。',
    iceBreakers: ['我做过数据标注，熟悉 Python 处理', '想跟科研，愿意从基础做起', '请问一周大概处理多少数据量？'],
    mine: false, closed: false,
  },
  {
    id: 9, userId: 7, intent: '个人寻伴', cat: '大创项目', title: '我会前端，求一个靠谱队伍带飞', time: '4小时前',
    projectTags: ['大创', '前端开发'], skillTags: ['前端', '小程序'], targetTags: ['不限年级', '每周8h'],
    desc: '大二软件工程，做过三个小程序、两个 Vue 项目，能独立完成前端页面和接口联调。\n\n之前参加过两次大创，但都是队友中途摆烂，想找一支真正想做事的队伍。时间比较充裕，周中晚上和周末都在。\n\n【我能做什么】\n页面开发、接口联调、简单原型。',
    iceBreakers: ['我会前端，也做过小程序，可以帮忙开发', '你们现在缺人吗？我时间比较充裕', '同校区的，随时可以线下聊'],
    mine: false, closed: false,
  },
  {
    id: 10, userId: 11, intent: '个人寻伴', cat: '蓝桥杯', title: '算法小白求组队一起刷题', time: '6小时前',
    projectTags: ['蓝桥杯', '算法竞赛'], skillTags: ['C++', '算法竞赛'], targetTags: ['不限年级', '晚上有空'],
    desc: '大一，C++ 基础还行，LeetCode 刷了 120 题左右，动态规划还不熟。\n\n一个人刷题容易放弃，想找同频的同学一起，每天互相打卡、每周讲一次题。不追求名次，先把基础打牢。',
    iceBreakers: ['同大一，可以一起打卡刷题吗？', '我 DP 也不太行，互相讲题吧', '你一般晚上几点刷题？'],
    mine: false, closed: false,
  },
  {
    id: 11, userId: 12, intent: '个人寻伴', cat: '挑战杯', title: '擅长写材料，想找技术队友', time: '昨天',
    projectTags: ['挑战杯', '社科调研'], skillTags: ['写作', '文案策划', 'PPT制作'], targetTags: ['不限年级', '周末有空'],
    desc: '汉语言文学专业，写过两份挑战杯校奖材料，擅长调研报告、答辩稿和 PPT 叙事。\n\n但不懂技术，想找一支有实打实技术成果的队伍，我来负责材料包装和答辩表达。可以先把现有材料给你看。',
    iceBreakers: ['我写过挑战杯材料，可以先看看我的稿子', '请问你们目前技术成果到哪一步了？', '答辩稿我可以负责，之前拿过校奖'],
    mine: false, closed: false,
  },
  {
    id: 12, userId: 8, intent: '个人寻伴', cat: '数学建模', title: '建模+编程都会，缺个写作搭子', time: '昨天',
    projectTags: ['数学建模', '统计'], skillTags: ['Python', '数学建模', '写作'], targetTags: ['大三及以上', '每周8h'],
    desc: '统计专业大三，会建模也会写代码，Python 处理数据很熟，拿过校赛一等奖。\n\n短板是论文表达，写出来总像实验报告。想找一位写作强的搭子，我负责模型和代码，你负责讲好故事。',
    iceBreakers: ['我是统计的，建模和代码都能扛', '想找写作强的搭子，你在准备国赛吗？', '可以看看你以前的论文吗？'],
    mine: false, closed: false,
  },
  {
    id: 13, userId: 9, intent: '个人寻伴', cat: '互联网+', title: 'UI 设计在读，想参与有冲劲的项目', time: '2天前',
    projectTags: ['互联网+', '产品设计'], skillTags: ['UI设计', '插画', '视频剪辑'], targetTags: ['不限年级', '周末有空'],
    desc: '视觉传达大二，会 Figma、插画和简单视频剪辑，做过两个校园项目的视觉。\n\n想找一个认真打磨产品的队伍，我可以负责 UI、宣传物料和路演视频。暂时不能写代码，但愿意学。',
    iceBreakers: ['我有作品集，可以发你看看', '想参与产品打磨，不只是做图', '请问项目现在到哪个阶段了？'],
    mine: false, closed: false,
  },
  {
    id: 14, userId: 10, intent: '个人寻伴', cat: '科研项目', title: '想跟着做 AI 科研，愿意从打杂做起', time: '3天前',
    projectTags: ['科研项目', '人工智能'], skillTags: ['Python', '机器学习', '数据标注'], targetTags: ['不限年级', '每周5h'],
    desc: '人工智能专业大一，自学过机器学习基础，跑过几个开源项目，但没做过真正的科研。\n\n想找有课题的学长学姐带一带，数据清洗、标注、跑实验都可以做。不怕枯燥，只希望能真正学到东西。',
    iceBreakers: ['大一 AI 专业，愿意从数据做起', '请问课题组还缺人吗？我可以长期跟', '跑实验、标注我都能做，不怕枯燥'],
    mine: false, closed: false,
  },
  {
    id: 21, userId: 15, intent: '队伍招募', cat: '大创项目', title: '招募一名数据分析同学', time: '1天前',
    projectTags: ['大创', '数据分析'], skillTags: ['数据分析', 'Python'], targetTags: ['大二及以上', '每周5h'],
    desc: '我们做校园学习行为分析，已有两学期脱敏数据。需要一位同学负责数据清洗和可视化，输出分析报告。\n\n项目节奏不快，每周一次同步，适合想积累数据实战经验的同学。',
    iceBreakers: ['我会 Python 数据处理，可以聊聊', '请问数据量大概多大？', '我想积累数据分析经验，时间稳定'],
    mine: true, closed: false,
  },
  {
    id: 22, userId: 15, intent: '个人寻伴', cat: '挑战杯', title: '想找一支做无障碍的队伍', time: '2天前',
    projectTags: ['挑战杯', '公益'], skillTags: ['产品经理', '需求分析'], targetTags: ['不限年级', '周末有空'],
    desc: '我是产品方向，做过两份需求调研，擅长把想法落成可执行的方案。\n\n一直关注无障碍方向，想加入一支已经在做的队伍，负责需求梳理和答辩表达。可以接受从零开始的项目。',
    iceBreakers: ['我是产品方向，可以负责需求梳理', '你们做的是哪个无障碍场景？', '可以约个时间聊一下团队分工吗？'],
    mine: true, closed: false,
  },
];

/* 我的账号（新增帖子的作者） */
USERS.push({ id: 15, name: '周冉', school: '成都信息工程大学', campus: '航空港校区', grade: '大三', major: '软件工程', rating: 4.9, verified: true, avatar: AVATARS[5], tags: ['产品经理', '前端', '需求分析'] });

const postOf = (id) => POSTS.find(p => p.id === id) || POSTS[0];
const userOfPost = (post) => getUser(post.userId);

/* ---------------- 会话（3 条以上历史消息，最后一条与列表预览一致） ---------------- */
const CHATS_INIT = [
  {
    id: 1, userId: 1, postId: 1, unread: 2, dismissed: false, usedIce: [],
    messages: [
      { type: 'post', at: '10:12' },
      { type: 'text', self: false, text: '你好，看到你在招前端，我有 React 项目经验~', at: '10:15' },
      { type: 'text', self: true, text: '太好了，方便发一下你的作品集吗？', at: '10:18' },
      { type: 'text', self: false, text: '作品集我整理好发你，我们约个时间聊聊？', at: '10:24' },
    ],
  },
  {
    id: 2, userId: 2, postId: 2, unread: 0, dismissed: false, usedIce: [],
    messages: [
      { type: 'post', at: '昨天' },
      { type: 'text', self: true, text: '你好，看到你在招算法队友，我刷题量还行', at: '昨天 14:02' },
      { type: 'text', self: false, text: '可以，你主要做哪一类题？', at: '昨天 14:10' },
      { type: 'text', self: false, text: '我们约个时间线下聊聊？', at: '昨天 20:31' },
    ],
  },
  {
    id: 3, userId: 3, postId: 3, unread: 0, dismissed: false, usedIce: [],
    messages: [
      { type: 'post', at: '周一' },
      { type: 'text', self: false, text: '这是项目计划书，你先看看硬件部分', at: '周一 09:12' },
      { type: 'file', self: false, name: '项目计划书V2.pdf', size: '1.2MB', at: '周一 09:12' },
      { type: 'text', self: true, text: '收到，我今晚看完给你反馈', at: '周一 09:40' },
      { type: 'text', self: false, text: '麻烦重点看一下预算那块', at: '周一 10:05' },
    ],
  },
  {
    id: 4, userId: 5, postId: 5, unread: 0, dismissed: false, usedIce: [],
    messages: [
      { type: 'post', at: '周日' },
      { type: 'text', self: false, text: '你好，看你也在准备数模国赛？', at: '周日 16:20' },
      { type: 'text', self: true, text: '是的，我们队缺个写作，你有兴趣吗', at: '周日 16:45' },
      { type: 'text', self: false, text: '有兴趣，我可以带两篇以前的论文给你看', at: '周日 17:02' },
    ],
  },
];

/* ---------------- 个人信息库 ---------------- */
const LIB_INIT = {
  base: {
    avatar: AVATARS[5], nickname: '周冉', realName: '周冉',
    school: '成都信息工程大学', campus: '航空港校区',
    majorClass: '软件工程 2101 班', grade: '大三',
    wechat: 'zhouran_pm', qq: '1029384756', email: 'zhouran@cuit.edu.cn',
  },
  skills: ['前端', 'React', '产品经理', 'UI设计'],
  intentComps: ['蓝桥杯', '挑战杯', '互联网+'],
  projects: [
    { id: 1, name: '大创 · 校园二手交易平台', desc: '负责前端架构与核心页面开发，项目获省级立项。', attachments: [{ name: '项目计划书.pdf', kind: 'file' }] },
  ],
  awards: [
    { id: 2, name: '蓝桥杯 省级一等奖', desc: '2023 年 C/C++ 程序设计大学 B 组。', attachments: [{ name: '蓝桥杯省一证书.jpg', kind: 'image' }] },
  ],
  works: [
    { id: 3, name: '搭子Match 高保真原型', desc: '独立完成产品设计与移动端交互 Demo。', attachments: [{ name: 'GitHub 仓库链接', kind: 'link' }] },
  ],
};

/* ---------------- 匹配池（A/B/C 三组不雷同） ---------------- */
const MATCH_POOLS = [
  [
    { userId: 1, reason: '同校同校区，前端技能与你的项目需求匹配度 96%' },
    { userId: 2, reason: '算法竞赛经历丰富，与你「蓝桥杯」意向高度一致' },
    { userId: 4, reason: '设计能力互补，可补齐你团队缺失的 UI 环节' },
  ],
  [
    { userId: 5, reason: '建模与写作双强，与你的数据分析目标互补' },
    { userId: 7, reason: '同校前端搭子，时间充裕，响应速度快' },
    { userId: 9, reason: '视觉设计方向一致，作品集完成度高' },
  ],
  [
    { userId: 8, reason: '统计背景 + Python 能力，与你技能结构互补' },
    { userId: 6, reason: '硬件方向稀缺，与你的电子设计意向匹配' },
    { userId: 10, reason: '同校区低年级，学习意愿强，投入时间稳定' },
  ],
];

/* ---------------- 帮助中心 ---------------- */
const FAQ_DATA = [
  {
    group: '账号类', items: [
      { q: '怎么完成实名认证？', a: '注册后填写姓名、学校、专业与班级，选择学号验证或校园邮箱验证即可。认证通过后头像旁会显示绿色「已实名」盾牌。' },
      { q: '实名认证失败怎么办？', a: '请先确认学校与校区选择正确、学号格式无误。若多次失败，可在「我的-帮助与反馈」提交截图，我们会在 1 个工作日内人工复核。' },
    ],
  },
  {
    group: '发帖类', items: [
      { q: '怎么关闭帖子？', a: '进入「我的-我的帖子-进行中」，点击帖子右下角「关闭帖子」，选择原因并确认即可。关闭后帖子会移入「已结束」，不会立即删除。' },
      { q: '发布的帖子为什么没显示？', a: '请检查是否选择了正确的意图（队伍招募/个人寻伴）与圈层范围。帖子会按发布时间倒序展示，若仍看不到可下拉刷新或联系客服。' },
    ],
  },
  {
    group: '组队类', items: [
      { q: '被恶意骚扰怎么办？', a: '在聊天页右上角「...」中选择举报，填写原因与说明并上传截图。平台核实后会限制该账号的沟通权限。' },
      { q: '组队契约有什么用？', a: '契约会记录项目名称、周期、分工与投入时间。签署后双方在合作评价中会带上契约标识，便于积累信用。' },
    ],
  },
];
