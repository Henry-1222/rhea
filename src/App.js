import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, Zap, Eye, Terminal, Shield, 
  Radio, Info, ChevronRight, AlertTriangle, Music
} from 'lucide-react';
import { ToolMode } from './constants';

// --- Constants & Data ---

const SCANNABLE_OBJECTS = {
  AIRLOCK: {
    0: [
      {
        id: 'substation_panel',
        name: 'Substation Control',
        nameZh: '变电站控制台',
        description: 'A complex array of switches and gauges for the base power grid.',
        descriptionZh: '一组复杂的开关和仪表，用于基地电网。',
        translatedText: 'GRID STATUS: OFFLINE. MANUAL OVERRIDE REQUIRED.',
        translatedTextZh: '电网状态：离线。需要手动覆盖。',
        position: { x: 30, y: 50 },
        interactable: true
      },
      {
        id: 'airlock_door',
        name: 'Hydraulic Airlock',
        nameZh: '液压气闸门',
        description: 'A massive circular door. It requires full power to cycle.',
        descriptionZh: '一个巨大的圆形门。循环需要全部电力。',
        translatedText: 'DOOR LOCKED. POWER SIGNATURE INSUFFICIENT.',
        translatedTextZh: '门已锁定。电力特征不足。',
        position: { x: 75, y: 50 },
        interactable: true
      }
    ],
    1: [
      {
        id: 'maintenance_note',
        name: 'Scattered Note',
        nameZh: '散落的笔记',
        description: 'A handwritten note left by a technician.',
        descriptionZh: '技术人员留下的手写笔记。',
        translatedText: 'SUBSTATION PATTERN: TOP-LEFT, BOTTOM-RIGHT, CENTER.',
        translatedTextZh: '变电站模式：左上，右下，中心。',
        position: { x: 50, y: 60 },
        hint: true
      }
    ]
  },
  COMMUNICATIONS: {
    0: [
      {
        id: 'antenna_console',
        name: 'Signal Array Console',
        nameZh: '信号阵列控制台',
        description: 'Controls for the external long-range antenna.',
        descriptionZh: '外部远程天线的控制装置。',
        translatedText: 'SIGNAL LOST. ALIGN DISH TO FREQUENCY 142.8.',
        translatedTextZh: '信号丢失。将天线对准频率 142.8。',
        position: { x: 50, y: 45 },
        interactable: true
      }
    ],
    1: [
      {
        id: 'frequency_chart',
        name: 'Frequency Chart',
        nameZh: '频率图表',
        description: 'A technical chart showing various signal bands.',
        descriptionZh: '显示各种信号波段的技术图表。',
        translatedText: 'EMERGENCY CHANNEL: 142.8 MHZ.',
        translatedTextZh: '紧急频道：142.8 兆赫。',
        position: { x: 40, y: 35 },
        hint: true
      }
    ]
  },
  LABORATORY: {
    0: [
      {
        id: 'terminal_main',
        name: 'Volgravian Terminal',
        nameZh: '沃尔格拉维亚终端',
        description: 'The main data hub for the research wing.',
        descriptionZh: '研究部门的主要数据中心。',
        translatedText: 'ENCRYPTION ACTIVE. SECURITY KEY REQUIRED.',
        translatedTextZh: '加密已激活。需要安全密钥。',
        position: { x: 50, y: 45 },
        interactable: true
      },
      {
        id: 'data_log_1',
        name: 'Data Pad 01',
        nameZh: '数据平板 01',
        description: 'A discarded data pad with a blinking light.',
        descriptionZh: '一个闪烁着灯光的废弃数据平板。',
        translatedText: 'LOG 01: THE RHEA ANOMALY IS SELF-SUSTAINING.',
        translatedTextZh: '日志 01：瑞亚异常是自给自足的。',
        position: { x: 20, y: 70 },
        interactable: true
      }
    ],
    1: [
      {
        id: 'cipher_clue',
        name: 'Star Map',
        nameZh: '星图',
        description: 'A map of the Volgravian star system.',
        descriptionZh: '沃尔格拉维亚星系的地图。',
        translatedText: 'THE KEY LIES IN THE YEAR OF THE GREAT ECLIPSE: 1972.',
        translatedTextZh: '密钥在于大日食之年：1972。',
        position: { x: 60, y: 30 },
        hint: true
      },
      {
        id: 'gravity_calibration',
        name: 'Gravity Calibrator',
        nameZh: '重力校准器',
        description: 'A device used to stabilize local gravity fields.',
        descriptionZh: '用于稳定局部重力场的设备。',
        translatedText: 'GRAVITY FLUCTUATION DETECTED. CALIBRATION REQUIRED.',
        translatedTextZh: '检测到重力波动。需要校准。',
        position: { x: 50, y: 60 },
        interactable: true
      },
      {
        id: 'data_log_2',
        name: 'Data Pad 02',
        nameZh: '数据平板 02',
        description: 'A data pad hidden behind some equipment.',
        descriptionZh: '隐藏在一些设备后面的数据平板。',
        translatedText: 'LOG 02: DR. VOLKOV REPORTED STRANGE FLUCTUATIONS.',
        translatedTextZh: '日志 02：沃尔科夫博士报告了奇怪的波动。',
        position: { x: 85, y: 80 },
        interactable: true
      }
    ]
  },
  REACTOR: {
    0: [
      {
        id: 'laser_alignment_system',
        name: 'Laser Alignment System',
        nameZh: '激光对齐系统',
        description: 'A precision system for guiding energy beams into the core.',
        descriptionZh: '用于将能量束引导至核心的精密系统。',
        translatedText: 'BEAM MISALIGNED. CORE TEMPERATURE RISING.',
        translatedTextZh: '光束未对齐。核心温度正在升高。',
        position: { x: 50, y: 40 },
        interactable: true
      }
    ],
    1: [
      {
        id: 'reactor_schematics',
        name: 'Reactor Schematics',
        nameZh: '反应堆示意图',
        description: 'Technical drawings of the reactor core.',
        descriptionZh: '反应堆核心的技术图纸。',
        translatedText: 'STABILIZATION SEQUENCE: GRAVITY -> LASER -> PRESSURE.',
        translatedTextZh: '稳定序列：重力 -> 激光 -> 压力。',
        position: { x: 30, y: 30 },
        hint: true
      },
      {
        id: 'data_log_3',
        name: 'Data Pad 03',
        nameZh: '数据平板 03',
        description: 'A scorched data pad near the cooling pipes.',
        descriptionZh: '冷却管附近的一个焦黑的数据平板。',
        translatedText: 'LOG 03: EMERGENCY! THE CORE IS OVERHEATING.',
        translatedTextZh: '日志 03：紧急！核心正在过热。',
        position: { x: 70, y: 60 },
        interactable: true
      }
    ]
  },
  CONTAINMENT: {
    0: [
      {
        id: 'core_stabilizer',
        name: 'Core Stabilizer',
        nameZh: '核心稳定器',
        description: 'The final containment unit for the Red Matter core.',
        descriptionZh: '红物质核心的最终遏制单元。',
        translatedText: 'STABILIZATION SEQUENCE: FULL ROTATION -> ZERO RESET.',
        translatedTextZh: '稳定序列：全旋转 -> 归零重置。',
        position: { x: 50, y: 50 },
        interactable: true
      }
    ],
    1: [
      {
        id: 'emergency_manual',
        name: 'Emergency Manual',
        nameZh: '紧急手册',
        description: 'A safety manual for core meltdowns.',
        descriptionZh: '核心熔毁安全手册。',
        translatedText: 'IN CASE OF INSTABILITY: ROTATE CW TO 360, THEN CCW TO 0.',
        translatedTextZh: '如果出现不稳定：顺时针旋转至 360，然后逆时针旋转至 0。',
        position: { x: 50, y: 40 },
        hint: true
      },
      {
        id: 'pressure_calibration',
        name: 'Pressure Valve',
        nameZh: '压力阀',
        description: 'A manual valve for regulating containment pressure.',
        descriptionZh: '用于调节遏制压力的手动阀门。',
        translatedText: 'PRESSURE CRITICAL. BALANCE THE LOAD TO PROCEED.',
        translatedTextZh: '压力临界。平衡负载以继续。',
        position: { x: 70, y: 70 },
        interactable: true
      }
    ]
  }
};

const UI_STRINGS = {
  EN: {
    suitIntegrity: 'Suit Integrity',
    oxygenLevel: 'Oxygen Level',
    commsActive: 'COMMS: ACTIVE',
    location: 'Location',
    scan: 'SCAN',
    claw: 'CLAW',
    light: 'LIGHT',
    hack: 'HACK',
    translatedData: 'Translated Data',
    powerDist: 'Substation Control',
    close: 'CLOSE',
    volgravianOS: 'Volgravian OS // Decryptor',
    abort: 'ABORT',
    connectNodes: 'CONNECT ALL NODES TO BYPASS ENCRYPTION',
    coreStabilizer: 'CORE STABILIZER',
    exit: 'EXIT',
    initStabilization: 'INITIALIZE STABILIZATION',
    missionAccomplished: 'Mission Accomplished',
    missionDesc: 'The Red Matter has been stabilized. The Rhea base is secure. Extraction team is en route. Well done, Agent.',
    restart: 'RESTART SIMULATION',
    msgInit: 'System initialized.',
    msgLanding: 'Landing sequence complete.',
    msgWelcome: 'Welcome to Rhea Base, Agent.',
    msgScanned: 'Scanned',
    msgAirlockCycled: 'Airlock cycled. Entering Communications.',
    msgPowerReq: 'Error: Door requires substation activation.',
    msgAccessGranted: 'Terminal access granted.',
    msgAccessContainment: 'Security override: Accessing Containment Chamber.',
    msgPowerRestored: 'Substation online. Power restored.',
    msgCoreStabilized: 'Core stabilized. Red Matter contained.',
    msgSeqReset: 'Sequence reset: Incorrect input.',
    msgFuseAligned: 'Fuses aligned. Power flowing.',
    msgCipherSolved: 'Cipher solved. Accessing restricted files.',
    msgAntennaAligned: 'Antenna aligned. Signal restored.',
    msgGravityCalibrated: 'Gravity calibrated. Local field stabilized.',
    msgPressureBalanced: 'Pressure balanced. Containment stable.',
    msgLaserAligned: 'Laser aligned. Reactor core accessible.',
    msgLogFound: 'Data log decrypted. New information added to database.',
    msgAccessReactor: 'Security override: Accessing Reactor Core.',
    gravityCalibration: 'GRAVITY CALIBRATION',
    stabilizeGravity: 'DRAG SPHERES TO STABILIZE THE FIELD',
    pressureBalance: 'PRESSURE BALANCE',
    balanceLoad: 'KEEP THE POINTER IN THE GREEN ZONE',
    walkthroughTitle: 'Classified: Field Manual',
    walkthroughStep1: '1. Activate Substation: In Airlock View 0, toggle switches: Top-Left, Bottom-Right, Center.',
    walkthroughStep2: '2. Align Antenna: In Communications View 0, set frequency to 142.8.',
    walkthroughStep3: '3. Calibrate Gravity: In Laboratory View 1, drag spheres to targets.',
    walkthroughStep4: '4. Hack Terminal: In Laboratory View 0, connect all nodes.',
    walkthroughStep5: '5. Align Laser: In Reactor View 0, rotate mirrors to guide the beam.',
    walkthroughStep6: '6. Balance Pressure: In Containment View 1, keep pointer in green.',
    walkthroughStep7: '7. Stabilize Core: In Containment View 0, rotate CW to 360, then CCW to 0.',
    log1: 'LOG 01: The Rhea base was established to study the "Red Matter" anomaly. Initial tests show it is a self-sustaining energy source, but highly volatile.',
    log2: 'LOG 02: Dr. Volkov reported strange gravitational fluctuations in the lab. The spheres are drifting without external force.',
    log3: 'LOG 03: Emergency! The reactor core is overheating. The laser alignment system failed. We are evacuating. If you find this, stabilize the core at all costs.',
    reactor: 'REACTOR',
    laserAlignment: 'LASER ALIGNMENT',
    alignMirrors: 'ROTATE MIRRORS TO GUIDE THE BEAM TO THE RECEIVER',
    credits: 'Credits',
    creditsTitle: 'The Rhea Incident: Red Matter 2',
    creditsLead: 'Lead Developer & Designer',
    creditsLeadName: 'Crea',
    creditsLeadDesc: 'Responsible for full-stack development, UI/UX design, game logic, and multilingual support.',
    creditsTech: 'Tech Stack',
    creditsTechDesc: 'React 19, Tailwind CSS, Framer Motion, Lucide Icons.',
    creditsStory: 'Story & Lore',
    creditsStoryDesc: 'Inspired by the Red Matter 2 universe by Vertical Robot.',
    creditsPowered: 'Powered by Crea',
    back: 'Back',
    rotateFull: 'ROTATE CLOCKWISE TO 360° THEN BACK TO 0°',
    newGame: 'NEW GAME',
    createWorld: 'CREATE NEW WORLD',
    levelSelect: 'LEVEL SELECTION',
    selectMission: 'SELECT A MISSION',
    controls: 'CONTROL LOGIC',
    howToPlay: 'HOW TO INTERACT',
    loading: 'LOADING RHEA ASSETS...',
    initializing: 'INITIALIZING NEURAL LINK...',
    connecting: 'CONNECTING TO BASE...',
    airlock: 'AIRLOCK',
    communications: 'COMMUNICATIONS',
    laboratory: 'LABORATORY',
    containment: 'CONTAINMENT',
    controlScan: 'SCANNER: USE TO TRANSLATE VOLGRAVIAN TEXT.',
    controlClaw: 'CLAW: USE TO INTERACT WITH PHYSICAL OBJECTS.',
    controlLight: 'LIGHT: USE TO ILLUMINATE DARK AREAS.',
    controlHack: 'HACK: USE TO BYPASS SECURITY TERMINALS.',
    controlMove: 'MOVE: USE ARROWS TO CHANGE PERSPECTIVE.',
    antennaAlignment: 'ANTENNA ALIGNMENT',
    setFrequency: 'SET FREQUENCY TO 142.8 MHZ',
    substationSwitches: 'SUBSTATION SWITCHES',
    matchPattern: 'MATCH THE TECHNICIAN\'S PATTERN',
    resetSettings: 'RESET TO INITIAL SETTINGS',
    resetConfirm: 'ARE YOU SURE? THIS WILL WIPE ALL PROGRESS.',
    musicOn: 'MUSIC: ON',
    musicOff: 'MUSIC: OFF',
    originalDev: 'Original VR Game Developer',
    fullPlaythrough: '"Red Matter 2" Full Playthrough',
  },
  ZH: {
    suitIntegrity: '宇航服完整性',
    oxygenLevel: '氧气水平',
    commsActive: '通信：激活',
    location: '位置',
    scan: '扫描',
    claw: '机械爪',
    light: '照明',
    hack: '破解',
    translatedData: '翻译数据',
    powerDist: '变电站控制',
    close: '关闭',
    volgravianOS: '沃尔格拉维亚操作系统 // 解码器',
    abort: '中止',
    connectNodes: '连接所有节点以绕过加密',
    coreStabilizer: '核心稳定器',
    exit: '退出',
    initStabilization: '初始化稳定程序',
    missionAccomplished: '任务完成',
    missionDesc: '红物质已稳定。瑞亚基地已安全。撤离小组正在途中。干得好，特工。',
    restart: '重启模拟',
    msgInit: '系统已初始化。',
    msgLanding: '着陆序列完成。',
    msgWelcome: '欢迎来到瑞亚基地，特工。',
    msgScanned: '已扫描',
    msgAirlockCycled: '气闸已循环。正在进入通信室。',
    msgPowerReq: '错误：门需要激活变电站。',
    msgAccessGranted: '终端访问已授权。',
    msgAccessContainment: '安全覆盖：正在进入遏制室。',
    msgPowerRestored: '变电站上线。电力已恢复。',
    msgCoreStabilized: '核心已稳定。红物质已遏制。',
    msgSeqReset: '序列重置：输入错误。',
    msgFuseAligned: '保险丝已对齐。电力开始流动。',
    msgCipherSolved: '密码已破解。正在访问受限文件。',
    msgAntennaAligned: '天线已对齐。信号已恢复。',
    msgGravityCalibrated: '重力已校准。局部场已稳定。',
    msgPressureBalanced: '压力已平衡。遏制场稳定。',
    msgLaserAligned: '激光已对齐。反应堆核心可访问。',
    msgLogFound: '数据日志已解密。新信息已添加到数据库。',
    msgAccessReactor: '安全覆盖：正在进入反应堆核心。',
    gravityCalibration: '重力校准',
    stabilizeGravity: '拖动球体以稳定重力场',
    pressureBalance: '压力平衡',
    balanceLoad: '将指针保持在绿色区域',
    walkthroughTitle: '绝密：外勤手册',
    walkthroughStep1: '1. 激活变电站：在气闸室视图 0，切换开关：左上，右下，中心。',
    walkthroughStep2: '2. 对齐天线：在通信室视图 0，设置频率为 142.8。',
    walkthroughStep3: '3. 校准重力：在实验室视图 1，将球体拖动到目标。',
    walkthroughStep4: '4. 破解终端：在实验室视图 0，连接所有节点。',
    walkthroughStep5: '5. 对齐激光：在反应堆视图 0，旋转镜子以引导光束。',
    walkthroughStep6: '6. 平衡压力：在遏制室视图 1，将指针保持在绿色区域。',
    walkthroughStep7: '7. 稳定核心：在遏制室视图 0，顺时针旋转至 360，然后逆时针旋转至 0。',
    log1: '日志 01：瑞亚基地是为了研究“红物质”异常而建立的。初步测试显示它是一种自给自足的能源，但极不稳定。',
    log2: '日志 02：沃尔科夫博士报告实验室出现奇怪的重力波动。球体在没有外力的情况下漂移。',
    log3: '日志 03：紧急！反应堆核心过热。激光对齐系统失效。我们正在撤离。如果你发现这个，不惜一切代价稳定核心。',
    reactor: '反应堆',
    laserAlignment: '激光对齐',
    alignMirrors: '旋转镜子以将光束引导至接收器',
    credits: '制作人员表',
    creditsTitle: '瑞亚事件：红物质 2',
    creditsLead: '首席开发与设计',
    creditsLeadName: 'Crea',
    creditsLeadDesc: '负责全栈开发、UI/UX 设计、游戏逻辑及多语言支持。',
    creditsTech: '技术栈',
    creditsTechDesc: 'React 19, Tailwind CSS, Framer Motion, Lucide Icons.',
    creditsStory: '故事背景',
    creditsStoryDesc: '基于 Vertical Robot 的《Red Matter 2》宇宙。',
    creditsPowered: 'Powered by Crea',
    back: '返回',
    rotateFull: '顺时针旋转至 360°，然后逆时针旋转回 0°',
    newGame: '新游戏',
    createWorld: '创建新世界',
    levelSelect: '选择关卡',
    selectMission: '选择一个任务',
    controls: '操作逻辑',
    howToPlay: '如何进行交互',
    loading: '正在加载瑞亚资产...',
    initializing: '正在初始化神经链接...',
    connecting: '正在连接至基地...',
    airlock: '气闸室',
    communications: '通信室',
    laboratory: '实验室',
    containment: '遏制室',
    controlScan: '扫描仪：用于翻译沃尔格拉维亚文字。',
    controlClaw: '机械爪：用于与物理对象交互。',
    controlLight: '照明：用于照亮黑暗区域。',
    controlHack: '破解：用于绕过安全终端。',
    controlMove: '移动：使用箭头改变视角。',
    antennaAlignment: '天线对齐',
    setFrequency: '设置频率为 142.8 兆赫',
    substationSwitches: '变电站开关',
    matchPattern: '匹配技术人员的模式',
    resetSettings: '恢复最初设置',
    resetConfirm: '您确定吗？这将清除所有进度。',
    musicOn: '音乐：开启',
    musicOff: '音乐：关闭',
    originalDev: '原版VR游戏开发者',
    fullPlaythrough: '《红色物质2》实况全程',
  }
};
// --- Sub-components ---

const HUD = ({ state, toolMode, setToolMode, setLanguage, onLocationClick }) => {
  const t = UI_STRINGS[state.language];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-10">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-6">
          <div className="player-chrome p-5 flex items-center gap-8 pointer-events-auto">
            <div className="flex flex-col">
              <span className="status-label text-[9px] mb-2">{t.suitIntegrity}</span>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                  initial={{ width: '100%' }}
                  animate={{ width: '98%' }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="status-label text-[9px] mb-2">{t.oxygenLevel}</span>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  initial={{ width: '100%' }}
                  animate={{ width: '85%' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 border-l border-white/10">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="timer-display text-[10px] font-sans tracking-widest">{t.commsActive}</span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="player-chrome p-2.5 flex gap-2 pointer-events-auto w-fit">
            <button 
              onClick={() => setLanguage('EN')}
              className={`px-4 py-1.5 rounded-2xl font-sans text-[10px] transition-all ${state.language === 'EN' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-white/40 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ZH')}
              className={`px-4 py-1.5 rounded-2xl font-sans text-[10px] transition-all ${state.language === 'ZH' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-white/40 hover:text-white'}`}
            >
              中文
            </button>
          </div>
        </div>

        <div 
          onClick={onLocationClick}
          className="player-chrome p-5 flex flex-col items-end pointer-events-auto cursor-default active:scale-95 transition-transform"
        >
          <span className="status-label text-[9px] mb-1">{t.location}</span>
          <span className="font-sans text-sm tracking-[0.2em] text-white/90 font-light">RHEA BASE // {state.currentRoom}</span>
        </div>
      </div>

      {/* Bottom Bar - Tool Selector */}
      <div className="flex justify-center items-end gap-6 pointer-events-auto">
        {[
          { mode: ToolMode.SCANNER, icon: Scan, label: t.scan },
          { mode: ToolMode.CLAW, icon: Zap, label: t.claw },
          { mode: ToolMode.FLASHLIGHT, icon: Eye, label: t.light },
          { mode: ToolMode.HACKER, icon: Terminal, label: t.hack },
        ].map((tool) => (
          <button
            key={tool.mode}
            onClick={() => setToolMode(tool.mode)}
            className={`
              tool-btn flex flex-col items-center gap-3 p-5 backdrop-blur-2xl border
              ${toolMode === tool.mode ? 'tool-btn-active text-cyan-400' : 'bg-black/30 border-white/5 text-white/30 hover:bg-black/50 hover:border-white/20'}
            `}
          >
            <tool.icon className="w-7 h-7" />
            <span className="status-label text-[9px] tracking-widest">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageLog = ({ messages }) => {
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 w-64 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {messages.slice(-5).map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/60 border-l-2 border-cyan-500 p-3 backdrop-blur-sm rounded-r-xl"
          >
            <p className="font-sans font-light text-[10px] text-cyan-400/80 leading-tight uppercase tracking-widest">
              {msg.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

let msgCounter = 0;
const generateMsgId = () => `msg-${Date.now()}-${msgCounter++}-${Math.random().toString(36).substr(2, 9)}`;

const ExternalLinks = ({ t, className }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-all group pointer-events-auto">
        <span className="text-[10px] font-sans tracking-widest text-white/40 group-hover:text-white/60 transition-colors uppercase">
          {t.originalDev}:
        </span>
        <a 
          href="https://verticalrobot.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-sans tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-4"
        >
          verticalrobot.com
        </a>
      </div>
      <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-all group pointer-events-auto">
        <span className="text-[10px] font-sans tracking-widest text-white/40 group-hover:text-white/60 transition-colors uppercase">
          {t.fullPlaythrough}:
        </span>
        <a 
          href="https://www.bilibili.com/video/BV1bW4y157Cb/?spm_id_from=333.337.search-card.all.click" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-sans tracking-widest text-pink-400/60 hover:text-pink-400 transition-colors underline underline-offset-4"
        >
          bilibili.com
        </a>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasCompletedGame, setHasCompletedGame] = useState(() => {
    return localStorage.getItem('rhea_completed') === 'true';
  });

  const [state, setState] = useState({
    currentRoom: 'AIRLOCK',
    currentView: 0,
    inventory: [],
    powerRestored: false,
    substationActive: false,
    antennaAligned: false,
    terminalUnlocked: false,
    coreStabilized: false,
    fusesAligned: false,
    cipherSolved: false,
    gravityCalibrated: false,
    pressureCalibrated: false,
    laserAligned: false,
    scannedObjects: new Set(),
    messages: [
      { id: generateMsgId(), text: UI_STRINGS.EN.msgInit },
      { id: generateMsgId(), text: UI_STRINGS.EN.msgLanding },
      { id: generateMsgId(), text: UI_STRINGS.EN.msgWelcome }
    ],
    language: 'EN',
    foundLogs: [],
  });

  const t = UI_STRINGS[state.language];

  const [toolMode, setToolMode] = useState(ToolMode.SCANNER);
  const [scanningId, setScanningId] = useState(null);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [locationClickCount, setLocationClickCount] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let playPromise = null;

    const syncAudio = async () => {
      if (isMusicPlaying) {
        console.log("Music toggle: ON. Syncing...");
        try {
          if (!audioRef.current) {
            console.log("Initializing new Audio object...");
            audioRef.current = new Audio();
            audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4;
            audioRef.current.load();
            
            audioRef.current.addEventListener('error', (e) => {
              console.error("Audio object error event:", e);
              if (audioRef.current && isMounted) {
                console.log("Attempting fallback to another stable source...");
                audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
                audioRef.current.load();
                audioRef.current.play().catch(err => console.error("Fallback failed:", err));
              }
            });
          }
          
          if (audioRef.current.paused) {
            playPromise = audioRef.current.play();
            await playPromise;
            console.log("Audio started playing successfully");
          }
        } catch (error) {
          if (isMounted) {
            console.error("Audio play() failed:", error);
            if (error instanceof Error && error.name === 'NotAllowedError') {
              console.warn("Autoplay blocked. User must interact again.");
            }
            setIsMusicPlaying(false);
          }
        }
      } else {
        if (audioRef.current) {
          console.log("Music toggle: OFF. Syncing...");
          if (playPromise) {
            try {
              await playPromise;
            } catch (e) {}
          }
          audioRef.current.pause();
        }
      }
    };

    syncAudio();

    return () => {
      isMounted = false;
    };
  }, [isMusicPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (state.coreStabilized) {
      localStorage.setItem('rhea_completed', 'true');
      setHasCompletedGame(true);
    }
  }, [state.coreStabilized]);

  const handleLocationClick = () => {
    const rooms = ['AIRLOCK', 'COMMUNICATIONS', 'LABORATORY', 'CONTAINMENT', 'REACTOR'];
    const currentIndex = rooms.indexOf(state.currentRoom);
    const nextIndex = (currentIndex + 1) % rooms.length;
    
    const nextRoom = rooms[nextIndex];
    let canProceed = true;
    
    if (nextRoom === 'COMMUNICATIONS' && !state.substationActive) canProceed = false;
    if (nextRoom === 'LABORATORY' && !state.antennaAligned) canProceed = false;
    if (nextRoom === 'CONTAINMENT' && !state.terminalUnlocked) canProceed = false;
    if (nextRoom === 'REACTOR' && !state.coreStabilized) canProceed = false;

    if (canProceed || nextRoom === 'AIRLOCK') {
      setState(prev => ({ ...prev, currentRoom: nextRoom, currentView: 0 }));
    } else {
      addMessage('msgAccessDenied');
    }

    const nextCount = locationClickCount + 1;
    if (nextCount >= 5) {
      setShowWalkthrough(true);
      setLocationClickCount(0);
    } else {
      setLocationClickCount(nextCount);
    }
  };

  const startNewGame = () => {
    setState({
      currentRoom: 'AIRLOCK',
      currentView: 0,
      inventory: [],
      powerRestored: false,
      substationActive: false,
      antennaAligned: false,
      terminalUnlocked: false,
      coreStabilized: false,
      fusesAligned: false,
      cipherSolved: false,
      gravityCalibrated: false,
      pressureCalibrated: false,
      laserAligned: false,
      foundLogs: [],
      scannedObjects: new Set(),
      messages: [
        { id: generateMsgId(), text: t.msgInit },
        { id: generateMsgId(), text: t.msgLanding },
        { id: generateMsgId(), text: t.msgWelcome }
      ],
      language: state.language
    });
    setShowMenu(false);
    setShowIntro(true);
  };

  const jumpToLevel = (room) => {
    setState(prev => ({
      ...prev,
      currentRoom: room,
      currentView: 0,
      powerRestored: room !== 'AIRLOCK',
      substationActive: room !== 'AIRLOCK',
      antennaAligned: room !== 'AIRLOCK' && room !== 'COMMUNICATIONS',
      terminalUnlocked: room === 'CONTAINMENT',
      messages: [
        { id: generateMsgId(), text: t.msgInit },
        { id: generateMsgId(), text: t.msgWelcome }
      ]
    }));
    setShowMenu(false);
    setShowLevelSelect(false);
  };

  const resetGame = () => {
    if (window.confirm(t.resetConfirm)) {
      localStorage.removeItem('rhea_completed');
      setHasCompletedGame(false);
      setState({
        currentRoom: 'AIRLOCK',
        currentView: 0,
        inventory: [],
        powerRestored: false,
        substationActive: false,
        antennaAligned: false,
        terminalUnlocked: false,
        coreStabilized: false,
        fusesAligned: false,
        cipherSolved: false,
        gravityCalibrated: false,
        pressureCalibrated: false,
        laserAligned: false,
        foundLogs: [],
        scannedObjects: new Set(),
        messages: [
          { id: generateMsgId(), text: t.msgInit },
          { id: generateMsgId(), text: t.msgLanding },
          { id: generateMsgId(), text: t.msgWelcome }
        ],
        language: state.language
      });
      setShowMenu(true);
      addMessage('System reset to factory defaults.');
    }
  };

  const addMessage = (msgKey) => {
    setState(prev => {
      const msgText = UI_STRINGS[prev.language][msgKey] || msgKey;
      return { 
        ...prev, 
        messages: [...prev.messages, { id: generateMsgId(), text: msgText }] 
      };
    });
  };

  const setLanguage = (lang) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const handleScan = (obj) => {
    if (toolMode !== ToolMode.SCANNER) return;
    setScanningId(obj.id);
    setTimeout(() => {
      setState(prev => {
        const next = new Set(prev.scannedObjects);
        next.add(obj.id);
        return { ...prev, scannedObjects: next };
      });
      const name = state.language === 'ZH' ? obj.nameZh : obj.name;
      addMessage(`${t.msgScanned}: ${name}`);
      setScanningId(null);
    }, 1500);
  };

  const handleInteract = (objId) => {
    if (toolMode === ToolMode.CLAW) {
      if (objId === 'substation_panel' && !state.substationActive) {
        setActivePuzzle('SUBSTATION');
      } else if (objId === 'airlock_door') {
        if (state.substationActive) {
          setState(prev => ({ ...prev, currentRoom: 'COMMUNICATIONS', currentView: 0 }));
          addMessage('msgAirlockCycled');
        } else {
          addMessage('msgPowerReq');
        }
      } else if (objId === 'antenna_console' && state.currentRoom === 'COMMUNICATIONS') {
        setActivePuzzle('ANTENNA');
      } else if (objId === 'terminal_main' && state.currentRoom === 'LABORATORY') {
        if (state.antennaAligned) {
          setActivePuzzle('HACK');
        } else {
          addMessage('Error: Signal required for terminal uplink.');
        }
      } else if (objId === 'core_stabilizer' && state.currentRoom === 'CONTAINMENT') {
        if (state.gravityCalibrated && state.pressureCalibrated && state.laserAligned) {
          setActivePuzzle('CORE');
        } else {
          addMessage('Error: Gravity, Pressure, and Laser calibration required.');
        }
      } else if (objId === 'laser_alignment_system' && state.currentRoom === 'REACTOR') {
        setActivePuzzle('LASER');
      } else if (objId.startsWith('data_log_')) {
        const logId = objId.split('_').pop();
        if (!state.foundLogs.includes(logId)) {
          setState(prev => ({ ...prev, foundLogs: [...prev.foundLogs, logId] }));
          addMessage('msgLogFound');
        }
      } else if (objId === 'cipher_wall' || objId === 'cipher_clue') {
        setActivePuzzle('CIPHER');
      } else if (objId === 'gravity_calibration') {
        setActivePuzzle('GRAVITY');
      } else if (objId === 'pressure_calibration') {
        setActivePuzzle('PRESSURE');
      }
    }
  };

  const changeView = (dir) => {
    setState(prev => ({
      ...prev,
      currentView: prev.currentView === 0 ? 1 : 0
    }));
  };

  // --- Screens ---

  const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(t.loading);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 100;
          return p + Math.random() * 15;
        });
      }, 300);
      
      const textTimer1 = setTimeout(() => setLoadingText(state.language === 'ZH' ? '正在校准神经接口...' : 'CALIBRATING NEURAL INTERFACE...'), 1200);
      const textTimer2 = setTimeout(() => setLoadingText(state.language === 'ZH' ? '正在同步沃尔格拉维亚协议...' : 'SYNCING VOLGRAVIAN PROTOCOLS...'), 2400);

      return () => {
        clearInterval(interval);
        clearTimeout(textTimer1);
        clearTimeout(textTimer2);
      };
    }, []);

    return (
      <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 overflow-hidden">
        <div className="atmosphere opacity-100" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="w-24 h-24 mb-12 relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-white/5 border-t-white/40 rounded-full"
            />
            <div className="absolute inset-4 bg-red-500/20 blur-xl rounded-full red-matter-glow" />
          </div>
          
          <span className="status-label text-white/40 mb-4">{loadingText}</span>
          
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div 
              className="h-full bg-white/40"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          <span className="font-sans text-[10px] text-white/20">{Math.floor(progress)}%</span>
        </motion.div>
      </div>
    );
  };

  const MainMenu = () => {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center p-10">
        <div className="atmosphere opacity-80" />
        <img 
          src="https://picsum.photos/seed/rhea_menu/1920/1080?blur=4" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          alt="Menu Background"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl font-light tracking-tighter mb-4">RHEA</h1>
            <h2 className="text-3xl font-light text-red-500 tracking-[0.3em] mb-12">RED MATTER 2</h2>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <button onClick={() => setLanguage('EN')} className={`px-4 py-1 rounded-full text-[10px] border transition-all ${state.language === 'EN' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10'}`}>EN</button>
                <button onClick={() => setLanguage('ZH')} className={`px-4 py-1 rounded-full text-[10px] border transition-all ${state.language === 'ZH' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10'}`}>ZH</button>
              </div>

              {/* Music Toggle in Menu */}
              <button 
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all w-fit ${isMusicPlaying ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                <Music className={`w-5 h-5 ${isMusicPlaying ? 'animate-pulse' : ''}`} />
                <span className="status-label text-[10px] tracking-widest uppercase">
                  {isMusicPlaying ? t.musicOn : t.musicOff}
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <button onClick={startNewGame} className="group flex flex-col items-start p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all text-left">
              <span className="text-xl font-light mb-1 group-hover:text-red-500 transition-colors">{t.newGame}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase">{t.createWorld}</span>
            </button>

            <button 
              disabled={!hasCompletedGame}
              onClick={() => setShowLevelSelect(true)}
              className={`group flex flex-col items-start p-6 rounded-[2rem] border border-white/5 transition-all text-left ${hasCompletedGame ? 'hover:bg-white/5' : 'opacity-30 cursor-not-allowed'}`}
            >
              <span className="text-xl font-light mb-1 group-hover:text-red-500 transition-colors">{t.levelSelect}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase">{t.selectMission}</span>
            </button>

            <button onClick={() => setShowControls(true)} className="group flex flex-col items-start p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all text-left">
              <span className="text-xl font-light mb-1 group-hover:text-red-500 transition-colors">{t.controls}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase">{t.howToPlay}</span>
            </button>

            <button onClick={() => setShowCredits(true)} className="group flex flex-col items-start p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all text-left">
              <span className="text-xl font-light mb-1 group-hover:text-red-500 transition-colors">{t.credits}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase">CREA</span>
            </button>

            <button 
              onClick={resetGame}
              className="group flex flex-col items-start p-6 rounded-[2rem] border border-red-500/10 hover:bg-red-500/5 transition-all text-left"
            >
              <span className="text-xl font-light mb-1 group-hover:text-red-500 transition-colors">{t.resetSettings}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase">{t.resetConfirm.split('?')[0]}?</span>
            </button>
          </motion.div>
        </div>

        {/* External Links in Main Menu */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 right-10"
        >
          <ExternalLinks t={t} className="items-end" />
        </motion.div>
      </div>
    );
  };

  const LevelSelectModal = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-10"
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-12">
          <span className="status-label text-red-500">{t.levelSelect}</span>
          <button onClick={() => setShowLevelSelect(false)} className="text-white/40 hover:text-white transition-colors">{t.back}</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {['AIRLOCK', 'COMMUNICATIONS', 'LABORATORY', 'CONTAINMENT'].map((room) => (
            <button 
              key={room}
              onClick={() => jumpToLevel(room)}
              className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all"
            >
              <span className="text-2xl font-light group-hover:text-red-500 transition-colors">{t[room.toLowerCase()]}</span>
              <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-red-500" />
            </button>
          ))}
          <button 
            onClick={() => {
              const rooms = ['AIRLOCK', 'LABORATORY', 'CONTAINMENT'];
              const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
              jumpToLevel(randomRoom);
            }}
            className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all mt-4"
          >
            <span className="text-2xl font-light text-red-400 group-hover:text-red-500 transition-colors">RANDOM MISSION</span>
            <Radio className="w-6 h-6 text-red-400/40 group-hover:text-red-500 animate-pulse" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ControlsModal = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-10"
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-12">
          <span className="status-label text-cyan-400">{t.controls}</span>
          <button onClick={() => setShowControls(false)} className="text-white/40 hover:text-white transition-colors">{t.back}</button>
        </div>
        <div className="space-y-6">
          {[
            { icon: <Scan className="w-5 h-5" />, text: t.controlScan },
            { icon: <Zap className="w-5 h-5" />, text: t.controlClaw },
            { icon: <Eye className="w-5 h-5" />, text: t.controlLight },
            { icon: <Terminal className="w-5 h-5" />, text: t.controlHack },
            { icon: <ChevronRight className="w-5 h-5" />, text: t.controlMove },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5">
              <div className="p-4 bg-white/5 rounded-2xl text-cyan-400">{item.icon}</div>
              <span className="text-sm font-light text-white/70">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // --- Puzzles ---

  const SubstationPuzzle = () => {
    const [switches, setSwitches] = useState(Array(9).fill(false));
    const targetPattern = [0, 4, 8]; // Top-Left, Center, Bottom-Right

    const handleToggle = (i) => {
      const next = [...switches];
      next[i] = !next[i];
      setSwitches(next);
      
      const activeIndices = next.map((v, idx) => v ? idx : null).filter(v => v !== null);
      if (activeIndices.length === targetPattern.length && targetPattern.every(idx => next[idx])) {
        setState(prev => ({ ...prev, substationActive: true, powerRestored: true }));
        setActivePuzzle(null);
        addMessage('msgPowerRestored');
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[500px] border-cyan-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <span className="status-label text-cyan-400 text-xs">{t.powerDist}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {switches.map((val, i) => (
              <button
                key={i}
                onClick={() => handleToggle(i)}
                className={`h-24 rounded-2xl border transition-all duration-300 flex items-center justify-center ${val ? 'bg-cyan-500/30 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
              >
                <div className={`w-3 h-3 rounded-full ${val ? 'bg-cyan-400 animate-pulse' : 'bg-white/10'}`} />
              </button>
            ))}
          </div>
          <p className="mt-8 font-sans text-[10px] text-cyan-500/40 text-center uppercase tracking-widest">{t.matchPattern}</p>
        </div>
      </motion.div>
    );
  };

  const AntennaPuzzle = () => {
    const [freq, setFreq] = useState(100.0);
    const target = 142.8;

    useEffect(() => {
      if (Math.abs(freq - target) < 0.2) {
        const timer = setTimeout(() => {
          setState(prev => ({ ...prev, antennaAligned: true }));
          setActivePuzzle(null);
          addMessage('msgAntennaAligned');
          addMessage('Laboratory uplink established.');
          setTimeout(() => {
            setState(prev => ({ ...prev, currentRoom: 'LABORATORY', currentView: 0 }));
          }, 1000);
        }, 800);
        return () => clearTimeout(timer);
      }
    }, [freq]);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[500px] border-blue-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <span className="status-label text-blue-400 text-xs">{t.antennaAlignment}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          
          <div className="flex flex-col items-center gap-12">
            <div className="text-6xl font-sans font-light tracking-tighter text-blue-400 tabular-nums">
              {freq.toFixed(1)} <span className="text-sm text-blue-400/40 ml-2">MHZ</span>
            </div>
            
            <div className="w-full space-y-4">
              <input 
                type="range" 
                min="80" 
                max="200" 
                step="0.1"
                value={freq} 
                onChange={(e) => setFreq(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-sans tracking-widest">
                <span>80.0</span>
                <span>200.0</span>
              </div>
            </div>
            
            <p className="font-sans text-[10px] text-blue-500/40 text-center uppercase tracking-widest">{t.setFrequency}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const CipherPuzzle = () => {
    const [code, setCode] = useState(['', '', '', '']);
    const target = ['1', '9', '7', '2']; 

    const handleInput = (i, val) => {
      const next = [...code];
      next[i] = val;
      setCode(next);
      if (next.join('') === target.join('')) {
        setState(prev => ({ ...prev, cipherSolved: true }));
        setActivePuzzle(null);
        addMessage('msgCipherSolved');
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[450px] border-amber-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <span className="status-label text-amber-500 text-xs">VOLGRAVIAN CIPHER</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          <div className="flex gap-4 justify-center">
            {code.map((val, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleInput(i, e.target.value)}
                className="w-16 h-20 bg-black/50 border-2 border-amber-500/30 rounded-xl text-center text-2xl font-sans text-amber-400 focus:border-amber-500 outline-none"
              />
            ))}
          </div>
          <p className="mt-8 text-center font-sans text-[10px] text-amber-500/40 uppercase tracking-widest">ENTER THE SEQUENCE FOUND IN THE STARS</p>
        </div>
      </motion.div>
    );
  };

  const HackPuzzle = () => {
    const [grid, setGrid] = useState(Array(9).fill(false));
    const handleToggle = (i) => {
      const next = [...grid];
      next[i] = !next[i];
      setGrid(next);
      if (next.every(v => v)) {
        setState(prev => ({ ...prev, terminalUnlocked: true }));
        setActivePuzzle(null);
        addMessage('msgAccessGranted');
        setTimeout(() => {
          setState(prev => ({ ...prev, currentRoom: 'CONTAINMENT', currentView: 0 }));
          addMessage('msgAccessContainment');
        }, 1000);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        <div className="rounded-panel p-10 w-[450px] scanlines border-emerald-500/20">
          <div className="flex justify-between items-center mb-8">
            <span className="status-label text-emerald-500 text-xs">{t.volgravianOS}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-emerald-500/40 hover:text-emerald-500 transition-colors">{t.abort}</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {grid.map((val, i) => (
              <button
                key={i}
                onClick={() => handleToggle(i)}
                className={`h-24 rounded-2xl border transition-all duration-300 ${val ? 'bg-emerald-500/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5'}`}
              />
            ))}
          </div>
          <p className="mt-6 font-sans text-[10px] text-emerald-500/60 text-center uppercase tracking-widest">{t.connectNodes}</p>
        </div>
      </motion.div>
    );
  };

  const GravityPuzzle = () => {
    const [positions, setPositions] = useState([
      { id: 1, x: 0, y: 0, targetX: 100, targetY: -100, solved: false },
      { id: 2, x: 0, y: 0, targetX: -100, targetY: 100, solved: false },
      { id: 3, x: 0, y: 0, targetX: 120, targetY: 120, solved: false },
    ]);

    const handleDrag = (id, info) => {
      const next = positions.map(p => {
        if (p.id === id) {
          const newX = p.x + info.delta.x;
          const newY = p.y + info.delta.y;
          const dist = Math.sqrt(Math.pow(newX - p.targetX, 2) + Math.pow(newY - p.targetY, 2));
          return { ...p, x: newX, y: newY, solved: dist < 20 };
        }
        return p;
      });
      setPositions(next);

      if (next.every(p => p.solved)) {
        setState(prev => ({ ...prev, gravityCalibrated: true }));
        setActivePuzzle(null);
        addMessage('msgGravityCalibrated');
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[600px] h-[600px] border-purple-500/20 shadow-2xl flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-10">
            <span className="status-label text-purple-400 text-xs">{t.gravityCalibration}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          
          <div className="relative w-full h-full border border-white/5 rounded-3xl overflow-hidden bg-black/40">
            {/* Target Zones */}
            {positions.map(p => (
              <div 
                key={`target-${p.id}`}
                className={`absolute w-16 h-16 rounded-full border-2 border-dashed transition-all duration-500 flex items-center justify-center ${p.solved ? 'border-purple-500 bg-purple-500/20 scale-110' : 'border-white/10'}`}
                style={{ 
                  left: `calc(50% + ${p.targetX}px - 32px)`, 
                  top: `calc(50% + ${p.targetY}px - 32px)` 
                }}
              >
                <div className={`w-2 h-2 rounded-full ${p.solved ? 'bg-purple-400 animate-ping' : 'bg-white/5'}`} />
              </div>
            ))}

            {/* Draggable Spheres */}
            {positions.map(p => (
              <motion.div
                key={`sphere-${p.id}`}
                drag
                dragMomentum={false}
                onDrag={(_, info) => handleDrag(p.id, info)}
                className={`absolute w-12 h-12 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg transition-colors ${p.solved ? 'bg-purple-500' : 'bg-white/20 hover:bg-white/30'}`}
                style={{ 
                  left: `calc(50% + ${p.x}px - 24px)`, 
                  top: `calc(50% + ${p.y}px - 24px)`,
                  zIndex: 10
                }}
              >
                <Zap className={`w-6 h-6 ${p.solved ? 'text-white' : 'text-white/40'}`} />
              </motion.div>
            ))}

            {/* Central Core Visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-32 h-32 rounded-full bg-purple-500/5 blur-3xl animate-pulse" />
              <div className="w-16 h-16 rounded-full border border-purple-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-purple-500/40 animate-spin" />
              </div>
            </div>
          </div>

          <p className="mt-8 font-sans text-[10px] text-purple-500/40 text-center uppercase tracking-widest">{t.stabilizeGravity}</p>
        </div>
      </motion.div>
    );
  };

  const LaserPuzzle = () => {
    const [mirrors, setMirrors] = useState([0, 90, 180, 270]); // Angles for 4 mirrors
    const targetAngles = [90, 180, 270, 0]; // Solution

    const rotateMirror = (idx) => {
      const next = [...mirrors];
      next[idx] = (next[idx] + 90) % 360;
      setMirrors(next);
      
      if (next.every((val, i) => val === targetAngles[i])) {
        setTimeout(() => {
          setState(prev => ({ ...prev, laserAligned: true }));
          setActivePuzzle(null);
          addMessage('msgLaserAligned');
        }, 1000);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[600px] border-cyan-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <span className="status-label text-cyan-400 text-xs">{t.laserAlignment}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          
          <div className="grid grid-cols-2 gap-8 place-items-center relative">
            {/* Laser Source */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full shadow-[0_0_20px_red]" />
            
            {mirrors.map((angle, i) => (
              <motion.button
                key={i}
                onClick={() => rotateMirror(i)}
                animate={{ rotate: angle }}
                className={`w-24 h-24 border-2 flex items-center justify-center rounded-xl transition-colors ${mirrors[i] === targetAngles[i] ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="w-1 h-20 bg-white/40 rounded-full rotate-45" />
              </motion.button>
            ))}

            {/* Receiver */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-dashed border-cyan-500/50 rounded-xl flex items-center justify-center">
              <div className={`w-6 h-6 rounded-full transition-colors ${state.laserAligned ? 'bg-cyan-500 shadow-[0_0_20px_cyan]' : 'bg-white/5'}`} />
            </div>
          </div>
          
          <p className="mt-12 font-sans text-[10px] text-cyan-500/40 text-center uppercase tracking-widest">{t.alignMirrors}</p>
        </div>
      </motion.div>
    );
  };

  const PressurePuzzle = () => {
    const [value, setValue] = useState(50);
    const [progress, setProgress] = useState(0);
    const targetRange = [45, 55];

    useEffect(() => {
      const interval = setInterval(() => {
        if (value >= targetRange[0] && value <= targetRange[1]) {
          setProgress(p => {
            if (p >= 100) {
              clearInterval(interval);
              setState(prev => ({ ...prev, pressureCalibrated: true }));
              setActivePuzzle(null);
              addMessage('msgPressureBalanced');
              return 100;
            }
            return p + 2;
          });
        } else {
          setProgress(p => Math.max(0, p - 5));
        }
      }, 100);

      return () => clearInterval(interval);
    }, [value]);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      >
        <div className="rounded-panel p-10 w-[500px] border-orange-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <span className="status-label text-orange-400 text-xs">{t.pressureBalance}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-white/40 hover:text-white transition-colors">{t.close}</button>
          </div>
          
          <div className="flex flex-col items-center gap-12">
            <div className="relative w-full h-24 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center px-4">
              {/* Green Zone */}
              <div 
                className="absolute h-full bg-emerald-500/20 border-x border-emerald-500/40"
                style={{ left: '45%', width: '10%' }}
              />
              
              {/* Pointer */}
              <motion.div 
                className="absolute w-1 h-16 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] z-10"
                animate={{ left: `${value}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              {/* Jitter Simulation */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                animate={{ x: [0, 2, -2, 0] }}
                transition={{ duration: 0.1, repeat: Infinity }}
              />
            </div>

            <div className="w-full space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={value} 
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <p className="font-sans text-[10px] text-orange-500/40 text-center uppercase tracking-widest">{t.balanceLoad}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const CorePuzzle = () => {
    const [rotation, setRotation] = useState(0);
    const [phase, setPhase] = useState('CW');
    const [cwDone, setCwDone] = useState(false);
    const [ccwDone, setCcwDone] = useState(false);

    useEffect(() => {
      if (phase === 'CW' && rotation >= 355) {
        setCwDone(true);
        setPhase('CCW');
      }
      if (phase === 'CCW' && cwDone && rotation <= 5) {
        setCcwDone(true);
      }
    }, [rotation, phase, cwDone]);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        <div className="rounded-panel p-10 w-[450px] flex flex-col items-center border-red-500/20">
          <div className="w-full flex justify-between items-center mb-10">
            <span className="status-label text-red-500 text-xs">{t.coreStabilizer}</span>
            <button onClick={() => setActivePuzzle(null)} className="text-red-500/40 hover:text-red-500 transition-colors">{t.exit}</button>
          </div>
          
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-dashed border-white/5 rounded-full" />
            <motion.div 
              style={{ rotate: rotation }}
              className={`w-48 h-2.5 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-colors duration-500 ${ccwDone ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}
            />
            <div className="absolute w-5 h-5 bg-white rounded-full top-0 shadow-[0_0_15px_white]" />
            
            {/* Phase Indicators */}
            <div className="absolute -top-8 flex gap-2">
              <div className={`w-2 h-2 rounded-full ${cwDone ? 'bg-emerald-500' : 'bg-red-500/20'}`} />
              <div className={`w-2 h-2 rounded-full ${ccwDone ? 'bg-emerald-500' : 'bg-red-500/20'}`} />
            </div>
          </div>

          <input 
            type="range" 
            min="0" 
            max="360" 
            value={rotation} 
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full mt-16 accent-red-500 cursor-pointer"
          />

          <p className="mt-8 font-sans text-[10px] text-red-500/60 text-center uppercase tracking-widest leading-relaxed">
            {t.rotateFull}
          </p>

          <button
            disabled={!ccwDone}
            onClick={() => {
              setState(prev => ({ ...prev, coreStabilized: true }));
              setActivePuzzle(null);
              addMessage('msgCoreStabilized');
            }}
            className={`mt-10 w-full py-5 rounded-3xl font-sans text-xs tracking-widest border-2 transition-all duration-500 ${ccwDone ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-white/5 text-white/10'}`}
          >
            {t.initStabilization}
          </button>
        </div>
      </motion.div>
    );
  };

  const WalkthroughModal = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-8"
    >
      <div className="rounded-panel p-12 max-w-2xl w-full border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-cyan-500" />
            <h2 className="text-3xl font-serif italic text-white/90">{t.walkthroughTitle}</h2>
          </div>
          <button onClick={() => setShowWalkthrough(false)} className="text-white/30 hover:text-white transition-colors">
            <ChevronRight className="w-6 h-6 rotate-90" />
          </button>
        </div>
        <div className="space-y-8 font-sans text-sm text-white/70 leading-relaxed">
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep1}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep2}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep3}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep4}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep5}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep6}</p>
          <p className="border-l-2 border-cyan-500/50 pl-6 py-2 bg-cyan-500/5 rounded-r-2xl">{t.walkthroughStep7}</p>
        </div>
        <button 
          onClick={() => setShowWalkthrough(false)}
          className="mt-12 w-full py-4 rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all font-sans text-xs tracking-[0.3em]"
        >
          ACKNOWLEDGE
        </button>
      </div>
    </motion.div>
  );

  const CreditsScreen = ({ onClose, t }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center p-12 overflow-y-auto"
    >
      <div className="atmosphere opacity-80" />
      <div className="max-w-3xl w-full text-center space-y-16 py-20 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-light italic text-white/90 tracking-tight mb-4">{t.creditsTitle}</h1>
          <div className="w-24 h-0.5 bg-cyan-500 mx-auto" />
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="status-label text-cyan-400 text-xs mb-4">{t.creditsLead}</h3>
            <p className="text-3xl font-light italic text-white/80 mb-2">{t.creditsLeadName}</p>
            <p className="text-sm text-white/40 font-sans font-light max-w-md mx-auto">{t.creditsLeadDesc}</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="status-label text-cyan-400 text-xs mb-4">{t.creditsTech}</h3>
            <p className="text-sm text-white/60 font-sans font-light tracking-widest">{t.creditsTechDesc}</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="status-label text-cyan-400 text-xs mb-4">{t.creditsStory}</h3>
            <p className="text-sm text-white/60 font-sans font-light tracking-widest">{t.creditsStoryDesc}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-12 space-y-10"
        >
          <p className="text-xs font-sans font-light tracking-[0.5em] text-white/20 uppercase">{t.creditsPowered}</p>
          
          <button 
            onClick={onClose}
            className="px-16 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 font-sans text-[10px] tracking-[0.4em] shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95 uppercase"
          >
            {t.back}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  const MissionAccomplished = ({ state, t, onRestart, onShowCredits }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="atmosphere opacity-100" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-3xl"
      >
        <Shield className="w-24 h-24 text-emerald-500 mb-10 mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
        <h1 className="text-7xl font-light italic mb-6 tracking-tight">{t.missionAccomplished}</h1>
        <p className="text-white/50 font-sans font-light tracking-widest uppercase max-w-2xl mx-auto leading-loose text-xs">
          {t.missionDesc}
        </p>
        
        <div className="flex flex-col gap-4 mt-16 max-w-xs mx-auto">
          <button 
            onClick={onShowCredits}
            className="px-12 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 font-sans text-[10px] tracking-[0.4em] uppercase"
          >
            {t.credits}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-500 font-sans text-[10px] tracking-[0.4em] uppercase"
          >
            {t.restart}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const IntroSequence = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const introTexts = state.language === 'ZH' ? [
      "2072年。土卫五 (Rhea)。",
      "一个被遗忘的沃尔格拉维亚研究基地。",
      "一种未知的威胁正在核心深处苏醒...",
      "你的任务：稳定红物质核心。不惜一切代价。",
      "连接建立。神经链接已同步。"
    ] : [
      "YEAR 2072. RHEA.",
      "A FORGOTTEN VOLGRAVIAN RESEARCH BASE.",
      "AN UNKNOWN THREAT AWAKENS IN THE CORE...",
      "YOUR MISSION: STABILIZE THE RED MATTER. AT ALL COSTS.",
      "CONNECTION ESTABLISHED. NEURAL LINK SYNCED."
    ];

    useEffect(() => {
      if (step < introTexts.length) {
        const timer = setTimeout(() => setStep(s => s + 1), 3500);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
      }
    }, [step]);


    return (
      <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-10 overflow-hidden">
        <div className="atmosphere opacity-100" />
        <AnimatePresence mode="wait">
          {step < introTexts.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <p className="text-2xl font-light tracking-[0.3em] text-white/80 uppercase leading-relaxed max-w-2xl">
                {introTexts[step]}
              </p>
              <div className="mt-8 w-12 h-0.5 bg-red-500 mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <Shield className="w-16 h-16 text-red-500 animate-pulse" />
              <span className="status-label text-red-500 animate-pulse">INITIALIZING MISSION...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const DataLogViewer = ({ t }) => {
    return (
      <div className="fixed left-8 bottom-32 flex flex-col gap-3 z-[40] pointer-events-none">
        <AnimatePresence>
          {state.foundLogs.map(logId => (
            <motion.div
              key={logId}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl w-80 pointer-events-auto"
            >
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-4 h-4 text-cyan-500" />
                <span className="status-label text-[9px] text-cyan-500/60 uppercase tracking-widest">
                  {t[`log${logId}`]?.split(':')[0]}
                </span>
              </div>
              <p className="font-sans text-[11px] text-white/70 leading-relaxed italic">
                {t[`log${logId}`]?.split(':')[1]}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const Atmosphere = () => (
    <motion.div 
      className="atmosphere"
      animate={{
        opacity: isMusicPlaying ? [0.4, 0.8, 0.4] : 0.6,
        scale: isMusicPlaying ? [1, 1.1, 1] : 1,
        background: isMusicPlaying 
          ? [
              'radial-gradient(circle at 50% 30%, #1a0a05 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255, 78, 0, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #0a1a25 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.2) 0%, transparent 60%)',
              'radial-gradient(circle at 50% 30%, #1a0a05 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255, 78, 0, 0.1) 0%, transparent 50%)'
            ]
          : 'radial-gradient(circle at 50% 30%, #1a0a05 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255, 78, 0, 0.1) 0%, transparent 50%)'
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  // --- Render ---

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black select-none"
      onMouseMove={(e) => {
        if (toolMode === ToolMode.FLASHLIGHT) {
          const root = document.documentElement;
          root.style.setProperty('--x', e.clientX + 'px');
          root.style.setProperty('--y', e.clientY + 'px');
        }
      }}
    >
      <Atmosphere />
      
      {/* Game World View */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${state.currentRoom}-${state.currentView}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Background Image / Scene */}
            <img 
              src={`https://picsum.photos/seed/red_matter_${state.currentRoom.toLowerCase()}_${state.currentView}/1920/1080?grayscale&blur=1`}
              className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-150"
              alt="Room Background"
              referrerPolicy="no-referrer"
            />
            
            {/* Navigation Arrows (Rusty Lake Style) */}
            <button 
              onClick={() => changeView('LEFT')}
              className="absolute left-10 top-1/2 -translate-y-1/2 p-6 bg-black/20 hover:bg-black/40 border border-white/5 rounded-full text-white/40 hover:text-white transition-all z-40 pointer-events-auto"
            >
              <ChevronRight className="w-10 h-10 rotate-180" />
            </button>
            <button 
              onClick={() => changeView('RIGHT')}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-6 bg-black/20 hover:bg-black/40 border border-white/5 rounded-full text-white/40 hover:text-white transition-all z-40 pointer-events-auto"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <button 
              onClick={() => changeRoom()}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 p-6 bg-black/20 hover:bg-black/40 border border-white/5 rounded-full text-white/40 hover:text-white transition-all z-40 pointer-events-auto flex items-center gap-4"
            >
              <ChevronRight className="w-10 h-10 -rotate-90" />
              <span className="status-label text-[10px] tracking-[0.3em]">{t.changeRoom}</span>
            </button>

            {/* Scannable / Interactable Objects */}
            {SCANNABLE_OBJECTS[state.currentRoom][state.currentView].map(obj => (
              <div
                key={obj.id}
                style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
              >
                <button
                  onClick={() => {
                    if (toolMode === ToolMode.SCANNER) handleScan(obj);
                    else handleInteract(obj.id);
                  }}
                  className={`
                    w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-700 pointer-events-auto
                    ${scanningId === obj.id ? 'border-cyan-400 bg-cyan-400/20 scale-125 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'border-white/10 bg-black/20 backdrop-blur-sm hover:border-white/40 hover:scale-110'}
                  `}
                >
                  {toolMode === ToolMode.SCANNER ? <Scan className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                  
                  {/* Scan Progress Ring */}
                  {scanningId === obj.id && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="32" cy="32" r="30"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeDasharray="188"
                        className="text-cyan-400"
                        style={{ strokeDashoffset: 188 }}
                      />
                    </svg>
                  )}
                </button>
 
                {/* Object Label */}
                <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="bg-black/80 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl whitespace-nowrap shadow-2xl">
                    <span className="status-label text-[10px] tracking-widest">{state.language === 'ZH' ? obj.nameZh : obj.name}</span>
                  </div>
                </div>
 
                {/* Scanned Info Overlay */}
                {state.scannedObjects.has(obj.id) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-80"
                  >
                    <div className="bg-cyan-950/40 border border-cyan-500/30 p-6 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${obj.hint ? 'bg-amber-500/20' : 'bg-cyan-500/20'}`}>
                          {obj.hint ? <Info className="w-4 h-4 text-amber-400" /> : <Info className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <span className={`status-label text-[10px] ${obj.hint ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {obj.hint ? (state.language === 'ZH' ? '线索数据' : 'CLUE DATA') : t.translatedData}
                        </span>
                      </div>
                      <p className={`font-sans font-light italic text-sm text-white/90 leading-relaxed pl-3 border-l-2 ${obj.hint ? 'border-amber-500/20' : 'border-cyan-500/20'}`}>
                        "{state.language === 'ZH' ? obj.translatedTextZh : obj.translatedText}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
 
            {/* Red Matter Core Visual (Only in Containment View 0) */}
            {state.currentRoom === 'CONTAINMENT' && state.currentView === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className={`w-64 h-64 rounded-full bg-red-600/20 blur-[100px] ${state.coreStabilized ? 'bg-emerald-500/20' : 'red-matter-glow'}`} />
                <div className={`absolute inset-0 w-64 h-64 rounded-full border-2 border-red-500/10 ${state.coreStabilized ? 'border-emerald-500/10' : 'animate-pulse'}`} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
 
      {/* UI Layers */}
      <HUD 
        state={state} 
        toolMode={toolMode} 
        setToolMode={setToolMode} 
        setLanguage={setLanguage} 
        onLocationClick={handleLocationClick} 
      />
      <MessageLog messages={state.messages} />
      <DataLogViewer t={t} />
      
      {/* Overlays & Modals */}
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading-screen" />}
        {showIntro && <IntroSequence key="intro-sequence" onComplete={() => setShowIntro(false)} />}
        {showMenu && <MainMenu key="main-menu" />}
        {showLevelSelect && <LevelSelectModal key="level-select" />}
        {showControls && <ControlsModal key="controls-modal" />}
        {activePuzzle === 'SUBSTATION' && <SubstationPuzzle key="puzzle-substation" />}
        {activePuzzle === 'ANTENNA' && <AntennaPuzzle key="puzzle-antenna" />}
        {activePuzzle === 'HACK' && <HackPuzzle key="puzzle-hack" />}
        {activePuzzle === 'CORE' && <CorePuzzle key="puzzle-core" />}
        {activePuzzle === 'CIPHER' && <CipherPuzzle key="puzzle-cipher" />}
        {activePuzzle === 'GRAVITY' && <GravityPuzzle key="puzzle-gravity" />}
        {activePuzzle === 'PRESSURE' && <PressurePuzzle key="puzzle-pressure" />}
        {activePuzzle === 'LASER' && <LaserPuzzle key="puzzle-laser" />}
        {showWalkthrough && <WalkthroughModal key="walkthrough-modal" />}
        {showCredits && (
          <CreditsScreen 
            key="credits-screen"
            onClose={() => {
              setShowCredits(false);
              if (!state.coreStabilized) setShowMenu(true);
            }} 
            t={t} 
          />
        )}
        {state.coreStabilized && !showCredits && (
          <MissionAccomplished 
            key="mission-accomplished"
            state={state} 
            t={t} 
            onRestart={() => setShowMenu(true)} 
            onShowCredits={() => setShowCredits(true)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

