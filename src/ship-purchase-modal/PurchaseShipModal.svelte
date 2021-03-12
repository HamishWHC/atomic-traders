<script>
    import {useQuery} from "@sveltestack/svelte-query";
    import {
        ComposedModal,
        Loading,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Search,
        Select,
        SelectItem,
    } from "carbon-components-svelte";
    import {getContext} from "svelte";
    import type {PurchasableShip} from "../spacetraders/types";
    import type {ContextType as UserContextType} from "../userContext";
    import {key as userContextKey} from "../userContext";
    import {sortByKey} from "../utils";
    import Categories from "./Categories.svelte";

    export let open = false;

    let sortBy = "manufacturer";
    let search = "";
    let selectedShip = "";

    const userContextStore = getContext<UserContextType>(userContextKey);

    let allShipsQuery = useQuery(["ships"], async () => {
        const {data} = await $userContextStore.instance.get<{
            ships: PurchasableShip[];
        }>(`/game/ships`);
        return data.ships;
    });

    const groupByKey = function <U extends keyof PurchasableShip>(
        data: PurchasableShip[],
        key: U
    ) {
        let categories: {
            id: PurchasableShip[U];
            ships: PurchasableShip[];
        }[] = [];
        data.forEach((ship) => {
            const category = categories.find((m) => m.id === ship[key]);
            if (category) {
                category.ships.push(ship);
            } else {
                categories.push({
                    id: ship[key],
                    ships: [ship],
                });
            }
        });
        return categories.sort(sortByKey("id"));
    };
</script>

<ComposedModal bind:open>
    <ModalHeader title="Purchase New Ship" />
    <ModalBody>
        <div class="toolbar">
            <Search
                style="margin: 1em 0.5em 1em 0em;"
                size="sm"
                labelText="Search"
                skeleton={$allShipsQuery.isLoading}
                bind:value={search}
            />
            <Select
                style="margin: 1em 0em 1em 0.5em; min-width: fit-content;"
                size="sm"
                labelText="Sort By"
                inline
                bind:selected={sortBy}
            >
                <SelectItem value="manufacturer" text="Manufacturer" />
                <SelectItem value="class" text="Class" />
                <SelectItem value="speed" text="Speed" />
                <SelectItem value="cargo" text="Max Cargo" />
                <SelectItem value="price" text="Lowest Price" />
            </Select>
        </div>

        {#if $allShipsQuery.isLoading || !$allShipsQuery.data}
            <Loading withOverlay={false} />
        {:else if sortBy === "manufacturer"}
            <Categories
                catergories={groupByKey(
                    $allShipsQuery.data,
                    "manufacturer"
                ).map((c) => ({...c, name: c.id}))}
                bind:selected={selectedShip}
            />
        {:else if sortBy === "class"}
            <Categories
                catergories={groupByKey(
                    $allShipsQuery.data,
                    "class"
                ).map((c) => ({...c, name: c.id}))}
                bind:selected={selectedShip}
            />
        {:else if sortBy === "speed"}
            <Categories
                catergories={groupByKey(
                    $allShipsQuery.data,
                    "speed"
                ).map((c) => ({...c, name: `Speed ${c.id}`}))}
                bind:selected={selectedShip}
            />
        {:else if sortBy === "cargo"}
            <Categories
                catergories={groupByKey(
                    $allShipsQuery.data,
                    "maxCargo"
                ).map((c) => ({...c, name: `${c.id}`}))}
                bind:selected={selectedShip}
            />
        {:else if sortBy === "price"}
            <!-- <ShipCategories
                categorys={groupByKey(
                    $allShipsQuery.data,
                    "class"
                ).map((c) => ({...c, name: c.id}))}
                bind:selected={selectedShip}
            /> -->
        {/if}
    </ModalBody>
    <ModalFooter
        primaryButtonText="Purchase"
        primaryButtonDisabled={selectedShip === ""}
    />
</ComposedModal>

<style>
    .toolbar {
        display: flex;
        align-items: flex-end;
    }
</style>
