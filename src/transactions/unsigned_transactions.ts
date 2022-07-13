import {
  contractPrincipalCV,
  standardPrincipalCV,
  uintCV,
} from "micro-stacks/clarity";
import { StacksMainnet } from "micro-stacks/network";
import {
  AnchorMode,
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  NonFungibleConditionCode,
  PostConditionMode,
} from "micro-stacks/transactions";
import {
  asset_address,
  asset_contract_name,
  asset_name,
  public_key_1,
  user_1,
  user_2,
} from "../constants";
import { to_byte_array_string } from "../utils";

const defaultOptions = {
  fee: 100,
  nonce: 0,
  network: new StacksMainnet(),
};

export async function generate() {
  const txs = await Promise.all([
    // stx token transfer with any anchor mode
    makeUnsignedSTXTokenTransfer(
      Object.assign(defaultOptions, {
        amount: 100,
        recipient: user_2,
        anchorMode: AnchorMode.Any,
        publicKey: public_key_1,
      })
    ),

    // stx token transfer with on chain only anchor mode
    makeUnsignedSTXTokenTransfer(
      Object.assign(defaultOptions, {
        amount: 100,
        recipient: user_2,
        anchorMode: AnchorMode.OnChainOnly,
        publicKey: public_key_1,
      })
    ),

    // stx token transfer with off chain only anchor mode
    makeUnsignedSTXTokenTransfer(
      Object.assign(defaultOptions, {
        amount: 100,
        recipient: user_2,
        anchorMode: AnchorMode.OffChainOnly,
        publicKey: public_key_1,
      })
    ),
    // contract call with allow mode
    makeUnsignedContractCall(
      Object.assign(defaultOptions, {
        contractAddress: asset_address,
        contractName: asset_contract_name,
        functionName: "transfer",
        functionArgs: [
          uintCV(1),
          standardPrincipalCV(user_1),
          standardPrincipalCV(user_2),
        ],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        publicKey: public_key_1,
      })
    ),

    // deny mode with standard non-fungible post conditions
    makeUnsignedContractCall(
      Object.assign(defaultOptions, {
        contractAddress: asset_address,
        contractName: asset_contract_name,
        functionName: "transfer",
        functionArgs: [
          uintCV(1),
          standardPrincipalCV(user_1),
          standardPrincipalCV(user_2),
        ],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardNonFungiblePostCondition(
            user_1,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(asset_address, asset_contract_name, asset_name),
            uintCV(1)
          ),
        ],
        publicKey: public_key_1,
      })
    ),

    // deny mode with contract non-fungible post conditions
    makeUnsignedContractCall(
      Object.assign(defaultOptions, {
        contractAddress: asset_address,
        contractName: asset_contract_name,
        functionName: "transfer",
        functionArgs: [
          uintCV(1),
          contractPrincipalCV(asset_address, asset_contract_name),
          standardPrincipalCV(user_2),
        ],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeContractNonFungiblePostCondition(
            asset_address,
            asset_contract_name,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(asset_address, asset_contract_name, asset_name),
            uintCV(1)
          ),
        ],
        publicKey: public_key_1,
      })
    ),

    // deny mode with standard fungible post conditions
    makeUnsignedContractCall(
      Object.assign(defaultOptions, {
        contractAddress: asset_address,
        contractName: asset_contract_name,
        functionName: "transfer",
        functionArgs: [
          uintCV(2),
          standardPrincipalCV(user_1),
          standardPrincipalCV(user_2),
        ],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardFungiblePostCondition(
            user_1,
            FungibleConditionCode.LessEqual,
            2,
            createAssetInfo(asset_address, asset_contract_name, asset_name)
          ),
        ],
        publicKey: public_key_1,
      })
    ),

    // deny mode with contract fungible post conditions
    makeUnsignedContractCall(
      Object.assign(defaultOptions, {
        contractAddress: asset_address,
        contractName: asset_contract_name,
        functionName: "transfer",
        functionArgs: [
          uintCV(2),
          contractPrincipalCV(asset_address, asset_contract_name),
          standardPrincipalCV(user_2),
        ],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeContractFungiblePostCondition(
            asset_address,
            asset_contract_name,
            FungibleConditionCode.LessEqual,
            2,
            createAssetInfo(asset_address, asset_contract_name, asset_name)
          ),
        ],
        publicKey: public_key_1,
      })
    ),
  ]);

  return [
    "Raw transactions",
    txs
      .map((tx) => tx.serialize())
      .map(to_byte_array_string)
      .join("\n"),
    "Transaction IDs",
    txs
      .map((tx) => Buffer.from(tx.txid(), "hex"))
      .map(to_byte_array_string)
      .join("\n"),
  ].join("\n");
}
