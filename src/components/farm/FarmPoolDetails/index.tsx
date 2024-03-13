import CopyButton from "@/components/common/CopyButton";
import { useSinglePoolQuery } from "@/graphql/generated/graphql";
import { formatCurrency } from "@/utils/common/formatCurrency";
import { useMemo } from "react";
import { FetchTokenResult } from "wagmi/actions";

interface IFarmPoolDetails {
    name: string;
    id: string;
    token0: FetchTokenResult;
    token1: FetchTokenResult;
}

const DataWithCopyButton = ({ data} : { data: string } ) => <div className="flex items-center">
    <span className="mr-2">{data}</span>
    <CopyButton data={data}/>
</div>

const FarmPoolDetails = ({ name, id, token0, token1 }: IFarmPoolDetails) => {

    const { data: pool } = useSinglePoolQuery({
        variables: {
            poolId: id
        }
    })

    const formattedPool = useMemo(() => {

        if (!pool?.pool) return

        return {
            token0To1Rate: Number(pool.pool.token0Price).toFixed(4),
            token1To0Rate: Number(pool.pool.token1Price).toFixed(4),
            tvlUSD: formatCurrency.format(pool.pool.totalValueLockedUSD),
        }      

    }, [pool])

    return <div className="text-left p-4 border rounded-xl">
        <div className="font-bold mb-4">{`${name} Details`}</div>
        <div className="flex flex-col gap-4">
            <div>
                <div className="font-semibold text-sm">Pool address</div>
                <DataWithCopyButton data={id} />
            </div>
            <div>
                <div className="font-semibold text-sm">{`${token0.symbol} address`}</div>
                <DataWithCopyButton data={token0.address} />
            </div>
            <div>
                <div className="font-semibold text-sm">{`${token1.symbol} address`}</div>
                <DataWithCopyButton data={token1.address} />
            </div>
            <div>
                <div className="font-semibold text-sm">{`${token0.symbol} to ${token1.symbol} rate`}</div>
                { formattedPool ? <div>{`1 ${token0.symbol} = ${formattedPool.token0To1Rate} ${token1.symbol}`}</div> : <div></div> }
            </div>
            <div>
                <div className="font-semibold text-sm">{`${token1.symbol} to ${token0.symbol} rate`}</div>
                { formattedPool ? <div>{`1 ${token1.symbol} = ${formattedPool.token1To0Rate} ${token0.symbol}`}</div> : <div></div> }
            </div>
            <div>
                <div className="font-semibold text-sm">TVL</div>
                { formattedPool ? <div>{formattedPool.tvlUSD}</div> : <div></div> }
            </div>
        </div>
    </div>

}

export default FarmPoolDetails