/**
 * 资源加载/管理模块
 */

class ResourceManager {
    constructor() {
        this.spritesheet = null;
        this.atlas = null;
        this.scenes = {};
        this.loadedCount = 0;
        this.totalCount = 0;
        this.onProgress = null;
        this.onComplete = null;
    }
    
    /**
     * 加载所有资源
     */
    async loadAll(progressCallback, completeCallback) {
        this.onProgress = progressCallback;
        this.onComplete = completeCallback;
        
        // 计算资源总数
        this.totalCount = 4; // spritesheet, atlas, 2 scenes
        this.loadedCount = 0;
        
        // 加载精灵分镜图
        await this.loadImage('assets/spritesheet.png', 'spritesheet');
        
        // 加载角色atlas
        await this.loadImage('assets/atlas.png', 'atlas');
        
        // 加载场景
        await this.loadImage('assets/scene_riverbank.jpg', 'riverbank');
        await this.loadImage('assets/scene_santi.jpg', 'santi');
        
        // 完成
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    /**
     * 加载单个图片
     */
    loadImage(src, key) {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                if (key === 'spritesheet') {
                    this.spritesheet = img;
                } else if (key === 'atlas') {
                    this.atlas = img;
                } else {
                    this.scenes[key] = img;
                }
                this.loadedCount++;
                if (this.onProgress) {
                    this.onProgress(this.loadedCount, this.totalCount);
                }
                console.log(`[资源] 加载成功: ${src}`);
                resolve();
            };
            
            img.onerror = () => {
                console.warn(`[资源] 加载失败: ${src}`);
                this.loadedCount++;
                if (this.onProgress) {
                    this.onProgress(this.loadedCount, this.totalCount);
                }
                resolve();
            };
            
            img.src = src;
        });
    }
    
    /**
     * 检查是否全部加载完成
     */
    isLoaded() {
        return this.loadedCount >= this.totalCount;
    }
    
    /**
     * 从精灵分镜图裁切指定区域
     */
    drawSprite(ctx, spriteKey, destX, destY, destW, destH) {
        if (!this.spritesheet) return false;
        
        const coords = this.getSpriteCoords(spriteKey);
        if (!coords) return false;
        
        try {
            ctx.drawImage(
                this.spritesheet,
                coords.x1, coords.y1,
                coords.x2 - coords.x1,
                coords.y2 - coords.y1,
                destX, destY,
                destW || (coords.x2 - coords.x1),
                destH || (coords.y2 - coords.y1)
            );
            return true;
        } catch (e) {
            console.warn('[资源] 绘制精灵失败:', spriteKey, e);
            return false;
        }
    }
    
    /**
     * 获取精灵坐标
     */
    getSpriteCoords(spriteKey) {
        const coords = SPRITE_COORDS;
        
        switch (spriteKey) {
            // 键盘按钮
            case 'key_1': return { x1: coords.keyboard.col0.x1, y1: coords.keyboard.row0.y1, x2: coords.keyboard.col0.x2, y2: coords.keyboard.row0.y2 };
            case 'key_2': return { x1: coords.keyboard.col1.x1, y1: coords.keyboard.row0.y1, x2: coords.keyboard.col1.x2, y2: coords.keyboard.row0.y2 };
            case 'key_3': return { x1: coords.keyboard.col2.x1, y1: coords.keyboard.row0.y1, x2: coords.keyboard.col2.x2, y2: coords.keyboard.row0.y2 };
            case 'key_sharp': return { x1: coords.keyboard.col3.x1, y1: coords.keyboard.row0.y1, x2: coords.keyboard.col3.x2, y2: coords.keyboard.row0.y2 };
            case 'key_4': return { x1: coords.keyboard.col0.x1, y1: coords.keyboard.row1.y1, x2: coords.keyboard.col0.x2, y2: coords.keyboard.row1.y2 };
            case 'key_5': return { x1: coords.keyboard.col1.x1, y1: coords.keyboard.row1.y1, x2: coords.keyboard.col1.x2, y2: coords.keyboard.row1.y2 };
            case 'key_6': return { x1: coords.keyboard.col2.x1, y1: coords.keyboard.row1.y1, x2: coords.keyboard.col2.x2, y2: coords.keyboard.row1.y2 };
            case 'key_0': return { x1: coords.keyboard.col3.x1, y1: coords.keyboard.row1.y1, x2: coords.keyboard.col3.x2, y2: coords.keyboard.row1.y2 };
            case 'key_7': return { x1: coords.keyboard.col0.x1, y1: coords.keyboard.row2.y1, x2: coords.keyboard.col0.x2, y2: coords.keyboard.row2.y2 };
            case 'key_8': return { x1: coords.keyboard.col1.x1, y1: coords.keyboard.row2.y1, x2: coords.keyboard.col1.x2, y2: coords.keyboard.row2.y2 };
            case 'key_9': return { x1: coords.keyboard.col2.x1, y1: coords.keyboard.row2.y1, x2: coords.keyboard.col2.x2, y2: coords.keyboard.row2.y2 };
            case 'key_star': return { x1: coords.keyboard.col3.x1, y1: coords.keyboard.row2.y1, x2: coords.keyboard.col3.x2, y2: coords.keyboard.row2.y2 };
            
            // 菜单按钮
            case 'btn_character': return coords.menuButtons.character;
            case 'btn_summon': return coords.menuButtons.summon;
            case 'btn_equipment': return coords.menuButtons.equipment;
            case 'btn_skill': return coords.menuButtons.skill;
            case 'btn_bag': return coords.menuButtons.bag;
            case 'btn_setting': return coords.menuButtons.setting;
            case 'btn_system': return coords.menuButtons.system;
            
            // HP/EXP条
            case 'hp_bar': return coords.hpBar;
            case 'exp_bar': return coords.expBar;
            
            // 确定/取消
            case 'btn_confirm': return coords.confirm;
            case 'btn_cancel': return coords.cancel;
            
            // 场景精灵
            case 'rabbit': return coords.sprites.rabbit;
            case 'ufo': return coords.sprites.ufo;
            case 'jetpack': return coords.sprites.jetpack;
            
            default: return null;
        }
    }
}

// 全局资源管理器实例
const resources = new ResourceManager();
