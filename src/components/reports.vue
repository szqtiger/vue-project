<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main" style="width:600px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1 npm 下载echarts
// 2 引入echarts
import echarts from "echarts";

export default {
  mounted() {
    // mounted什么时候使用 ---> 操作DOM对象的时候
    this.initecharts();
  },
  methods: {
    async initecharts() {
      var myChart = echarts.init(document.getElementById("main"));

      //发送ajax接受真实数据
      const { data: dt } = await this.$http.get("reports/type/1");
      console.log(dt);
      const options2 = dt.data;

      // 假数据表格自带的
      var options1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      // 真实数据和假数据结合
      let option = { ...options1, ...options2 };
      // use configuration item and data specified to show chart
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
