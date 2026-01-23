# Micro-plugin 开发指南

### 目录结构

本库所有源码均在src目录，开发时需要安装相应工具链

以下是运行相关核心包

```text
./
├── src/            # 源码
|    ├──backend/    # 支持yunzai环境运行
|    ├──frontend/   # 前端源码
|    └──package/    # 开发环境支持
├── configs/        # 插件运行时配置文件
├── public/         # 前后端共享静态资源
|    ├──static/     # 前端资源目录
|    ├──...         # 其它
```

以下根据你运行环境使用对应包管理工具，yunzai、miao-yunzai使用pnpm，yunzaijs使用yarn

### 后端开发

- 直接启动
  ```bash
  npm run app
  ```
- 热开发支持
  ```bash
  npm run dev
  ```
- 编译
  ```bash
  npm run build
  ```

### 前端开发

- 启动开发模式
  ```bash
  npm run dev:frontend
  ```
- 构建前端资源
  ```bash
  npm run build:frontend
  ```

### 提交Git

> [!WARNING] 请手动执行以下命令提交

- 添加到暂存器
  ```bash
  git add .
  ```
- 提交commit信息（不要执行git commit -m !!!!）
  ```bash
  npm run commit
  ```
- 推送到远程
  ```bash
  git push
  ```
