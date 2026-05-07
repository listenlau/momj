/**
 * 玩家控制模块
 */

class Player {
    constructor() {
        this.x = 180;
        this.y = 320;
        this.direction = DIRECTION.UP;
        this.lastDirection = DIRECTION.DOWN;
        this.isMoving = false;
        this.moveSpeed = CONFIG.MOVE_SPEED;
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.data = null;
    }

    setData(data) {
        this.data = data;
        if (data.x !== undefined) this.x = data.x;
        if (data.y !== undefined) this.y = data.y;
        if (data.direction) this.direction = data.direction;
    }

    getData() {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction,
            lastDirection: this.lastDirection,
            hp: this.data?.hp || 100,
            maxHp: this.data?.maxHp || 100,
            exp: this.data?.exp || 0,
            maxExp: this.data?.maxExp || 100,
            level: this.data?.level || 1,
            gold: this.data?.gold || 0,
            gem: this.data?.gem || 0,
            name: this.data?.name || '未命名',
            server: this.data?.server || '七巧板',
            gender: this.data?.gender || 'male'
        };
    }

    moveTo(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        
        // 如果距离太近，停止移动
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            this.isMoving = false;
            return;
        }
        
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        
        // 选择距离更远的方向移动
        if (absDx > absDy) {
            this.targetX = targetX;
            this.targetY = this.y;
            this.direction = dx > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
        } else {
            this.targetX = this.x;
            this.targetY = targetY;
            this.direction = dy > 0 ? DIRECTION.DOWN : DIRECTION.UP;
        }
        
        this.isMoving = true;
        this.lastDirection = this.direction;
    }

    setDirection(direction) {
        this.direction = direction;
        this.lastDirection = direction;
    }

    stopMoving() {
        this.isMoving = false;
        this.targetX = this.x;
        this.targetY = this.y;
    }

    update(deltaTime) {
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.moveSpeed) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            } else {
                const ratio = this.moveSpeed / distance;
                this.x += dx * ratio;
                this.y += dy * ratio;
            }
            
            // 更新帧动画
            this.frameTimer += deltaTime;
            if (this.frameTimer >= CONFIG.FRAME_DURATION) {
                this.frameTimer = 0;
                this.frameIndex++;
            }
        } else {
            this.frameIndex = 0;
            this.frameTimer = 0;
        }
        
        // 边界限制
        this.x = Math.max(30, Math.min(CONFIG.GAME_WIDTH - 30, this.x));
        this.y = Math.max(50, Math.min(CONFIG.GAME_HEIGHT - 50, this.y));
    }

    draw(ctx) {
        // 即使atlas为null也绘制fallback角色（确保游戏能运行）
        if (!resources.atlas) {
            this.drawFallbackCharacter(ctx);
            return;
        }
        
        try {
            let animType = this.isMoving ? 'walk_' + this.direction : 'idle_' + this.lastDirection;
            const anim = CONFIG.ATLAS_INFO[animType] || CONFIG.ATLAS_INFO.idle_down;
            const frame = this.frameIndex % anim.frames;
            const col = anim.start + frame;
            const sx = col * CONFIG.PLAYER_FRAME_WIDTH;
            
            let drawW = CONFIG.PLAYER_FRAME_WIDTH;
            let drawH = CONFIG.PLAYER_FRAME_HEIGHT;
            let drawX = this.x - drawW / 2;
            let drawY = this.y - drawH;
            
            // 横向移动时调整宽度
            const isHorizontal = (this.direction === DIRECTION.LEFT || this.direction === DIRECTION.RIGHT) ||
                (animType.startsWith('idle_') && (this.lastDirection === DIRECTION.LEFT || this.lastDirection === DIRECTION.RIGHT));
            
            if (isHorizontal) {
                drawW = Math.round(CONFIG.PLAYER_FRAME_WIDTH * CONFIG.PLAYER_HORIZONTAL_SCALE);
                drawX = this.x - drawW / 2;
            }
            
            // drawImage前检查atlas不为null
            if (resources.atlas) {
                ctx.drawImage(
                    resources.atlas,
                    sx, 0,
                    CONFIG.PLAYER_FRAME_WIDTH, CONFIG.PLAYER_FRAME_HEIGHT,
                    drawX, drawY,
                    drawW, drawH
                );
            } else {
                this.drawFallbackCharacter(ctx);
            }
        } catch (e) {
            console.warn('[玩家] 绘制失败，使用fallback:', e);
            this.drawFallbackCharacter(ctx);
        }
    }

    drawFallbackCharacter(ctx) {
        const size = 40;
        
        // 绘制头部
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(this.x, this.y - size/2, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - size/2 - 5, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 8, this.y - size/2 - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制瞳孔
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - size/2 - 5, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 8, this.y - size/2 - 5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 创建全局玩家实例
const player = new Player();
