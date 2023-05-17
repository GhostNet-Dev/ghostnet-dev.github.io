import { GhostNetBlockHeader, GhostNetDataBlockHeader } from "./block.js";
import { GhostTransaction } from "./tx.js";

export type BlockInfoParam = {
    Header: GhostNetBlockHeader,
    DataHeader: GhostNetDataBlockHeader,
    IssuedCoin: number
}

export type TxInfoParam = {
    BlockId: number,
    Tx: GhostTransaction
}