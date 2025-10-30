import PocketBaseCore, { UserInfo } from './lib-core/core';

import './style/style.sass';

const timeEl = document.querySelector('#time');
if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();

function _log(...args: any[]) {
    let rlt = '';
    const _obj2str = (obj: any) => {
        if (typeof obj === 'object') {
            return '<pre>' + JSON.stringify(obj, null, 2) + '</pre>';
        } else return obj;
    };
    for (let i = 0; i < args.length; i++) {
        rlt += _obj2str(args[i]) + ' ';
    }
    const logEl = document.querySelector('#log');
    if (logEl) logEl.innerHTML += `${rlt}<br>`;
}

const app: {
    data: any;
    pb_config: { baseURL: string; userInfo: UserInfo };
} = {
    data: null,
    pb_config: {
        baseURL: process.env.PB_URL || 'http://127.0.0.1:8090',
        userInfo: {
            email: process.env.PB_EMAIL || 'your-email@example.com',
            password: process.env.PB_PASSWORD || 'your-password',
            isAdmin: true,
        },
    },
};

(async () => {
    if (process.env.DEMO_VAR === undefined) {
        alert('请配置环境变量文件 .env.dev');
        _log('DEMO_VAR 未定义，请配置环境变量文件 .env.dev');
        return;
    } else {
        _log('DEMO_VAR:', process.env.DEMO_VAR);
    }
    const config = app.pb_config;

    const pbCore = new PocketBaseCore(config.baseURL, config.userInfo, true);

    // 等待初始化完成
    await new Promise((resolve) => setTimeout(resolve, 1000));

    _log('初始化完成');
    _log('认证状态:', pbCore.getAuthStatus());

})();
