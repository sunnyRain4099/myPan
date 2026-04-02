<template>
  <div ref="chartRef" style="width: 600px; height: 400px"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    const option = {
      title: {
        text: '总内存占比图',
        subtext: '数据',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const valueInMB = (params.value / 1024 / 1024).toFixed(2)
          return `${params.name}: ${valueInMB} MB (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '内存占比',
          type: 'pie',
          radius: '50%',
          data: props.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

onMounted(() => {
  initChart()
})

watch(
  () => props.data,
  (newData) => {
    if (chartInstance) {
      chartInstance.setOption({
        series: [
          {
            data: newData
          }
        ]
      })
    }
  }
)
</script>
