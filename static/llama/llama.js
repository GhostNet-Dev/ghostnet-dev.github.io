export class Llama {
    constructor(blockStore, ipc) {
        this.blockStore = blockStore;
        this.m_blockStore = blockStore;
        this.m_ipc = ipc;
        this.m_model = "UNetModel";
        ipc.RegisterMsgHandler('generateLog', (log) => {
            const printTag = document.getElementById("log");
            printTag.innerHTML = `
                ${log}
            `;
        });
        ipc.RegisterMsgHandler('reply_generateImage', (filename) => {
            const printTag = document.getElementById("printImg");
            printTag.innerHTML = `
                <img src="${window.MasterAddr}/image?filename=${filename}">
            `;
        });
    }
    generateImage() {
        const promptTag = document.getElementById("prompt");
        const prompt = promptTag.value.toLowerCase();
        const npromptTag = document.getElementById("nprompt");
        const nprompt = npromptTag.value.toLowerCase();
        const heightTag = document.getElementById("height");
        const height = heightTag.value;
        const widthTag = document.getElementById("width");
        const width = widthTag.value;
        const stepTag = document.getElementById("step");
        const step = stepTag.value;
        const seedTag = document.getElementById("seed");
        const seed = (seedTag.value == "") ? "-1" : seedTag.value;
        const printTag = document.getElementById("printImg");
        printTag.innerHTML = `
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden"></span>
            </div>
        `;
        if (this.m_model == "UNetModel") {
            this.m_ipc.SendMsg("generateImage", prompt, nprompt, height, width, step, seed);
        }
        else {
            this.m_ipc.SendMsg("generateImage2", prompt, nprompt, height, width, step, seed, this.m_model);
        }
    }
    selectModel(key, model) {
        this.m_model = model;
        const btn = document.getElementById("dropdownMenu2");
        btn.innerText = key;
    }
    drawHtmlUpdateModelList() {
        const models = new Map();
        models.set("UNetModel", "UNetModel");
        models.set("SD-v1.4", "sd-v1-4-ggml-model-f16.bin");
        models.set("chiled-remix", "chilled_remix_v2-ggml-model-f16.bin");
        const tag = document.getElementById("modellist");
        if (tag == null)
            return;
        tag.innerHTML = "";
        models.forEach((model, key, map) => {
            const button = document.createElement('button');
            button.setAttribute('class', 'dropdown-item');
            button.onclick = () => this.selectModel(key, model);
            button.innerText = key;
            tag.appendChild(button);
        });
    }
    Run(masterAddr) {
        if (!this.m_ipc.IsOpen())
            this.m_ipc.OpenChannel(window.MasterWsAddr + "/ws");
        const btn = document.getElementById("generateBtn");
        btn.onclick = () => this.generateImage();
        this.drawHtmlUpdateModelList();
        return true;
    }
    Release() { }
}
//# sourceMappingURL=llama.js.map