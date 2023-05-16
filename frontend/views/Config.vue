<template>
  <div class="config">
    请输入您的OpenAI Key:
    <input type="text" name="" id="" v-model="openaiKey"
      placeholder="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
    <button @click="updateKey">Update</button>
    <p class="tip">
      Tips: 点击 Update 按钮会将 OpenAI Key 保存到本地localStorage中，仅用于请求
      OpenAI，本应用不会收集任何信息
    </p>
    <n-divider />
    <p>自定义User头像 | 自定义AI头像 | 当前User头像 | 当前AI头像</p>
    <div class="flex">
      <n-upload :default-file-list="userPreviewFileList" list-type="image-card" accept=".jpg, .jpeg, .png" :max="1"
        :on-remove="() => onMove(1)" :on-change="(options: any, e: InputEvent) => onChange(1, options, e)" />
      <n-upload :default-file-list="AIPreviewFileList" list-type="image-card" accept=".jpg, .jpeg, .png" :max="1"
        :on-remove="() => onMove(2)" :on-change="(options: any, e: InputEvent) => onChange(2, options, e)" />
      <img v-if="currentUserAvatar" :src="currentUserAvatar" alt="当前User Avatar" title="当前User Avatar" class="avatar" />
      <img v-if="currentAIAvatar" :src="currentAIAvatar" alt="当前AI Avatar" title="当前AI Avatar" srcset="" class="avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessage, UploadFileInfo } from "naive-ui";
import {
  OPENAI_KEY,
  UPDATE_OPENAI_KEY_TIPS,
  AI_AVATAR,
  USER_AVATAR,
} from "../constants";
import { fireworks } from '../util/confetti'

const message = useMessage();

const openaiKey = ref("");

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

const onChange = async (type: number, options: any, e: InputEvent) => {
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
}
</style>