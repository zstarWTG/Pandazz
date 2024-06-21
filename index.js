

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
/**
 * 根据提供的JSON数据生成相应的HTML元素，并将这些元素添加到指定的mainBox元素中。
 * @param {Object} jsonData - 包含需要生成HTML元素的数据的JSON对象。
 * {
 *    classification: {String} - 分类的ID标识。
 *    classification_CN: {String} - 分类的中文名称。
 *    folder: {String} - 存放子HTML文件的文件夹名称。
 *    PageMsg: {Array} - 包含多个页面消息对象的数组。
 *      每个页面消息对象 {
 *        fileName: {String} - 子HTML文件的文件名。
 *        title: {String} - 页面标题。
 *        detail: {String} - 页面详细描述。
 *      }
 * }
 */
function generateHtmlElements(jsonData) {
    // 获取mainBox和guide元素
    var mainBox = document.getElementById("mainBox");
    var guide = document.getElementById("guide");

    // 创建分类div元素，并设置其ID
    var classification = document.createElement("div");
    classification.id = jsonData.classification;
    
    // 创建并设置guide项的链接和文本
    var guideItem = document.createElement("a");
    guideItem.href = "#"+jsonData.classification;
    guideItem.innerText = jsonData.classification_CN;
    guide.appendChild(guideItem);

    // 创建分类标题，并添加到classification元素中
    var classiTitle = document.createElement("p");
    classiTitle.innerText = jsonData.classification_CN;
    classiTitle.className = "classificationTitle";
    classification.appendChild(classiTitle)

    // 将classification元素添加到mainBox中
    mainBox.appendChild(classification);

    // 遍历PageMsg数组，为每个项目创建链接和详情，并添加到classification中
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
/**
 * 打印欢迎信息到控制台，并读取JSON文件，然后根据JSON数据生成HTML元素。
 * 
 * 本段代码不直接包含函数或类定义，因此不涉及参数和返回值说明。
 */
console.log("hello to pandazz.cn"); // 打印欢迎信息

// 读取JSON文件，回调函数处理读取到的数据
readJsonFile(function(jsonData) {
    generateHtmlElements(jsonData); // 根据JSON数据生成HTML元素
});

