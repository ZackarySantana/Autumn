<script>
    import { onMount } from "svelte";
    let data = [];
    let currentItem = "";
    let delta = 0;
    const newItem = async () => {
        const tick = new Date().getTime();
        const data = await fetch("/api/fetch").then((r) => r.json());
        currentItem = data[Math.floor(Math.random() * data.length)];
        delta = new Date().getTime() - tick;
    };

    onMount(() => {
        newItem();
    });
</script>

<div class="fetch">
    <button on:click={newItem}>New quote</button>
    <p>{delta}ms</p>
    <div>{currentItem}</div>
</div>
