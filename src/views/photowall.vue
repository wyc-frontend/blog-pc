<template>
    <div v-masonry :horizontal-order="false" :column-width="325" :fit-width="false" transition-duration="0.3s" item-selector=".card" origin-left="false" class="pets">
        <div v-masonry-tile v-for="pet in picArr.values" :key="pet['id']" class="card">
            <el-card>
                <img :src="pet.userimg" alt="">
                <p style="text-align:center;">{{pet.picId}}</p>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { onMounted,reactive } from 'vue'
import { reqPhotoWall } from '../api';
//定义接收区
const picArr = reactive([])

//方法区
const getPhotos = async () =>{
  
    let res = await reqPhotoWall()
    if(res.data.code===0){
        picArr.values = res.data.data.map(item=>{
           return{
            userimg:import.meta.env.VITE_APP_API_URL + `${item.userimg}`,
            username:item.username,
            picId:item.id
           }
        })
    }
}


onMounted(()=>{
 
    getPhotos()
})
</script>
<style scoped>
.pets {
    width:100%;
    margin: 0 auto;
    height: 730px;
    /* background-color: rgba(0, 0, 0, .6); */
    background-color: aliceblue;
    /* opacity: .7; */
}

.card {
    width: 100%;
    max-width: 310px;
    margin:0.25vw;
    border-radius: 5px;
    /* box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1); */
}
img {
    width: 100%;
    max-width: 280px;
    margin:0.25vw;
    border-radius: 5px;
    /* box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1); */
}

.card img {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
</style>