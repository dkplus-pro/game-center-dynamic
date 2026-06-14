# Game Center Dynamic — 动态 H5 页面搭建平台

一个全栈 Monorepo 项目，支持通过可视化拖拽编辑器动态搭建 H5 游戏中心页面，实时发布上线。

## 项目概览

```
┌──────────────────────────────────────────────────────────────┐
│                     管理后台 (:8080)                          │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │ 组件面板   │  │    预览画布       │  │    属性面板       │    │
│  │ Banner   │  │  ┌────────────┐  │  │ 标题: 热门推荐   │    │
│  │ 游戏网格  │  │  │  Simulated │  │  │ 自动播放: ✅     │    │
│  │ 卡片轮播  │  │  │  iPhone    │  │  │ 间隔: 3000ms    │    │
│  │ ...      │  │  └────────────┘  │  │ ...              │    │
│  └──────────┘  └──────────────────┘  └──────────────────┘    │
│                        保存草稿 | 发布                        │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼ 保存 schema
┌──────────────────────────────────────────────────────────────┐
│                      Go 后端 (:3000)                          │
│  Thrift IDL → Gin API → GORM → SQLite                       │
│  页面 CRUD | 游戏圈选 | 批量数据解析                           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼ 请求页面
┌──────────────────────────────────────────────────────────────┐
│                      H5 前端 (:8081)                          │
│  SchemaRenderer 解析 schema → 渲染真实组件                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│  │ Banner   │ │ GameGrid │ │ GameList │                      │
│  │ 轮播     │ │ 2×4      │ │ 分页     │                      │
│  └──────────┘ └──────────┘ └──────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 总架构 | **Turborepo + pnpm** | Monorepo 管理，并行构建 |
| 后端 | **Go + Gin + GORM + SQLite** | 轻量级 REST API，零配置数据库 |
| 接口定义 | **Thrift IDL** | 前后端共享类型定义，自动生成 TS 类型 |
| 组件库 | **React + Tailwind CSS** | 5 个游戏组件，双重用途（渲染 + 编辑） |
| 管理后台 | **Modern.js + React + Zustand + @dnd-kit** | 三栏拖拽编辑器 |
| H5 前端 | **Modern.js + React** | Schema 驱动渲染，三层兜底 |
| 测试 | **Vitest + Playwright** | 单元测试 + E2E，console 零报错 |

## 项目结构

```
game-center-dynamic/
├── apps/
│   ├── admin/                  # 管理后台 :8080
│   │   ├── src/
│   │   │   ├── routes/         # 页面列表 + 编辑器
│   │   │   ├── stores/         # zustand 状态管理
│   │   │   └── components/     # 三栏编辑器组件
│   │   └── e2e/                # Playwright E2E
│   └── h5/                     # H5 前端 :8081
│       ├── src/
│       │   ├── renderer/       # SchemaRenderer 引擎
│       │   ├── hooks/          # 数据获取
│       │   └── routes/         # 页面渲染 + 预览
│       └── e2e/                # Playwright E2E
├── packages/
│   ├── components/             # 共享组件库
│   │   └── src/
│   │       ├── Banner/         # 横幅轮播
│   │       ├── GameGrid2x4/    # 2×4 游戏网格
│   │       ├── GameCardSwiper/ # 卡片横向轮播
│   │       ├── GameGrid4x1/    # 4×1 游戏列表
│   │       ├── GameList/       # 分页游戏列表
│   │       ├── GameCard/       # 共享游戏卡片
│   │       ├── PropsEditorFactory/ # 通用属性编辑器
│   │       └── registry.ts     # 组件注册表
│   ├── eslint-config/          # 共享 ESLint 配置
│   └── types/                  # IDL 生成的 TS 类型
├── server/                     # Go 后端 :3000
│   ├── idl/                    # Thrift IDL 定义
│   ├── cmd/
│   │   ├── server/             # 服务入口
│   │   └── codegen/            # IDL → TS 代码生成器
│   └── internal/
│       ├── handler/            # HTTP 接口层
│       ├── service/            # 业务逻辑层
│       └── repo/               # 数据访问层
├── docs/                       # 课程文档 (6 篇)
├── turbo.json                  # Turbo 流水线配置
└── pnpm-workspace.yaml         # pnpm 工作区
```

## 快速开始

### 环境要求

- **Node.js** >= 18
- **pnpm** >= 9.15
- **Go** >= 1.21

### 安装依赖

```bash
# 安装前端依赖
pnpm install

# 安装 Go 依赖
cd server && go mod download && cd ..
```

### 启动开发

```bash
# 终端 1: 启动 Go 后端
cd server && go run cmd/server/main.go
# → http://localhost:3000

# 终端 2: 启动管理后台
cd apps/admin && pnpm dev
# → http://localhost:8080

# 终端 3: 启动 H5 前端
cd apps/h5 && pnpm dev
# → http://localhost:8081
```

### 一键启动

```bash
# 使用 concurrently 同时启动三个服务
pnpm add -g concurrently
concurrently \
  "cd server && go run cmd/server/main.go" \
  "cd apps/admin && pnpm dev" \
  "cd apps/h5 && pnpm dev"
```

### 生成 TypeScript 类型

```bash
cd server && go run cmd/codegen/main.go
# → packages/types/src/generated/
```

## 使用流程

1. 打开管理后台 `http://localhost:8080`
2. 点击「新建页面」，进入三栏编辑器
3. 从左侧组件面板拖入组件到预览画布
4. 点击组件，在右侧属性面板修改配置
5. 点击「保存草稿」保存，点击「发布」上线
6. 访问 `http://localhost:8081/{slug}` 查看已发布页面

## 测试

```bash
# 组件库单元测试 (33 个)
cd packages/components && pnpm test

# 管理后台 E2E
cd apps/admin && pnpm e2e

# H5 前端 E2E
cd apps/h5 && pnpm e2e

# 全量构建验证
pnpm build
cd server && go build ./...
```

## 课程文档

| 章节 | 内容 |
|------|------|
| [01-项目初始化](docs/01-项目初始化.md) | Turborepo Monorepo 骨架搭建 |
| [02-后端搭建](docs/02-后端搭建.md) | Thrift IDL + Go + SQLite |
| [03-组件库搭建](docs/03-组件库搭建.md) | 5 组件 + registry + PropsEditorFactory |
| [04-管理后台搭建](docs/04-管理后台搭建.md) | 三栏编辑器 + dnd-kit + zustand |
| [05-H5前端搭建](docs/05-H5前端搭建.md) | SchemaRenderer + 三层兜底 |
| [06-联调与部署](docs/06-联调与部署.md) | 全栈联调 + Playwright + 排错 |

## 核心设计

### Schema 驱动渲染

页面结构以 JSON Schema 存储，H5 端通过 `SchemaRenderer` 动态解析渲染：

```json
{
  "components": [
    { "type": "Banner", "order": 0, "props": { "images": [...], "autoplay": true } },
    { "type": "GameGrid2x4", "order": 1, "props": { "title": "热门推荐", "dataSource": {...} } }
  ]
}
```

### 游戏数据源圈选

支持**规则圈选**（按标签/分类自动拉取）和**手动选择**两种模式，游戏库更新后 H5 自动同步。

### 三层兜底

| 层级 | 策略 | 场景 |
|------|------|------|
| 组件级 | 未知 type 跳过 + console.warn | 组件注册表缺失 |
| 数据级 | 空状态占位 | 游戏数据为空 |
| 页面级 | 友好错误页 + 重试按钮 | API 请求失败 |

### 版本管理

- **草稿状态**：覆盖保存，不产生新版本
- **发布操作**：生成不可变版本快照，版本号递增
- **软删除**：archived 状态，可恢复

## MVP 范围

- ✅ 可视化拖拽编辑器
- ✅ 5 个游戏组件
- ✅ 游戏数据源圈选
- ✅ 草稿/发布版本管理
- ✅ Schema 驱动渲染
- ✅ 单元测试 + E2E
- ⏳ 用户登录/权限（后续）
- ⏳ 游戏详情页（后续）
- ⏳ 多设备预览切换（后续）