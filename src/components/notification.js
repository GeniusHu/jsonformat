// 通知组件
export class Notification {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = document.createElement('span');
        icon.className = 'notification-icon';
        icon.textContent = type === 'success' ? '✓' : '⚠';
        
        const text = document.createElement('span');
        text.className = 'notification-text';
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        this.container.appendChild(notification);

        // 添加动画类
        setTimeout(() => notification.classList.add('show'), 10);

        // 自动移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }
}

// 创建单例实例
export const notification = new Notification(); 