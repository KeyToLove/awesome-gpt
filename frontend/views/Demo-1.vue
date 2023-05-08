<template>
  <h1>{{ route.meta.desc }}</h1>
  <div id="container">
    <div class="left box">
      <h2 class="text-xl">Picture</h2>
      <n-spin size="large" v-show="imageLoading" />
      <img v-if="imgSrc" :src="imgSrc" alt="pic" />
    </div>
    <div class="right box" ref="answerBox">
      <h2 class="text-xl">Translation</h2>
      <n-spin size="large" v-show="answerLoading" />
      <p class="answer">
        {{ answer.trim() }}
      </p>
    </div>
  </div>
  <div id="action">
    <input type="text" name="" id="" v-model="text" @keydown="onKeydown" placeholder="试着描述想要生成的图片吧 例如: three cats" />
    <n-spin :show="globalLoading" size="small">
      <button @click="go">Go</button>
    </n-spin>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { generateImage, conversation } from "../api";
import { useMessage } from "naive-ui";
import { OPENAI_KEY, WITHOUT_OPENAI_KEY_TIPS } from "../constants";
import { useRoute } from "vue-router";
const userOpenAIKey = localStorage.getItem(OPENAI_KEY);

const route = useRoute()

const message = useMessage();
const imgSrc = ref<string>("");
const text = ref<string>("");
const answer = ref<string>("");
const answerBox = ref<HTMLElement>();
const imageLoading = ref<boolean>(false);
const answerLoading = ref<boolean>(false);
const globalLoading = computed(() => {
  return imageLoading.value || answerLoading.value;
});
const go = () => {
  if (globalLoading.value || !text.value) return;
  if (!userOpenAIKey) {
    return message.info(WITHOUT_OPENAI_KEY_TIPS);
  }
  reset();
  getImage();
  analyse();
};

const reset = () => {
  answer.value = "";
  imgSrc.value = "";
};

const getImage = async () => {
  imageLoading.value = true;
  const data = await generateImage(text.value, {
    userOpenAIKey,
  });
  if (!data?.data) {
    imageLoading.value = false;
    return message.error(data.message);
  }
  const url = data?.data[0]?.url;
  imgSrc.value = url;
  imageLoading.value = false;
};

const analyse = () => {
  answerLoading.value = true;
  conversation({ key:'translate',prompts:text.value }, {
    userOpenAIKey,
    onMessage: (str: string) => {
      if (answerLoading.value) {
        answerLoading.value = false;
      }
      answer.value += str;
      if (answerBox.value) {
        answerBox.value.scrollTop = answerBox.value.scrollHeight;
      }
    },
    onError: (msg: string) => {
      console.log("error message:", msg);
      message.error(msg || "服务异常");
    },
    onFinally: () => {
      answerLoading.value = false;
    },
  });
};

const onKeydown = (event: KeyboardEvent) => {
  // event.isComposing 判断用户是否正在输入中文
  if (event.keyCode === 13 && !event.isComposing) {
    go();
  }
};
</script>
<style scoped lang="less">
h1 {
  text-align: center;
  color: aqua;
}

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
    color: sandybrown;
    border: 2px solid sandybrown;
  }

  .right {
    border: 2px solid aqua;
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
