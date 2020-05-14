<template>
  <div class="wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用画对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="closeDialog">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      var checkEmail=(rule,value,cb)=>{
        const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          // 验证通过
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      var checkMobile=(rule,value,cb)=>{
        const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          // 验证通过
          return cb()
        }
        cb(new Error('请输入合法的手机'))
      }
      return{
        userList:[],
        total:0,
        queryParams:{
          query:'',
          pagenum:1,
          pagesize:2
        },
        dialogVisible:false,
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        addFormRules:{
          username:[
            {required:"true",message:"请输入用户名",trigger:"blur"},
            {min:3,max:10,message:"用户名长度为3到10位",trigger:"blur"}
          ],
          password:[
            {required:"true",message:"请输入密码",trigger:"blur"},
            {min:6,max:15,message:"密码长度为6到15位",trigger:"blur"}
          ],
          email:[
            {required:"true",message:"请输入邮箱",trigger:"blur"},
            {validator:checkEmail,trigger:"blur"}
          ],
          mobile:[
            {required:"true",message:"请输入手机号",trigger:"blur"},
            {validator:checkMobile,trigger:"blur"}
          ],
        }
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      async getUserList(){
        let {data:res} = await this.$http.get('users',{params:this.queryParams})
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取用户列表失败')
        this.userList=res.data.users
        this.total=res.data.total
      },
      handleSizeChange(newPageSize){
        console.log(newPageSize)
        this.queryParams.pagesize=newPageSize
        this.getUserList()
      },
      handleCurrentChange(newPage){
        console.log(newPage)
        this.queryParams.pagenum=newPage
        this.getUserList()
      },
      async changeState(info){
        console.log(info)
        const {data:res} = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
        console.log(res)
        if(res.meta.status!=200){
          info.mg_state=!info.mg_state
          return this.$message.error('修改状态失败')
        }
        this.$message.success('修改状态成功')
      },
      closeDialog(){
        this.$refs.addFormRef.resetFields()
      },
      addUser(){
        this.$refs.addFormRef.validate(async validate=>{
          console.log(validate)
          if(!validate) return
          const {data:res}=await this.$http.post('users',this.addForm)
          if(res.meta.status!=201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          this.dialogVisible=false
          this.getUserList()
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>