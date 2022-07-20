<template>
  <div>欢迎登录</div>
</template>

<script>
export default {
  created () {
    if (this.$store.state.user && this.$store.state.user.token) {
      this.$message({
        message: '登陆成功',
        type: 'success',
        duration: 1000
      })
    }
  },
  data () {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
</style>
