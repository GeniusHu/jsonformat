// 显示通知
export function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加到页面
    document.body.appendChild(notification);

    // 添加动画类
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 6px;
    background: #ffffff;
    color: #2c3e50;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateY(0);
}

.notification-success {
    background: #2ecc71;
    color: #ffffff;
}

.notification-warning {
    background: #f1c40f;
    color: #ffffff;
}

.notification-error {
    background: #e74c3c;
    color: #ffffff;
}
`;
document.head.appendChild(style); 