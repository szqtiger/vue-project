<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="fenpeiDialog" width="50%">
      <!-- 插入表单 -->
      <el-form  :model="destributeForm" label-width="80px">
        <el-form-item label="角色名称">{{ destributeForm.roleName }}</el-form-item>
        <el-form-item label="选取权限">
          <el-tree
            :data="rightsList"
            :props="treeProps"
            node-key="id"
            show-checkbox
            default-expand-all
            :default-checked-keys="rightsChecked"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiDialog = false">取 消</el-button>
        <el-button type="primary" @click="destribute()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-table :data="roleList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235,238,245)','border-top':k===0?'1px solid rgb(235,238,245)':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delRights(info.row,v.id)">{{ v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top':kk!==0?'1px solid rgb(235,238,245)':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRights(info.row,vv.id)"
                    >{{ vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      closable
                      @close="delRights(info.row,vvv.id)"
                    >{{ vvv.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="info">
            <el-button
              type="warning"
              class="el-icon-setting"
              size="small"
              @click="showFenPeiDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  methods: {
    async destribute(){
        //获取选中的ID
        var ids1 = this.$refs.treeRef.getCheckedKeys()
        // 获取半选中的id
        var ids2 = this.$refs.treeRef.getHalfCheckedKeys()
        //将选中的和半选中的合并并连接成字符串
        var ids12 = ids1.concat(ids2).join(',') 
        const {data : dt} = await this.$http.post(`roles/${this.destributeForm.id}/rights`,{rids:ids12})   
        if(dt.meta.status !== 200){
            return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.fenpeiDialog = false
        this.getRoleList()

    },

    async showFenPeiDialog(role) {
      const { data: dt } = await this.$http.get("rights/tree");
      console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      this.rightsList = dt.data;

      // 默认选中节点- 获取默认节点
      var idKeys = [];
      this.getHaveRights(role, idKeys);
      this.rightsChecked = idKeys;


      this.destributeForm = role;
      this.fenpeiDialog = true;
    },
    getHaveRights(node, keys) {
      // 给node的第1维对象添加上children字段
      if (node.son) {
        node.children = node.son;
      }
      if (!node.children) {
        return keys.push(node.id);
      }
      node.children.forEach(item => {
        return this.getHaveRights(item, keys);
      });
    },

    delRights(role, rightsId) {
      this.$confirm("确定要取消该权限吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(
            `roles/${role.id}/rights/${rightsId}`
          );
          console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          //这里是 getRoleList() 但是为了用户体验可以这样写
          role.son = dt.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    async getRoleList() {
      const { data: dt } = await this.$http.get("roles");
      console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 这里的循环是为了改名字 因为组件本身有children  然而返回的data数据里面也有children
      //  报错  循环定义一个别的名字就行
      dt.data.forEach(item => {
        item.son = item.children;
        delete item.children;
      });
      this.roleList = dt.data;
    }
  },
  data() {
    return {
      rightsChecked: [],
      rightsList: [],
      treeProps: {
        label: "authName",   // 树节点对外显示的字段
        children: "children" // 树节点 父、子衔接的字段
      },
      destributeForm: [],
      fenpeiDialog: false,
      roleList: []
    };
  }
};
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
