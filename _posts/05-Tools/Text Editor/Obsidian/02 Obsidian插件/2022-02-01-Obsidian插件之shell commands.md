---
date_created: Saturday, February 1st 2022, 10:28:40 am
date_updated: Sunday, February 2nd 2025, 12:44:57 am
title: Obsidian插件之shell commands
author: hacket
categories:
  - Tools
category: Obsidian
tags: [obsidian]
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
aliases: [Obsidian 插件之 shell commands]
linter-yaml-title-alias: Obsidian 插件之 shell commands
---

# Obsidian 插件之 shell commands

## shell commands 概念

### Environments

### `Preactions`

### Output

### Events

### variables

#### 内置变量 built-in variables

| 变量名称               | 说明                                                 |
| ------------------ | -------------------------------------------------- |
| `{{vault_path}}`   | 自动替换为当前 Obsidian Vault 仓库的根目录绝对路径                  |
| `{{file.path}}`    | 当前文件的**绝对路径**（如 `/Users/name/vault/notes/note.md`） |
| `{{file.name}}`    | 当前文件的**文件名**（如 `note.md`）                          |
| `{{file.content}}` | 当前文件的**全文内容**（需谨慎使用，内容过长可能导致命令执行失败）                |
| `{{title}}`        | 当前文件的标题（通常是文件名去掉扩展名，如 `note`）                      |
| `{{tags}}`         | 当前文件的所有标签（逗号分隔，如 `#work, #meeting`）                |

## 示例

### 将 Obsidian 文章转化为 Jekyll 格式

**实现的目标：** 将 `ObsidianVault` 下的 md 文章转换为符合 Jekyll 格式的文章

**shell commands 配置：**
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250202003828.png)

- shell 脚本：

```shell
which python3

# 检查 pyyaml 是否安装
if ! pip show pyyaml &> /dev/null; then
  echo "pyyaml 未安装，正在安装…"
  pip install pyyaml
else
  echo "pyyaml 已安装，跳过安装。"
fi

# 检查 argparse 是否安装
if ! pip show argparse &> /dev/null; then
  echo "argparse 未安装，正在安装…"
  pip install argparse
else
  echo "argparse 已安装，跳过安装。"
fi

OBSIDIAN_2_JEKYII={{vault_path}}/.obsidian/scripts/python/obsidian2jekyii.py
JEKYLL_BUILD_DIR=$HOME/Documents/build/_posts
OBSIDIAN_VAULT_DIR={{vault_path}}

echo "Script path: $OBSIDIAN_2_JEKYII"

echo "start obsidian convert to JekyII _post"

# 检查目录是否存在，如果存在则移除
if [ -d "$JEKYLL_BUILD_DIR" ]; then
  echo "Jekyll directory exists, removing: $JEKYLL_BUILD_DIR"
  rm -rf "$JEKYLL_BUILD_DIR"
fi

# 创建目录
echo "Creating Jekyll directory: $JEKYLL_BUILD_DIR"
mkdir -p "$JEKYLL_BUILD_DIR"

python3 $OBSIDIAN_2_JEKYII --obsidian-dir $OBSIDIAN_VAULT_DIR --jekyll-dir $JEKYLL_BUILD_DIR

# 打开目录
open $JEKYLL_BUILD_DIR
```

- py 脚本: 位于 `ObsidianVault/.obsidian/scripts/python/obsidian2jekyii.py`
- 配置 output，stdout 和 stderr 都是询问
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250202004027.png)
脚本执行完毕后输出的 log
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250202004214.png)

### Open the current file in vscode and jump to the current position

用 vscode 打开当前文件，并跳转到广播在文章当前位置。

```shell
code --goto {{file_path:absolute}}:{{caret_position}}
```

![ueyzf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ueyzf.png)
