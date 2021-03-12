<script>
    import {RadioTile} from "carbon-components-svelte";
    import type {PurchasableShip} from "../spacetraders/types";

    export let ship: PurchasableShip;
    export let checked: boolean;
</script>

<RadioTile light value={ship.type} {checked}>
    {ship.type}
</RadioTile>
