/**
 * 场景管理模块
 */

class Scene {
    constructor() {
        this.currentScene = 'riverbank';
        this.time = 0;
        this.entities = [];
        this.initEntities();
    }

    setScene(sceneName) {
        if (SCENES[sceneName]) {
            this.currentScene = sceneName;
            this.initEntities();
        }
    }

    initEntities() {
        const sceneConfig = SCENES[this.currentScene];
        if (sceneConfig && sceneConfig.entities) {
            this.entities = sceneConfig.entities.map(e => ({...e}));
        } else {
            this.entities = [];
        }
    }

    update(deltaTime) {
        this.time += deltaTime / 1000;
        this.entities.forEach(e => {
            e.y = e.baseY + Math.sin(this.time * e.floatSpeed) * e.floatAmp;
        });
    }

    drawBackground(ctx) {
        const sceneImg = resources.scenes[this.currentScene];
        
        // 检查场景图片是否存在且已加载
        if (sceneImg && sceneImg.complete && sceneImg.naturalWidth > 0) {
            try {
                ctx.drawImage(
                    sceneImg,
                    0, 0,
                    sceneImg.width, sceneImg.height,
                    0, 0,
                    CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT
                );
            } catch (e) {
                console.warn('[场景] 绘制背景失败:', e);
                this.drawDefaultBackground(ctx);
            }
        } else {
            this.drawDefaultBackground(ctx);
        }
    }

    drawDefaultBackground(ctx) {
        const colors = this.currentScene === 'santi' 
            ? ['#2a1a3a', '#3a2a4a', '#2a1a3a'] 
            : ['#1a2a3a', '#2a3a4a', '#1a2a3a'];
        
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.GAME_HEIGHT);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    }

    drawEntities(ctx) {
        this.entities.forEach(e => {
            if (e.type === 'jetpack') {
                this.drawJetpack(ctx, e.x, e.y);
            } else if (e.type === 'ufo') {
                this.drawUFO(ctx, e.x, e.y);
            } else if (e.type === 'rabbit') {
                this.drawRabbit(ctx, e.x, e.y);
            }
        });
    }

    drawJetpack(ctx, x, y) {
        // 先尝试使用精灵分镜图，带null检查
        if (resources.spritesheet) {
            try {
                const coords = SPRITE_COORDS.sprites.jetpack;
                ctx.drawImage(
                    resources.spritesheet,
                    coords.x1, coords.y1,
                    coords.x2 - coords.x1, coords.y2 - coords.y1,
                    x - 30, y - 50,
                    60, 80
                );
            } catch (e) {
                this.drawJetpackFallback(ctx, x, y);
            }
        } else {
            this.drawJetpackFallback(ctx, x, y);
        }
    }

    drawJetpackFallback(ctx, x, y) {
        ctx.save();
        
        // 背包主体
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x-3, y-12, 6, 8);
        ctx.fillRect(x-4, y-4, 8, 10);
        ctx.fillRect(x-6, y-2, 2, 6);
        ctx.fillRect(x+4, y-2, 2, 6);
        ctx.fillRect(x-3, y+6, 3, 4);
        ctx.fillRect(x, y+6, 3, 4);
        
        // 火焰
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x-7, y-3, 3, 8);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x-7, y+5, 3, 2);
        
        // 闪烁效果
        const flicker = Math.sin(this.time * 15) * 2;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x-6, y+7, 1, 3+flicker);
        ctx.fillRect(x-5, y+7, 1, 4+flicker);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x-6, y+9+flicker, 1, 2);
        ctx.fillRect(x-5, y+10+flicker, 1, 3);
        
        ctx.restore();
    }

    drawUFO(ctx, x, y) {
        // 先尝试使用精灵分镜图，带null检查
        if (resources.spritesheet) {
            try {
                const coords = SPRITE_COORDS.sprites.ufo;
                ctx.drawImage(
                    resources.spritesheet,
                    coords.x1, coords.y1,
                    coords.x2 - coords.x1, coords.y2 - coords.y1,
                    x - 40, y - 25,
                    80, 50
                );
            } catch (e) {
                this.drawUFOFallback(ctx, x, y);
            }
        } else {
            this.drawUFOFallback(ctx, x, y);
        }
    }

    drawUFOFallback(ctx, x, y) {
        ctx.save();
        
        // 飞碟主体
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.ellipse(x, y, 15, 6, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 飞碟顶部
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.ellipse(x, y-3, 8, 6, 0, Math.PI, 0);
        ctx.fill();
        
        // 发光效果
        ctx.fillStyle = 'rgba(139,92,246,0.5)';
        ctx.beginPath();
        ctx.ellipse(x, y-4, 5, 4, 0, Math.PI, 0);
        ctx.fill();
        
        // 底部光晕
        ctx.fillStyle = `rgba(168,85,247,${0.3+0.7*Math.abs(Math.sin(this.time*5))})`;
        ctx.beginPath();
        ctx.ellipse(x, y+6, 10, 3, 0, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    drawRabbit(ctx, x, y) {
        // 先尝试使用精灵分镜图，带null检查
        if (resources.spritesheet) {
            try {
                const coords = SPRITE_COORDS.sprites.rabbit;
                ctx.drawImage(
                    resources.spritesheet,
                    coords.x1, coords.y1,
                    coords.x2 - coords.x1, coords.y2 - coords.y1,
                    x - 40, y - 70,
                    80, 100
                );
            } catch (e) {
                this.drawRabbitFallback(ctx, x, y);
            }
        } else {
            this.drawRabbitFallback(ctx, x, y);
        }
    }

    drawRabbitFallback(ctx, x, y) {
        ctx.save();
        
        // 身体
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.ellipse(x, y, 25, 35, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 耳朵
        ctx.fillRect(x-20, y-60, 12, 40);
        ctx.fillRect(x+8, y-60, 12, 40);
        
        // 眼睛
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x-10, y-10, 4, 0, Math.PI*2);
        ctx.arc(x+10, y-10, 4, 0, Math.PI*2);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(x, y-10, 20, 8, 0, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    getCurrentSceneName() {
        return SCENES[this.currentScene]?.name || '未知地图';
    }
}

// 创建全局场景实例
const scene = new Scene();
