<script>
    import {useQuery} from "@sveltestack/svelte-query";
    import {slide} from "svelte/transition";
    import {
        Header,
        HeaderGlobalAction,
        HeaderNav,
        HeaderSearch,
        HeaderAction,
        HeaderUtilities,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        HeaderNavItem,
        SkeletonText,
    } from "carbon-components-svelte";
    import OpenPanelFilledRight20 from "carbon-icons-svelte/lib/OpenPanelFilledRight20";
    import OpenPanelRight20 from "carbon-icons-svelte/lib/OpenPanelRight20";
    import {getContext} from "svelte";
    import type {User} from "./spacetraders/types";
    import {key as userContextKey} from "./userContext";
    import type {ContextType as UserContextType} from "./userContext";

    let rightPanelOpen = false;
    const toggleRightPanel = () => {
        rightPanelOpen = !rightPanelOpen;
    };

    const userContextStore = getContext<UserContextType>(userContextKey);

    let userQuery = useQuery(
        ["user", $userContextStore.username],
        async ({queryKey: [, username]}) => {
            const {data} = await $userContextStore.instance.get<{user: User}>(
                `/users/${username}`
            );
            return data.user;
        }
    );

    let searchActive = false;
</script>

<Header company="ISC">
    <span slot="platform" class="app-name">Atomic Trader</span>
    <HeaderNav>
        <HeaderNavItem href="/markets" text="Markets" />
        <HeaderNavItem href="/system-map" text="System Map" />
    </HeaderNav>
    <HeaderUtilities>
        <div class="header-item">
            Active User:
            {#if $userQuery.data}
                {$userQuery.data.username}
            {:else}
                <SkeletonText style="margin: 0 0 0 1em;" width="5em" />
            {/if}
        </div>
        <div class="header-item">
            Credit Balance:
            {#if $userQuery.data}
                {$userQuery.data.credits}
            {:else}
                <SkeletonText style="margin: 0 0 0 1em;" width="5em" />
            {/if}
        </div>
        <HeaderSearch
            placeholder="Search Entities (not implemented)"
            bind:active={searchActive}
        />
        <HeaderGlobalAction
            icon={rightPanelOpen ? OpenPanelFilledRight20 : OpenPanelRight20}
            on:click={toggleRightPanel}
        />
        <HeaderAction>
            <HeaderPanelLinks>
                <HeaderPanelDivider
                    >InterSpace Commerce Software</HeaderPanelDivider
                >
                <HeaderPanelLink>Atomic Trader</HeaderPanelLink>
                <HeaderPanelDivider
                    >InterSpace Commerce Services</HeaderPanelDivider
                >
                <HeaderPanelLink>ISC Loans</HeaderPanelLink>
                <HeaderPanelLink>ST Stock Exchange</HeaderPanelLink>
                <HeaderPanelLink>Market API</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
    </HeaderUtilities>
</Header>
<div class="header-container">
    <div class="avoid-header" />
    <div class="panel-container">
        <div class="main-container">
            <slot />
        </div>
        {#if rightPanelOpen}
            <div>
                <slot name="right-panel" />
            </div>
        {/if}
    </div>
</div>

<style>
    .avoid-header {
        margin-top: 3rem;
    }
    .header-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .panel-container {
        display: flex;
        flex-grow: 1;
    }
    .main-container {
        flex-grow: 1;
        display: flex;
    }
    .header-item {
        align-self: center;
        padding: 1em;
        display: flex;
        align-items: center;
    }
    .app-name {
        white-space: nowrap;
    }
</style>
