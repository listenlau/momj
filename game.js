/**
 * 游戏状态、存档/读档、主循环模块
 */

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.frameInterval = 1000 / CONFIG.FRAME_RATE;
        
        // 游戏状态
        this.state = 'loading'; // loading, login, playing
    }
    
    /**
     * 初始化游戏
     */
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置像素风格渲染
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        // 设置Canvas尺寸适配屏幕
        if (typeof resizeCanvas === 'function') {
            resizeCanvas(canvas);
        }
        
        // 初始化场景实体
        scene.initEntities();
    }
    
    /**
     * 开始游戏主循环
     */
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }
    
    /**
     * 停止游戏
     */
    stop() {
        this.isRunning = false;
    }
    
    /**
     * 游戏主循环
     */
    loop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastTime;
        
        // 限制帧率
        if (this.deltaTime >= this.frameInterval) {
            try {
                this.update(this.deltaTime);
                this.render();
            } catch (e) {
                console.error('[游戏] 渲染出错:', e);
            }
            this.lastTime = currentTime - (this.deltaTime % this.frameInterval);
        }
        
        requestAnimationFrame(() => this.loop());
    }
    
    /**
     * 更新游戏状态
     */
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // 更新玩家
        player.update(deltaTime);
        
        // 更新场景
        scene.update(deltaTime);
        
        // 更新UI
        ui.update(deltaTime);
    }
    
    /**
     * 渲染游戏画面
     */
    render() {
        if (this.state !== 'playing') return;
        
        const ctx = this.ctx;
        
        // 清屏
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        
        // 绘制场景背景
        scene.drawBackground(ctx);
        
        // 绘制场景精灵
        scene.drawEntities(ctx);
        
        // 绘制玩家
        player.draw(ctx);
        
        // 绘制UI
        ui.draw(ctx);
    }
    
    /**
     * 设置游戏状态
     */
    setState(state) {
        this.state = state;
        
        if (state === 'playing') {
            // 开始游戏主循环
            this.start();
        }
    }
    
    /**
     * 保存游戏
     */
    save() {
        const saveData = {
            player: player.getData(),
            scene: scene.currentScene,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
            console.log('[存档] 保存成功');
            return true;
        } catch (e) {
            console.error('[存档] 保存失败:', e);
            return false;
        }
    }
    
    /**
     * 加载游戏
     */
    load() {
        try {
            const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
            if (saveData) {
                const data = JSON.parse(saveData);
                player.setData(data.player);
                if (data.scene) {
                    scene.setScene(data.scene);
                }
                console.log('[读档] 加载成功');
                return true;
            }
        } catch (e) {
            console.error('[读档] 加载失败:', e);
        }
        return false;
    }
    
    /**
     * 创建新游戏
     */
    newGame(playerData) {
        try {
            // 初始化玩家数据
            player.data = {
                name: playerData.name || '未命名',
                server: playerData.server || '七巧板',
                gender: playerData.gender || 'male',
                level: 99,
                hp: 9999,
                maxHp: 9999,
                exp: 0,
                maxExp: 100,
                gold: 10000000000000,
                gem: 100000000000000,
                x: 180,
                y: 320,
                direction: 'down'
            };
            
            // 直接设置初始场景（不要调setScene，它会触发initEntities）
            scene.currentScene = 'riverbank';
            scene.initEntities();
            
            // 保存
            this.save();
            
            console.log('[游戏] 新游戏创建成功');
        } catch (e) {
            console.error('[游戏] 创建新游戏失败:', e);
        }
    }
    
    /**
     * 检查存档是否存在
     */
    hasSave() {
        try {
            const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
            return !!saveData;
        } catch (e) {
            return false;
        }
    }
}

// 创建全局游戏实例
const game = new Game();
