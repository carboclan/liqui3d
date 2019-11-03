package reward

import (
	"github.com/tendermint/go-amino"
	abci "github.com/tendermint/tendermint/abci/types"

	"github.com/tendermint/dex-demo/types/errs"
	"github.com/tendermint/dex-demo/x/asset"
	"github.com/tendermint/dex-demo/x/asset/types"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	QueryGet = "get"
)

func NewQuerier(keeper asset.Keeper) sdk.Querier {
	return func(ctx sdk.Context, path []string, req abci.RequestQuery) ([]byte, sdk.Error) {
		switch path[0] {
		case QueryGet:
			return queryGet(ctx, keeper, req.Data)
		default:
			return nil, sdk.ErrUnknownRequest("unknown reward request")
		}
	}
}

func queryGet(ctx sdk.Context, keeper asset.Keeper, reqB []byte) ([]byte, sdk.Error) {
	var req GetQueryRequest
	err := amino.UnmarshalBinaryBare(reqB, &req)
	if err != nil {
		return nil, errs.ErrUnmarshalFailure("failed to unmarshal get query request")
	}

	res := GetQueryResponse{
		Rewards: make([]GetQueryResponseReward, 0),
	}
	keeper.Iterator(ctx, func(a types.Asset) bool {
		bal := keeper.Reward(ctx, a.ID, req.Address)
		if bal.IsZero() {
			return true
		}

		res.Rewards = append(res.Rewards, GetQueryResponseReward{
			AssetID: a.ID,
			Name:    a.Name,
			Symbol:  a.Symbol,
			Liquid:  bal,
		})

		return true
	})

	b, err := codec.MarshalJSONIndent(codec.New(), res)
	if err != nil {
		return nil, errs.ErrMarshalFailure("could not marshal result")
	}
	return b, nil
}
