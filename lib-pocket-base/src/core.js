import PocketBase from 'pocketbase';

class PocketBaseCore {
    constructor(baseURL, userInfo, autoLogin = false) {
        this.pb = new PocketBase(baseURL);
        this.userInfo = userInfo;
        this.autoLogin = autoLogin;
        this.logDev(this.pb.authStore.isValid)

        if (!this.pb.authStore.isValid && this.autoLogin) {
            this.initialize();
        }
    }

    async initialize() {
        this.authData = await this.userLogin();
    }

    async userLogin() {
        try {
            const asAdmin = this.userInfo.isAdmin;
            const collection = asAdmin ? '_superusers' : 'users';
            const authData = await this.pb.collection(collection).authWithPassword(
                this.userInfo.email,
                this.userInfo.password
            );

            if (!authData?.token) {
                throw new Error('认证数据无效');
            }

            this.logDev(`${asAdmin ? '管理员' : '用户'}登录成功:`, {
                id: authData.record.id,
                email: authData.record.email
            });

            return authData;
        } catch (error) {
            throw new Error(`登录失败: ${error.message}`);
        }
    }

    async userLogout() {
        this.pb.authStore.clear();

        this.logDev('退出登录');
    }

    getAuthStatus() {
        this.logDev(this.pb.authStore.record);

        return {
            isValid: this.pb.authStore.isValid,
            // record: this.pb.authStore.record,
            token: this.pb.authStore.token,
        };
    }

    logDev() {
        if ('dev' === process.env.NODE_ENV) {
            console.log(...arguments);
        }
    }
}

export default PocketBaseCore;
