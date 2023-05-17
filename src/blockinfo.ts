import { elapsedTime } from "./utils.js";
import { BlockStore } from "./store.js";
import { BlockInfoParam } from "./models/param.js";

const PageViewCount = 10;
const MaxUnsignedInt = ((1 << 31) >>> 0); // unsigned int max


export class BlockInfo {
    g_minBlockId: number;
    g_masterAddr: string;
    throttleWait: boolean;

    public constructor(private blockStore: BlockStore) {
        this.g_minBlockId = MaxUnsignedInt;
        this.g_masterAddr = "";
        this.throttleWait = false;
    }

    insertBlockInfo(blockInfoParam: BlockInfoParam[]) {
        const t = document.querySelector('#blockinfo') as HTMLTableElement;
        if (t == null) return 1;
        this.blockStore.InsertBlockInfos(blockInfoParam);

        blockInfoParam.forEach(blockInfo => {
            const newRow = t.insertRow();
            const newCell1 = newRow.insertCell(0);
            const newCell2 = newRow.insertCell(1);
            const newCell3 = newRow.insertCell(2);
            const newCell4 = newRow.insertCell(3);
            const link = document.createElement('a');
            link.setAttribute('onclick', `ClickLoadPage("blockdetail", false, "&blockid=${blockInfo.Header.Id}")`);
            link.innerHTML = `${blockInfo.Header.Id}`;
            newCell1.appendChild(link);
            newCell2.innerText = `${elapsedTime(Number(blockInfo.Header.TimeStamp) * 1000)}`;
            newCell3.innerText = `${blockInfo.Header.TransactionCount + blockInfo.Header.AliceCount}`;
            newCell4.innerText = `${blockInfo.IssuedCoin}`;
            if (this.g_minBlockId > Number(blockInfo.Header.Id))
                this.g_minBlockId = Number(blockInfo.Header.Id)
        });
    }

    handleScroll(): void {
        const endOfPage = window.innerHeight <= window.pageYOffset + document.body.offsetHeight;
        console.log(window.innerHeight);
        console.log(window.pageYOffset);
        console.log(document.body.offsetHeight);
        console.log(endOfPage);
        if (endOfPage) {
            // execute Loading
            this.fetchBlockInfo(this.g_masterAddr);
        }
    }
    throttle(evt: Event): void {
        if (this.throttleWait) return;
        this.throttleWait = true;
        console.log("throttle")
        setTimeout(() => {
            this.handleScroll();
            this.throttleWait = false;
        }, 250);
    }

    Range(): Array<number> {
        const requestBlockIds = new Array(PageViewCount);
        let pos = this.g_minBlockId - 1;

        for (let i = 0; i < PageViewCount && pos > 0; i++, pos--) {
            requestBlockIds[i] = pos;
        }

        return requestBlockIds
    }

    fetchBlockInfo(target: string): Promise<Response> {
        this.g_masterAddr = target;
        const promise = (this.g_minBlockId == MaxUnsignedInt) ?
            fetch(target + "/blocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            }) : fetch(target + "/blocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.Range())
            });
        promise.then((response) => response.json())
            .then((list) => this.insertBlockInfo(list));
        return promise;
    }

    public Run(target: string): boolean {
        this.g_masterAddr = target;
        this.fetchBlockInfo(target)
            //.then((evt)=> handleScroll())
            .then(() => window.addEventListener("scroll", this.throttle));

        return true;
    }

    public Release = () => {
        window.removeEventListener("scroll", this.throttle);
    }
}