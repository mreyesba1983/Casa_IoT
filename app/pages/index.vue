<template>
    <div>
    </div>
</template>

<script>
    export default{
        middleware: "authenticated",
        mounted() {
            $nuxt.$router.push("/login");
        }
    }
</script>
