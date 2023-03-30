import 'tailwindcss/tailwind.css';
import './css/index.scss';
import('./pkg').then((wasm) => {
  wasm.main(process.env.CONFIG_URL);
});

console.log("Loading: ", process.env.CONFIG_URL)
