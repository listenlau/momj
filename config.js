/**
 * 游戏配置常量、精灵坐标映射、UI布局参数
 */

// ===== 游戏基础配置 =====
const CONFIG = {
    GAME_WIDTH: 360,
    GAME_HEIGHT: 640,
    FRAME_RATE: 30,
    SAVE_KEY: 'miouPlayerCanvas',
    
    // 移动速度
    MOVE_SPEED: 3,
    FRAME_DURATION: 150, // ms per frame
    
    // 角色帧尺寸
    PLAYER_FRAME_WIDTH: 64,
    PLAYER_FRAME_HEIGHT: 80,
    // 左右精灵缩放比例（使其视觉比例与上下方向一致）
    PLAYER_HORIZONTAL_SCALE: 0.78, // 50/64 ≈ 0.78
    
    // 角色atlas信息
    ATLAS_INFO: {
        walk_down: { start: 0, frames: 5 },
        walk_left: { start: 5, frames: 5 },
        walk_right: { start: 10, frames: 5 },
        walk_up: { start: 15, frames: 5 },
        idle_down: { start: 20, frames: 2 },
        idle_left: { start: 22, frames: 2 },
        idle_right: { start: 24, frames: 2 },
        idle_up: { start: 26, frames: 2 }
    }
};

// ===== UI布局参数 =====
const UI_LAYOUT = {
    // 顶部状态栏
    TOP_BAR: {
        y: 0,
        height: 28,
        padding: 4
    },
    
    // 左侧按钮列
    LEFT_BUTTONS: {
        x: 2,
        y: 35,
        buttonWidth: 60,
        buttonHeight: 42,
        buttonGap: 3,
        // 按钮数量和类型
        buttons: [
            { name: 'mapTag', label: '地图', color: '#8B4513', textColor: '#fff' },
            { name: 'character', label: '人物', color: '#FF69B4', textColor: '#fff' },
            { name: 'summon', label: '秘偶', color: '#9370DB', textColor: '#fff' },
            { name: 'equipment', label: '装备', color: '#4169E1', textColor: '#fff' },
            { name: 'skill', label: '技能', color: '#00CED1', textColor: '#fff' },
            { name: 'bag', label: '背包', color: '#8B4513', textColor: '#fff' },
            { name: 'setting', label: '设置', color: '#FFD700', textColor: '#000' },
            { name: 'system', label: '系统', color: '#808080', textColor: '#fff' },
            { name: 'confirm', label: '确定', color: '#32CD32', textColor: '#fff' },
            { name: 'cancel', label: '取消', color: '#DC143C', textColor: '#fff' }
        ]
    },
    
    // 右侧HP/EXP条
    RIGHT_BARS: {
        x: 345,
        barWidth: 12,
        barHeight: 180,
        barGap: 8,
        y: 35
    },
    
    // 中间地图区域
    MAP_AREA: {
        x: 65,
        y: 35,
        width: 275,
        height: 200
    },
    
    // 底部区域
    BOTTOM: {
        // 聊天区域
        CHAT: {
            y: 240,
            height: 80,
            labels: ['全服', '世界', '区域', '队伍'],
            inputX: 65,
            inputY: 295,
            inputWidth: 200,
            inputHeight: 22,
            sendButtonX: 275,
            sendButtonY: 295,
            sendButtonWidth: 50,
            sendButtonHeight: 22
        },
        // 功能键盘区域
        KEYPAD: {
            y: 325,
            buttonSize: 58,
            buttonGap: 4,
            rows: [
                ['1常用', '2↑', '3辅助', '#名称'],
                ['4←', '5周围', '6→', '0系统'],
                ['7聊天', '8↓', '9地图', '*频道']
            ]
        }
    }
};

// ===== 精灵分镜图坐标映射 =====
const SPRITE_COORDS = {
    // 键盘 (3×4) - 从精灵分镜图
    keyboard: {
        // 整体区域: x=408-1500, y=1450-1900
        row0: { y1: 1450, y2: 1596 },
        row1: { y1: 1606, y2: 1788 },
        row2: { y1: 1799, y2: 1901 },
        col0: { x1: 408, x2: 689 },
        col1: { x1: 698, x2: 979 },
        col2: { x1: 988, x2: 1269 },
        col3: { x1: 1279, x2: 1501 }
    },
    
    // 菜单按钮
    menuButtons: {
        character: { x1: 1211, y1: 570, x2: 1558, y2: 680 },   // 粉色
        summon: { x1: 1226, y1: 680, x2: 1559, y2: 790 },      // 紫色
        equipment: { x1: 1200, y1: 790, x2: 1558, y2: 900 },   // 深蓝
        skill: { x1: 1212, y1: 900, x2: 1558, y2: 1000 },      // 青蓝
        bag: { x1: 1203, y1: 1000, x2: 1558, y2: 1110 },      // 棕色
        setting: { x1: 1200, y1: 1110, x2: 1558, y2: 1210 },   // 黄色
        system: { x1: 1203, y1: 1210, x2: 1558, y2: 1340 }    // 灰色
    },
    
    // HP条 (红色竖条)
    hpBar: { x1: 1807, y1: 511, x2: 2033, y2: 1077 },
    
    // EXP条 (蓝色竖条)
    expBar: { x1: 1700, y1: 500, x2: 1730, y2: 1100 },
    
    // 确定/取消按钮
    confirm: { x1: 1300, y1: 1607, x2: 1555, y2: 1700 },  // 绿色
    cancel: { x1: 1659, y1: 1607, x2: 1840, y2: 1700 },   // 红色
    
    // 地图标签
    mapTags: {
        tag0: { x1: 1647, x2: 1733 },  // 深紫
        tag1: { x1: 1748, x2: 1832 },  // 明黄
        tag2: { x1: 1851, x2: 1937 },  // 玫红
        tag3: { x1: 1953, x2: 2039 },  // 灰绿
        tag4: { x1: 2055, x2: 2143 },  // 红棕
        tag5: { x1: 2161, x2: 2247 },  // 深蓝
        tag6: { x1: 2266, x2: 2350 }   // 深棕
    },
    mapTagY: { y1: 1850, y2: 1978 },
    
    // 场景精灵
    sprites: {
        rabbit: { x1: 1200, y1: 400, x2: 1572, y2: 600 },
        ufo: { x1: 1550, y1: 1100, x2: 2100, y2: 1450 },
        jetpack: { x1: 1300, y1: 1100, x2: 1600, y2: 1500 }
    },
    
    // 图标
    icons: {
        treasure: { x1: 2050, y1: 900, x2: 2300, y2: 1200 },
        gold: { x1: 1900, y1: 900, x2: 2100, y2: 1100 }
    }
};

// ===== 场景配置 =====
const SCENES = {
    riverbank: {
        name: '黄浦江边',
        background: 'scene_riverbank.jpg',
        entities: [
            { type: 'jetpack', x: 85, y: 130, baseY: 130, floatAmp: 8, floatSpeed: 2 },
            { type: 'ufo', x: 290, y: 110, baseY: 110, floatAmp: 6, floatSpeed: 1.5 }
        ]
    },
    santi: {
        name: '三里屯小屋',
        background: 'scene_santi.jpg',
        entities: [
            { type: 'rabbit', x: 180, y: 180, baseY: 180, floatAmp: 4, floatSpeed: 1.2 }
        ]
    }
};

// ===== 方向常量 =====
const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

// ===== 聊天频道 =====
const CHAT_CHANNEL = {
    GLOBAL: '全服',
    WORLD: '世界',
    AREA: '区域',
    TEAM: '队伍'
};


