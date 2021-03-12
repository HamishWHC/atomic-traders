<script>
    import type {PanzoomObject} from "@panzoom/panzoom";
    import Panzoom from "@panzoom/panzoom";
    import {onMount} from "svelte";
    import {Icon} from "carbon-components-svelte"
    import Reset32 from "carbon-icons-svelte/lib/Reset32";

    let draggableArea: HTMLDivElement;
    let panzoomObject: PanzoomObject;

    onMount(() => {
        console.log(draggableArea);
        panzoomObject = Panzoom(draggableArea, {maxScale: 1, canvas: true});
        draggableArea.parentElement!.addEventListener(
            "wheel",
            panzoomObject.zoomWithWheel
        );
    });
</script>

<section class="wrapper">
    <section class="fill-available" bind:this={draggableArea}>
        <div class="origin fill-available">
            <slot />
        </div>
    </section>
    <div class="reset-button">
        <Icon render={Reset32} on:click={panzoomObject?.reset} />
    </div>
    <slot name="unmoved" />
</section>

<style>
    .fill-available {
        width: 100%;
        height: 100%;
    }
    .aqua {
        background-color: aqua;
    }
    .origin {
        transform: translate(50%, 50%);
    }
    .reset-button {
        position: absolute;
        top: 1em;
        right: 1em;
    }
    .wrapper {
        position: relative;
        flex: 1;
    }
</style>
