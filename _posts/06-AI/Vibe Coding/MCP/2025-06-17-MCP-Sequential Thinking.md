---
banner: 
date_created: Tuesday, June 17th 2025, 12:13:51 am
date_updated: Tuesday, June 24th 2025, 12:13:23 am
title: MCP-Sequential Thinking
author: hacket
categories:
  - AI
category: MCP
tags: [AI, MCP, VibeCoding]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
aliases: [Sequential Thinking]
linter-yaml-title-alias: Sequential Thinking
---

# Sequential Thinking

**结构化思维助手**

<https://github.com/arben-adm/mcp-sequential-thinking>

## Sequential Thinking 结构化思维助手

<https://github.com/arben-adm/mcp-sequential-thinking>

`Sequential Thinking` 是结构化思考工具 MCP。通过定义阶段促进结构化、渐进式思考的模型上下文协议（MCP）服务器。此工具有助于将复杂问题分解为连续的思考，跟踪您思考过程的进展，并生成摘要。

主要 Features：

- **分步式问题解决：** 将复杂问题拆解成可管理的子步骤。
- **动态思考演进：** 支持在理解深入时回溯、修改和完善思考路径。
- **探索分支思路：** 允许创建并探索不同的解决方案分支。
- **弹性规划：** 动态调整解题所需的思考步骤总数。
- **方案验证：** 辅助生成并验证潜在的解决方案。

### 安装

需要 Python 环境，clone 仓库代码后使用 uv 安装依赖：

```shell
# uv安装 https://docs.astral.sh/uv/getting-started/installation/
## Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
## Mac
curl -LsSf https://astral.sh/uv/install.sh | sh
## 测试
uv --help 

git clone https://github.com/arben-adm/mcp-sequential-thinking.git

# 创建并激活虚拟环境  
## Windows
uv venv .venv --python 3.12
.venv\Scripts\activate
## Unix
source .venv/bin/activate

# 安装依赖项  
## 安装 portalocker，解决ModuleNotFoundError: No module named 'portalocker'
uv pip install portalocker
uv pip install -e .
## 实际使用发现启动回报错缺少依赖，需要安装：  
uv pip install portalocker
```

**配置 MCP：**

```json
"sequential-thinking": {
  "command": "uv",
  "args": [
    "--directory",
    "/Users/xxx/Repositories/github.com/mcp-sequential-thinking",
    "run",
    "run_server.py"
  ]
}
```

测试：

```shell
uv --directory D:\AI\MCP\mcp-sequential-thinking run run_server.py
```

报错：

```
uv --directory D:\AI\MCP\mcp-sequential-thinking run run_server.py
No pyvenv.cfg file
```

原因：这个错误表明 `uv` 找不到虚拟环境的配置文件 `pyvenv.cfg`，说明虚拟环境可能没有正确创建或路径有问题。

解决：

```shell
# 定位到D:\AI\MCP\mcp-sequential-thinking目录
# 删除旧环境
rm -r .venv

# 激活uv虚拟环境
.venv\Scripts\activate

# 使用 `uv venv` 重新创建
uv venv .venv --python 3.12  # 指定你的Python版本
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250623002518704.png)

再次运行命令：

```shell
uv --directory D:\AI\MCP\mcp-sequential-thinking run run_server.py
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250623003201691.png)

Cursor 配置成功：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250623003334810.png)

### 使用

详细的使用方式，可以参考官方仓库说明：`https://github.com/arben-adm/mcp-sequential-thinking?tab=readme-ov-file#1-process_thought`。

- **交互时调用：** 在单次 Cursor 请求中，指令其通过  `sequential-thinking`  进行结构化思考 (`use sequential-thinking`  或类似指令)。
- **集成到 Cursor Rules (推荐)：** 将其定义为一个规则（Rule），让 Cursor 在特定类型任务中自动应用此思维方式。
- **核心工具指令：**
	- `process_thought`: 开始进行结构化的分步思考。
	- `generate_summary`: 获取当前思考链的阶段性摘要。
	- `clear_history`: 清除当前会话的历史思考内容，重置状态。

**SequentialThinking 适用：** 只要一个任务有 Workflow，我们都可以让 SequentialThinking 来分步拆解、规划、执行！
SequentialThinking MCP 的最大价值在于：支持复杂问题的分步拆解、动态调整、分支推演和多方协作，适用于任何需要系统性思考、流程优化和创新探索的领域。其分支与反思机制，尤其适合面对不确定性高、路径多变、协作复杂的实际场景。

### 示例

```
用sequential-thinking来深入思考一下，SequentialThinking这个mcp可以用于什么实际场景当中，要求：- 使用sequential-thinking来规划所有的步骤，思考和分支- 可以使用brave Search进行搜索，每一轮Thinking之前都先搜索验证- 可以用fetch工具来查看搜索到的网页详情- 思考轮数不低于5轮，且需要有发散脑暴意识，需要有思考分支- 每一轮需要根据查询的信息结果，反思自己的决策是否正确- 返回至少10个高价值的使用场景，并详细说明为什么价值高，如何用
```
