package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/tendermint/dex-demo/types/store"
)

const (
	ModuleName = "market"
	RouterKey  = ModuleName
	StoreKey   = RouterKey
)

type Batch struct {
	BlockHeight  int64
	Participants []sdk.AccAddress
}

type Market struct {
	ID           store.EntityID
	BaseAssetID  store.EntityID
	QuoteAssetID store.EntityID
	RewardPool   sdk.AccAddress
	LastBatch    Batch
}

func New(id store.EntityID, baseAsset store.EntityID, quoteAsset store.EntityID, rewardPool sdk.AccAddress) Market {
	return Market{
		ID:           id,
		BaseAssetID:  baseAsset,
		QuoteAssetID: quoteAsset,
		RewardPool:   rewardPool,
		LastBatch:    Batch{BlockHeight: -1, Participants: nil},
	}
}
