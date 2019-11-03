#!/usr/bin/env bash

rm -rf ~/.dexd*
dexd init testval --chain-id testchain
dexcli keys add dex-demo
dexcli keys add dex-demo-2

dexd add-genesis-account $(dexcli keys show dex-demo -a) 40000000000000000000000000stake,40000000000000000000000000asset1,40000000000000000000000000asset2,10000000000000000000000000asset3
dexd add-genesis-account $(dexcli keys show dex-demo-2 -a) 60000000000000000000000000stake,60000000000000000000000000asset1,60000000000000000000000000asset2,20000000000000000000000000asset3
dexcli config chain-id testchain
dexcli config output json
dexcli config indent true
dexcli config trust-node true

dexd gentx --name dex-demo
dexd gentx --name dex-demo-2

echo "Collecting genesis txs..."
dexd collect-gentxs

echo "Validating genesis file..."
dexd validate-genesis
