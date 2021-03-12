<script>
    import {useQuery} from "@sveltestack/svelte-query";
    import type {AxiosInstance} from "axios";
    import DraggableArea from "./DraggableArea.svelte";
    import type {Location} from "../spacetraders/types";
    import SystemLocation from "./SystemLocation.svelte";
    import type {LocationWithOrbits} from "../utils";
    import {key as userContextKey} from "../userContext";
    import type {ContextType as UserContextType} from "../userContext";
    import {getContext} from "svelte";

    export let symbol: string = "OE";

    const userContextStore = getContext<UserContextType>(userContextKey);

    const systemDataQuery = useQuery(
        ["system", symbol],
        async ({queryKey: [, symbol]}) => {
            const {data} = await $userContextStore.instance.get<{locations: Location[]}>(
                `/game/systems/${symbol}/locations`
            );
            console.log(data);
            return data.locations;
        }
    );

    $: locations = $systemDataQuery.data?.map<LocationWithOrbits>((loc) => ({
        ...loc,
        orbits: [],
    }));

    $: if (locations) {
        locations.forEach((loc) => {
            const symbolArray = loc.symbol.split("-");
            if (symbolArray[0] !== symbol) {
                throw Error(
                    `Location symbol ${loc.symbol} does not match system symbol ${symbol}.`
                );
            }

            if (symbolArray.length > 2) {
                const parentSymbol = symbolArray.slice(0, -1).join("-");
                locations!
                    .find((l) => l.symbol === parentSymbol)
                    ?.orbits.push({x: loc.x, y: loc.y});
            }
        });
    }
</script>

<style>
    .system-name {
        top: 0.5em;
        left: 0.5em;
        position: absolute;
    }
</style>

{#if !$systemDataQuery.isLoading && !$systemDataQuery.isError && locations}
    <DraggableArea>
        {#each locations as location (location.symbol)}
            <SystemLocation {location} />
        {/each}
        <h3 slot="unmoved" class="system-name">Omicron Eridani</h3>
    </DraggableArea>
{/if}