<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt>
      </div>



        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">


            <el-form-item prop="username">
              <el-input v-model="loginForm.username">
                <i slot="prefix" class="iconfont icon-user"></i>
              </el-input>
            </el-form-item>

            <el-form-item prop="userpass">
              <el-input v-model="loginForm.userpass" type="password">
                <i slot="prefix" class="iconfont icon-3702mima"></i>
              </el-input>
            </el-form-item>

            <el-row>
              <el-col :push="15">
                  <el-button type="primary" @click="denglu()">登录</el-button>
                  <el-button type="info" @click="reset()">重置</el-button>
              </el-col>
            </el-row>
            


        </el-form>

      
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    
    denglu(){
      // 登录的时候再次验证 
      // 通过$ref.loginFormRef找到标签 ref设置 refs获取
      this.$refs.loginFormRef.validate( async valid=>{
        if(valid===true){
          const {data : dt} = await this.$http.post('/login',{
            username:this.loginForm.username,
            password:this.loginForm.userpass}
          )
          
          if(dt.meta.status!==200){
            return this.$message.error(dt.meta.msg)
          }
          // 设置token
          window.sessionStorage.setItem('token',dt.data.token)
          this.$router.push('/home')
        }

      })

    },
    reset(){
      this.$refs.loginFormRef.resetFields()
    }
  },
  
  data(){
    return{
      // 基础验证 验证名字不为空
      loginFormRules:{
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
        userpass:[
            { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },

      loginForm:{
        username:'admin',
        userpass:'123456'
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>