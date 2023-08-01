import 'tailwindcss/tailwind.css';
import './css/index.scss';
import('./client/pkg').then((wasm) => {
  console.log(wasm)
  wasm.main(process.env.CONFIG_URL);
});

console.log("Loading: ", process.env.CONFIG_URL)
