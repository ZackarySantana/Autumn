/** @jsxImportSource solid-js */

import { createEffect, createSignal } from "solid-js";

function getData() {
    return fetch("/api/fetch").then((res) => res.json());
}

export default function Solid() {
    const [currentItem, setCurrentItem] = createSignal("");
    const [delta, setDelta] = createSignal(0);

    const setRandom = async () => {
        const tick = new Date().getTime();
        const data = await getData();
        setCurrentItem(data[Math.floor(Math.random() * data.length)]);
        setDelta(new Date().getTime() - tick);
    };

    createEffect(() => {
        setRandom();
    });

    return (
        <div class="fetch">
            <button onClick={setRandom}>New quote</button>
            <p>{delta()}ms</p>
            <div>{currentItem()}</div>
        </div>
    );
}
