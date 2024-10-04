import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MyTokenModule = buildModule("MyTokenModule", (m) => {
  const erc20 = m.contract("MyToken");

  return { erc20 };
});

export default MyTokenModule;
