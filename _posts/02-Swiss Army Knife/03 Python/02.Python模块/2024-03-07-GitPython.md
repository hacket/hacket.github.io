---
date created: Thursday, March 7th 2024, 10:13:00 am
date updated: Saturday, January 4th 2025, 7:14:30 pm
title: GitPython
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories:
  - Python
aliases: [安装]
linter-yaml-title-alias: 安装
---

<https://gitpython.readthedocs.io/en/stable/tutorial.html>#>

# 安装

```python
pip install GitPython
```

# 使用

## 包装的 git 命令

### Git repo

1. 初始化一个 repo

```python
# $ git init <path/to/dir>

from git import Repo

repo = Repo.init(path_to_dir)
```

2. 已经存在的 repo

```python
repo = Repo(path_to_dir)
```

3. 从 url clone

```python
# $ git clone <url> <local_dir>

repo_url = "https://github.com/gitpython-developers/QuickStartTutorialFiles.git"

repo = Repo.clone_from(repo_url, local_dir)
```

### stash

```python
stashed = False
if repo.is_dirty():
    repo.git.stash('save')
    stashed = True
    print(f'[pull error]{text_cyan(repo.git_dir)}, dirty, stash save, stashed={stashed}')
# ... 
if stashed:
    print(f'[pull stash]{text_cyan(get_repo_dir_name(repo))} repo dirty save stash save '
          f'in branch({text_cyan(active_branch)}), pull finished, stash_repos={stash_repos}, stashed={stashed}')
    try:
        repo.git.stash('pop')
        print(f'[pull stash]{text_cyan(repo.git_dir)} stash pop finished. stash_repos={stash_repos}, stashed={stashed}')
    except Exception as e:
        # 捕获异常
        error_string = traceback.format_exc()
        print(
            f'[pull stash]{text_cyan(repo.git_dir)} merge conflict, please merge by yourself. stash_repos={stash_repos}, stashed={stashed}, error_string={error_string}')
```

### fetch

### pull

```python
try:
    # repo.remote().pull()
    # origin = repo.remote(name='origin')
    # origin.pull()
    # 上面两种会出错
    repo.git.pull()
except Exception as e:
    print(f'[pull error]{text_red(repo.git_dir)}, {str(e.args)}')
```

#### 检测是否有冲突

```python
repo = git.Repo(r'./hello/GitDemos')
# 检测是否有冲突
# We'll use this as a flag to determine whether we found any files with conflicts
found_a_conflict = False

# This gets the dictionary discussed above 
unmerged_blobs = repo.index.unmerged_blobs()

# We're really interested in the stage each blob is associated with.
# So we'll iterate through all of the paths and the entries in each value
# list, but we won't do anything with most of the values.
for path in unmerged_blobs:
    list_of_blobs = unmerged_blobs[path]
    for (stage, blob) in list_of_blobs:
        # Now we can check each stage to see whether there were any conflicts
        if stage != 0:
            found_a_conflict = True
if found_a_conflict:
    print(
        f'[pull stash]{text_cyan(repo.git_dir)} merge conflict, please merge by yourself. unmerged_blobs={unmerged_blobs}, list_of_blobs={list_of_blobs}, stash_repos={stash_repos}, stashed={stashed}')

```

## [Submodule](https://gitpython.readthedocs.io/en/0.3.3/tutorial.html#submodule-handling)

```shell
repo = Repo('path/to/git-python/repository')
# 所有submodule
submodules = repo.submodules
# submodule的repo
repo = submodule.module() 
module_exists = submodule.module_exists()

# 就和单独的repo一样操作
```

## Using git directly 直接使用 git 命令

[GitPython Tutorial — GitPython 3.1.42 documentation](https://gitpython.readthedocs.io/en/stable/tutorial.html#using-git-directly)

```python
git = repo.git
git.checkout("HEAD", b="my_new_branch")  # create a new branch
git.branch("another-new-one")
git.branch("-D", "another-new-one")  # pass strings for full control over argument order
git.for_each_ref()  # '-' becomes '_' when calling it
```

- 直接使用 git 命令，必须是 git 已有的命令
- 多个参数通过逗号分隔开

# Ref

[GitPython Quick Start Tutorial](https://gitpython.readthedocs.io/en/stable/quickstart.html)

- [ ] [如何使用 Python 操作 Git 代码？GitPython 入门介绍](https://cloud.tencent.com/developer/article/1520592)
- [ ] <https://github.com/HanderWei/git-batch>

实现多仓库的 create/checkout/pull/push/branch 功能：

具体见：大圣助手
