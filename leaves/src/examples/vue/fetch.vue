<template>
    <div class="fetch">
        <button @click="newItem">New quote</button>
        <p>{{ delta }}ms</p>
        <div>{{ currentItem }}</div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            currentItem: "",
            delta: 0,
        };
    },
    mounted() {
        this.newItem();
    },
    methods: {
        async newItem() {
            const tick = new Date().getTime();
            const items = await fetch("/api/fetch").then((r) => r.json());
            this.currentItem = items[Math.floor(Math.random() * items.length)];
            this.delta = new Date().getTime() - tick;
        },
    },
};
</script>
