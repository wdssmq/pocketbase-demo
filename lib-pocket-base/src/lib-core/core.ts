import PocketBase, { RecordAuthResponse } from 'pocketbase';

export type UserInfo = {
    email: string;
    password: string;
    isAdmin?: boolean;
};

export type Error = {
    status: number;
    code: number;
    message: string;
};

class PocketBaseCore {
    pb: PocketBase;
    userInfo: UserInfo;
    autoLogin: boolean;
    authData: RecordAuthResponse | null = null;

    error: Error | null = null;

    errorHandler(error: any) {
        this.error = {
            status: error?.status || 500,
            code: error?.code || -1,
            message: error?.message || '未知错误',
        };
        console.error('错误:', error);
    }

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
            this.errorHandler(error);
            return Promise.reject(this.error);
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

    async getFirstListItem(collection: string, filter: string): Promise<any> {
        try {
            const record = await this.pb.collection(collection).getFirstListItem(filter);
            return record;
        } catch (error: any) {
            this.errorHandler(error);
            return Promise.reject(this.error);
        }
    }

    async createRecord(collection: string, data: any): Promise<any> {
        try {
            const record = await this.pb.collection(collection).create(data);
            return record;
        } catch (error: any) {
            this.errorHandler(error);
            return Promise.reject(this.error);
        }
    }

    async updateRecord(collection: string, recordId: string, data: any): Promise<any> {
        try {
            const record = await this.pb.collection(collection).update(recordId, data);
            return record;
        } catch (error: any) {
            this.errorHandler(error);
            return Promise.reject(this.error);
        }
    }

    logDev(...args: any[]) {
        if ('dev' === process.env.NODE_ENV) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    }
}

export default PocketBaseCore;
