import { App } from './app';

async function main() {
  const app = new App();
  await app.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
