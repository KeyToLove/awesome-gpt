<script lang="ts" setup>import { nextTick, onMounted, ref } from 'vue';
import { NSpin } from 'naive-ui'
import { chatApi } from './api'
import user_avatar from './assets/user_avatar.jpeg'
import ai_avatar from './assets/ai_avatar.webp'
const text = ref<string>("")
const loading = ref<boolean>(false)
interface chatItem {
    type: 'User' | 'Ai',
    content: string
}
const chatList = ref<chatItem[]>([])
const contentRef = ref()
const send = () => {
    if (loading.value || !text.value.trim()) return
    loading.value = true
    chatList.value.push({
        type: 'User',
        content: text.value
    })
    nextTick(moveToBottom)
    // 拼接对话上下文
    const prompt = getChatHistory() + `\n提问:` + text.value + `\nAI:`
    text.value = ''
    // 记录AI回复内容
    let content = ""
    chatApi(prompt, msg => {
        console.log(msg);
        if (msg) {
            if (!content) {
                chatList.value.push({
                    type: 'Ai',
                    content: msg
                })
            } else {
                chatList.value[chatList.value.length - 1].content = content
            }
            content += msg
            moveToBottom()
        }
    }, () => {
        window.localStorage.setItem('AI_CHAT', JSON.stringify({
            data: prompt + content
        }))
        loading.value = false
    })
}

// 聊天记录触底
const moveToBottom = () => {
    contentRef.value.scrollTop = contentRef.value.scrollHeight
}
// 重置聊天上下文
const reset = () => {
    window.localStorage.setItem("AI_CHAT", JSON.stringify({
        data: ""
    }))
    chatList.value = []
}

const getChatHistory = () => {
    const temp = window.localStorage.getItem('AI_CHAT')
    return temp ? JSON.parse(temp)?.data : ""
}

onMounted(() => {
    reset()
})
</script>
<template>
    <div id="container">
        <h1>AI - Chat</h1>
        <div class="content" ref="contentRef">
            <div v-for="item in chatList" :class="['item', item.type === 'Ai' ? 'item-ai' : 'item-user']">
                <img class="item-image" :src="item.type === 'User' ? user_avatar : ai_avatar" alt="">
                <div class="item-text">
                    {{ item.content }}
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
                background: gray;
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
