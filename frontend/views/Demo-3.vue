<template>
    <h1>{{ route.meta.desc }}</h1>
    <div class="prompt-container">
        <div v-for="(item, index) in PROMPT_MAP" :key="item.key"
            :class="['prompt-item', activePromptKey === item.key ? 'active' : '']" @click="handleClickPrompt(item)">
            <n-tooltip trigger="hover" :style="{ maxWidth: '300px' }">
                <template #trigger>
                    {{ item.title }}
                </template>
                {{ item.description }}
            </n-tooltip>
            <span class="ball" :style="{ backgroundColor: getBallBG(index) }"></span>
        </div>
    </div>
    <div id="container">
        <div class="left box">
            <h2 class="text-xl">Prompt</h2>
            <p class="prompt">
                {{ prompt }}
            </p>
        </div>
        <div class="right box" ref="answerBox">
            <h2 class="text-xl">Output</h2>
            <n-spin size="large" v-show="answerLoading" />
            <p :class="['answer', globalLoading ? 'loading' : '']" v-html="answer">
            </p>
        </div>
    </div>
    <div id="action">
        <input type="text" v-model="prompt" @keydown="onKeydown" placeholder="选择一个模版开始体验吧～" />
        <n-spin :show="globalLoading" size="small">
            <button @click="go">Go</button>
        </n-spin>
        <button @click="copy" id="copy-btn">Copy</button>
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { PROMPT_MAP, PROMPT_COLOR_MAP, OPENAI_KEY, WITHOUT_OPENAI_KEY_TIPS, type promptMapItem } from '../constants'
import { useMessage,NTooltip,NSpin } from 'naive-ui'
import { nextTick, onMounted, ref } from 'vue';
import { conversation } from '../api'
import { marked } from "marked";
import hljs from "highlight.js";
const render = new marked.Renderer();
marked.setOptions({
    renderer: render, // 这是必填项
    gfm: true, // 启动类似于Github样式的Markdown语法
    pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
    sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）
    // 高亮的语法规范
    highlight: (code, lang) => hljs.highlight(code, { language: lang || 'javascript' }).value,
});

const message = useMessage()

const activePromptKey = ref<string>('')

const prompt = ref<string>('')
const answer = ref<string>('')
const originalAnswer = ref<string>('')

const answerBox = ref<HTMLElement>();

const answerLoading = ref<boolean>(false)
const globalLoading = ref<boolean>(false)

const userOpenAIKey = localStorage.getItem(OPENAI_KEY);


const handleClickPrompt = (item: promptMapItem) => {
    prompt.value = ''
    answer.value = ''
    activePromptKey.value = item.key
}

const getBallBG = (index: number) => {
    return PROMPT_COLOR_MAP[index % PROMPT_COLOR_MAP.length]
}

// 聊天记录触底
const moveToBottom = () => {
    if (answerBox.value) {
        answerBox.value.scrollTop = answerBox.value.scrollHeight;
    }
};

const go = () => {
    if (globalLoading.value || !prompt.value?.trim()) return
    if (!userOpenAIKey) {
        return message.info(WITHOUT_OPENAI_KEY_TIPS);
    }
    if (!activePromptKey.value) {
        return message.info('请先选择一个角色模版')
    }
    answer.value = ''
    originalAnswer.value = ''
    answerLoading.value = true;
    globalLoading.value = true
    conversation({ key: activePromptKey.value, prompts: prompt.value }, {
        userOpenAIKey,
        onMessage: (str: string) => {
            if (answerLoading.value) {
                answerLoading.value = false;
            }
            answer.value += str;
            moveToBottom()
        },
        onError: (msg: string) => {
            console.log("error message:", msg);
            message.error(msg || "服务异常");
        },
        onFinally: () => {
            // 记录原始答案,以便copy时保留markdown格式
            originalAnswer.value = answer.value
            const needMarkdown = PROMPT_MAP.find(v => v.key === activePromptKey.value)?.markdown
            if (needMarkdown) {
                answer.value = marked(answer.value)
            }
            nextTick(() => {
                addCopyButton();
                moveToBottom()
            });
            answerLoading.value = false;
            globalLoading.value = false
        },
    });
}

const onKeydown = (event: KeyboardEvent) => {
    // event.isComposing 判断用户是否正在输入中文
    if (event.keyCode === 13 && !event.isComposing) {
        go();
    }
};

onMounted(() => {
    addCopyButton();
});

const copy = () => {
    const copyButton = document.getElementById('copy-btn') as HTMLElement
    const el = document.createElement("textarea");
    // const textContent = document.querySelector('.answer')?.textContent ?? ''
    el.value = originalAnswer.value
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
        copyButton.textContent = "Copy";
    }, 2000);

}

// 代码块添加复制按钮
const addCopyButton = () => {
    document.querySelectorAll("pre code").forEach((block: Element) => {
        const parentNode = block.parentElement as HTMLElement;
        // 忽略已经添加复制按钮的代码块
        if (parentNode?.firstChild?.nodeName === "BUTTON") {
            return;
        }
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button";
        copyButton.textContent = "Copy";
        parentNode.insertBefore(copyButton, block);
        // 添加复制功能
        copyButton.addEventListener("click", () => {
            const code = block.textContent as string;
            const el = document.createElement("textarea");
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            copyButton.textContent = "Copied!";
            setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 2000);
        });
    });
};


const route = useRoute()
</script>
<style lang="less" scoped>
h1 {
    text-align: center;
    color: aqua;
}

.prompt-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .prompt-item {
        margin: 15px 30px;
        cursor: pointer;
        background-color: #94e1d040;
        padding: 5px 12px;
        border: 2px solid rgb(164, 166, 168);

        .ball {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 8px;
        }

        &:hover {
            box-shadow: 0 0 2px 1px #a4a6a8;
        }

        &.active {
            border-color: aqua
        }
    }
}


#container {
    display: flex;
    width: 800px;
    height: 400px;
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);

    >.box {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        text-align: center;
    }

    .left {
        color: sandybrown;
        border: 2px solid sandybrown;

        .prompt {
            padding: 6px;
        }
    }

    .right {
        border: 2px solid aqua;
        white-space: pre-line;
        overflow-y: auto;
        color: aqua;
        user-select: none;

        .answer {
            padding: 6px;

            &.loading::after {
                content: '';
                display: inline-block;
                width: 3px;
                height: 16px;
                position: relative;
                top: 2px;
                background: url('../assets/cursor.gif');
            }
        }
    }
}

#action {
    position: absolute;
    top: 740px;
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

    #copy-btn {
        margin-left: 8px;
    }
}
</style>