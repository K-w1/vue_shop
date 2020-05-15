<template>
  <div class="wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色表格区域 -->
      <el-table :data="roleList" border stripe="">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1==0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @click="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2==0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @click="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限区域 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      @close="closeRightDialog"
      width="30%">
      <el-tree ref="tree" :data="rightList" :props="treeProps" :default-checked-keys="defKeys" show-checkbox node-key="id" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      @close="closeAddRoleDialog"
      width="30%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框区域 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      @close="closeEditRoleDialog"
      width="30%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        roleList:[],
        rightDialogVisible:false,
        rightList:[],
        treeProps:{
          label:'authName',
          children:'children'
        },
        defKeys:[],
        roleId:'',
        addRoleDialogVisible:false,
        addForm:{
          roleName:'',
          roleDesc:''
        },
        editForm:{
          roleName:'',
          roleDesc:''
        },
        addFormRules:{
          roleName:[
            {required:'true',message:'请输入名称',trigger:'blur'}
          ],
          roleDesc:[
            {required:'true',message:'请输入描述',trigger:'blur'}
          ]
        },
        editFormRules:{
          roleName:[
            {required:'true',message:'请输入名称',trigger:'blur'}
          ],
          roleDesc:[
            {required:'true',message:'请输入描述',trigger:'blur'}
          ]
        },
        editRoleDialogVisible:false,
        roleInfo:{}
      }
    },
    created(){
      this.getRoleList()
    },
    methods:{
      async getRoleList(){
        const {data:res} = await this.$http.get('roles')
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取角色列表失败')
        this.roleList=res.data
      },
      async removeRightById(row,id){
        const confirmRes = await this.$confirm('确定要删除该权限吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err=>err)
        if(confirmRes!='confirm') return this.$message.info('取消删除')
        const {data:res} = await this.$http.delete(`roles/${row.id}/rights/${id}`)
        console.log(res,row)
        if(res.meta.status!=200) return this.$message.error('删除权限失败')
        row.children=res.data
        this.$message.success('删除成功')
      },
      async showSetRightDialog(role){
        console.log(role,'dddd')
        this.roleId=role.id
        const {data:res} = await this.$http.get('rights/tree')
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取权限数据失败')
        this.rightList=res.data
        this.getLeafKeys(role,this.defKeys)
        this.rightDialogVisible=true
      },
      getLeafKeys(node,arr){
        if(!node.children){
          arr.push(node.id)
          return
        }
        node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
        })
      },
      closeRightDialog(){
        this.defKeys=[]
      },
      async confirmRight(){
        let idStr=[...this.$refs.tree.getHalfCheckedKeys(),...this.$refs.tree.getCheckedKeys()].join()
        console.log(idStr)
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
          rids:idStr
        })
        if(res.meta.status!=200) return this.$message.error('分配权限失败')
        this.$message.success('分配权限成功')
        this.getRoleList()
        this.rightDialogVisible=false
      },
      showAddRoleDialog(){
        this.addRoleDialogVisible=true
      },
      closeAddRoleDialog(){
        console.log(this.$refs.addFormRef,'关闭对话框')
        this.$refs.addFormRef.resetFields()
      },
      addRole(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.post('roles',this.addForm)
          console.log(res)
          if(res.meta.status!=201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功')
          this.getRoleList()
          this.addRoleDialogVisible=false
        })
      },
      async showEditRoleDialog(role){
        console.log(role)
        this.roleInfo=role
        this.editForm.roleName=this.roleInfo.roleName
        this.editForm.roleDesc=this.roleInfo.roleDesc
        this.editRoleDialogVisible=true
      },
      editRole(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.put(`roles/${this.roleInfo.id}`,this.editForm)
          console.log(res)
          if(res.meta.status!=200) return this.$message.error('修改角色失败')
          this.$message.success('修改角色成功')
          this.getRoleList()
          this.editRoleDialogVisible=false
        })
      },
      closeEditRoleDialog(){
        this.$refs.editFormRef.resetFields()
        this.roleInfo={}
      },
      async delRole(id){
        const confirmRes = await this.$confirm('确定要删除该角色吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消'
        }).catch(err=>err)
        if(confirmRes!='confirm') return this.$message.info('取消删除')
        const {data:res} = await this.$http.delete('roles/'+id)
        if(res.meta.status!=200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        this.getRoleList()
      }
    }
  }
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>