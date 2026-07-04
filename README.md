# CloudERP - 企业办公一体化平台

基于 RuoYi Office 参考架构，专为 Cloudflare 平台构建的轻量级 ERP 系统。

## 技术栈

- **前端**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **图表**: Recharts
- **图标**: Lucide React
- **路由**: React Router v7
- **部署**: Cloudflare Pages

## 功能模块

### 🏠 仪表盘
- 营收趋势图表
- 订单状态分布
- TOP 客户排名
- 最新公告

### 🤝 CRM 客户管理
- 客户列表（增删改查）
- 客户等级管理（VIP/A/B/C）
- 客户来源追踪
- 合同管理（草稿/待签署/已签署/已完成）

### 📊 ERP 进销存
- **产品管理**: 产品目录、售价/成本管理、库存预警
- **采购管理**: 采购订单、供应商管理、入库审核流程
- **销售管理**: 销售订单、发货管理、收入统计
- **库存管理**: 实时库存监控、库存水平可视化、库存预警

### 👥 HRM 人力资源
- 员工档案管理
- 部门/职位管理
- 在职状态追踪

### 🏢 OA 协同办公
- 通知公告发布
- 公告类型分类（通知/政策/活动）
- 置顶公告管理

### ⚙️ 系统管理
- 用户管理（角色分配）
- 角色权限管理
- 权限可视化

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Cloudflare Pages 部署

### 方式一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages
3. 创建 Pages 项目，连接 Git 仓库或直接上传
4. 构建设置：
   - 框架预设：Vite
   - 构建命令：`npm run build`
   - 输出目录：`dist`

### 方式二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
npx wrangler pages deploy dist --project-name=clouderp
```

### D1 数据库配置（可选 - 用于生产环境）

```bash
# 创建 D1 数据库
npx wrangler d1 create clouderp-db

# 执行数据库迁移
npx wrangler d1 execute clouderp-db --file=./schema.sql
```

## 演示账号

- 用户名: `admin`
- 密码: `admin123`

## 项目结构

```
src/
├── components/
│   ├── layout/          # 布局组件
│   │   ├── app-layout.tsx
│   │   ├── sidebar-nav.tsx
│   │   └── header.tsx
│   └── ui/              # shadcn/ui 组件
├── contexts/
│   └── auth-context.tsx # 认证上下文
├── lib/
│   ├── mock-data.ts     # 模拟数据
│   └── utils.ts
├── pages/
│   ├── login.tsx        # 登录页
│   ├── dashboard.tsx    # 仪表盘
│   ├── crm/             # 客户管理
│   ├── erp/             # 进销存
│   ├── hrm/             # 人力资源
│   ├── oa/              # 协同办公
│   └── system/          # 系统管理
├── types/
│   └── index.ts         # 类型定义
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```
