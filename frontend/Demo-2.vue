<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { marked } from 'marked';
import { useMessage } from 'naive-ui'
import hljs from 'highlight.js'
import { chatApi } from './api'
import user_avatar from './assets/user_avatar.jpeg'
import ai_avatar from './assets/ai_avatar.webp'
const render = new marked.Renderer()
marked.setOptions({
    renderer: render, // 这是必填项
    gfm: true,	// 启动类似于Github样式的Markdown语法
    pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
    sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）

    // 高亮的语法规范
    highlight: (code, lang) => hljs.highlight(code, { language: lang }).value,
})
const OPENAI_CHAT_HISTORY = "OPENAI_CHAT_HISTORY"
const props = defineProps({
    userOpenAIKey: String
})
const message = useMessage()
const text = ref<string>("")
const loading = ref<boolean>(false)
interface chatItem {
    role: 'user' | 'assistant',
    content: string
}
const chatHistory = localStorage.getItem(OPENAI_CHAT_HISTORY) ? JSON.parse(localStorage.getItem(OPENAI_CHAT_HISTORY) as any) : []
const chatList = ref<chatItem[]>(chatHistory)
const contentRef = ref()
const send = () => {
    if (!props.userOpenAIKey) {
        return message.info("openai key不能为空")
    }
    if (loading.value || !text.value.trim()) return
    loading.value = true
    chatList.value.push({
        role: 'user',
        content: text.value
    })
    nextTick(moveToBottom)
    text.value = ''
    // 记录AI回复内容
    let content = ""
    chatApi(chatList.value, {
        userOpenAIKey: props.userOpenAIKey,
        onMessage: (msg: string) => {
            if (msg) {
                const newContent = content + msg
                if (!content) {
                    chatList.value.push({
                        role: 'assistant',
                        content: msg
                    })
                } else {
                    chatList.value[chatList.value.length - 1].content = newContent
                }
                content = newContent
                moveToBottom()
            }
        },
        onError: (msg: string) => {
            console.log('error message:', msg);
            message.error(msg || '服务异常')
        },
        onFinally: () => {
            loading.value = false
            // 加载完消息所有内容用 markdown渲染来高亮
            chatList.value[chatList.value.length - 1].content = marked(content)
            // 缓存对话记录到本地
            updateChatHistory(chatList.value)
            nextTick(() => {
                addCopyButton()
                moveToBottom()
            })
        }
    })
}

// 聊天记录触底
const moveToBottom = () => {
    contentRef.value.scrollTop = contentRef.value.scrollHeight
}
// 重置聊天上下文
const reset = () => {
    chatList.value = []
    updateChatHistory([])
}

// 本地持久化存储会话
const updateChatHistory = (history: chatItem[]) => {
    localStorage.setItem(OPENAI_CHAT_HISTORY, JSON.stringify(history))
}

const onKeydown = (event: KeyboardEvent) => {
    // event.isComposing 判断用户是否正在输入中文
    if (event.keyCode === 13 && !event.isComposing) {
        send()
    }
}

// 代码块添加复制按钮
const addCopyButton = () => {
    document.querySelectorAll('pre code').forEach((block: Element) => {
        const parentNode = block.parentElement as HTMLElement
        // 忽略已经添加复制按钮的代码块
        if (parentNode?.firstChild?.nodeName === "BUTTON") {
            return
        }
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        parentNode.insertBefore(copyButton, block);
        // 添加复制功能
        copyButton.addEventListener('click', () => {
            const code = block.textContent as string
            const el = document.createElement('textarea');
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
}

onMounted(() => {
    addCopyButton()
})

</script>
<template>
    <div id="container">
        <h1>AI - Chat</h1>
        <div class="content" ref="contentRef">
            <div v-for="item in chatList" :class="['item', item.role === 'assistant' ? 'item-ai' : 'item-user']">
                <img class="item-image" :src="item.role === 'user' ? user_avatar : ai_avatar" alt="">
                <div class="item-text" v-if="item.role === 'user'">
                    {{ item.content }}
                </div>
                <div class="item-text" v-else v-html="item.content">
                </div>
            </div>
        </div>
        <div class="action">
            <input type="text" v-model="text" placeholder="发送内容，开始跟AI对话吧～" @keydown="onKeydown">
            <n-spin :show="loading" size="small">
                <button @click="send">发送</button>
            </n-spin>
            <button @click="reset">重置话题</button>
        </div>
    </div>
</template>

<style lang="less" scoped>
h1 {
    text-align: center;
    color: aqua;
}

.content {
    padding-bottom: 80px;
    clear: both;
    height: 450px;
    overflow-y: auto;

    .item {
        max-width: 600px;
        padding: 10px;
        clear: both;
        display: flex;

        &-image {
            width: 30px;
            height: 30px;
            border-radius: 100%;
        }

        &-text {
            padding: 5px;
            border-radius: 4px;
        }

        &-ai {
            float: left;

            .item-text {
                border: 1px solid rgba(0, 116, 217, 0.15);
                background: rgba(0, 116, 217, 0.15);
            }

            .item-image {
                margin-right: 15px;
            }
        }

        &-user {
            float: right;
            flex-direction: row-reverse;

            .item-text {
                background: seagreen;

            }

            .item-image {
                margin-left: 15px;
            }
        }

        /deep/.copy-button {
            float: right;
            background: #5468ff;
        }
    }
}

.action {
    position: fixed;
    width: 100%;
    bottom: 40px;
    text-align: center;

    .n-spin-container {
        display: inline-block;
    }

    input {
        margin-right: 15px;
        padding: 0.6em 1.2em;
        width: 400px;
    }

    button {
        margin-right: 8px;
    }

}
</style>
