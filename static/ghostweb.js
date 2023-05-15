import { elapsedTime } from "./utils.js";
const PageViewCount = 10;
const MaxUnsignedInt = ((1 << 31) >>> 0); // unsigned int max
let g_minBlockId = MaxUnsignedInt; // unsigned int max
let g_masterAddr;
const insertBlockInfo = (blockHeaders) => {
    const t = document.querySelector('#blockinfo');
    if (t == null)
        return 1;
    blockHeaders.forEach(blockInfo => {
        const newRow = t.insertRow();
        const newCell1 = newRow.insertCell(0);
        const newCell2 = newRow.insertCell(1);
        const newCell3 = newRow.insertCell(2);
        const newCell4 = newRow.insertCell(3);
        newCell1.innerText = `${blockInfo.Header.Id}`;
        newCell2.innerText = `${elapsedTime(Number(blockInfo.Header.TimeStamp) * 1000)}`;
        newCell3.innerText = `${blockInfo.Header.TransactionCount + blockInfo.Header.AliceCount}`;
        newCell4.innerText = `${blockInfo.IssuedCoin}`;
        if (g_minBlockId > Number(blockInfo.Header.Id))
            g_minBlockId = Number(blockInfo.Header.Id);
    });
};
const handleScroll = () => {
    const endOfPage = window.innerHeight <= window.pageYOffset + document.body.offsetHeight;
    console.log(window.innerHeight);
    console.log(window.pageYOffset);
    console.log(document.body.offsetHeight);
    console.log(endOfPage);
    if (endOfPage) {
        // execute Loading
        fetchBlockInfo(g_masterAddr);
    }
};
let throttleWait;
const throttle = (evt) => {
    if (throttleWait)
        return;
    throttleWait = true;
    console.log("throttle");
    setTimeout(() => {
        handleScroll();
        throttleWait = false;
    }, 250);
};
const Range = () => {
    const requestBlockIds = new Array(PageViewCount);
    let pos = g_minBlockId - 1;
    for (let i = 0; i < PageViewCount && pos > 0; i++, pos--) {
        requestBlockIds[i] = pos;
    }
    return requestBlockIds;
};
const fetchBlockInfo = (target) => {
    g_masterAddr = target;
    const promise = (g_minBlockId == MaxUnsignedInt) ?
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
        body: JSON.stringify(Range())
    });
    promise.then((response) => response.json())
        .then((list) => insertBlockInfo(list));
    return promise;
};
const BlockScan = (target) => {
    fetchBlockInfo(target)
        //.then((evt)=> handleScroll())
        .then(() => window.addEventListener("scroll", throttle));
};
const BlockScanRelease = () => {
    window.removeEventListener("scroll", throttle);
};
export { BlockScan, BlockScanRelease };
//# sourceMappingURL=ghostweb.js.map