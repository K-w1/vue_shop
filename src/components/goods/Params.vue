<template>
  <div class="wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="只允许为第三级分类设置相关参数"
        show-icon
        :closable="false"
        type="warning">
      </el-alert>
      <el-row>
        <el-col class="select-cat">
          <span>选择商品分类：</span>
          <el-cascader
            change-on-select
            clearable
            v-model="selectedCateKeys"
            :options="cateList"
            expand-trigger="hover"
            :props="cateProps"
            @change="cateChanged">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length!=3" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe="">
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length!=3" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe="">
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        @close="closeAddDialog"
        width="50%">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        @close="closeEditDialog"
        width="50%">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        cateList:[],
        cateProps:{
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        selectedCateKeys:[],
        activeName:'many',
        manyTableData:[],
        onlyTableData:[],
        addDialogVisible:false,
        addForm:{
          attr_name:''
        },
        addFormRules:{
          attr_name:[
            {required:'true',message:'请输入参数名称',trigger:'blur'}
          ]
        },
        editForm:{
          attr_name:''
        },
        editFormRules:{
          attr_name:[
            {required:'true',message:'请输入参数名称',trigger:'blur'}
          ]
        },
        editDialogVisible:false,
      }
    },
    computed:{
      cateId(){
        if(this.selectedCateKeys.length==3){
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText(){
        if(this.activeName=='many'){
          return '动态参数'
        }
        return '静态属性'
      }
    },
    created(){
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$http.get('categories')
        if(res.meta.status!=200) return this.$message.error('获取商品分类失败')
        this.cateList=res.data
        console.log(this.cateList)
      },
      cateChanged(){
        this.getParamsData()
      },
      handleClick(){
        this.getParamsData()  
      },
      async getParamsData(){
        if(this.selectedCateKeys.length!=3){
          this.manyTableData=[]
          this.onlyTableData=[]
          return
        }
        console.log(this.selectedCateKeys)
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:this.activeName}
        })
        if(res.meta.status!=200) return this.$message.error('获取参数列表失败')
        console.log(res.data)
        res.data.forEach((item,index)=>{
          item.inputVisible=false
          item.inputValue=''
          item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
        })
        console.log(res.data,'转成数组后')
        if(this.activeName=='many'){
          this.manyTableData=res.data
        }else{
          this.onlyTableData=res.data
        }
      },
      closeAddDialog(){
        this.$refs.addFormRef.resetFields()
      },
      addParams(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status!=201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          this.getParamsData()
          this.addDialogVisible=false
        })
      },
      async showEditDialog(attr_id){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
          params:{attr_sel:this.activeName}
        })
        if(res.meta.status!=200) return this.$message.error('获取参数信息失败')
        this.editForm=res.data
        this.editDialogVisible=true
      },
      closeEditDialog(){
        this.$refs.editFormRef.resetFields()
      },
      editParams(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return 
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status!=200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible=false
        })
      },
      async removeParams(attr_id){
        const confirmRes = await this.$confirm('确定要删除该参数吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err=>err)
        if(confirmRes!='confirm') return this.$message.info('取消删除成功')
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status!=200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamsData()
      },
      handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
          row.inputValue=''
          row.inputVisible=false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false
        this.saveCateParams(row)
      },
      showInput(row){
        row.inputVisible=true
        this.$nextTick(()=>{
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveCateParams(row)
      },
      async saveCateParams(row){
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status!=200) return this.$message.error('修改参数项失败')
        this.$message.success('修改参数项成功')
      }
    }
  }
</script>

<style lang="less" scoped>
.select-cat{
  margin: 15px 0;
}
.el-tag{
  margin: 0 10px;
}
.input-new-tag{
  width: 120px;
}
</style>