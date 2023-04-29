
const parseResponse = (nodes) => {
    let randIdx = Math.floor(Math.random()*nodes.length);
    console.log(nodes);
    return nodes[randIdx];
}

const loadNodesHtml = (node) => {
    return `http://${node.ip.Ip}:${node.ip.Port}`;
}

fetch("http://ghostnetroot.com:58080/nodes")
    .then((response) =>response.json())
//.then((data)=> new Map(Object.entries(data)))
    .then(parseResponse)
    .then(loadNodesHtml)
    .then((addr)=>fetch(addr)
        .then((response) =>response.text())
        .then((data)=> {
            let r = document.getElementsByClassName("root")[0];
            r.insertAdjacentHTML("afterbegin", data);
        }));

