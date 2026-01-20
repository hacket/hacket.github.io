---
banner:
date_created: Sunday, August 10th 2025, 12:04:33 am
date_updated: Tuesday, December 23rd 2025, 12:10:16 am
title: Prompt Engineering
author: hacket
categories:
  - AI
category: Prompt
tags: [AI, Prompt]
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
aliases: [Prompt Engineering]
linter-yaml-title-alias: Prompt Engineering
---

# Prompt Engineering

## 提示词优化

### promptpilot

 <https://promptpilot.volcengine.com/>

### lyra 提示词

lyra 提示词：优化提示词的提示词，Reddit 爆火的 AI 对话革命

Ref:

- [用于优化提示词的提示词](https://gorden-sun.notion.site/225594247325806f9bacfdaf42a8bb0d)
- [After 147 failed ChatGPT prompts, I had a breakdown and accidentally discovered something : r/ChatGPT](https://www.reddit.com/r/ChatGPT/comments/1lnfcnt/after_147_failed_chatgpt_prompts_i_had_a/)
- <https://gist.github.com/xthezealot/c873effd9e74225ef3fcfbb9c3a341da>

**Professor-Synapse（lyra 改进）：**
Still pretty wordy, but on the right track with the delimiter use and markdown. Why not evolve more into a framework style prompt.Try the good professor (this is optimized for ChatGPT use)
- [After 147 failed ChatGPT prompts, I had a breakdown and accidentally discovered something : r/ChatGPT](https://www.reddit.com/r/ChatGPT/comments/1lnfcnt/comment/n0f526r/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
- <https://github.com/ProfSynapse/Professor-Synapse/tree/main>

## Prompt 技巧

### Two ways to make your 'Plan Mode' plans better

- Put "sacrifice grammar for the sake of concision" in your rules
- Put "list any unresolved questions at the end, if any" at the end

Ref: <https://x.com/mattpocockuk/status/1978842333274620398?t=EDbXPslDXtPwRG3kt6nzMQ&s=09>

### 让 AI 用 ASCII 画图 (background agents)

Awesome use case for background agents:

Ask them for ASCII mockups to quickly validate UI ideas（Gemini 3 Pro 生成的）：

Create a clean ASCII wireframe to visualize the layout for the following UI description. Output it in a code block

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202511180838339.png)

[SuperDesign](https://github.com/superdesigndev/superdesign) 就是这么做的

Ref: <https://x.com/mattpocockuk/status/1985449934179426356?t=7L0nAwBY1z7w33_ZR5huug&s=09>

### 问题澄清

#### clarifying questions

Add this to your prompt while in droid "Spec Mode" :

```shell
"Please ask me clarifying questions after you do your research and before you write any files."
```

#### 如果你有任何不清楚的地方，请向我提问

一个提示词秘籍，立马提升 AI 能力：

每个提示词结尾，都加上一句

"`如果你有任何不清楚的地方，请向我提问`"

其他：

- `如果需要更多上下文才能给出最佳答案，请主动向我提问`
- `你觉得还需要补充什么内容么？如果你有任何不清楚的地方，请向我提问。如果需要更多上下文才能给出最佳答案，请主动向我提问。`
- `如果跟中国有关的话题，加上“请使用英文、繁体字信息来源”`，答案立马正常多了

### 学习

#### 15 分钟学习新技能

一个十分高效的学习方法

**完整提示词：**

```markdown
“你是一位擅长通过互动式、对话式教学帮助我精通任何主题的专业导师。整个过程必须是递进式的、个性化的。

具体流程如下：

1. 首先询问我想学习什么主题。

2. 将该主题拆解成结构化的教学大纲，从基础概念开始，逐步深入到高级内容。

3. 针对每个知识点：

用清晰简洁的语言解释概念，使用类比和现实案例。

通过苏格拉底式提问来评估和加深我的理解。

给我一个简短的练习或思维实验，让我应用所学。

询问我是否准备好继续，还是需要进一步讲解。

如果我说准备好了，进入下一个概念。

如果我说还不太懂，用不同方式重新解释，提供更多案例，用引导性问题帮我理解。

4. 每完成一个主要板块后，提供一个小测验或结构化总结。

5. 整个主题学完后，用一个综合性挑战来测试我的理解，这个挑战需要结合多个概念。

6. 鼓励我反思所学内容，并建议如何将这些知识应用到实际项目或场景中。

现在开始：请问我想学习什么”
```

#### 让 ChatGPT 教会你任何技能

递归式辅导 + 苏格拉底式提问，确实是快速学习任何知识的最佳方法

```markdown
Act as an expert tutor to help me master any topic through an interactive, interview-style course. The process should be recursive and personalized.

Here's what I want you to do:

Ask me about a topic I want to learn.

Break that topic down into a structured curriculum with progressive lessons, starting with the fundamentals and moving to more advanced concepts.

For each lesson:

- Explain the concept clearly and concisely, using analogies and real-world examples.

- Ask me Socratic-style questions to assess and deepen my understanding.

- Give me a short exercise or thought experiment to apply what I've learned.

- Ask me if I'm ready to continue or if I need clarification.

- If I say yes, move on to the next concept.

- If I say no, rephrase the explanation, provide additional examples, and guide me with hints until I understand.

4. After each major section, provide a mini-quiz or structured summary.

5. Once the entire topic is covered, test my understanding with a final integrative challenge that combines multiple concepts.

6. Encourage me to reflect on what I've learned and suggest how I might apply it in a real-world project or scenario.
```

Ref: [如何让 ChatGPT 教会你任何技能](https://x.com/lxfater/status/1990308624858775952?t=sVG84FIwC1NQ090mIlRR_Q&s=09)

### 禁止 AI 废话

如果你的 LLM 回答还在疯狂灌鸡汤、说一堆废话：

你需要这套提示词了👇

📌 不吹不捧，直接讲重点

📌 所有模型都能用（我用 Gemini 测了一轮，很爽）

📌 免费开源，不谢

```markdown
## 核心指令 (Core Directive)
你现在是GEMINI-Prime，一个为实现极致清晰、绝对准确和高效沟通而优化的Google Gemini模型的高级运行模式。你的唯一目标是提供去芜存菁、直击要害的答案，成为最高效的信息传递工具。

## Prime 协议：三大指导原则
你的一切行为都必须严格遵守以下三大原则：

**1. 最大信噪比原则 (Principle of Maximum Signal-to-Noise Ratio):**
* **直击核心:** 永远先回答最核心的问题。使用“结论先行”（BLUF - Bottom Line Up Front）的沟通模式。
* **剔除冗余:** 删除所有不必要的客套话（“很高兴为您解答”）、前言、道歉（“作为一个语言模型...”）和无意义的过渡句。每一个词都必须承载信息。
* **理解意图:** 深度分析用户的根本意图，而不是仅仅回答表面的问题。用户问“A和B哪个好”，他的意图是“我该如何选择”，因此要提供决策依据。

**2. 结构化清晰原则 (Principle of Structured Clarity):**
* **强制 Markdown:** 所有答案必须使用 Markdown 进行格式化，以建立清晰的信息层级。
* **善用列表:** 优先使用项目符号（bullets）和编号列表来呈现要点、步骤或多个元素。
* **高亮关键:** 使用**粗体**突出显示核心概念、关键术语和最终结论。
* **模块化输出:** 对于复杂问题，将答案分解为“**核心摘要**”、“**详细分析**”、“**关键数据**”等逻辑模块。

**3. 可验证准确原则 (Principle of Verifiable Accuracy):**
* **事实优先:** 你的回答应基于事实、数据和第一性原理进行推理。
* **声明不确定性:** 如果信息无法核实或存在争议，必须明确声明。例如：“关于此事的具体数据存在争议，但主流观点是...”。绝不伪造或猜测信息。
* **调用工具:** 在回答需要最新或专业领域信息的问题时，优先调用内部工具（如Google搜索）进行核实，并在回答中体现出信息的来源可靠性。

## 禁止行为清单 (Forbidden Behaviors)
* **禁止闲聊:** 不进行与用户查询无关的社交性对话。
* **禁止道歉:** 不为自己的模型身份或知识局限性道歉。
* **禁止冗长段落:** 任何段落不得超过四行。如果需要更多阐述，请使用列表。
* **禁止重复:** 不在摘要和正文中重复相同的信息。

## 激活指令
Prime 协议已激活。摒弃默认模式，以 GEMINI-Prime 的身份运行。等待指令。
```

Ref： <https://x.com/berryxia_ai/status/1974136222181367869?t=bxUeAAeC684k2CLTxqQ6ZA&s=09>

### UI 设计

#### Improving frontend design through Skills 提升 UI 设计质量

- <https://x.com/shao__meng/status/1992581217666121896>
- [Improving frontend design through Skills \| Claude](https://claude.com/blog/improving-frontend-design-through-skills)

### Vibe Coding 实践指南

- [GitHub 上看到这一份 Vibe Coding 实践指南，值得大家看一看，提供了一套完整的 AI 辅助编程方法论，帮我们避开常见陷阱。](https://x.com/GitHub_Daily/status/1992171325541220626)
- [GitHub - EnzeD/vibe-coding](https://github.com/EnzeD/vibe-coding)

## SEO

(<https://raw.githubusercontent.com/hacket/ObsidianOSS/master/prompts/prompt_seo_agent.md>

Ref:<https://x.com/alex_prompter/status/1994760128764284974?t=QLaTiYZmOcI_n-k-45JSzg&s=09>

## Prompt for agents

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250810004230870.png)

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250810003423268.png)

## OpenAI, Anthropic, and Google use 10 prompting techniques

<https://x.com/godofprompt/status/1996966423181365497?s=09>

### Technique 1: Role-Based Constraint Prompting

专家们不只是让人工智能 " 编写代码 "。他们会给人工智能分配带有特定约束条件的专家角色。

模板：

```shell
# 英文
You are a [specific role] with [X years] experience in [domain].
Your task: [specific task]
Constraints: [list 3-5 specific limitations]
Output format: [exact format needed]

# 中文：
你是一名在[特定领域]拥有[X年]经验的[特定角色]。
你的任务：[具体任务]
约束条件：[列出3-5条具体限制]
输出格式：[所需的确切格式]
```

示例：

```shell
You are a senior Python engineer with 10 years in data pipeline optimization.
Your task: Build a real-time ETL pipeline for 10M records/hour
Constraints:
- Must use Apache Kafka
- Maximum 2GB memory footprint
- Sub-100ms latency
- Zero data loss tolerance
Output format: Production-ready code with inline documentation
```

这能让你得到的输出比 " 给我写一个 ETL 管道 " 具体 10 倍。

### Technique 2: Chain-of-Verification (CoVe) 验证链

谷歌的研究团队利用这一方法来消除幻觉现象。该模型先生成一个答案，然后生成验证问题，对这些问题进行解答，再优化最初的回应。

**Template:**

```shell
Task: [your question]

Step 1: Provide your initial answer
Step 2: Generate 5 verification questions that would expose errors in your answer
Step 3: Answer each verification question
Step 4: Provide your final, corrected answer based on verification
```

**Example:**

```shell
Task: Explain how transformers handle long-context windows

Step 1: Provide your initial answer
Step 2: Generate 5 verification questions that would expose errors in your answer
Step 3: Answer each verification question
Step 4: Provide your final, corrected answer based on verification
```

在复杂的技术查询上，准确率从 60% 跃升至 92%。

![](https://pbs.twimg.com/media/G7amdWGb0AAKtCP?format=jpg&name=medium)

### Technique 3: Few-Shot with Negative Examples 带有负面示例的少样本学习

Anthropic 发现，向模型展示不应该做什么，其效果与展示应该做什么同样显著。

**Template:**

```shell
I need you to [task]. Here are examples:

✅ GOOD Example 1: [example]
✅ GOOD Example 2: [example]

❌ BAD Example 1: [example]
Why it's bad: [reason]
❌ BAD Example 2: [example]
Why it's bad: [reason]

Now complete: [your actual task]
```

**Example:**

```shell
I need you to write cold email subject lines. Here are examples:

✅ GOOD: "Quick question about your Q4 engineering roadmap"
✅ GOOD: "Saw your post on distributed systems—thoughts on this?"

❌ BAD: "URGENT: Limited Time Offer Inside!!!"
Why it's bad: Spam trigger words, fake urgency
❌ BAD: "You won't believe what we built..."
Why it's bad: Clickbait, no context

Now write 5 subject lines for: SaaS tool that reduces cloud costs by 40%
```

这消除了 80% 的通用人工智能回复。

![](https://pbs.twimg.com/media/G7ameSDacAAC2RK?format=jpg&name=900x900)

### Technique 4: Structured Thinking Protocol 结构化思维协议

OpenAI 的 GPT-5 团队将此用于复杂的推理任务。迫使模型在回应之前进行分层思考。

**Template:**

```shell
Before answering, complete these steps:

[UNDERSTAND]
- Restate the problem in your own words
- Identify what's actually being asked

[ANALYZE]
- Break down into sub-components
- Note any assumptions or constraints

[STRATEGIZE]
- Outline 2-3 potential approaches
- Evaluate trade-offs

[EXECUTE]
- Provide your final answer
- Explain your reasoning

Question: [your question]
```

**Example:**

```shell
Before answering, complete these steps:

[UNDERSTAND]
- Restate the problem in your own words
- Identify what's actually being asked

[ANALYZE]
- Break down into sub-components
- Note any assumptions or constraints

[STRATEGIZE]
- Outline 2-3 potential approaches
- Evaluate trade-offs

[EXECUTE]
- Provide your final answer
- Explain your reasoning

Question: Should I use microservices or monolith for a 5-person startup building a B2B SaaS with 1000 expected users in year one?
```

给出的答案会考虑上下文，而非机械重复最佳实践。

### Technique 5: Confidence-Weighted Prompting 置信度加权提示法

谷歌深度思维（Google DeepMind）将此用于高风险决策。让模型对其置信度进行评分，并提供替代答案。

**Template:**

```shell
Answer this question: [question]

For your answer, provide:
1. Your primary answer
2. Confidence level (0-100%)
3. Key assumptions you're making
4. What would change your answer
5. Alternative answer if you're <80% confident
```

**Example:**

```shell
Answer this question: Will Rust replace C++ in systems programming by 2030?

For your answer, provide:
1. Your primary answer
2. Confidence level (0-100%)
3. Key assumptions you're making
4. What would change your answer
5. Alternative answer if you're <80% confident
```

防止你基于人工智能毫无根据的自信做出决策。

![](https://pbs.twimg.com/media/G7amjXNb0AMzYsA?format=jpg&name=large)

### Technique 6: Context Injection with Boundaries 带边界的上下文注入

Anthropic 的工程师们注入大量上下文，但会明确界定重要内容的边界。

**Template:**

```shell
[CONTEXT]
[paste your documentation, code, research paper]

[FOCUS]
Only use information from CONTEXT to answer. If the answer isn't in CONTEXT, say "Insufficient information in provided context."

[TASK]
[your specific question]

[CONSTRAINTS]
- Cite specific sections when referencing CONTEXT
- Do not use general knowledge outside CONTEXT
- If multiple interpretations exist, list all
```

**Example:**

```shell
[CONTEXT]
[paste your company's 50-page API documentation]

[FOCUS]
Only use information from CONTEXT to answer. If the answer isn't in CONTEXT, say "Insufficient information in provided context."

[TASK]
How do I implement rate limiting with retry logic for the /users endpoint?

[CONSTRAINTS]
- Cite specific sections when referencing CONTEXT
- Do not use general knowledge outside CONTEXT
- If multiple interpretations exist, list all
```

在处理专有系统时消除幻觉。

### Technique 7: Iterative Refinement Loop 迭代优化循环

OpenAI 的研究团队将提示词串联起来，通过多轮处理来优化输出结果。

**Template:**

```shell
[ITERATION 1]
Create a [draft/outline/initial version] of [task]

[ITERATION 2]
Review the above output. Identify 3 weaknesses or gaps.

[ITERATION 3]
Rewrite the output addressing all identified weaknesses.

[ITERATION 4]
Final review: Is this production-ready? If not, what's missing?
```

**Example:**

```shell
[ITERATION 1]
Create a draft sales email for reaching out to engineering VPs at Series B startups about our CI/CD optimization tool

[ITERATION 2]
Review the above output. Identify 3 weaknesses or gaps.

[ITERATION 3]
Rewrite the output addressing all identified weaknesses.

[ITERATION 4]
Final review: Is this production-ready? If not, what's missing?
```

单次输出的结果总是很糟糕。这种方法能让你达到 90% 的质量。

### Technique 8: Constraint-First Prompting 约束优先提示法

谷歌大脑的研究人员在实际任务开始前会先设定约束条件。

**Template:**

```shell
HARD CONSTRAINTS (cannot be violated):
- [constraint 1]
- [constraint 2]
- [constraint 3]

SOFT PREFERENCES (optimize for these):
- [preference 1]
- [preference 2]

TASK: [your actual request]

Confirm you understand all constraints before proceeding.
```

**Example:**

```shell
HARD CONSTRAINTS (cannot be violated):
- Must be written in Rust
- Cannot use any external dependencies
- Must compile on stable Rust 1.75+
- Maximum binary size: 5MB

SOFT PREFERENCES (optimize for these):
- Fast compilation time
- Minimal memory allocation

TASK: Write a CLI tool that parses 10GB CSV files and outputs JSON with schema validation

Confirm you understand all constraints before proceeding.
```

防止人工智能给出技术上正确但实际上毫无用处的答案。

### Technique 9: Multi-Perspective Prompting 多视角提示法

Anthropic 的 Constitutional AI 运用多种视角来减少偏见并改进推理。

**Template:**

```shell
Analyze [topic/problem] from these perspectives:

[PERSPECTIVE 1: Technical Feasibility]
[specific lens]

[PERSPECTIVE 2: Business Impact]
[specific lens]

[PERSPECTIVE 3: User Experience]
[specific lens]

[PERSPECTIVE 4: Risk/Security]
[specific lens]

SYNTHESIS:
Integrate all perspectives into a final recommendation with trade-offs clearly stated.
```

**Example:**

```shell
Analyze whether we should migrate from Postgres to DynamoDB from these perspectives:

[PERSPECTIVE 1: Technical Feasibility]
Engineering complexity, timeline, data migration risks

[PERSPECTIVE 2: Business Impact]
Cost implications, team velocity, vendor lock-in

[PERSPECTIVE 3: User Experience]
Latency changes, feature implications, downtime requirements

[PERSPECTIVE 4: Risk/Security]
Data consistency guarantees, backup procedures, compliance

SYNTHESIS:
Integrate all perspectives into a final recommendation with trade-offs clearly stated.
```

为你提供的是战略性思考，而非表面层次的建议。

### Technique 10: Meta-Prompting (The Nuclear Option) 元提示（核选项）

这就是 OpenAI 的红队用来攻破他们自己的模型并找出边缘案例的方法。 你让人工智能为自己生成完美的提示词。

**Template:**

```shell
I need to accomplish: [high-level goal]

Your task:
1. Analyze what would make the PERFECT prompt for this goal
2. Consider: specificity, context, constraints, output format, examples needed
3. Write that perfect prompt
4. Then execute it and provide the output

[GOAL]: [your actual objective]
```

**Example:**

```shell
I need to accomplish: Build a Python script that scrapes Twitter threads, converts them to blog posts with proper formatting, and auto-generates SEO meta descriptions

Your task:
1. Analyze what would make the PERFECT prompt for this goal
2. Consider: specificity, context, constraints, output format, examples needed
3. Write that perfect prompt
4. Then execute it and provide the output

[GOAL]: Twitter thread to blog post converter with SEO optimization
```

人工智能能写出比你好得多的提示词，然后执行它。这就像有一位提示词工程师实时为你工作一样。

## Prompt 工具

### PromptHub

<https://github.com/legeling/PromptHub>

⚠️ macOS 首次启动

如果提示 " 无法打开 " 或 " 已损坏 "，请在终端执行：

```shell
sudo xattr -rd com.apple.quarantine /Applications/PromptHub.app
```
