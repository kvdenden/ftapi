const db = require("./db");
const { ft, provider } = require("./ft");
const _ = require("lodash");

const getWalletInfo = (address) => fetch(`https://prod-api.kosetto.com/users/${address}`).then((res) => res.json());

const SYNC_BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE) || 100;

async function main() {
  let [lastBlock = 2430440] = await db.pluck("value").from("config").where("key", "sync");

  while (true) {
    try {
      const currentBlock = await provider.getBlockNumber();
      while (lastBlock < currentBlock) {
        const toBlock = Math.min(lastBlock + SYNC_BATCH_SIZE, currentBlock);
        console.log("Sync", lastBlock);

        const events = await ft.queryFilter(ft.filters.Trade(), lastBlock + 1, toBlock);
        const subjects = _.uniq(events.map((e) => e.args.subject));

        const existingWallets = await db.pluck("wallet").from("users").whereIn("wallet", subjects);

        const newWallets = _.difference(subjects, existingWallets);

        const newUsers = [];

        for (const wallet of newWallets) {
          const userInfo = await getWalletInfo(wallet);
          if (userInfo.twitterUsername) {
            newUsers.push({ wallet, username: userInfo.twitterUsername.toLowerCase() });
          }
        }

        if (newUsers.length > 0) {
          console.log("New users", newUsers.map((u) => u.username).join(", "));
          await db.insert(newUsers).into("users").onConflict().ignore();
        }

        await db("config").insert({ key: "sync", value: toBlock }).onConflict("key").merge();

        lastBlock = toBlock;
      }
    } catch (e) {
      console.error(e.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep 5 seconds
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
