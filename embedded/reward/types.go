package reward

import (
	"github.com/tendermint/dex-demo/types/store"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

type GetQueryRequest struct {
	Address sdk.AccAddress
}

type GetQueryResponseReward struct {
	AssetID store.EntityID `json:"asset_id"`
	Name    string         `json:"name"`
	Symbol  string         `json:"symbol"`
	Liquid  sdk.Uint       `json:"liquid"`
}

type GetQueryResponse struct {
	Rewards []GetQueryResponseReward `json:"rewards"`
}
