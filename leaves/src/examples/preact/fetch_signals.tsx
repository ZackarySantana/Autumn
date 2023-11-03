/** @jsxImportSource preact */

import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function Preact() {
    const currentItem = signal("");
    const delta = signal(0);

    const setRandom = async () => {
        const tick = new Date().getTime();
        const items = await fetch("/api/fetch").then((r) => r.json());
        currentItem.value = items[Math.floor(Math.random() * items.length)];
        delta.value = new Date().getTime() - tick;
    };

    useEffect(() => {
        setRandom();
    }, []);

    return (
        <>
            <div className="fetch">
                <button onClick={setRandom}>New quote</button>
                <p>{delta}ms</p>
                <div>{currentItem}</div>
            </div>
        </>
    );
}
