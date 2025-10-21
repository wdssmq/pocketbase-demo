import PocketBaseCore from "./core.js";

import "./style/style.sass";

document.querySelector("#time").textContent = new Date().toLocaleTimeString();

function _log(...args) {
    let rlt = "";
    const _obj2str = (obj) => {
        if (typeof obj === "object") {
            return '<pre>' + JSON.stringify(obj, null, 2) + '</pre>';
        } else return obj;
    };
    for (let i = 0; i < args.length; i++) {
        rlt += _obj2str(args[i]) + " ";
    }
    document.querySelector("#log").innerHTML += `${rlt}<br>`;
}

console.log("lib-pocket-base.js");
console.log("DEMO_VAR:", process.env.DEMO_VAR);

(async () => {
    const config = {
        baseURL: process.env.PB_URL || "http://127.0.0.1:8090",
        userInfo: {
            email: process.env.PB_EMAIL || 'your-email@example.com',
            password: process.env.PB_PASSWORD || 'your-password',
            isAdmin: true
        }
    };

    try {
        // 创建实例（会自动登录）
        const pbCore = new PocketBaseCore(
            config.baseURL,
            config.userInfo,
            true
        );

        // 等待初始化完成
        await new Promise(resolve => setTimeout(resolve, 1000));

        _log("初始化完成");
        _log("认证状态:", pbCore.getAuthStatus());

    } catch (error) {
        console.error('操作失败:', error);
    }
})();
