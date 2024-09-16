import 'tailwindcss/tailwind.css';
import './css/index.scss';
if (process.env.CONFIG_URL) {
  import('./client/pkg').then((wasm) => {
    console.log(wasm)
    wasm.main(process.env.CONFIG_URL);
  });

  console.log("Loading: ", process.env.CONFIG_URL)
} else {
  window.alert(`No config URL was found! Use schema at: \n${window.location}config.schema.json\nRecompile with config url provided!`);
}
import 'tailwindcss/tailwind.css';
import './css/index.scss';