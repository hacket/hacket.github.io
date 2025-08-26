---
banner: 
date_created: Thursday, June 12th 2025, 8:32:08 am
date_updated: Sunday, June 22nd 2025, 11:28:56 pm
title: Github Copilot Chat使用技巧
author: hacket
categories:
  - AI
category: Vibe Coding
tags: [AI, Copilot, VibeCoding]
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
aliases: [Github Copilot Chat 使用技巧]
linter-yaml-title-alias: Github Copilot Chat 使用技巧
---

# Github Copilot Chat 使用技巧

## Github Copilot Chat 功能

### Copilot Chat 标签

#### `#codebase` 和 `@workspace`

`#codebase ` 是 GitHub Copilot Chat 中的一个上下文引用符号，用于让 AI 理解和分析你的整个代码库。

使用方法：

```shell
#codebase [你的问题]

# 示例
#codebase 帮我分析项目的整体架构
```

`@workspace` 和 `#codebase` 对比：

在绝大多数情况下，`#codebase` 和 `@workspace` 基本是等价的，它们的本质含义都是 "`当前编辑器打开的整个项目/代码库的全部文件和文件夹，不是编辑器打开的文件`"。—— 也就是说，就是你在 VSCode、PyCharm 等 IDE 里以 "Open Folder" 或 "Open Project" 的方式打开的整个目录。

**它们为何会有两个名字？**
- `#codebase` 属于 Copilot Chat 官方文档推荐的 VSCode 风格提示语，主打 " 当前整个代码库 "；  
- `@workspace` 是 Copilot for JetBrains (如 PyCharm/WebStorm/IntelliJ IDEA) 里的专有风格，强调 " 当前项目/工作区 "；
- 某些编辑器的 API/上下文管理机制有区别，所以 Copilot 为了适配不同编辑器的风格给了不同标签，但实质作用范围是一样的。

#### 其他标签

- `#file` - 引用特定文件
- `#selection` - 当前所选代码区域

### Customize chat responses

参考：<https://code.visualstudio.com/docs/copilot/copilot-customization>

#### Instruction files

自定义指令允许你描述通用指南或规则，以获得符合你特定编码实践和技术栈的回复。自定义指令不是在每个聊天查询中手动包含此 context，而是自动将此信息包含在每个聊天请求中。

VS Code 支持多种类型的自定义指令，针对不同的场景：`code generation`, `test generation`, `code review`, `commit message generation`, and `pull request title and description generation instructions`.

你可以通过两种方式定义自定义指令：

1. **Instruction files** **指令文件**：在 Markdown 文件中为你的工作区或 [VS Code 配置文件](https://vscode.js.cn/docs/configure/profiles) 指定代码生成指令。
2. **Settings** **设置**：在 VS Code 用户或工作区设置中指定指令。

##### 使用 instruction files

指令文件允许你在 Markdown 文件中指定自定义指令。你可以使用这些文件定义你的编码实践、首选技术和项目要求。

指令文件有两种类型：

- `.github/copilot-instructions.md`：一个指令文件，其中包含工作区的所有指令。这些指令会自动包含在每个聊天请求中。
- `.instructions.md` 文件：一个或多个包含特定任务自定义指令的 prompt 文件。你可以将单个 prompt 文件附加到聊天请求，或者将其配置为自动包含在特定文件或文件夹中。

如果你同时指定这两种指令文件，它们都会包含在聊天请求中。指令不应用特定的顺序或优先级。确保在文件中避免冲突的指令。

**注意：** 指令文件仅用于代码生成，不用于 [代码补全](https://vscode.js.cn/docs/copilot/ai-powered-suggestions)。

###### 使用 .github/copilot-instructions.md 文件

单个指令文件

- 仓库根目录 `.github/copilot-instructions.md` 创建文件，描述你的 coding practices, preferred technologies, and project requirements
- 设置的 `github.copilot.chat.codeGeneration.useInstructionFiles` 设置为 true
- 文件中添加自然语言的指令描述（指令之间的空白会被忽略，因此指令可以写成一个段落，每条指令一行，或者用空行分隔以提高可读性）

###### 使用 .instructions.md 文件

指令文件夹；可以创建一个或多个 `.instructions.md` 文件来存储特定任务的自定义指令。例如，你可以为不同的编程语言、框架或项目类型创建指令文件。

VS Code 支持两种范围的指令文件

- **工作区指令文件**：仅在工作区内可用，存储在工作区的 `.github/instructions` 文件夹中。
- **用户指令文件**：可在多个工作区中使用，存储在当前的 [VS Code 配置文件](https://vscode.js.cn/docs/configure/profiles) 中。

指令文件是带有 `.instructions.md` 文件后缀的 Markdown 文件。指令文件包含两个部分

- （可选）带元数据的头部（Front Matter 语法）；`applyTo` 指定指令自动应用于哪些文件的 glob 模式。若要始终包含自定义指令，请使用 `**` 模式。
例如，以下指令文件始终应用：

```markdown
---
applyTo: "**"
---
Add a comment at the end of the file: 'Contains AI-generated edits.'
```

- 包含指令内容的 Body
使用 Markdown 格式以自然语言指定自定义指令。你可以使用标题、列表和代码块来构建指令。
你可以使用 Markdown 链接引用其他指令文件。使用相对路径引用这些文件，并确保路径相对于指令文件位置正确。

创建指令文件

1. 从命令面板：`Chat: New Instructions File`
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250612085838548.png)

2. 选择应创建指令文件的位置
	- 用户指令文件存储在 [当前配置文件文件夹](https://vscode.js.cn/docs/configure/profiles) 中。你可以使用 [设置同步](https://vscode.js.cn/docs/configure/settings-sync) 在多个设备上同步用户指令文件。确保在**设置同步: 配置**命令中配置**提示和指令**设置。
	- 工作区指令文件默认存储在工作区的 `.github/instructions` 文件夹中。使用 [chat.instructionsFilesLocations](vscode://settings/chat.instructionsFilesLocations) 设置为工作区添加更多指令文件夹。
3. 输入指令文件的名称。
4. 使用 Markdown 格式编写自定义指令。

**使用指令文件**
- 使用指令文件作为一个 chat prompt
- 在 chat view 中，**Add Context** > **Instructions**，然后选择指定的指令
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250612090127077.png)
- 运行命令：**Chat: Attach Instructions** 选择指定的指令添加
- 配置 `applyTo` 属性，以自动将指令应用于特定文件或文件夹

##### Settings

还可以在用户或工作区设置中配置自定义指令。针对不同的场景有特定的设置。指令会自动应用于特定任务。

下表列出了每种自定义指令类型的设置。

| 指令类型        | 设置名称                                                                                                                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 代码生成        | [github.copilot.chat.codeGeneration.instructions](vscode://settings/github.copilot.chat.codeGeneration.instructions)                                                                                                                            |
| 测试生成        | [github.copilot.chat.testGeneration.instructions](vscode://settings/github.copilot.chat.testGeneration.instructions)                                                                                                                            |
| 代码审查        | [github.copilot.chat.reviewSelection.instructions](vscode://settings/github.copilot.chat.reviewSelection.instructions)                                                                                                                          |
| 提交消息生成      | [github.copilot.chat.commitMessageGeneration.instructions](vscode://settings/github.copilot.chat.commitMessageGeneration.instructions)                                                                                                          |
| 拉取请求标题和描述生成 | [](vscode://settings/github.copilot.chat.pullRequestDescriptionGeneration.instructions)[github.copilot.chat.pullRequestDescriptionGeneration.instructions](vscode://settings/github.copilot.chat.pullRequestDescriptionGeneration.instructions) |

以下代码片段展示了如何在 `settings.json` 文件中定义一组指令。若要直接在设置中定义指令，请配置 `text` 属性。若要引用外部文件，请配置 `file` 属性。

```json
"github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Always add a comment: 'Generated by Copilot'."
    },
    {
      "text": "In TypeScript always use underscore for private field names."
    },
    {
      "file": "general.instructions.md" // import instructions from file `general.instructions.md`
    },
    {
      "file": "db.instructions.md" // import instructions from file `db.instructions.md`
    }
  ],
```

##### 自定义指令示例

在适用于所有代码的 `.github/instructions/general-coding.instructions.md` 文件中定义通用编码指南

```markdown
---
applyTo: "**"
---
# Project general coding standards

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants

## Error Handling
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information

```

- 在适用于 TypeScript 和 React 代码的 `.github/instructions/typescript-react.instructions.md` 文件中定义 TypeScript 和 React 编码指南，通用编码指南会被继承

```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---
# Project coding standards for TypeScript and React

Apply the [general coding guidelines](./general-coding.intructions.md) to all code.

## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators

## React Guidelines
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling
```

##### 定义自定义指令的提示

- 保持指令简短且自包含。每条指令应是一个简单、独立的陈述。如果需要提供多条信息，请使用多条指令。
- 不要在指令中引用外部资源，例如特定的编码标准。
- 将指令拆分成多个文件。这种方法对于按主题或任务类型组织指令非常有用。
- 将指令存储在指令文件中，可以方便地与团队或跨项目共享自定义指令。你还可以对文件进行版本控制，以便跟踪随时间推移的更改。
- 使用指令文件头中的 `applyTo` 属性，自动将指令应用于特定文件或文件夹。
- 在你的 prompt 文件中引用自定义指令，以保持你的 prompt 清晰和专注，并避免为不同任务重复指令。

##### 测试指令是否设置对了

```
// 在 Copilot Chat 中询问：
@workspace 你知道这个项目的编码规范吗？
```

#### Prompt files

<https://vscode.js.cn/docs/copilot/copilot-customization#_prompt-files-experimental>

##### 测试 prompts files 设置对了

```
@workspace 列出所有可用的 prompts
```

### Copilot MCP
