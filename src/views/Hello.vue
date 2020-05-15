<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

    import {getMessage} from '@/api/common'

    export default {
        name: 'Hello',
        data() {
            return {
                msg: 'Welcome'
            }
        },
        created() {
            getMessage().then(res => {
                    this.msg = res.data
                }
            )
        }
    }
</script>

<style scoped>
</style>
