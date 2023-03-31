
<script setup lang="ts">
import { computed, ref } from 'vue';
import Demo1 from './Demo-1.vue'
import Demo2 from './Demo-2.vue'
import Footer from './Footer.vue'
import { useMessage } from 'naive-ui'


const OPENAI_KEY = "OPENAI_KEY"
const routes = {
  '/': Demo1,
  '/demo-2': Demo2
}
const message = useMessage()
const currentPath = ref(window.location.hash)

const openaiKey = ref("")

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  // @ts-ignore
  return routes[currentPath.value.slice(1) || '/'] || Demo1
})

const activeRoute = computed(() => {
  return currentPath.value === '#/demo-2' ? 'demo-2' : 'demo-1'
})

const go = (path: string) => {
  window.location.href = `#/${path}`
}

const updateKey = () => {
  if (!openaiKey.value) return
  window.localStorage.setItem(OPENAI_KEY, openaiKey.value)
  openaiKey.value = ""
  message.success('成功更新openai key到本地localStorage,开始体验吧～')
}

const userOpenAIKey = computed(() => {
  return openaiKey.value || localStorage.getItem(OPENAI_KEY)
})

const expanded = computed(() => {
  return localStorage.getItem(OPENAI_KEY) ? null : ["1"]
})

const isShowFooter = computed(() => {
  return ['', '/', '#/demo-1'].includes(currentPath.value)
})

</script>

<template>
  <n-collapse :default-expanded-names="expanded">
    <n-collapse-item title="OPENAI_KEY" name="1">
      <div class="header">
        请输入您的openai key:
        <input type="text" name="" id="" v-model="openaiKey"
          placeholder="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
        <button @click="updateKey">Update</button>
        <p class="tip">Tips: 点击 Update 按钮会将openai key保存到localStorage中，调用接口时优先读取输入框 key再读取localStorage中key，即更新后可以不用再手动输入
        </p>
      </div>
    </n-collapse-item>
  </n-collapse>

  <div class="nav">
    <button @click="go('demo-1')" :class="{ active: activeRoute === 'demo-1' }">Demo-1</button>
    <button @click="go('demo-2')" :class="{ active: activeRoute === 'demo-2' }">Demo-2</button>
  </div>
  <component :is="currentView" :userOpenAIKey="userOpenAIKey"></Component>
  <Footer v-show="isShowFooter"></Footer>
</template>
<style lang="less" scoped>
.header {

  color: #fff;

  .tip {
    color: orange;
  }

  input {
    padding: 0.6em 1.2em;
    width: 400px;
    margin: 0 10px;
  }
}

.nav {
  display: flex;
  font-size: 16px;

  button {
    margin-right: 6px;

    &.active {
      background: darkslategray;
    }
  }
}
</style>

