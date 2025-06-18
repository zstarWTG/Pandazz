
document.addEventListener('DOMContentLoaded', function () {
const textarea = document.getElementById('inputScript');
const scriptTag = document.getElementById('waveDromScript');

textarea.addEventListener('input', function () {
  try {
    // 更新 script 标签内容
    scriptTag.textContent = textarea.value;

    // 重新渲染 WaveDrom 图形
    WaveDrom.ProcessAll();
  } catch (e) {
    console.error('输入内容无效:', e);
  }
});
});

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






