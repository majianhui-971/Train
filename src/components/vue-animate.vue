<template>
  <transition :enter-active-class="enter" :leave-active-class="leave" :duration="{ enter: 800, leave: 300}">
    <slot></slot>
  </transition>
</template>

<script>
    export default {
        name: "vue-animate",
        props:{
            enter: {
                type: String,
                default: ''
            },

            leave: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped>

</style>
