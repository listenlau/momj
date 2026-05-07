/**
 * UI渲染模块
 * - 状态栏/按钮/键盘/聊天/HP/EXP
 * - 严格按参考截图布局
 * - 精灵分镜图渲染：菜单按钮、键盘、HP/EXP条、确定/取消
 * - 聊天标签用Canvas绘制，点击变色
 */

class UI {
    constructor() {
        // 聊天状态
        this.chatChannel = CHAT_CHANNEL.WORLD;
        this.chatMessages = [];
        this.isChatInputVisible = false;
        
        // 按键状态
        this.pressedKey = null;
        this.pressedKeyTimer = 0;
        
        // 按钮回调
        this.onButtonClick = null;
        this.onChatSend = null;
        
        // 地图标签索引
        this.mapTagIndex = 0;
        
        // 按钮区域（用于点击检测）
        this.buttonAreas = [];
    }
    
    /**
     * 设置按钮点击回调
     */
    setButtonClickHandler(handler) {
        this.onButtonClick = handler;
    }
    
    /**
     * 设置聊天发送回调
     */
    setChatSendHandler(handler) {
        this.onChatSend = handler;
    }
    
    /**
     * 更新UI状态
     */
    update(deltaTime) {
        // 按键按下效果计时器
        if (this.pressedKeyTimer > 0) {
            this.pressedKeyTimer -= deltaTime;
            if (this.pressedKeyTimer <= 0) {
                this.pressedKey = null;
            }
        }
    }
    
    /**
     * 绘制整个UI
     */
    draw(ctx) {
        this.buttonAreas = []; // 重置按钮区域
        
        // 绘制顶部状态栏
        this.drawTopBar(ctx);
        
        // 绘制左侧按钮列
        this.drawLeftButtons(ctx);
        
        // 绘制右侧HP/EXP条
        this.drawRightBars(ctx);
        
        // 绘制底部区域
        this.drawBottomArea(ctx);
    }
    
    /**
     * 绘制顶部状态栏
     * 只有一行文字：左侧 "服务器-角色名 LV等级"，右侧金币和秘宝数值
     */
    drawTopBar(ctx) {
        const layout = UI_LAYOUT.TOP_BAR;
        const data = player.getData();
        
        // 背景
        ctx.fillStyle = 'rgba(20, 10, 30, 0.85)';
        ctx.fillRect(0, layout.y, CONFIG.GAME_WIDTH, layout.height);
        
        // 边框
        ctx.strokeStyle = '#4a3a6a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, layout.y + layout.height);
        ctx.lineTo(CONFIG.GAME_WIDTH, layout.y + layout.height);
        ctx.stroke();
        
        // 玩家信息文字
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const playerInfo = `${data.server}-${data.name} LV${data.level}`;
        ctx.fillText(playerInfo, 8, layout.y + layout.height / 2);
        
        // 金币图标和数值
        ctx.fillStyle = '#ffd700';
        ctx.font = '10px "Microsoft YaHei", sans-serif';
        const goldText = `金币: ${this.formatNumber(data.gold)}`;
        ctx.textAlign = 'right';
        ctx.fillText(goldText, CONFIG.GAME_WIDTH - 80, layout.y + layout.height / 2);
        
        // 秘宝图标和数值
        ctx.fillStyle = '#ffd700';
        const gemText = `秘宝: ${this.formatNumber(data.gem)}`;
        ctx.fillText(gemText, CONFIG.GAME_WIDTH - 5, layout.y + layout.height / 2);
    }
    
    /**
     * 绘制左侧按钮列 - 使用精灵分镜图
     */
    drawLeftButtons(ctx) {
        const layout = UI_LAYOUT.LEFT_BUTTONS;
        let y = layout.y;
        const spritesheet = resources.spritesheet;
        
        // 地图标签（Canvas绘制，因为需要切换不同颜色）
        if (this.mapTagIndex === 0) {
            ctx.fillStyle = '#8B4513';
        } else {
            ctx.fillStyle = '#5a3510';
        }
        this.drawButton(ctx, layout.x, y, layout.buttonWidth, layout.buttonHeight, scene.getCurrentSceneName(), '#fff');
        this.buttonAreas.push({
            name: 'mapTag',
            x: layout.x,
            y: y,
            width: layout.buttonWidth,
            height: layout.buttonHeight
        });
        y += layout.buttonHeight + layout.buttonGap;
        
        // 7个菜单按钮 - 从精灵分镜图裁切
        const menus = [
            { name: 'character', label: '人物' },
            { name: 'summon', label: '秘偶' },
            { name: 'equipment', label: '装备' },
            { name: 'skill', label: '技能' },
            { name: 'bag', label: '背包' },
            { name: 'setting', label: '设置' },
            { name: 'system', label: '系统' }
        ];
        
        menus.forEach((menu, i) => {
            if (spritesheet) {
                try {
                    // 从精灵分镜图裁切
                    const coords = SPRITE_COORDS.menuButtons[menu.name];
                    if (coords) {
                        const srcW = coords.x2 - coords.x1;
                        const srcH = coords.y2 - coords.y1;
                        ctx.drawImage(
                            spritesheet,
                            coords.x1, coords.y1, srcW, srcH,
                            layout.x, y, layout.buttonWidth, layout.buttonHeight
                        );
                    }
                } catch (e) {
                    // 绘制失败则用fallback
                    const colors = ['#FF69B4', '#9370DB', '#4169E1', '#00CED1', '#8B4513', '#FFD700', '#808080'];
                    const textColor = colors[i] === '#FFD700' ? '#000' : '#fff';
                    this.drawButton(ctx, layout.x, y, layout.buttonWidth, layout.buttonHeight, menu.label, textColor);
                }
            } else {
                // 备用：Canvas绘制
                const colors = ['#FF69B4', '#9370DB', '#4169E1', '#00CED1', '#8B4513', '#FFD700', '#808080'];
                const textColor = colors[i] === '#FFD700' ? '#000' : '#fff';
                this.drawButton(ctx, layout.x, y, layout.buttonWidth, layout.buttonHeight, menu.label, textColor);
            }
            
            this.buttonAreas.push({
                name: menu.name,
                x: layout.x,
                y: y,
                width: layout.buttonWidth,
                height: layout.buttonHeight
            });
            y += layout.buttonHeight + layout.buttonGap;
        });
        
        // 确定和取消按钮 - 从精灵分镜图裁切
        const confirmX = layout.x;
        const confirmY = 480;
        const btnW = 55;
        const btnH = 38;
        
        if (spritesheet) {
            try {
                // 确定按钮
                const confirmCoords = SPRITE_COORDS.confirm;
                if (confirmCoords) {
                    const srcW = confirmCoords.x2 - confirmCoords.x1;
                    const srcH = confirmCoords.y2 - confirmCoords.y1;
                    ctx.drawImage(
                        spritesheet,
                        confirmCoords.x1, confirmCoords.y1, srcW, srcH,
                        confirmX, confirmY, btnW, btnH
                    );
                }
            } catch (e) {
                ctx.fillStyle = '#32CD32';
                this.drawButton(ctx, confirmX, confirmY, btnW, btnH, '确定', '#fff');
            }
        } else {
            ctx.fillStyle = '#32CD32';
            this.drawButton(ctx, confirmX, confirmY, btnW, btnH, '确定', '#fff');
        }
        this.buttonAreas.push({
            name: 'confirm',
            x: confirmX,
            y: confirmY,
            width: btnW,
            height: btnH
        });
        
        if (spritesheet) {
            try {
                // 取消按钮
                const cancelCoords = SPRITE_COORDS.cancel;
                if (cancelCoords) {
                    const srcW = cancelCoords.x2 - cancelCoords.x1;
                    const srcH = cancelCoords.y2 - cancelCoords.y1;
                    ctx.drawImage(
                        spritesheet,
                        cancelCoords.x1, cancelCoords.y1, srcW, srcH,
                        confirmX + 58, confirmY, btnW, btnH
                    );
                }
            } catch (e) {
                ctx.fillStyle = '#DC143C';
                this.drawButton(ctx, confirmX + 58, confirmY, btnW, btnH, '取消', '#fff');
            }
        } else {
            ctx.fillStyle = '#DC143C';
            this.drawButton(ctx, confirmX + 58, confirmY, btnW, btnH, '取消', '#fff');
        }
        this.buttonAreas.push({
            name: 'cancel',
            x: confirmX + 58,
            y: confirmY,
            width: btnW,
            height: btnH
        });
    }
    
    /**
     * 绘制按钮（备用Canvas绘制，用于精灵图未加载时）
     */
    drawButton(ctx, x, y, width, height, text, textColor) {
        // 备用：纯色背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, width, height);
        
        // 边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
        
        // 文字
        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    /**
     * 绘制右侧HP/EXP条 - 使用精灵分镜图
     */
    drawRightBars(ctx) {
        const layout = UI_LAYOUT.RIGHT_BARS;
        const data = player.getData();
        const spritesheet = resources.spritesheet;
        
        const hpRatio = Math.min(1, data.hp / data.maxHp);
        const expRatio = Math.min(1, data.exp / data.maxExp);
        
        if (spritesheet) {
            // ===== 使用精灵分镜图渲染 =====
            
            // HP条（红色，在右边）
            this.drawHPBarSprite(ctx, layout.x, layout.y, layout.barWidth, layout.barHeight, hpRatio);
            
            // EXP条（蓝色，在HP条左边）
            this.drawEXPBarSprite(ctx, layout.x - layout.barWidth - layout.barGap, layout.y, layout.barWidth, layout.barHeight, expRatio);
        } else {
            // 备用：Canvas绘制
            this.drawVerticalBar(
                ctx,
                layout.x,
                layout.y,
                layout.barWidth,
                layout.barHeight,
                hpRatio,
                '#ff4444',
                'HP'
            );
            
            this.drawVerticalBar(
                ctx,
                layout.x - layout.barWidth - layout.barGap,
                layout.y,
                layout.barWidth,
                layout.barHeight,
                expRatio,
                '#4444ff',
                'EXP'
            );
        }
    }
    
    /**
     * 绘制HP条（精灵分镜图）
     * HP条背景: { x1: 1807, y1: 511, x2: 2033, y2: 1077 } → 226×566
     */
    drawHPBarSprite(ctx, x, y, width, height, ratio) {
        const spritesheet = resources.spritesheet;
        const coords = SPRITE_COORDS.hpBar;
        
        if (!spritesheet || !coords) return;
        
        try {
            // 1. 先裁切HP条背景
            const srcW = coords.x2 - coords.x1;
            const srcH = coords.y2 - coords.y1;
            ctx.drawImage(
                spritesheet,
                coords.x1, coords.y1, srcW, srcH,
                x, y, width, height
            );
        } catch (e) {
            console.warn('[UI] HP条绘制失败:', e);
            this.drawVerticalBar(ctx, x, y, width, height, ratio, '#ff4444', 'HP');
            return;
        }
        
        // 2. 计算当前值填充（从底部向上）
        if (ratio > 0) {
            const fillHeight = Math.max(1, height * ratio);
            const fillY = y + height - fillHeight;
            
            // 红色渐变填充
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#ff4444');
            gradient.addColorStop(1, '#aa0000');
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, fillY + 1, width - 2, fillHeight - 2);
        }
        
        // 3. 在条上写HP文字
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('HP', x + width / 2, y + 2);
    }
    
    /**
     * 绘制EXP条（精灵分镜图）
     * EXP条背景: { x1: 1700, y1: 500, x2: 1730, y2: 1100 } → 30×600
     */
    drawEXPBarSprite(ctx, x, y, width, height, ratio) {
        const spritesheet = resources.spritesheet;
        const coords = SPRITE_COORDS.expBar;
        
        if (!spritesheet || !coords) return;
        
        try {
            // 1. 先裁切EXP条背景
            const srcW = coords.x2 - coords.x1;
            const srcH = coords.y2 - coords.y1;
            ctx.drawImage(
                spritesheet,
                coords.x1, coords.y1, srcW, srcH,
                x, y, width, height
            );
        } catch (e) {
            console.warn('[UI] EXP条绘制失败:', e);
            this.drawVerticalBar(ctx, x, y, width, height, ratio, '#4444ff', 'EXP');
            return;
        }
        
        // 2. 计算当前值填充（从底部向上）
        if (ratio > 0) {
            const fillHeight = Math.max(1, height * ratio);
            const fillY = y + height - fillHeight;
            
            // 蓝色渐变填充
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#4444ff');
            gradient.addColorStop(1, '#0000aa');
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, fillY + 1, width - 2, fillHeight - 2);
        }
        
        // 3. 在条上写EXP文字
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('EXP', x + width / 2, y + 2);
    }
    
    /**
     * 绘制竖直进度条（备用Canvas绘制）
     */
    drawVerticalBar(ctx, x, y, width, height, ratio, color, label) {
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(x, y, width, height);
        
        // 边框
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        
        // 填充
        const fillHeight = Math.max(0, height * ratio);
        const fillY = y + height - fillHeight;
        
        if (ratio > 0) {
            // 渐变填充
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, this.darkenColor(color, 0.5));
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, fillY + 1, width - 2, fillHeight - 2);
        }
        
        // 标签
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + width / 2, y + 2);
    }
    
    /**
     * 使颜色变暗
     */
    darkenColor(color, factor) {
        if (color.startsWith('#')) {
            const r = Math.round(parseInt(color.slice(1, 3), 16) * factor);
            const g = Math.round(parseInt(color.slice(3, 5), 16) * factor);
            const b = Math.round(parseInt(color.slice(5, 7), 16) * factor);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
    
    /**
     * 绘制底部区域
     */
    drawBottomArea(ctx) {
        const chatY = 245;
        
        // 聊天区域背景
        ctx.fillStyle = 'rgba(20, 15, 35, 0.92)';
        ctx.fillRect(0, chatY, CONFIG.GAME_WIDTH, 85);
        
        // 聊天标签（用Canvas绘制，点击变色）
        this.drawChatLabels(ctx, chatY);
        
        // 绘制功能键盘
        this.drawKeypad(ctx);
    }
    
    /**
     * 绘制聊天标签（Canvas绘制，点击变色）
     */
    drawChatLabels(ctx, y) {
        const layout = UI_LAYOUT.BOTTOM.CHAT;
        const labels = layout.labels;
        const labelWidth = 45;
        const labelX = 65;
        
        labels.forEach((label, i) => {
            const isSelected = CHAT_CHANNEL[Object.keys(CHAT_CHANNEL)[i]] === this.chatChannel;
            const x = labelX + i * (labelWidth + 5);
            
            // 背景
            if (isSelected) {
                ctx.fillStyle = '#9370DB'; // 选中态紫色
            } else {
                ctx.fillStyle = '#3a2a5a'; // 未选中态深紫色
            }
            ctx.fillRect(x, y + 8, labelWidth, 20);
            
            // 文字
            ctx.fillStyle = isSelected ? '#fff' : '#aaa';
            ctx.font = '10px "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + labelWidth / 2, y + 8 + 10);
            
            // 记录区域（用于点击检测）
            this.buttonAreas.push({
                name: 'chat_' + label,
                x: x,
                y: y + 8,
                width: labelWidth,
                height: 20,
                isChatLabel: true,
                channel: Object.keys(CHAT_CHANNEL)[i]
            });
        });
        
        // 聊天输入框背景
        ctx.fillStyle = 'rgba(30, 20, 50, 0.95)';
        ctx.fillRect(layout.inputX, layout.inputY, layout.inputWidth, layout.inputHeight);
        ctx.strokeStyle = '#6d28d9';
        ctx.lineWidth = 1;
        ctx.strokeRect(layout.inputX, layout.inputY, layout.inputWidth, layout.inputHeight);
        
        // 发送按钮
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(layout.sendButtonX, layout.sendButtonY, layout.sendButtonWidth, layout.sendButtonHeight);
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('发送', layout.sendButtonX + layout.sendButtonWidth / 2, layout.sendButtonY + layout.sendButtonHeight / 2);
        
        // 记录发送按钮区域
        this.buttonAreas.push({
            name: 'send',
            x: layout.sendButtonX,
            y: layout.sendButtonY,
            width: layout.sendButtonWidth,
            height: layout.sendButtonHeight
        });
    }
    
    /**
     * 绘制功能键盘（3×4）- 使用精灵分镜图
     * 键盘坐标 (3行4列):
     * 行0: y1=1450, y2=1596
     * 行1: y1=1606, y2=1788
     * 行2: y1=1799, y2=1901
     * 列0: x1=408, x2=689
     * 列1: x1=698, x2=979
     * 列2: x1=988, x2=1269
     * 列3: x1=1279, x2=1501
     */
    drawKeypad(ctx) {
        const layout = UI_LAYOUT.BOTTOM.KEYPAD;
        const buttonSize = 58;
        const gap = 4;
        const startX = 2;
        const startY = layout.y;
        const spritesheet = resources.spritesheet;
        
        const keyTexts = [
            ['常用', '↑', '辅助', '名称'],
            ['←', '周围', '→', '系统'],
            ['聊天', '↓', '地图', '频道']
        ];
        
        layout.rows.forEach((row, rowIndex) => {
            row.forEach((key, colIndex) => {
                const keyChar = key[0];
                const x = startX + colIndex * (buttonSize + gap);
                const y = startY + rowIndex * (buttonSize + gap);
                
                if (spritesheet) {
                    try {
                        // 从精灵分镜图裁切键盘按键
                        const coords = SPRITE_COORDS.keyboard;
                        if (coords) {
                            const rowY = [coords.row0, coords.row1, coords.row2][rowIndex];
                            const colX = [coords.col0, coords.col1, coords.col2, coords.col3][colIndex];
                            
                            if (rowY && colX) {
                                const srcX = colX.x1;
                                const srcY = rowY.y1;
                                const srcW = colX.x2 - colX.x1;
                                const srcH = rowY.y2 - rowY.y1;
                                
                                // 按键按下效果
                                if (this.pressedKey === keyChar) {
                                    ctx.globalAlpha = 0.8;
                                }
                                
                                ctx.drawImage(
                                    spritesheet,
                                    srcX, srcY, srcW, srcH,
                                    x, y, buttonSize, buttonSize
                                );
                                
                                ctx.globalAlpha = 1.0;
                            }
                        }
                    } catch (e) {
                        // 绘制失败则用fallback
                        this.drawKeypadButton(ctx, x, y, buttonSize, keyChar, keyTexts[rowIndex][colIndex]);
                    }
                } else {
                    // 备用：Canvas绘制
                    this.drawKeypadButton(ctx, x, y, buttonSize, keyChar, keyTexts[rowIndex][colIndex]);
                }
                
                // 记录区域
                this.buttonAreas.push({
                    name: 'key_' + keyChar,
                    x: x,
                    y: y,
                    width: buttonSize,
                    height: buttonSize,
                    key: keyChar
                });
            });
        });
    }
    
    /**
     * 绘制键盘按钮（备用Canvas绘制）
     */
    drawKeypadButton(ctx, x, y, size, keyChar, keyText) {
        const keyColors = {
            '1': '#DAA520', '2': '#DC143C', '3': '#FF8C00', '#': '#228B22',
            '4': '#DC143C', '5': '#696969', '6': '#DC143C', '0': '#F5DEB3',
            '7': '#4169E1', '8': '#DC143C', '9': '#FF69B4', '*': '#C71585'
        };
        
        let bgColor = keyColors[keyChar] || '#555';
        let shadowOffset = 3;
        
        if (this.pressedKey === keyChar) {
            shadowOffset = 1;
            bgColor = this.lightenColor(bgColor, 1.2);
        }
        
        // 绘制按钮阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x + 2, y + shadowOffset, size, size);
        
        // 绘制按钮
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, size, size);
        
        // 按钮边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);
        
        // 按键发光边缘效果（按下时）
        if (this.pressedKey === keyChar) {
            ctx.shadowColor = bgColor;
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, size, size);
            ctx.shadowBlur = 0;
        }
        
        // 数字
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(keyChar, x + size / 2, y + 5);
        
        // 功能文字
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '9px "Microsoft YaHei", sans-serif';
        ctx.fillText(keyText, x + size / 2, y + 22);
    }
    
    /**
     * 使颜色变亮
     */
    lightenColor(color, factor) {
        if (color.startsWith('#')) {
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            r = Math.min(255, Math.round(r * factor));
            g = Math.min(255, Math.round(g * factor));
            b = Math.min(255, Math.round(b * factor));
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
    
    /**
     * 处理点击事件
     */
    handleClick(x, y) {
        // 检查按钮区域
        for (const area of this.buttonAreas) {
            if (x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height) {
                
                if (area.isChatLabel) {
                    // 聊天标签
                    this.chatChannel = CHAT_CHANNEL[area.channel];
                    return { action: 'chat_channel', channel: area.channel };
                }
                
                if (area.name === 'send') {
                    // 发送按钮
                    return { action: 'chat_send' };
                }
                
                if (area.name.startsWith('key_')) {
                    // 键盘按键
                    this.pressedKey = area.key;
                    this.pressedKeyTimer = 150;
                    return { action: 'key_press', key: area.key };
                }
                
                // 其他按钮
                if (this.onButtonClick) {
                    return this.onButtonClick(area.name);
                }
                return { action: 'button', name: area.name };
            }
        }
        
        return null;
    }
    
    /**
     * 格式化数字（简化显示）
     */
    formatNumber(num) {
        if (num >= 1000000000000) {
            return (num / 1000000000000).toFixed(1) + 'T';
        } else if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    /**
     * 添加聊天消息
     */
    addChatMessage(sender, message, channel) {
        this.chatMessages.push({
            sender,
            message,
            channel,
            time: new Date()
        });
        
        // 限制消息数量
        if (this.chatMessages.length > 50) {
            this.chatMessages.shift();
        }
    }
}

// 全局UI实例
const ui = new UI();
