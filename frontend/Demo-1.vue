<script setup lang="ts">
import { computed, ref } from 'vue';
import { generateImage, conversation } from './api'
import { useMessage } from 'naive-ui'

const props = defineProps({
    userOpenAIKey: String
})

const message = useMessage()
const imgSrc = ref<string>("")
const text = ref<string>("")
const answer = ref<string>("")
const answerBox = ref<HTMLElement>()
const imageLoading = ref<boolean>(false)
const answerLoading = ref<boolean>(false)
const globalLoading = computed(() => {
    return imageLoading.value || answerLoading.value
})
const go = () => {
    if (globalLoading.value || !text.value) return
    if (!props.userOpenAIKey) {
        return message.info("openai key不能为空")
    }
    reset()
    getImage()
    analyse()
}

const reset = () => {
    answer.value = ""
    imgSrc.value = ""
}

const getImage = async () => {
    imageLoading.value = true
    const data = await generateImage(text.value, {
        userOpenAIKey: props.userOpenAIKey,
    })
    if (!data?.data) {
        imageLoading.value = false
        return message.error(data.message)
    }
    const url = data?.data[0]?.url
    imgSrc.value = url
    imageLoading.value = false
}

const analyse = () => {
    answerLoading.value = true
    conversation(text.value, {
        userOpenAIKey: props.userOpenAIKey,
        onMessage: (str: string) => {
            if (answerLoading.value) {
                answerLoading.value = false
            }
            answer.value += str
            if (answerBox.value) {
                answerBox.value.scrollTop = answerBox.value.scrollHeight
            }
        },
        onError: (msg: string) => {
            console.log('error message:', msg);
            message.error(msg || '服务异常')
        },
        onFinally: () => {
            answerLoading.value = false
        }
    })
}
</script>

<template>
    <div id="container">
        <div class="left box">
            <h2 class="text-xl">图片</h2>
            <n-spin size="large" v-show="imageLoading" />
            <img v-if="imgSrc" :src="imgSrc" alt="pic">
        </div>
        <div class="right box" ref="answerBox">
            <h2 class="text-xl">解析</h2>
            <n-spin size="large" v-show="answerLoading" />
            <p class="answer">
                {{ answer.trim() }}
            </p>
        </div>
    </div>
    <div id="action">
        <input type="text" name="" id="" v-model="text" @keydown.enter="go" placeholder="试着说句英语吧 例如: three cats">
        <n-spin :show="globalLoading" size="small">
            <button @click="go">Go</button>
        </n-spin>
    </div>
</template>

<style scoped lang="less">
#container {
    display: flex;
    width: 800px;
    height: 400px;
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);

    >.box {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        text-align: center;
    }

    .left {
        border: 2px solid sandybrown;
    }

    .right {
        border: 2px solid skyblue;
        white-space: pre-line;
        overflow-y: auto;
        color: aqua;
        user-select: none;

        .answer {
            padding: 6px;
        }
    }

}

#action {
    position: absolute;
    top: 540px;
    left: 50%;
    transform: translateX(-50%);

    input {
        margin-right: 15px;
        padding: 0.6em 1.2em;
        width: 400px;
    }

    .n-spin-container {
        display: inline-block;
    }
}
</style>
