<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级" width="200">
            <template slot-scope="info">
                <el-tag v-if="info.row.level == 0">一级</el-tag>
                <el-tag v-else-if="info.row.level == 1" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    created(){
        this.getRigthsList()
    },
    methods:{
        async getRigthsList(){
            const {data:dt} = await this.$http.get('rights/list')
            console.log(dt)
            if(dt.meta.status !== 200){
                return this.$message.error(dt.meta.msg)
            }
            this.rightsList = dt.data
        }

    },

    data() {
        return {
            rightsList:[]
        }
    },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
