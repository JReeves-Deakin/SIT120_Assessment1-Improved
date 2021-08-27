<template> <!-- Pages I never got to finish -->
    <navbar/>
    <div class="Content">
        <h1> This page is currently under construction, check back soon!</h1>
    </div>
</template>

<script>
import navbar from "../components/NavBar.vue"

export default{
    components:{
        navbar,
    }

}
</script>

<style scoped>
.Content{
    margin-top: 20px;
    z-index: 0;
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(85%);
    width: 100%;
    overflow: hidden;
    text-align: center;
}
</style>
