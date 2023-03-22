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
const chatList = ref<chatItem[]>([])
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
            console.log('content:', content);
            chatList.value[chatList.value.length - 1].content = marked(content)
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
}


onMounted(() => {
    reset()
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
            <input type="text" v-model="text" placeholder="发送内容，开始跟AI对话吧～" @keydown.enter="send" maxlength="50">
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
}

.content {
    padding: 20px;
    clear: both;
    height: 450px;
    border: 2px solid orange;
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
                border: 1px solid gray;
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
    }
}

.action {
    text-align: center;
    margin-top: 20px;

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
