<template>
  <div class="wrap">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-wrap">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="form" :model="loginForm" :rules="loginFormRules" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        loginForm:{
          username:'',
          password:''
        },
        loginFormRules:{
          username:[
            {required:"true",message:"请输入用户名",triggle:"blur"},
            {min:3,max:15,message:"用户名长度为3到15位",triggle:"blur"},
          ],
          password:[
            {required:"true",message:"请输入密码",triggle:"blur"}
          ]
        }
      }
    },
    methods:{
      reset(){
        // 表单重置
        this.$refs.form.resetFields()
      },
      login(){
        // 表单预验证
        this.$refs.form.validate(async validate=>{
          if(!validate){
            return
          }
          let {data:res}=await this.$http.post('login',this.loginForm)
          console.log(res)
          if(res.meta.status!=200){
            console.log(this.$message)
            return this.$message.error('登录失败')
          }
          this.$message.success('登录成功')
          sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
          // this.$http.post('login',this.loginForm).then(res=>{
          //   console.log(res)
          // }).catch(err=>{
          //   console.error(err)
          // })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.wrap{
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box{
    width: 450px;
    height: 320px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    .avatar-wrap{
      width: 130px;
      height: 130px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .login-form{
      width: 100%;
      padding:0 20px;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>