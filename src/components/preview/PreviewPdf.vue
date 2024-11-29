<template>
  <div class="pdf">
    <vue-pdf-embed
      ref="pdfRef"
      :source="state.url"
      class="vue-pdf-embed"
      width="850"
      :page="state.pageNum"
    />
  </div>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed'
import { ref, reactive, getCurrentInstance, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  url: {
    type: String
  }
})

const state = ref({
  url: '', // 预览pdf文件地址
  pageNum: 0, // 当前页面
  numPages: 0 // 总页数
})

const initPdf = async () => {
  const url = '/api' + props.url
  state.value.url = url
}

onMounted(() => {
  initPdf()
})
</script>

<style lang="scss" scoped>
.pdf {
  width: 100%;
}
</style>
