<script>
    import {
        Accordion,
        AccordionItem,
        TileGroup,
    } from "carbon-components-svelte";
    import ShipRadioTile from "./RadioTile.svelte";
    import type {PurchasableShip} from "../spacetraders/types";

    export let selected = "";
    export let catergories: {name: string, ships: PurchasableShip[]}[];
</script>

<Accordion size="sm">
    {#each catergories as category (category.name)}
        <AccordionItem title={category.name}>
            <TileGroup bind:selected>
                {#each category.ships as ship (ship.type)}
                    <ShipRadioTile {ship} checked={selected === ship.type} />
                {/each}
            </TileGroup>
        </AccordionItem>
    {/each}
</Accordion>
