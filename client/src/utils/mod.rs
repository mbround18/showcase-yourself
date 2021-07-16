pub async fn promise<F: std::future::Future>(f: F, resolve: yew::Callback<F::Output>) {
    resolve.emit(f.await);
}
