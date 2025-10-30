import PocketBase, { RecordAuthResponse } from 'pocketbase';

export type UserInfo = {
    email: string;
    password: string;
    isAdmin?: boolean;
};

class PocketBaseCore {
    pb: PocketBase;
    userInfo: UserInfo;
    autoLogin: boolean;
    authData: RecordAuthResponse | null = null;

    constructor (baseURL: string, userInfo: UserInfo, autoLogin = false) {
        this.pb = new PocketBase(baseURL);
        this.userInfo = userInfo;
        this.autoLogin = autoLogin;
        this.logDev(this.pb.authStore.isValid);

        if (!this.pb.authStore.isValid && this.autoLogin) {
            this.initialize();
        }
    }

    async initialize(): Promise<void> {
        this.authData = await this.userLogin();
    }

    async userLogin(): Promise<RecordAuthResponse> {
        try {
            const asAdmin = !!this.userInfo.isAdmin;
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
                email: authData.record.email,
            });

            return authData;
        } catch (error: any) {
            throw new Error(`登录失败: ${error?.message || String(error)}`);
        }
    }

    async userLogout(): Promise<void> {
        this.pb.authStore.clear();

        this.logDev('退出登录');
    }

    getAuthStatus() {
        return {
            isValid: this.pb.authStore.isValid,
            token: this.pb.authStore.token,
            record: this.pb.authStore.record,
        };
    }

    logDev(...args: any[]) {
        if ('dev' === process.env.NODE_ENV) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    }
}

export default PocketBaseCore;
