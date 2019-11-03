package reward

import (
	"net/http"

	"github.com/gorilla/mux"

	"github.com/tendermint/dex-demo/embedded"
	"github.com/tendermint/dex-demo/embedded/auth"

	"github.com/cosmos/cosmos-sdk/client/context"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/types/rest"
)

func RegisterRoutes(ctx context.CLIContext, r *mux.Router, cdc *codec.Codec, enableFaucet bool) {
	r.Handle("/user/rewards", auth.DefaultAuthMW(getRewardHandler(ctx, cdc))).Methods("GET")
}

func getRewardHandler(ctx context.CLIContext, cdc *codec.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		owner := auth.MustGetKBFromSession(r)

		req := GetQueryRequest{
			Address: owner.GetAddr(),
		}

		resB, _, err := ctx.QueryWithData("custom/reward/get", cdc.MustMarshalBinaryBare(req))
		if err != nil {
			rest.WriteErrorResponse(w, http.StatusBadRequest, err.Error())
			return
		}
		embedded.PostProcessResponse(w, ctx, resB)
	}
}
