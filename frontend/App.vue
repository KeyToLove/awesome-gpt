<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <n-message-provider>
            <n-dialog-provider>
                <Layout />
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<script lang="ts" setup>
import Layout from "./Layout.vue";
import { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    Collapse: {
        textColor: '#fff',
        arrowColor: '#fff',
        titleTextColor: '#fff'
    }
}
</script>