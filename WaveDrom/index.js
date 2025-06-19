
const editor = document.getElementById("editor");

// 初始化：从 textarea 加载内容到 editor
editor.innerText = "{ signal : [\n" +
    "  { name: \"clk\",  wave: \"p......\" },\n" +
    "  { name: \"bus\",  wave: \"x.34.5x\",   data: \"head body tail\" },\n" +
    "  { name: \"wire\", wave: \"0.1..0.\" },\n" +
    "]}";

// 正则匹配并替换为带样式的 span
function highlight(text) {
    // 匹配关键词：signal, name, wave, data，并确保是完整的单词（使用 \b 表示单词边界）
    text = text.replace(/(")(.*?)(")/g, '$1<span class="string">$2</span>$3');
    text = text.replace(/\b(signal|name|wave|data)\b/g, '<span class="keyword">$1</span>');


    // 匹配字符串："..."，并将其内容设为绿色


    return text;
}


// 更新编辑器内容
function updateEditor() {
    const text = editor.innerText;
    const html = highlight(text);
    editor.innerHTML = html;
}


// 将当前编辑器内容同步回 textarea

// 监听输入事件，更新高亮
editor.addEventListener("input", function () {
    const cursorPosition = getCaretPosition(editor);
    console.log('Cursor Position:', cursorPosition);
    updateEditor();
    // 同步到 WaveDrom
    document.getElementById('InputJSON_0').textContent = editor.innerText;
    WaveDrom.ProcessAll();
    setCaretPosition(editor, cursorPosition);
});

// 初始调用一次高亮
updateEditor();

// 光标位置保存与恢复（避免光标跳到开头）
function getCaretPosition(element) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
}


function setCaretPosition(element, offset) {
    const range = document.createRange();
    const sel = window.getSelection();
    let charCount = 0;
    let nodeStack = [element];
    let node;
    let foundNode = false;

    while (!foundNode && (node = nodeStack.pop())) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nextCharCount = charCount + node.length;
            if (offset >= charCount && offset <= nextCharCount) {
                range.setStart(node, offset - charCount);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                foundNode = true;
            }
            charCount = nextCharCount;
        } else {
            let i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }
}

function loadJSON() {
    // 创建一个隐藏的 file input 元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    // 监听文件选择事件
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;

            // 直接设置 editor 内容（纯文本）
            editor.innerText = content;

            // 触发高亮更新（如果有的话）
            updateEditor();

            // 可选：同步到 WaveDrom 并刷新图形
            document.getElementById('InputJSON_0').textContent = content;
            WaveDrom.ProcessAll();
        };

        reader.onerror = function (e) {
            alert('读取文件失败');
            console.error('File read error:', e);
        };

        reader.readAsText(file); // 以文本方式读取文件
    });

    // 触发文件选择对话框
    fileInput.click();
}


async function downloadJSON() {
    // 获取 textarea 中的内容
    const inputScript = document.getElementById("editor").innerText;

    // 创建 Blob 对象
    const blob = new Blob([inputScript], { type: "application/json" });

    try {
        // 弹出“另存为”对话框，让用户选择路径和文件名
        const handle = await window.showSaveFilePicker({
            suggestedName: 'waveform.json',
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] },
            }],
        });

        // 写入文件
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        console.log('文件已保存');
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('保存失败:', err);
            alert('保存被取消或不支持 File System Access API');
        }
    }


}


async function downloadSVG() {
    const svgElement = document.getElementById("svgcontent_0");
    if (!svgElement) {
        alert("SVG element not found.");
        return;
    }

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // 添加命名空间（如果缺失）
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgString.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
        svgString = svgString.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // 创建 Blob 对象
    const blob = new Blob([svgString], { type: "image/svg+xml" });

    try {
        // 弹出“另存为”对话框，让用户选择路径和文件名
        const handle = await window.showSaveFilePicker({
            suggestedName: 'waveform.svg',
            types: [{
                description: 'SVG Files',
                accept: { 'image/svg+xml': ['.svg'] },
            }],
        });

        // 写入文件
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        console.log('文件已保存');
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('保存失败:', err);
            alert('保存被取消或不支持 File System Access API');
        }
    }
}


async function downloadPNG() {
    const svgElement = document.getElementById("svgcontent_0");
    if (!svgElement) {
        alert("SVG element not found.");
        return;
    }

    const width = parseInt(svgElement.getAttribute('width')) || 360;
    const height = parseInt(svgElement.getAttribute('height')) || 90;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 填充白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // 添加命名空间
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgString.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
        svgString = svgString.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const v = canvg.Canvg.fromString(ctx, svgString);
    await v.render();

    // 导出为 PNG 数据 URL
    const pngDataUrl = canvas.toDataURL('image/png');

    // 将数据 URL 转换为 Blob
    const response = await fetch(pngDataUrl);
    const blob = await response.blob();

    // 使用 File System Access API 弹出保存文件对话框
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'waveform.png',
            types: [{
                description: 'PNG Files',
                accept: { 'image/png': ['.png'] },
            }],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
    } catch (err) {
        console.error('保存失败:', err);
        alert('保存被取消或不支持 File System Access API');
    }
}






