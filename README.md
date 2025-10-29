# pocketbase-demo

pocketbase 的 docker 部署示例 + 使用 JS SDK 进行连接操作；

## 运行 - docker

· 请确保已经安装了 docker 和 docker-compose；

```bash
# 进入 docker 目录
cd docker

# 基于示例创建环境变量文件，修改管理员邮箱和密码
cp .env.sample .env

# .env 已在 .gitignore 中，不会提交敏感信息

# 启动服务
docker-compose up -d

```

· 访问服务：

> - Admin: `http://localhost:8090/_/`
> - API：`http://localhost:8090/api`

· docker 镜像来源：

> muchobien/pocketbase-docker: Pocketbase docker image
>
> [https://github.com/muchobien/pocketbase-docker](https://github.com/muchobien/pocketbase-docker "muchobien/pocketbase-docker: Pocketbase docker image")

## 前端示例


```bash
# 进入前端目录
cd lib-pocket-base

# 安装依赖
pnpm install

# 环境变量配置，写入地址及管理信息
cp .env.dev.sample .env.dev

# !!!!
# 重要：在本 demo 中，管理信息会写入前端代码中，请勿在生产环境中这么做

# 启动服务
pnpm dev

```
