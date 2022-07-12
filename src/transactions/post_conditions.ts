import { createAssetInfo, createFungiblePostCondition, createNonFungiblePostCondition, createStandardPrincipal, createSTXPostCondition, FungibleConditionCode, NonFungibleConditionCode, serializePostCondition } from "micro-stacks/transactions";
import { principalCV, tupleCV, uintCV } from "micro-stacks/clarity";
import {print_byte_array} from "../utils";

const condition_principal = "SP2NDX0Q0XC6MME71PHNPN26DHTDZ1FHH9X26R0BW";
const asset_address = "SP39847RSVXG9MZ98PPM8J49ZK1DFFA8G6PE79593";
const asset_contract_name = "ryder-token-v1";
const asset_name = "ryd";

const stx_post_conditions = [
	() => createSTXPostCondition(condition_principal, FungibleConditionCode.Equal, 0x10),
	() => createSTXPostCondition(condition_principal, FungibleConditionCode.Greater, 0x20),
	() => createSTXPostCondition(condition_principal, FungibleConditionCode.GreaterEqual, 0x30),
	() => createSTXPostCondition(condition_principal, FungibleConditionCode.Less, 0x40),
	() => createSTXPostCondition(condition_principal, FungibleConditionCode.LessEqual, 0x50)
];

console.log("STX post conditions");
stx_post_conditions.map(x => console.log(x.toString()));
stx_post_conditions.map(x => x()).map(serializePostCondition).map(print_byte_array);
console.log("");

const fungible_token_asset_info = createAssetInfo(asset_address, asset_contract_name, asset_name);

const fungible_token_post_conditions = [
	() => createFungiblePostCondition(condition_principal, FungibleConditionCode.Equal, 0x10, fungible_token_asset_info),
	() => createFungiblePostCondition(condition_principal, FungibleConditionCode.Greater, 0x20, fungible_token_asset_info),
	() => createFungiblePostCondition(condition_principal, FungibleConditionCode.GreaterEqual, 0x30, fungible_token_asset_info),
	() => createFungiblePostCondition(condition_principal, FungibleConditionCode.Less, 0x40, fungible_token_asset_info),
	() => createFungiblePostCondition(condition_principal, FungibleConditionCode.LessEqual, 0x50, fungible_token_asset_info)
];

console.log("fungible token post conditions");
fungible_token_post_conditions.map(x => console.log(x.toString()));
fungible_token_post_conditions.map(x => x()).map(serializePostCondition).map(print_byte_array);
console.log("");

const non_fungible_token_asset_info = createAssetInfo(asset_address, asset_contract_name, asset_name);
const asset_id_simple = uintCV(16);
const asset_id_complex = tupleCV({"owner": principalCV(condition_principal), "token-id": uintCV(32)});

const non_fungible_token_post_conditions = [
	() => createNonFungiblePostCondition(condition_principal, NonFungibleConditionCode.Owns, non_fungible_token_asset_info, asset_id_simple),
	() => createNonFungiblePostCondition(condition_principal, NonFungibleConditionCode.DoesNotOwn, non_fungible_token_asset_info, asset_id_simple),
	() => createNonFungiblePostCondition(condition_principal, NonFungibleConditionCode.Owns, non_fungible_token_asset_info, asset_id_complex),
	() => createNonFungiblePostCondition(condition_principal, NonFungibleConditionCode.DoesNotOwn, non_fungible_token_asset_info, asset_id_complex)
];

console.log("non-fungible token post conditions");
non_fungible_token_post_conditions.map(x => console.log(x.toString()));
non_fungible_token_post_conditions.map(x => x()).map(serializePostCondition).map(print_byte_array);
console.log("");
