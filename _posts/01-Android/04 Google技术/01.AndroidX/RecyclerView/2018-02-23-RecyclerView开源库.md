---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Friday, February 7th 2025, 10:00:08 am
title: RecyclerView开源库
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, Google, RecyclerView]
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [RecyclerView 开源库]
linter-yaml-title-alias: RecyclerView 开源库
---

# RecyclerView 开源库

## Adapter 库

### BRAV

### AdapterDelegates

- [GitHub - sockeqwe/AdapterDelegates: "Favor composition over inheritance" for RecyclerView Adapters](https://github.com/sockeqwe/AdapterDelegates)

#### AdapterDelegatesManager

AdapterDelegate 管家，通过 `addDelegate()` 方法注册 AdapterDelegate；在 `AbsDelegationAdapter` 中维护了 `AdapterDelegatesManager` 实例，在对应的方法 `getItemViewType()`、`onCreateViewHolder()`、` onBindViewHolder()` 调用 AdapterDelegatesManager 中的方法。

可以在 AdapterDelegatesManager 添加一些通用逻辑，如调试信息，如：
```kotlin
class DebugAdapterDelegatesManager<T> : AdapterDelegatesManager<T>() {  
    companion object {  
        const val TAG = "DebugAdapterDelegatesManager"  
    }  
    @SuppressLint("AndroidToastJavaKotlin")  
    override fun onBindViewHolder(  
        items: T & Any,  
        position: Int,  
        viewHolder: RecyclerView.ViewHolder,  
        payloads: MutableList<Any?>?  
    ) {  
        super.onBindViewHolder(items, position, viewHolder, payloads)  
        val delegate = this.getDelegateForViewType(viewHolder.itemViewType)  
        val context = viewHolder.itemView.context  
        val log = "position=$position\n" +  
                "delegate=${delegate?.javaClass?.simpleName}\n" +  
                "context=${context.javaClass.simpleName}\n" +  
                "itemView=${viewHolder.itemView.javaClass.simpleName}\n" +  
                "viewHolder=${viewHolder.javaClass.simpleName}\n" +  
                "payloads=$payloads\n" +  
                "items.size=${(items as? ArrayList<*>)?.size}\n"  
        Logger.i(  
            TAG,  
            "${this.javaClass.simpleName}#onBindViewHolder onLongClick $log\nitems=$items"  
        )  
        viewHolder.itemView.setOnLongClickListener {  
            val builder = AlertDialog.Builder(context)  
            builder.setTitle("Adapter调试信息")  
            builder.setMessage(log)  
  
            builder.setPositiveButton("确定") { dialog, _ ->  
                val clipboardManager =  
                    context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager  
                val clipData = ClipData.newPlainText("label", "$log\n$items")  
                clipboardManager.setPrimaryClip(clipData)  
                Toast.makeText(context, "已复制到剪贴板", Toast.LENGTH_SHORT).show()  
                dialog.dismiss()  
            }  
            builder.setNegativeButton("取消") { dialog, _ ->  
                dialog.dismiss()  
            }  
            val dialog = builder.create()  
            dialog.show()  
            false  
        }  
    }  
}
```