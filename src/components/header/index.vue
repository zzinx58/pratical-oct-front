<template>
    <div id="header-container">
        <div>123</div>
        <div id="right-wrapper">
            <Avatar />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "Header",
    setup () {

        return {}
    }
})
</script>

<style scoped lang="scss">
#right-wrapper {
    // @apply bg-blue-300;
}
#header-container {
    // @apply bg-yellow-400;
    @apply flex justify-between;
    background-color: #6366F1;
    height: $headerHeight;
    width: 100%;
}
</style>