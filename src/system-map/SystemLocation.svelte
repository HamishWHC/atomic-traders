<script>
    import planet from "./planet.png";
    import {diameterFromOriginAndPoint, GRID_SIZE} from "../utils";
    import type {LocationWithOrbits, Point} from "../utils";

    export let location: LocationWithOrbits;

    const makeOrbitStyle = (orbit: Point) => {
        const diameter = diameterFromOriginAndPoint(
            {x: location.x * GRID_SIZE, y: location.y * -GRID_SIZE},
            {x: orbit.x * GRID_SIZE, y: orbit.y * -GRID_SIZE}
        );
        return `width: ${diameter}px; height: ${diameter}px;`;
    };
</script>

<div class="centering-wrapper">
    <div
        class="location"
        style="transform: translate({GRID_SIZE * location.x}px, {-GRID_SIZE *
            location.y}px)"
    >
        <img class="icon" src={planet} alt="Planet" />
        {#each location.orbits as orbit (`${orbit.x}/${orbit.y}`)}
            <div class="orbit" style={makeOrbitStyle(orbit)} />
        {/each}
        <div class="info">
            <div class="name">{location.name}</div>
            <div class="symbol">{location.symbol}</div>
        </div>
    </div>
</div>

<style>
    .location {
        text-align: center;
    }
    .centering-wrapper {
        position: absolute;
        display: inline-block;
        transform: translate(-50%, -50%);
    }
    .name {
    }
    .symbol {
        font-size: 0.75em;
    }
    .info {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        z-index: 30;
        width: 5em;
    }
    .icon {
        width: 5em;
        z-index: 20;
    }
    .orbit {
        border-radius: 50%;
        border: solid 2px grey;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }
</style>
