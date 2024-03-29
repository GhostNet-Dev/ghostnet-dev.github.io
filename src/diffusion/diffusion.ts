import { BlockStore } from "../store.js";
import { Channel } from "../models/com.js";

export class Diffusion {
    m_blockStore: BlockStore;
    m_ipc: Channel;
    m_model: string;
    m_img: Blob;
    public constructor(private blockStore: BlockStore, ipc: Channel) {
        this.m_blockStore = blockStore;
        this.m_ipc = ipc;
        this.m_model = "UNetModel";
        this.m_img = new Blob()

        ipc.RegisterMsgHandler('generateLog', (log: string) => {
            const printTag = document.getElementById("log") as HTMLDivElement;
            printTag.innerHTML = `
                ${log}
            `;
        });

        ipc.RegisterMsgHandler('reply_generateImage', (filename: string) => {
            fetch(`${window.MasterAddr}/image?filename=${filename}`)
                .then(response => response.blob())
                .then(data => {
                    const img = new Blob([data], {type: 'image/bmp'})
                    const imageUrl = URL.createObjectURL(img)
                    const imageElement = new Image()
                    imageElement.src = imageUrl
                    const container = document.getElementById("printImg") as HTMLDivElement;
                    container.innerHTML = ""
                    container.appendChild(imageElement)
                    this.m_img = img
                })
                /*
            const printTag = document.getElementById("printImg") as HTMLDivElement;
            printTag.innerHTML = `
                <img src="${window.MasterAddr}/image?filename=${filename}" class="img-fluid">
            `;
            */
        });
    }
    uploadImage() {
        const formData = new FormData()
        formData.append("files", this.m_img)
        formData.append("test", "hello")
        formData.forEach(entry => console.log(entry))
        fetch(`${window.MasterAddr}/upload`, {
            method: "POST",
            cache: "no-cache",
            headers: {},
            body: formData
        })
    }
    generateImage() {
        const promptTag = document.getElementById("prompt") as HTMLInputElement;
        const prompt = promptTag.value.toLowerCase();
        const npromptTag = document.getElementById("nprompt") as HTMLInputElement;
        const nprompt = npromptTag.value.toLowerCase();
        const heightTag = document.getElementById("height") as HTMLInputElement;
        const height = heightTag.value;
        const widthTag = document.getElementById("width") as HTMLInputElement;
        const width = widthTag.value;
        const stepTag = document.getElementById("step") as HTMLInputElement;
        const step = stepTag.value;
        const seedTag = document.getElementById("seed") as HTMLInputElement;
        const seed = (seedTag.value == "")? "-1": seedTag.value
        const printTag = document.getElementById("printImg") as HTMLDivElement;
        printTag.innerHTML = `
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden"></span>
            </div>
        `;
        if (this.m_model == "UNetModel") {
            this.m_ipc.SendMsg("generateImage", prompt, nprompt, height, width, step, seed);
        } else {
            const samplingMethod = "euler"
            const cfgScale = "7"
            const strength = ""
            const batchCnt = ""
            const schedule = ""
            const clipSkip = "2"
            const vea = ""
            const lora = ""
            this.m_ipc.SendMsg("generateImage2", prompt, nprompt, height, width, step, seed,
                this.m_model, samplingMethod, cfgScale, strength, batchCnt, schedule, clipSkip, vea, lora);
        }
    }

    heightUpdate(heightTag: HTMLInputElement) {
        const valueTag = document.getElementById("heightvalue") as HTMLLabelElement
        valueTag.innerHTML = "Height: " + heightTag.value
    }
    widthUpdate(widthTag: HTMLInputElement) {
        const valueTag = document.getElementById("widthvalue") as HTMLLabelElement
        valueTag.innerHTML = "Width: " + widthTag.value
    }

    stepUpdate(stepTag: HTMLInputElement) {
        const valueTag = document.getElementById("stepvalue") as HTMLLabelElement
        valueTag.innerHTML = "Step: " + stepTag.value
    }

    updateEvent() {
        const heightTag = document.getElementById("height") as HTMLInputElement
        heightTag.onchange = () => { this.heightUpdate(heightTag) }
        const widthTag = document.getElementById("width") as HTMLInputElement
        widthTag.onchange = () => { this.widthUpdate(widthTag) }
        const stepTag = document.getElementById("step") as HTMLInputElement
        stepTag.onchange = () => { this.stepUpdate(stepTag) }

        this.heightUpdate(heightTag)
        this.widthUpdate(widthTag)
        this.stepUpdate(stepTag)
    }

    selectModel(key: string, model: string) {
        this.m_model = model
        const btn = document.getElementById("dropdownMenu2") as HTMLButtonElement
        btn.innerText = key
    }

    drawHtmlUpdateModelList() {
        const models = new Map()
        models.set("UNetModel", "UNetModel")
        models.set("SD-v1.4", "sd-v1-4-f16.gguf")
        models.set("chiled-remix", "chilled_reversemix_v2-f16.gguf")

        const tag = document.getElementById("modellist")
        if (tag == null) return;
        tag.innerHTML = "";
        models.forEach((model, key, map) => {
            const button = document.createElement('button');
            button.setAttribute('class', 'dropdown-item');
            button.onclick = () => this.selectModel(key, model)
            button.innerText = key;
            tag.appendChild(button);
        })
    }
    public Run(masterAddr: string): boolean {
        if (!this.m_ipc.IsOpen()) this.m_ipc.OpenChannel(window.MasterWsAddr + "/ws")
        const btn = document.getElementById("generateBtn") as HTMLButtonElement
        btn.onclick = () => this.generateImage();

        this.updateEvent()
        this.drawHtmlUpdateModelList()
        return true;
    }

    public Release(): void { }

}