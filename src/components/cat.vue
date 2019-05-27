<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" width="50%">
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item prop="cate_name" label="分类名称">
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级"></el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 数据列表 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showaddCateDialog()">添加分类</el-button>
      <el-table :data="cateList" style="width: 100%" stripe border row-key="cat_id">
        <!-- <el-table-column type="index" label="序号" width="200"></el-table-column> -->
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="等级" width="200">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button type="primary" class="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="small">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  methods: {
    showaddCateDialog() {
      this.addCateDialog = true;
    },

    async getCateList() {
      const { data: dt } = await this.$http.get("categories", {
        params: this.querycdt
      });
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      console.log(dt);
      this.cateList = dt.data.result;
    }
  },
  data() {
    return {
      addCateDialog: false,
      addCateForm: {
        cate_name: ""
      },
      addCateFormRules: {
        cate_name: [
          { required: true, message: "分类名称必填", trigger: "blur" }
        ]
      },
      cateList: [],
      querycdt: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    };
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
