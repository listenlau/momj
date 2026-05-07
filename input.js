/**
 * 触摸/点击输入处理模块
 */

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.chatInput = null;
        this.isTouch = false;
        
        // 初始化事件监听
        this.initEventListeners();
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 鼠标点击
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // 触摸开始
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouch = true;
            this.handleTouchStart(e);
        }, { passive: false });
        
        // 触摸移动
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // 触摸结束
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleTouchEnd(e);
        }, { passive: false });
        
        // 键盘输入
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    /**
     * 设置聊天输入框元素
     */
    setChatInput(inputElement) {
        this.chatInput = inputElement;
    }
    
    /**
     * 获取画布坐标（考虑缩放和偏移）
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CONFIG.GAME_WIDTH / rect.width;
        const scaleY = CONFIG.GAME_HEIGHT / rect.height;
        
        let clientX, clientY;
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    /**
     * 处理点击事件
     */
    handleClick(event) {
        const coords = this.getCanvasCoordinates(event);
        this.processClick(coords.x, coords.y);
    }
    
    /**
     * 处理触摸开始
     */
    handleTouchStart(event) {
        // 触摸开始时隐藏聊天输入框
        if (this.chatInput) {
            this.chatInput.blur();
        }
    }
    
    /**
     * 处理触摸结束
     */
    handleTouchEnd(event) {
        if (event.changedTouches && event.changedTouches.length > 0) {
            const touch = event.changedTouches[0];
            const coords = this.getCanvasCoordinates({ touches: [touch] });
            this.processClick(coords.x, coords.y);
        }
    }
    
    /**
     * 处理点击坐标
     */
    processClick(x, y) {
        // 先检查UI按钮点击
        const result = ui.handleClick(x, y);
        
        if (result) {
            if (result.action === 'chat_send') {
                // 发送聊天消息
                if (this.chatInput && this.chatInput.value.trim()) {
                    ui.addChatMessage(
                        player.data?.name || '玩家',
                        this.chatInput.value.trim(),
                        ui.chatChannel
                    );
                    this.chatInput.value = '';
                }
                return;
            }
            
            if (result.action === 'chat_channel') {
                return;
            }
            
            if (result.action && result.action.startsWith('key_')) {
                // 处理键盘按键
                this.handleGameKey(result.key);
                return;
            }
        }
        
        // 检查是否点击在地图区域（用于移动）
        const mapArea = UI_LAYOUT.MAP_AREA;
        if (x >= mapArea.x && x <= mapArea.x + mapArea.width &&
            y >= mapArea.y && y <= mapArea.y + mapArea.height) {
            
            // 转换为场景坐标（考虑画布偏移）
            const sceneX = x - mapArea.x + 0;
            const sceneY = y - mapArea.y + 0;
            
            // 玩家移动到该位置（4方向直线）
            player.moveTo(sceneX + 50, sceneY + 80);
        }
    }
    
    /**
     * 处理游戏按键
     */
    handleGameKey(key) {
        switch (key) {
            case '1':
                // 常用菜单
                break;
            case '2':
                // 上
                player.setDirection(DIRECTION.UP);
                player.isMoving = true;
                player.targetX = player.x;
                player.targetY = player.y - 50;
                player.lastDirection = DIRECTION.UP;
                break;
            case '3':
                // 辅助
                break;
            case '4':
                // 左
                player.setDirection(DIRECTION.LEFT);
                player.isMoving = true;
                player.targetX = player.x - 50;
                player.targetY = player.y;
                player.lastDirection = DIRECTION.LEFT;
                break;
            case '5':
                // 周围
                break;
            case '6':
                // 右
                player.setDirection(DIRECTION.RIGHT);
                player.isMoving = true;
                player.targetX = player.x + 50;
                player.targetY = player.y;
                player.lastDirection = DIRECTION.RIGHT;
                break;
            case '7':
                // 聊天（显示输入框）
                if (this.chatInput) {
                    this.chatInput.style.display = 'block';
                    this.chatInput.focus();
                }
                break;
            case '8':
                // 下
                player.setDirection(DIRECTION.DOWN);
                player.isMoving = true;
                player.targetX = player.x;
                player.targetY = player.y + 50;
                player.lastDirection = DIRECTION.DOWN;
                break;
            case '9':
                // 地图切换
                const scenes = ['riverbank', 'santi'];
                const currentIndex = scenes.indexOf(scene.currentScene);
                const nextIndex = (currentIndex + 1) % scenes.length;
                scene.setScene(scenes[nextIndex]);
                break;
            case '0':
                // 系统菜单
                break;
            case '#':
                // 名称（显示玩家信息）
                console.log('[玩家]', player.getData());
                break;
            case '*':
                // 频道切换
                break;
        }
    }
    
    /**
     * 处理键盘按下事件
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                player.setDirection(DIRECTION.UP);
                player.isMoving = true;
                player.targetX = player.x;
                player.targetY = player.y - 50;
                player.lastDirection = DIRECTION.UP;
                event.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                player.setDirection(DIRECTION.DOWN);
                player.isMoving = true;
                player.targetX = player.x;
                player.targetY = player.y + 50;
                player.lastDirection = DIRECTION.DOWN;
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                player.setDirection(DIRECTION.LEFT);
                player.isMoving = true;
                player.targetX = player.x - 50;
                player.targetY = player.y;
                player.lastDirection = DIRECTION.LEFT;
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                player.setDirection(DIRECTION.RIGHT);
                player.isMoving = true;
                player.targetX = player.x + 50;
                player.targetY = player.y;
                player.lastDirection = DIRECTION.RIGHT;
                event.preventDefault();
                break;
            case 'Escape':
                player.stopMoving();
                event.preventDefault();
                break;
            case 'Enter':
                if (this.chatInput && this.chatInput.style.display !== 'none') {
                    if (this.chatInput.value.trim()) {
                        ui.addChatMessage(
                            player.data?.name || '玩家',
                            this.chatInput.value.trim(),
                            ui.chatChannel
                        );
                        this.chatInput.value = '';
                    }
                    this.chatInput.blur();
                    this.chatInput.style.display = 'none';
                }
                event.preventDefault();
                break;
        }
    }
}

// 创建全局输入处理实例（由主模块初始化）
let inputHandler = null;
