import { BlockInfoParam } from "./models/param";

export class BlockStore {
    blockInfos: BlockInfoParam[];

    public constructor() {
        this.blockInfos = new Array<BlockInfoParam>();
    }

    public InsertBlockInfos(blockHeaders: BlockInfoParam[]) {
        this.blockInfos.push.apply(this.blockInfos, blockHeaders);
    }
    public GetBlockInfos(blockId: number) : any {
        return this.blockInfos.filter(x => Number(x.Header.Id) == blockId);
    }
}