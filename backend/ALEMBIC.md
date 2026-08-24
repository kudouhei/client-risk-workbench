# Alembic 使用说明

本项目用 **Alembic** 管理 Postgres schema 变更。数据库连接来自 `backend/.env` 的 `DATABASE_URL`（由 `migrations/env.py` 读取），不依赖 `alembic.ini` 里的空 `sqlalchemy.url`。

## 前置条件

1. 已启动数据库：

```bash
# 仓库根目录
docker compose up -d
```

2. 已配置后端环境：

```bash
cd backend
source .venv/bin/activate   # 或使用 ./.venv/bin/python -m alembic ...
cp .env.example .env        # 首次
pip install -r requirements.txt
```

所有 Alembic 命令都在 **`backend/`** 目录下执行（该目录有 `alembic.ini`）。

## 常用命令

### 查看当前版本

```bash
alembic current
```

### 查看迁移历史

```bash
alembic history --verbose
```

### 升级到最新

```bash
alembic upgrade head
```

首次本地建表、或拉完含新 migration 的代码后执行。

### 回退一个版本

```bash
alembic downgrade -1
```

### 回退到指定 revision

```bash
alembic downgrade <revision_id>
```

### 生成新迁移（根据模型自动对比）

先改 `app/models.py`（或其他挂在 `Base.metadata` 上的模型），再执行：

```bash
alembic revision --autogenerate -m "describe_the_change"
```

生成的文件在 `migrations/versions/`。**务必人工检查** `upgrade()` / `downgrade()`，再执行 `alembic upgrade head`。

### 手写空迁移（不做 autogenerate）

```bash
alembic revision -m "describe_the_change"
```

## 推荐工作流

1. 修改 SQLAlchemy 模型（`app/models.py` 等）
2. `alembic revision --autogenerate -m "..."` 生成脚本
3. 检查并必要时手工调整 migration
4. `alembic upgrade head` 应用到本地库
5. 需要演示数据时再跑：`python -m app.seed`
6. 把 migration 文件一并提交

## 项目相关路径

| 路径 | 作用 |
|------|------|
| `alembic.ini` | Alembic 配置（`script_location = migrations`） |
| `migrations/env.py` | 从 `get_settings()` 注入 DB URL，绑定 `Base.metadata` |
| `migrations/versions/` | 各版本迁移脚本 |
| `app/models.py` | 模型定义（autogenerate 的对照源） |
| `.env` / `DATABASE_URL` | 实际数据库连接串 |

## 注意

- API 启动时**不会**再 `create_all`；表结构以 migration 为准。
- `env.py` 已开启 `compare_type=True`，列类型变化更容易被 autogenerate 检测到，但仍可能漏掉部分改动（如重命名），生成后要人工核对。
- 若本地库是以前用 `create_all` 建的、没有 `alembic_version` 表，可先：

  ```bash
  alembic stamp head
  ```

  表示「当前库已对齐最新 migration」，之后再正常 `revision` / `upgrade`。仅在确认 schema 已一致时使用。
- 生产环境优先用 `upgrade head`，不要用 `stamp` 跳过未执行的 DDL。

## 快速对照

| 场景 | 命令 |
|------|------|
| 应用全部迁移 | `alembic upgrade head` |
| 回退一步 | `alembic downgrade -1` |
| 自动生成迁移 | `alembic revision --autogenerate -m "..."` |
| 看当前版本 | `alembic current` |
| 看历史 | `alembic history --verbose` |
