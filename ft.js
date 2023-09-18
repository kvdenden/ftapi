const { ethers } = require("ethers");

const ABI = [
  "event Trade(address trader, address subject, bool isBuy, uint256 shareAmount, uint256 ethAmount, uint256 protocolEthAmount, uint256 subjectEthAmount, uint256 supply)",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT || "https://mainnet.base.org");
const ft = new ethers.Contract("0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4", ABI, provider);

module.exports = { ft, provider };
