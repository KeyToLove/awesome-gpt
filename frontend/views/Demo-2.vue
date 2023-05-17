<template>
  <div id="container">
    <h1>{{ route.meta.desc }}</h1>
    <div class="flex">
      <ul class="history">
        <n-tooltip placement="right" trigger="hover" v-for="item in  reverseChatHistory" :key="item.uid"
          :style="{ maxWidth: '400px' }">
          <template #trigger>
            <li @click="handleClickHistoryItem(item)" :class="activeChatItemUid === item.uid ? 'active' : ''">
              {{ item.detail?.[0]?.content ?? '新话题' }}
              <img v-if="activeChatItemUid === item.uid" @click.stop="handleDeleteHistoryItem(item)" :src="deleteIcon"
                title="删除会话" />
            </li>
          </template>
          <span class="history-tooltip"> {{ item.detail?.[0]?.content ?? '新话题' }} </span>
        </n-tooltip>
      </ul>
      <div class="content" ref="contentRef">
        <div v-for="( item, index ) in  activeChatItem.detail "
          :class="['item', item.role === 'assistant' ? 'item-ai' : 'item-user']" :key="index">
          <img class="item-image" :src="item.role === 'user' ? user_avatar : ai_avatar" alt="" />
          <div class="item-text" v-if="item.role === 'user'">
            {{ item.content }}
          </div>
          <div :class="['item-text', { loading: loading && (index === activeChatItem.detail.length - 1) }]" v-else
            v-html="item.content">
          </div>
        </div>
      </div>
    </div>
    <div class="action">
      <input type="text" v-model="text" placeholder="发送内容，开始跟AI对话吧～" @keydown="onKeydown" />
      <n-spin :show="loading" size="small">
        <button @click="send">发送</button>
      </n-spin>
      <button @click="newChat">新话题</button>
      <button @click="generateImage">下载对话图片</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { marked } from "marked";
import { useMessage } from "naive-ui";
import hljs from "highlight.js";
import html2canvas from "html2canvas"
import { chatApi } from "../api";
import { generateUid, isIncludeCodeBlock } from '../util/index'
import { USER_AVATAR, AI_AVATAR } from "../constants";
import default_user_avatar from "../assets/user_avatar.jpeg";
import default_ai_avatar from "../assets/ai_avatar.webp";
import deleteIcon from '../assets/delete.svg'
import {
  OPENAI_KEY,
  OPENAI_CHAT_HISTORY,
  ChatItem,
  WITHOUT_OPENAI_KEY_TIPS,
  HISTORY_MAX_SIZE
} from "../constants";
import { useRoute } from "vue-router";
const route = useRoute()
const user_avatar = localStorage.getItem(USER_AVATAR) ?? default_user_avatar;
const ai_avatar = localStorage.getItem(AI_AVATAR) ?? default_ai_avatar;
const render = new marked.Renderer();
marked.setOptions({
  renderer: render, // 这是必填项
  gfm: true, // 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）
  // 高亮的语法规范
  // TODO: OpenAI 代码块有时候不会正确返回语言格式，会导致highlight解析出错，如果未正确返回格式现默认当javascript进行解析
  highlight: (code, lang) => hljs.highlight(code, { language: lang || 'javascript' }).value,
});
const userOpenAIKey = localStorage.getItem(OPENAI_KEY);
const message = useMessage();
const text = ref<string>("");
const loading = ref<boolean>(false);

// 从localStorage读取全部对话历史
const initChatHistory = localStorage.getItem(OPENAI_CHAT_HISTORY)
  ? JSON.parse(localStorage.getItem(OPENAI_CHAT_HISTORY) as any)
  : []
const chatHistory = ref<ChatItem[]>(initChatHistory)

// 默认从对话历史记录中取最后一条作为当前回话
const initChatItem = chatHistory.value[chatHistory.value.length - 1] ?? {
  uid: generateUid(),
  createTime: Date.now(),
  detail: []
}

// 当前会话
const activeChatItem = ref<ChatItem>(initChatItem)
// 当前会话对应uid
const activeChatItemUid = ref<number>(activeChatItem.value.uid)

const contentRef = ref();

const send = () => {
  if (!userOpenAIKey) {
    return message.info(WITHOUT_OPENAI_KEY_TIPS);
  }
  if (loading.value || !text.value.trim()) return;
  loading.value = true;
  activeChatItem.value.detail.push({
    role: "user",
    content: text.value,
  });
  nextTick(moveToBottom);
  text.value = "";
  // 记录AI回复内容
  let content = "";
  chatApi(activeChatItem.value.detail, {
    userOpenAIKey,
    onMessage: (msg: string) => {
      if (msg) {
        const newContent = content + msg;
        if (!content) {
          activeChatItem.value.detail.push({
            role: "assistant",
            content: msg,
          });
        } else {
          activeChatItem.value.detail[activeChatItem.value.detail.length - 1].content = newContent;
        }
        content = newContent;
        moveToBottom();
      }
    },
    onError: (msg: string) => {
      console.log("error message:", msg);
      message.error(msg || "服务异常");
    },
    onFinally: () => {
      loading.value = false;
      activeChatItem.value.updateTime = Date.now()
      // 加载完消息所有内容,如果包含代码块用markdown渲染来高亮
      if (isIncludeCodeBlock(content)) {
        activeChatItem.value.detail[activeChatItem.value.detail.length - 1].content = marked(content);
      }
      // 缓存对话记录到本地
      updateChatHistory(activeChatItem.value);
      nextTick(() => {
        addCopyButton();
        moveToBottom();
      });
    },
  });
};

// 生成图片
const generateImage = () => {
  // html2canvas 默认只会生成可视区范围的canvas，需要根据元素设置正确窗口尺寸
  const el = document.querySelector('#container .content') as HTMLElement
  //TODO: 如果可视区发生滚动可能存在截图不全情况，先滚动可视区到顶部 待优化
  el.scrollTop = 0
  html2canvas(el, {
    backgroundColor: "#242424",
    allowTaint: true,
    windowWidth: el.clientWidth,
    windowHeight: el.scrollHeight + 50
  }).then(canvas => {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = `会话 - ${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.target = '_blank';
    link.click();
    document.body.removeChild(link)
  })
}

// 聊天记录触底
const moveToBottom = () => {
  contentRef.value.scrollTop = contentRef.value.scrollHeight;
};
// 新话题
const newChat = () => {
  activeChatItem.value = {
    uid: generateUid(),
    createTime: Date.now(),
    detail: []
  }
};

// 本地持久化存储会话
const updateChatHistory = (chatItem: ChatItem) => {
  const index = chatHistory.value.findIndex(chat => chat.uid === chatItem.uid)
  if (index > -1) {
    chatHistory.value.splice(index, 1)
  }
  // 如果已经达到存储上限则先移除最久远的回话记录 
  if (chatHistory.value.length === HISTORY_MAX_SIZE) {
    chatHistory.value.shift()
  }
  chatHistory.value.push(chatItem)
  localStorage.setItem(OPENAI_CHAT_HISTORY, JSON.stringify(chatHistory.value));
};

const onKeydown = (event: KeyboardEvent) => {
  // event.isComposing 判断用户是否正在输入中文
  if (event.keyCode === 13 && !event.isComposing) {
    send();
  }
};

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

// 点击对应回话记录
const handleClickHistoryItem = (item: ChatItem) => {
  activeChatItem.value = item
  nextTick(addCopyButton)
}

// 删除对应回话记录
const handleDeleteHistoryItem = (item: ChatItem) => {
  const index = chatHistory.value.findIndex(chat => chat.uid === item.uid)
  chatHistory.value.splice(index, 1)
  localStorage.setItem(OPENAI_CHAT_HISTORY, JSON.stringify(chatHistory.value))
  newChat()
}

const reverseChatHistory = computed(() => {
  // reverse 会改变原始数组 copy一份再进行反转
  const copy = chatHistory.value.slice(0)
  return copy.reverse()
})

watch(activeChatItem, (newValue, oldValue) => {
  activeChatItemUid.value = newValue.uid
})

onMounted(() => {
  addCopyButton();
});
</script>


<style lang="less" scoped>
h1 {
  text-align: center;
  color: aqua;
}

.flex {
  display: flex;
  height: calc(100vh - 220px);
}


.history {
  width: 250px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  height: 100%;
  border: 2px solid #fff;
  background: #1a1a1a;
  font-size: 16px;

  li {
    position: relative;
    list-style: none;
    height: 40px;
    line-height: 40px;
    padding: 0 6px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:hover {
      background-color: rgba(42, 43, 50, 1);
    }

    &.active {
      background-color: rgba(52, 53, 65, 1);
      // 给删除图标预留位置
      padding-right: 25px;
      color: aqua;
    }

    img {
      position: absolute;
      display: inline-block;
      right: 6px;
      top: 12px;
      height: 16px;
    }
  }
}

.content {
  flex: 1;
  height: 100%;
  padding-bottom: 80px;
  clear: both;
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

    :deep(.copy-button) {
      float: right;
      background: #5468ff;
    }
  }
}

.action {
  position: fixed;
  width: calc(100% - 250px);
  left: 263px; // 250 + body padding(8) + App margin(5)
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
