export class BlockStore {
    constructor() {
        this.blockInfos = new Array();
    }
    InsertBlockInfos(blockHeaders) {
        this.blockInfos.push.apply(this.blockInfos, blockHeaders);
    }
    GetBlockInfos(blockId) {
        return this.blockInfos.filter(x => Number(x.Header.Id) == blockId);
    }
}
//# sourceMappingURL=store.js.map