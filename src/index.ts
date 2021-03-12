import App from "./App.svelte";

var app = new App({
    target: document.body,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
//@ts-expect-error
if (import.meta.hot) {
    //@ts-expect-error
    import.meta.hot.accept();
    //@ts-expect-error
    import.meta.hot.dispose(() => {
        app.$destroy();
    });
}
