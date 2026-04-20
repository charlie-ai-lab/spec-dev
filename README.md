# Spec-Driven Development Skills for Claude Code

> 基于吴恩达（Andrew Ng）教授 **Spec 驱动开发** 方法论，为 Claude Code 打造的一套结构化开发 Skills 合集。

---

## 核心理念

**Spec 驱动开发** 的核心思想是：**在编写代码之前，先写清楚规格说明**。通过结构化的文档（需求、计划、验证）来驱动开发流程，减少返工、提高质量、确保团队对齐。

> "Write the spec before you write the code."
> — Andrew Ng

本套 Skills 将这一理念固化为 7 个可复用的 Claude Code Skill，覆盖从项目初始化到功能交付的完整生命周期。

---

## 包含的 Skills

| Skill | 名称 | 触发指令 | 职责 |
|-------|------|---------|------|
| `spec-init` | 项目初始化 | `/spec-init` | 创建项目规格基础文件（使命、技术栈、路线图） |
| `spec-create` | 创建功能规格 | `/spec-create` | 为单个功能创建详细规格（需求、计划、验证） |
| `spec-mvp` | MVP 定义与执行 | `/spec-mvp` | 定义最小可行产品范围并完整执行交付 |
| `spec-do` | 执行规格 | `/spec-do` | 按任务组逐步实现功能，含验证与分支管理 |
| `spec-review` | 规格审查 | `/spec-review` | 四角度并行审查（架构/需求/可行性/**代码质量**），代码质量委派给 `code-reviewer` agent |
| `spec-done` | 完成交付 | `/spec-done` | 比对任务与日志，提交合并，完成开发周期 |
| `changelog` | 更新日志 | `/changelog` | 从 Git 历史自动生成/更新 CHANGELOG.md |

---

## 工作流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Spec-Driven 开发流程                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [项目启动]                                                        │
│       │                                                             │
│       ▼                                                             │
│   ┌─────────────┐    创建使命、技术栈、路线图                         │
│   │  spec-init  │ ─────────────────────────────────────────────►    │
│   └─────────────┘                                                   │
│       │                                                             │
│   [功能开发]                                                        │
│       │                                                             │
│       ├──► ┌──────────────┐   创建单个功能规格                        │
│       │    │ spec-create  │ ───────────────────────────────────►    │
│       │    └──────────────┘                                         │
│       │         │                                                   │
│       │         ▼                                                   │
│       │    ┌──────────────┐   按任务组执行、验证                      │
│       │    │   spec-do    │ ───────────────────────────────────►    │
│       │    └──────────────┘                                         │
│       │         │                                                   │
│       │         ▼                                                   │
│       │    ┌──────────────┐   四角度深度审查（含代码质量）            │
│       │    │ spec-review  │ ───────────────────────────────────►    │
│       │    └──────────────┘                                         │
│       │         │                                                   │
│       │         ▼                                                   │
│       │    ┌──────────────┐   标记完成、提交合并                      │
│       │    │  spec-done   │ ───────────────────────────────────►    │
│       │    └──────────────┘                                         │
│       │                                                             │
│       │    [或一次性定义 MVP]                                        │
│       └──► ┌──────────────┐   定义范围 + 执行 + 更新日志              │
│            │  spec-mvp    │ ───────────────────────────────────►    │
│            └──────────────┘                                         │
│                                                                     │
│   [全局工具]                                                        │
│       │                                                             │
│       ▼                                                             │
│   ┌─────────────┐    自动生成/更新 CHANGELOG.md                     │
│   │  changelog  │ ─────────────────────────────────────────────►    │
│   └─────────────┘                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 各 Skill 详解

### 1. spec-init — 项目初始化

在项目 kickoff 时调用，建立规格体系的"宪法"文件：

- **`specs/mission.md`** — 项目使命说明书，包含核心使命、价值主张、KPI、目标用户、投资理由
- **`specs/tech-stack.md`** — 技术栈说明书，包含前后端技术选型、开发工具、部署架构
- **`specs/roadmap.md`** — 路线图，按 Phase 划分可交付单元，带复选框跟踪进度

**关键约束**：在询问用户 3 个问题（使命/技术/路线图）之前，绝不写任何文件。

---

### 2. spec-create — 创建功能规格

为单个功能创建可执行的规格目录 `specs/YYYY-MM-DD-<feature-name>/`：

- **`requirements.md`** — 范围、决策、上下文
- **`plan.md`** — 任务组（Task Groups）及验收标准，每个任务组独立可交付
- **`validation.md`** — 自动化验证（测试/类型检查/构建）+ 手动验证（用户流程/边界情况）+ 完成定义

**关键约束**：创建前必须先询问用户 3 个问题（范围/决策/上下文）。

---

### 3. spec-mvp — MVP 定义与执行

专门用于最小可行产品的快速交付：

1. 读取路线图，了解全部规划
2. 询问用户 MVP 范围、决策、时间线
3. 创建 `specs/MVP-<date>-mvp/` 规格目录
4. 执行任务（每个任务独立分支）
5. 更新 CHANGELOG.md
6. 输出总结与下一步建议

**与 spec-create + spec-do 的区别**：MVP 是一次性完成"定义+执行"，适合快速验证核心价值的场景。

---

### 4. spec-do — 执行规格

规格执行的核心引擎，按任务组（Task Groups）逐步推进：

**分支工作流**：
```
main
  └── phase-N-feature
        ├── task-1-xxx ──► merge ──┐
        ├── task-2-xxx ──► merge ──┼──► phase-N-feature (完整功能)
        └── task-3-xxx ──► merge ──┘
```

**强制门控**：
- 每个任务提交前必须运行验证（测试/类型/构建）
- 所有功能组完成后必须运行完整验证
- 必须更新 CHANGELOG.md，否则规格不算完成

---

### 5. spec-review — 规格审查

**四角度并行审查机制**，产出结构化审查报告。

| 审查角度 | 输出文件 | 关注点 | 执行者 |
|---------|---------|--------|--------|
| **架构与技术** | `ARCHITECTURE_REVIEW.md` | 技术选型合理性、架构一致性、债务风险 | subagent |
| **需求与范围** | `REQUIREMENTS_REVIEW.md` | 范围边界清晰度、验收标准可测试性、与使命对齐 | subagent |
| **可行性** | `FEASIBILITY_REVIEW.md` | 任务拆解充分性、估算合理性、隐藏复杂度 | subagent |
| **代码质量** | `CODE_QUALITY_REVIEW.md` | 编码规范、逻辑正确性、安全漏洞（OWASP Top 10）、测试覆盖 | **`code-reviewer` agent** |

**为什么要委派代码质量审查？** 代码审查是深度专业任务，需要专门的 agent（如 `code-reviewer`）从编码标准、安全漏洞、性能等维度进行 severity-rated 分析。spec-review 负责**编排整个审查管道**，但不替代代码质量领域的专业判断。

**共识问题（Consensus Issues）**（≥2 个审查者同时标记）自动标记为高优先级；**代码安全/质量问题**在合并前必须优先处理。

---

### 6. spec-done — 完成交付

收尾阶段的标准化操作：

1. 比对 `plan.md` 与 `CHANGELOG.md`，标记任务完成状态
2. 提取提交信息，格式化为 [Conventional Commits](https://www.conventionalcommits.org/)
3. 合并到 `main` 分支
4. 清理功能分支

---

### 7. changelog — 更新日志

基于 Git 提交历史自动生成/增量更新 `CHANGELOG.md`：

- **首次运行**：读取全部提交历史，按日期分组生成
- **后续运行**：自动检测已有日志中的最新日期，仅追加新提交
- 幂等设计：无新提交时安全退出，不做任何修改

---

## 快速开始

### 安装（作为 Claude Code Plugin）

#### 方式一：通过 Marketplace 安装（推荐）

```bash
# 添加 marketplace
claude plugin marketplace add charlie-ai-lab/spec-dev

# 安装 plugin
claude plugin install spec-dev
```

或在 Claude Code 会话内：
```
/plugin marketplace add charlie-ai-lab/spec-dev
/plugin install spec-dev
```

#### 方式二：本地开发安装

```bash
# 直接指定 plugin 目录
cd your-project
claude --plugin-dir /path/to/spec-dev-skills
```

或在 Claude Code 会话内：
```
/plugin install /path/to/spec-dev-skills
```

#### 方式三：手动复制 Skills（旧方式）

```bash
cp -r skills/* ~/.claude/skills/
```

### 使用

安装后，在 Claude Code 会话中直接调用：

```
用户：初始化项目规格
Claude：/spec-init

用户：开始下一个功能
Claude：/spec-create

用户：执行当前规格
Claude：/spec-do

用户：审查本次变更
Claude：/spec-review

用户：完成功能交付
Claude：/spec-done
```

---

## 项目结构

```
spec-dev/
├── .claude-plugin/
│   └── plugin.json           # Claude Code Plugin manifest
├── skills/
│   ├── spec-init/
│   │   └── SKILL.md          # 项目初始化技能
│   ├── spec-create/
│   │   └── SKILL.md          # 创建功能规格技能
│   ├── spec-mvp/
│   │   └── SKILL.md          # MVP 定义与执行技能
│   ├── spec-do/
│   │   └── SKILL.md          # 执行规格技能
│   ├── spec-review/
│   │   └── SKILL.md          # 规格审查技能
│   ├── spec-done/
│   │   └── SKILL.md          # 完成交付技能
│   └── changelog/
│       ├── SKILL.md          # 更新日志技能
│       └── scripts/
│           └── changelog.py  # 日志生成脚本
├── package.json
└── README.md
```

---

## 设计理念

### 1. 规格优先（Spec First）
每个功能在编码前必须有明确的范围、计划、验收标准。规格是代码的"前序依赖"。

### 2. 用户访谈驱动（Interview-Driven）
关键决策点（init/create/mvp）在写文件前必须先询问用户 3 个结构化问题，确保规格反映真实意图。

### 3. 验证门控（Validation Gates）
规格未完成验证不算完成。自动化测试 + 手动验证 + CHANGELOG 更新，缺一不可。

### 4. 分支隔离（Branch-Per-Task）
每个任务独立分支，独立验证，独立合并。降低风险，保持主干清洁。

### 5. 可追溯性（Traceability）
所有决策必须在 `requirements.md` 中记录原因，所有任务完成状态必须与 `CHANGELOG.md` 对应。

---

## 适用场景

- **AI 辅助开发**：与 Claude Code 配合，将自然语言需求转化为结构化规格
- **团队协作**：规格文档作为开发前的"契约"，减少沟通成本
- **MVP 快速验证**：快速定义最小可行产品，聚焦核心价值
- **个人项目管理**：为自己的 side project 建立规范的开发节奏

---

## 贡献指南

欢迎贡献新的 Skills 或改进现有 Skills：

1. Fork 本仓库
2. 在 `skills/` 下创建新 Skill 目录，遵循 `SKILL.md` 格式
3. 确保 Skill 包含：名称、描述、触发条件、工作流、约束、质量门控
4. 提交 Pull Request

---

## License

[MIT](LICENSE)

---

> 本项目受吴恩达（Andrew Ng）教授在 AI 工程课程中倡导的 Spec 驱动开发方法论启发，旨在将这一理念转化为可复用的 Claude Code 工具集。
