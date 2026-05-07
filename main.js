/**
 * 入口，初始化流程模块
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[初始化] 开始加载游戏...');
    
    // 获取DOM元素
    const canvas = document.getElementById('gameCanvas');
    const loginScreen = document.getElementById('loginScreen');
    const charCreateScreen = document.getElementById('charCreateScreen');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay?.querySelector('.loading-text');
    const chatInput = document.getElementById('chatInput');
    
    // 显示加载动画
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    if (loadingText) {
        loadingText.textContent = '正在加载游戏资源...';
    }
    
    // 加载游戏资源
    await resources.loadAll(
        (loaded, total) => {
            if (loadingText) {
                loadingText.textContent = `加载资源 ${loaded}/${total}...`;
            }
        },
        () => {
            console.log('[资源] 加载完成');
        }
    );
    
    // 初始化游戏
    game.init(canvas);
    
    // 初始化输入处理
    inputHandler = new InputHandler(canvas);
    inputHandler.setChatInput(chatInput);
    
    // 设置UI按钮回调
    ui.setButtonClickHandler((name) => {
        console.log('[按钮] 点击:', name);
        
        // 根据按钮名称处理
        switch (name) {
            case 'confirm':
                // 确定按钮
                break;
            case 'cancel':
                // 取消按钮
                break;
            case 'mapTag':
                // 切换地图
                const scenes = ['riverbank', 'santi'];
                const currentIndex = scenes.indexOf(scene.currentScene);
                const nextIndex = (currentIndex + 1) % scenes.length;
                scene.setScene(scenes[nextIndex]);
                break;
            default:
                // 其他按钮
                break;
        }
    });
    
    // 隐藏加载动画
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
    
    // 检查是否有存档
    if (game.hasSave()) {
        // 直接进入游戏
        game.load();
        if (loginScreen) loginScreen.style.display = 'none';
        if (charCreateScreen) charCreateScreen.style.display = 'none';
        game.setState('playing');
        console.log('[游戏] 继续存档游戏');
    } else {
        // 显示登录界面
        if (loginScreen) loginScreen.style.display = 'flex';
        if (charCreateScreen) charCreateScreen.style.display = 'none';
        console.log('[游戏] 显示登录界面');
    }
    
    // 设置登录按钮事件
    const loginBtn = document.getElementById('loginBtn');
    const accountInput = document.getElementById('accountInput');
    const loginError = document.getElementById('loginError');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const account = accountInput?.value.trim();
            if (!account) {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = '请输入账号';
                }
                return;
            }
            
            // 隐藏登录界面，显示角色创建界面
            if (loginScreen) loginScreen.style.display = 'none';
            if (charCreateScreen) charCreateScreen.style.display = 'flex';
        });
    }
    
    // 隐藏登录错误提示（当用户输入时）
    if (accountInput) {
        accountInput.addEventListener('input', () => {
            if (loginError) {
                loginError.style.display = 'none';
            }
        });
    }
    
    console.log('[初始化] 游戏加载完成');
});

// 全局暴露给HTML调用的函数
window.selectGender = function(element) {
    // 移除其他选中状态
    document.querySelectorAll('.gender-card').forEach(card => {
        card.classList.remove('selected');
    });
    // 添加选中状态
    element.classList.add('selected');
    // 存储选中性别
    window.selectedGender = element.dataset.gender;
};

window.createCharacter = function() {
    const charNameInput = document.getElementById('charNameInput');
    const charName = charNameInput?.value.trim() || '神秘旅人';
    const gender = window.selectedGender || 'male';
    const accountInput = document.getElementById('accountInput');
    const server = accountInput?.value.trim() || '七巧板';
    
    // 1. 先隐藏覆盖层
    const charCreateScreen = document.getElementById('charCreateScreen');
    const loginScreen = document.getElementById('loginScreen');
    if (charCreateScreen) charCreateScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'none';
    
    // 2. 初始化游戏数据
    game.newGame({
        name: charName,
        gender: gender,
        server: server
    });
    
    // 3. 启动游戏（setState内部调start()）
    game.setState('playing');
    
    console.log('[角色] 创建角色:', charName, '性别:', gender);
};
