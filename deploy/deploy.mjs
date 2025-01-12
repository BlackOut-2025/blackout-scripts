import {ethers } from 'ethers';


const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"purchaseDate","type":"uint256"}],"name":"TicketPurchased","type":"event"},{"inputs":[],"name":"TICKET_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyTickets","outputs":[{"components":[{"internalType":"uint256","name":"ticketId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isUsed","type":"bool"},{"internalType":"uint256","name":"purchaseDate","type":"uint256"}],"internalType":"struct TicketManager.Ticket[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"getTicketById","outputs":[{"components":[{"internalType":"uint256","name":"ticketId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"isUsed","type":"bool"},{"internalType":"uint256","name":"purchaseDate","type":"uint256"}],"internalType":"struct TicketManager.Ticket","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purchaseTicket","outputs":[],"stateMutability":"payable","type":"function"}]

const bytecode = "608080604052346015576104e3908161001a8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f3560e01c9081631a95f15f1461031c5750806321846c76146101bc57806327b7aabc1461016f5763e1d10d8514610048575f80fd5b3461016b575f36600319011261016b57335f525f60205260405f2080549067ffffffffffffffff8211610157576040519161008960208260051b0184610357565b8083526020830180925f5260205f205f915b838310610111578486604051918291602083019060208452518091526040830191905f5b8181106100cd575050500390f35b91935091602060808261010360019488516060809180518452602081015160208501526040810151151560408501520151910152565b0194019101918493926100bf565b600460206001926040516101248161033b565b85548152848601548382015260ff600287015416151560408201526003860154606082015281520192019201919061009b565b634e487b7160e01b5f52604160045260245ffd5b5f80fd5b3461016b57602036600319011261016b57608061018d60043561038d565b6101ba60405180926060809180518452602081015160208501526040810151151560408501520151910152565bf35b5f36600319011261016b57662386f26fc1000034036102de57335f525f60205260405f205460405160208101914283523360601b6040830152605482015260548152610209607482610357565b5190206040516102188161033b565b818152602081019134835260408201915f835260608101428152335f525f60205260405f20908154946801000000000000000086101561015757600186018084558610156102ca577f2a91574e12ad96234e84923e146b0946ecfb871cd8d5534dc1fdcbe87a7c01b3966060966003945f5260205f209060021b0194518555516001850155600284019051151560ff8019835416911617905551910155604051903382526020820152426040820152a1005b634e487b7160e01b5f52603260045260245ffd5b60405162461bcd60e51b8152602060048201526016602482015275496e636f7272656374207469636b657420707269636560501b6044820152606490fd5b3461016b575f36600319011261016b5780662386f26fc1000060209252f35b6080810190811067ffffffffffffffff82111761015757604052565b90601f8019910116810190811067ffffffffffffffff82111761015757604052565b80518210156102ca5760209160051b010190565b6040516103998161033b565b5f81525f60208201525f60408201525f606082015250335f525f60205260405f20805467ffffffffffffffff811161015757604051916103df60208360051b0184610357565b81835260208301905f5260205f205f915b83831061046757505050505f5b815181101561042f57826104118284610379565b515114610420576001016103fd565b9061042b9250610379565b5190565b60405162461bcd60e51b815260206004820152601060248201526f151a58dad95d081b9bdd08199bdd5b9960821b6044820152606490fd5b6004602060019260405161047a8161033b565b85548152848601548382015260ff60028701541615156040820152600386015460608201528152019201920191906103f056fea2646970667358221220456b29c8b7f193bc89a1aea864be6936aed453873080fb0ae826bde5f8400a9664736f6c634300081c0033";


const provider = new ethers.providers.JsonRpcProvider(
  "https://ethereum-holesky.nodit.io/" + token
);
const mnemonic = "";
const accountFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic);
const connectWalletToProvider = accountFromMnemonic.connect(provider);
const contractFactory = new ethers.ContractFactory(
  abi,
  bytecode,
  connectWalletToProvider
);

(async () => {
  try {
    const deployingContract = await contractFactory.deploy();
    await deployingContract.deployed();
    console.log(deployingContract.address);
  } catch (error) {
    console.error(error);
  }
})();
