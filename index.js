const {Query, User} = AV;
AV.init({
  appId: "pmHpYsxvmBtERl6cmQ8sKMjf-MdYXbMMI",
  appKey: "VA2iGJ2coooFBfxYN076tiPp",
  serverURL: "https://pmhpysxv.api.lncldglobal.com"
});

new Vue({
  el: '#app',
  Data_link() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      selections: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        link: [{required: true, message: "链接URL不能为空", trigger: "blur"}],
        label: [{required: true, message: "链接名不能为空", trigger: "blur"}],
        label2: [{required: true, message: "备注不能为空", trigger: "blur"}],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询表格数据 */
    getList() {
      this.loading = true;
      this.tableList = [];
      const queryAll = new AV.Query('Data_link');
      if (this.queryParams.name) {
        queryAll.contains('name', this.queryParams.name);
      }
      queryAll.find().then((rows) => {
        for (let row of rows) {
          this.tableList.push(row.attributes);
        }
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        name: ''
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selections = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.selections[0].id;
      const query = new AV.Query('Data_link');
      query.equalTo('id', id);
      query.first().then((Data_link) => {
        this.form = {
          id: Data_link.get('id'),
          link: Data_link.get('link'),
          grade: Data_link.get('label'),
          points: Data_link.get('label2'),
        }
        this.open = true;
        this.title = "修改数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            const query = new AV.Query('Data_link');
            query.equalTo('id', this.form.id);
            query.first().then((Data_link) => {
              Data_link.set('link', this.form.name);
              Data_link.set('label', this.form.grade);
              Data_link.set('label2', this.form.points);
              Data_link.save().then((Data_link) => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.open = false;
                this.getList();
              });
            })
          } else {
            const Data_link = new AV.Object('Data_link');
            Data_link.set('link', this.form.name);
            Data_link.set('label', this.form.grade);
            Data_link.set('lebel2', this.form.points);
            Data_link.save().then((Data_link) => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        grade: null,
        points: null,
        address: null
      };
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.id) {
        this.$confirm('是否确认删除该数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const query = new AV.Query('Data_link');
          query.equalTo('id', row.id);
          query.first().then((Data_link) => {
            Data_link.destroy().then((Data_link) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        const length = this.selections.length;
        this.$confirm('是否确认删除' + (length > 1 ? '这' + length + '个' : '该') + '数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const ids = this.selections.map(item => item.id);
          const query = new AV.Query('Data_link');
          query.containedIn('id', ids);
          query.find().then((rows) => {
            AV.Object.destroyAll(rows).then((rows) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
});