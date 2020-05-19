<template>
  <div class="wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="100px" label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column width="100px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="160px" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time|timeFormat}}
          </template>
        </el-table-column>
        <el-table-column width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        goodsList:[],
        total:0
      }
    },
    created(){
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{
          params:this.queryInfo
        })
        if(res.meta.status!=200) return this.$message.error('获取商品列表失败')
        this.$message.success('获取列表成功')
        this.goodsList=res.data.goods
        this.total=res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getGoodsList()
      },
      async removeById(id){
        const confirmRes = await this.$confirm('确定要删除该商品吗？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err=>err)
        if(confirmRes!='confirm') return this.$message.info('取消删除成功')
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status!=200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
      },
      toAdd(){
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>