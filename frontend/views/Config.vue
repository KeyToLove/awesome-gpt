<template>
  <div class="config">
    请输入您的OpenAI Key:
    <input type="text" name="" id="" v-model="openaiKey"
      placeholder="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
    <button @click="updateKey">Update</button>
    <div>
      请选择 Chat Model:
      <n-select placeholder="请选择 Chat Model" class="model" v-model:value="chatModel" :options="modelOptions"
        :on-update:value="changeModel" />
    </div>
    <p class="tip">
      Tips: 点击 Update 按钮会将 OpenAI Key 保存到本地localStorage中，仅用于请求
      OpenAI，本应用不会收集任何信息
    </p>
    <n-divider />
    <p>自定义User头像 | 自定义AI头像 | 当前User头像 | 当前AI头像</p>
    <div class="flex">
      <n-upload :default-file-list="userPreviewFileList" list-type="image-card" accept=".jpg, .jpeg, .png" :max="1"
        :on-remove="() => onMove(1)" :on-change="(options: any) => onChange(1, options)" />
      <n-upload :default-file-list="AIPreviewFileList" list-type="image-card" accept=".jpg, .jpeg, .png" :max="1"
        :on-remove="() => onMove(2)" :on-change="(options: any) => onChange(2, options)" />
      <img v-if="currentUserAvatar" :src="currentUserAvatar" alt="当前User Avatar" title="当前User Avatar" class="avatar" />
      <img v-if="currentAIAvatar" :src="currentAIAvatar" alt="当前AI Avatar" title="当前AI Avatar" srcset=""
        class="avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useMessage, UploadFileInfo, NUpload, NSelect, NDivider } from "naive-ui";
import {
  OPENAI_KEY,
  UPDATE_OPENAI_KEY_TIPS,
  AI_AVATAR,
  USER_AVATAR,
  OPENAI_CHAT_MODEL
} from "../constants";
import { fireworks } from '../util/confetti'

const message = useMessage();

const openaiKey = ref("");

const chatModel = ref("")

const modelOptions = [
  {
    label: "gpt-4o",
    value: "gpt-4o"
  },
  {
    label: "gpt-4-turbo",
    value: "gpt-4-turbo-preview"
  },
  {
    label: "gpt-3.5-turbo",
    value: "gpt-3.5-turbo-0125"
  },
]

const currentUserAvatar: any = ref(localStorage.getItem(USER_AVATAR));
const currentAIAvatar: any = ref(localStorage.getItem(AI_AVATAR));

const updateKey = () => {
  if (!openaiKey.value) return;
  window.localStorage.setItem(OPENAI_KEY, openaiKey.value);
  openaiKey.value = "";
  fireworks()
  message.success(UPDATE_OPENAI_KEY_TIPS);
};
const userPreviewFileList = ref<UploadFileInfo[]>([]);
const AIPreviewFileList = ref<UploadFileInfo[]>([]);

const onMove = (type: number): boolean => {
  localStorage.setItem(type === 1 ? USER_AVATAR : AI_AVATAR, "");
  return true;
};

const onChange = async (type: number, options: any) => {
  const { file } = options.file;
  try {
    const result = (await getBase64(file as File)) as string;
    type === 1
      ? (currentUserAvatar.value = result)
      : (currentAIAvatar.value = result);
    localStorage.setItem(type === 1 ? USER_AVATAR : AI_AVATAR, result);
    fireworks()
  } catch (error: any) {
    message.error("图片上传失败: " + error.message);
  }
};

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const changeModel = (value: string) => {
  chatModel.value = value
  window.localStorage.setItem(OPENAI_CHAT_MODEL, value)
}

onBeforeMount(() => {
  chatModel.value = window.localStorage.getItem(OPENAI_CHAT_MODEL) || 'gpt-3.5-turbo-0125'
})

</script>

<style scoped lang="less">
.config {
  margin-top: 20px;
  color: #fff;

  .tip {
    color: orange;
  }

  input {
    padding: 0.6em 1.2em;
    width: 400px;
    margin: 0 10px;
  }

  :deep(.n-base-icon) {
    color: black;
  }

  :deep(.n-upload) {
    width: auto;
    margin-right: 10px;
  }

  .flex {
    display: flex;
    justify-content: flex-start;

    .avatar {
      display: inline-block;
      width: 96px;
      height: 96px;
      margin-right: 10px;
    }
  }

  .model {
    width: 200px;
    margin: 20px 0 0 10px;
    display: inline-block;
  }
}
</style>