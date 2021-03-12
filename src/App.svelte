<script>
    import {QueryClient, QueryClientProvider} from "@sveltestack/svelte-query";
    import {makeSpaceTradersApi} from "./spacetraders";
    import SystemMap from "./system-map/SystemMap.svelte";
    import RightPanel from "./RightPanel.svelte";
    import Shell from "./Shell.svelte";
    import {writable} from "svelte/store";
    import {key as userContextKey} from "./userContext";
    import type {ContextType as UserContextType} from "./userContext"
    import {setContext} from "svelte";

    const queryClient = new QueryClient();

    let userContext: UserContextType = writable({
        username: "HamishWHC",
        instance: makeSpaceTradersApi(
            //@ts-expect-error
            import.meta.env.SNOWPACK_PUBLIC_SPACETRADERS_TOKEN
        ),
    });

    setContext(userContextKey, userContext);
</script>

<QueryClientProvider client={queryClient}>
    <Shell>
        <SystemMap />
        <RightPanel slot="right-panel" />
    </Shell>
</QueryClientProvider>

<style lang="scss">
    /** Gray 10 theme **/
    @import "carbon-components-svelte/css/g90.css";
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        height: 100vh;
    }
</style>
