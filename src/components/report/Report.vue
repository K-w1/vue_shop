<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
  export default {
    data(){
      return{}
    },
    async mounted(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      const {data:res} = await this.$http.get('reports/type/1')
      if(res.meta.status!=200) return this.$message.error('获取数据失败')


      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(res.data);
    }
  }
</script>

<style lang="less" scoped>

</style>