<template>
  <svg :width="width" :height="height" class="svg-icon" aria-hidden="true">
    <use :xlink:href="svgName"></use>
  </svg>
</template>

<script>
    export default {
        name: 'svg-icon',
        props: {
            name: {
                type: String,
                required: true
            },
            width: {
                type: String,
                default: '1em'
            },
            height: {
                type: String,
                default: '1em'
            }
        },
        computed: {
            svgName() {
                return `#icon-${this.name}`
            }
        },
    }
</script>

<style scoped>

  .svg-icon {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }


/*

  xl	≥1920px
  @media screen and (min-width:1920px){

  }


  lg	≥1200px
  @media screen and (min-width:1200px) and (max-width: 1919px){

  }


  md	≥992px
  @media screen and (min-width: 992px) and (max-width: 1199px) {

  }


  sm	≥768px
  @media screen and (min-width: 768px) and (max-width: 991px) {

  }


  xs	<768px
  @media screen and (min-width: 480px) and (max-width: 767px) {

  }

  @media only screen and (max-width: 479px) {

  }
*/


</style>
