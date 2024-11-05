

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', (event) => {
    // 向header中添加favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/icon.png';
    document.head.appendChild(link);

    // 创建footer元素
    const footerDiv = document.createElement('div');
    footerDiv.id = 'footer';
    footerDiv.style.textAlign = 'center';

    // 创建友链div
    const friendLinkDiv = document.createElement('div');
    friendLinkDiv.id = 'friendLink';
    const friendLinkA = document.createElement('a');
    friendLinkA.href = 'https://github.com/';
    friendLinkA.textContent = 'github page';
    friendLinkA.style.color = 'black';
    friendLinkA.style.textDecoration = 'none';
    friendLinkDiv.appendChild(friendLinkA);

    // 创建备案图标和链接
    const img = document.createElement('img');
    img.src = 'https://www.pandazz.cn/images/2024-11-beian-e254b7bec2de097b.png';
    img.width = 20;
    img.height = 20;
    img.style.verticalAlign = 'middle';

    const beianA = document.createElement('a');
    beianA.href = 'https://beian.mps.gov.cn/#/query/webSearch?code=51081102000085';
    beianA.rel = 'noreferrer';
    beianA.target = '_blank';
    beianA.textContent = '川公网安备51081102000085';
    beianA.style.color = 'black';
    beianA.style.textDecoration = 'none';

    const icpA = document.createElement('a');
    icpA.href = 'https://beian.miit.gov.cn/';
    icpA.target = '_blank';
    icpA.style.textDecoration = 'none';
    icpA.textContent = '蜀ICP备2024068395号-1';
    icpA.style.color = 'black';

    // 将所有创建的元素添加到footer
    footerDiv.appendChild(friendLinkDiv);
    footerDiv.appendChild(img);
    footerDiv.appendChild(beianA);
    footerDiv.appendChild(document.createElement('br'));
    footerDiv.appendChild(icpA);

    // 将footer添加到body
    document.body.appendChild(footerDiv);

    // 创建“回首页”链接
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.style.position = 'fixed';
    homeLink.style.left = '1%';
    homeLink.style.top = '2%';
    homeLink.style.textDecoration = 'none';
    homeLink.style.color = 'black';
    homeLink.textContent = '回首页';

    // 将“回首页”链接添加到body
    document.body.appendChild(homeLink);
});