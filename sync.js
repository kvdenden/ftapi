const { ft, provider } = require("./ft");

const getWalletInfo = (address) => fetch(`https://prod-api.kosetto.com/users/${address}`).then((res) => res.json());

async function main() {
  let lastBlock = 2430440; // TODO: get from db

  while (true) {
    try {
      const currentBlock = await provider.getBlockNumber();
      while (lastBlock < currentBlock) {
        const toBlock = Math.min(lastBlock + 100, currentBlock);

        const events = await ft.queryFilter(ft.filters.Trade(), lastBlock + 1, toBlock);

        const subjects = new Set(events.map((e) => e.args.subject));

        console.log("number of events", events.length);
        console.log("number of subjects", subjects.size);

        // for each subject
        // - check if they are already in our db
        // - look up wallet info and store in db

        lastBlock = toBlock;
      }
    } catch (e) {
      console.error(e);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep 5 seconds
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
