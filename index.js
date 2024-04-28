

// 读取JSON文件
function readJsonFile(callback) {
    // 读取SubHtml文件夹中的index.json文件
    fetch('SubHtml/index.json')
    .then(response => response.json())
    .then(data => {
    const subFolders = data.SubFold;

    // 遍历次级文件夹
    subFolders.forEach(folder => {
        const folderPath = `SubHtml/${folder}/index.json`;

        // 读取次级文件夹中的index.json文件
        fetch(folderPath)
        .then(response => response.json())
        .then(subData => {
            // 将次级index.json的内容传递给callback函数
            subData.folder = folder;
            callback(subData);
        })
        .catch(error => {
            console.error(`Error reading ${folderPath}:`, error);
        });
    });
    })
    .catch(error => {
    console.error('Error reading SubHtml/index.json:', error);
    });

}

// 根据JSON数据生成HTML元素并添加到mainBox中
function generateHtmlElements(jsonData) {
    var mainBox = document.getElementById("mainBox");
    var guide = document.getElementById("guide");

    var classification = document.createElement("div");
    classification.id = jsonData.classification;
    var guideItem = document.createElement("a");
    guideItem.href = "#"+jsonData.classification;
    guideItem.innerText = jsonData.classification_CN;
    guide.appendChild(guideItem);


    var classiTitle = document.createElement("p");
    classiTitle.innerText = jsonData.classification_CN;
    classiTitle.className = "classificationTitle";
    classification.appendChild(classiTitle)

    mainBox.appendChild(classification);

    jsonData.PageMsg.forEach(function(item) {
        var aTag = document.createElement("a");
        aTag.href = "SubHtml/" + jsonData.folder + "/" + item.fileName;
        aTag.appendChild(document.createTextNode(item.title));
        aTag.className = "ItemTitle";
        classification.appendChild(aTag);
        var mp = document.createElement("p");
        mp.innerText = item.detail;
        mp.className = "ItemDetail";
        classification.appendChild(mp);
    });
}

// 主函数
console.log("hello to pandazz.cn");
readJsonFile(function(jsonData) {
    generateHtmlElements(jsonData);
});

