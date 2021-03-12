<script>
    import {
        useMutation,
        useQuery,
        useQueryClient,
    } from "@sveltestack/svelte-query";
    import {
        Button,
        DataTable,
        DataTableSkeleton,
        OverflowMenu,
        OverflowMenuItem,
        Tile,
        Toolbar,
        ToolbarContent,
        ToolbarMenu,
        ToolbarSearch,
        Tag,
        InlineNotification,
    } from "carbon-components-svelte";
    import {format, parseISO} from "date-fns";
    import {getContext} from "svelte";
    import type {User} from "./spacetraders/types";
    import type {ContextType as UserContextType} from "./userContext";
    import {key as userContextKey} from "./userContext";
    import PurchaseShipModal from "./ship-purchase-modal/PurchaseShipModal.svelte";
import type { AxiosError } from "axios";

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

    let purchaseShipModalOpen = false;
    const openPurchaseShipModal = () => {
        purchaseShipModalOpen = true;
    };

    const queryClient = useQueryClient();

    const repayLoanMutation = useMutation<User, AxiosError, string, unknown>(async (loanId: string) =>{
            const response = await $userContextStore.instance.put<{user: User}>(
                `/users/${$userContextStore.username}/loans/${loanId}`
            )
            return response.data.user
        },
        {
            onSuccess: (response) => {
                queryClient.setQueryData(["user", $userContextStore.username], response)
            },
        }
    );
</script>

<Tile style="height: 100%;" light>
    {#if $userQuery.isLoading}
        <DataTableSkeleton
            headers={[
                {key: "id", value: "ID"},
                {key: "location", value: "Location"},
                {key: "cargo", value: "Cargo"},
                {key: "type", value: "Type"},
            ]}
            size="compact"
        />
        <DataTableSkeleton
            headers={[
                {key: "id", value: "ID"},
                {key: "due", value: "Due By"},
                {key: "repaymentAmount", value: "Repayment Amount"},
                {key: "status", value: "Status"},
                {key: "type", value: "Type"},
                {key: "actions", empty: true},
            ]}
            size="compact"
        />
    {:else if $userQuery.data}
        <PurchaseShipModal bind:open={purchaseShipModalOpen} />
        <DataTable
            title="Ships"
            description="All ships. Expand to see detailed cargo and flight plan information."
            size="compact"
            sortable
            expandable
            headers={[
                {key: "id", value: "ID"},
                {key: "location", value: "Location"},
                {key: "cargo", value: "Cargo"},
                {key: "type", value: "Type"},
            ]}
            rows={$userQuery.data.ships}
        >
            <span slot="cell" let:cell let:row>
                {#if cell.key === "id"}
                    {cell.value.slice(-5)}
                {:else if cell.key === "cargo"}
                    {row.maxCargo - row.spaceAvailable}/{row.maxCargo}
                {:else if cell.key === "location" && cell.value === undefined}
                    Flying to: TODO
                {:else}
                    {cell.value}
                {/if}
            </span>
            <div slot="expanded-row" class="expanded-row" let:row>
                <h5 class="ship-row-expanded-heading">Cargo</h5>
                <span>
                    {#each row.cargo as cargo (cargo.good)}
                        <Tag size="sm">{cargo.quantity}x {cargo.good}</Tag>
                    {/each}
                </span>
            </div>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarSearch />
                    <ToolbarMenu />
                    <Button on:click={openPurchaseShipModal}
                        >Purchase Ship</Button
                    >
                </ToolbarContent>
            </Toolbar>
        </DataTable>
        {#if $repayLoanMutation.variables}
            {#if $repayLoanMutation.isError && $repayLoanMutation.error}
                <InlineNotification kind="error" title="Error" subtitle="Repayment of loan with ID ending in {$repayLoanMutation.variables.slice(
                    -5
                )} failed: {$repayLoanMutation.error.response?.data.error.message}" timeout={10000} />
            {:else if $repayLoanMutation.isSuccess}
                <InlineNotification
                    kind="success"
                    title="Success"
                    subtitle="Repayment of loan with ID ending in {$repayLoanMutation.variables.slice(
                        -5
                    )} was successful."
                    timeout={10000}
                />
            {/if}
        {/if}
        <DataTable
            title="Loans"
            description="All loans. Coming up with a longer description is hard."
            size="compact"
            headers={[
                {key: "id", value: "ID"},
                {key: "due", value: "Due By"},
                {key: "repaymentAmount", value: "Repayment Amount"},
                {key: "status", value: "Status"},
                {key: "type", value: "Type"},
                {key: "actions", empty: true},
            ]}
            rows={$userQuery.data.loans}
        >
            <span slot="cell" let:cell let:row>
                {#if cell.key === "id"}
                    {cell.value.slice(-5)}
                {:else if cell.key === "due"}
                    {format(parseISO(cell.value), "Pp")}
                {:else if cell.key === "actions"}
                    <OverflowMenu flipped>
                        <OverflowMenuItem
                            danger
                            text="Repay"
                            on:click={() => $repayLoanMutation.mutate(row.id)}
                        />
                    </OverflowMenu>
                {:else}
                    {cell.value}
                {/if}
            </span>
            <div slot="expanded-row" class="expanded-row" let:row>TODO</div>
            <Toolbar>
                <ToolbarContent>
                    <Button>Take Loan</Button>
                </ToolbarContent>
            </Toolbar>
        </DataTable>
    {/if}
</Tile>

<style>
    .ship-row-expanded-heading {
        margin: 0.5em;
    }
    .expanded-row {
        display: flex;
        margin: 1em 0;
        align-items: center;
    }
</style>
