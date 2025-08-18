fetch('data.json') /** * 从data.json文件获取数据并处理 * 使用fetch API异步获取JSON数据 * 然后处理数据并更新页面样式和内容 */
    .then(response => response.json()) //  将响应解析为JSON格式
    .then(data => {
        initNavHtml(data.data, data); //  初始化页面样式和内容
        initPage1(data.data, data); //  初始化页面1的样式和内容
        setLines(data)
        setRepos(data)
        setTools(data)
        setPage2Repo(data)
        setPage2Tool(data)

    })
    .catch(error => { //  捕获并处理可能的错误
        console.error('Error fetching JSON:', error);
    });
window.addEventListener('load', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/font.css';   // 把 @font-face 单独放这里
    document.head.appendChild(link);
});

/**
 * 设置CSS变量值
 * @param {string} key - CSS变量名
 * @param {string} value - 变量值
 */
function setStyle(key, value) {
    document.documentElement.style.setProperty(`--${key}`, value);
}

/**
 * 设置CSS变量值为图片URL
 * @param {string} key - CSS变量名
 * @param {string} src - 图片路径
 */
function setStyleFile(key, src) {
    document.documentElement.style.setProperty(`--${key}`, `url("../${src}")`);
}

/**
 * 更新元素文本内容
 * @param {string} key - 元素ID
 * @param {string} value - 新的文本内容
 */
function changeContent(key, value) {
    document.getElementById(key).textContent = value;
}

/**
 * 更新链接元素的href属性
 * @param {string} key - 元素ID
 * @param {string} src - 新的链接地址
 */
function changeContentFile(key, src) {
    document.getElementById(key).href = `assets/${src}`;
}

/**
 * 初始化导航栏样式和内容
 * @param {Object} data - 页面数据对象
 * @param {Object} all - 完整的数据对象
 */
function initNavHtml(data, all) {
    // 设置背景和图标
    setStyleFile('bg', data.bg.src);
    setStyleFile('icon', data.icon.src);

    // 设置颜色主题
    const colorData = data.color_list;
    Object.entries(colorData).forEach(([key, value]) => {
        setStyle(key, value);
    });

    // 更新页面内容
    changeContentFile('t-favicon', data.icon.src);
    changeContent('nav-name', data.name);
    changeContent('title', data.title);
}

/**
 * 初始化第一页的样式和内容
 * @param {Object} data - 页面数据对象
 * @param {Object} all - 完整的数据对象
 */
function initPage1(data, all) {
    const nowtime = new Date();
    // 设置颜色主题
    const colorData = data.color_list;
    Object.entries(colorData).forEach(([key, value]) => {
        setStyle(key, value);
    });

    // 处理标签列表
    const tagsContainer = document.getElementById('page1-left-bottom-tags');
    const descriptionContainer = document.getElementById('page1-left-middle-description');

    // 设置描述文本，保留换行格式
    descriptionContainer.innerHTML = data.description.replace(/\n/g, "<br>");
    changeContent('page1-right-top-daytime', `${monthNameCN(nowtime.getMonth())}  ${weekdayNameCN(nowtime.getDay())}`)
    // 创建并添加标签
    data.tag_list.forEach(tagObj => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagObj.name;
        tag.style.setProperty('--color', tagObj['hover-color']);
        tagsContainer.appendChild(tag);
    });
}

function monthNameCN(m) {
    if (m < 0 || m > 11) throw new RangeError('月份索引必须是 0–11');
    return [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ][m];
}

// 0–6 → 周日、周一……周六
function weekdayNameCN(d) {
    if (d < 0 || d > 6) throw new RangeError('星期索引必须是 0–6');
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d];
}
/**
 * 更新时钟显示
 */
function tick() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('page1-right-top-clock').innerHTML =
        `${hours}:${minutes}:${seconds}`;
}

// 初始化时钟并设置定时更新
tick();
setInterval(tick, 1000);
setDate()

function setDate() {
    // 1. 基本数据
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();        // 本月 1 号星期几
    const daysCur = new Date(year, month + 1, 0).getDate();   // 本月天数
    const daysPrev = new Date(year, month, 0).getDate();       // 上月天数

    // 2. 42 格数组
    const cells = Array(42).fill(0);
    for (let d = 1; d < daysCur + 1; d++) {
        cells[firstDay + d - 1] = d
        if (new Date(year, month, d).getDay() == 0 | new Date(year, month, d).getDay() == 6) {
            document.getElementById(`date${firstDay + d - 1}`).style.color = "#ff0000"
        }
    }

    for (let a = 0; a < 42; a++) {
        if (cells[a] == 0) {
            cells[a] = new Date(year, month, 1 - firstDay + a).getDate()
            document.getElementById(`date${a}`).style.color = "#8b8b8bff"
        }
        document.getElementById(`date${a}`).textContent = cells[a]
        if (new Date(year, month, 1 - firstDay + a).getDate() == today.getDate()) {
            document.getElementById(`date${a}`).style.backgroundColor = "#20cbffff"
        }
    }
    console.log(cells)
}

function setLines(data) {
    const linesContainer = document.getElementById('linelist');
    linesContainer.innerHTML = ''; // 清空现有内容
    data.lines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = 'line-item';
        lineElement.innerHTML = `
        <div class="line-radius"></div>
            <div class="line-time">${line.time}</div>
            <div class="line-content">${line.content}</div>
        `;
        linesContainer.appendChild(lineElement);
    });
}

function setRepos(data) {
    data = data.repos;
    if (data.length > 3) {
        data = [data[0], data[1], data[2]]
    } else {
        data = data
    }
    for (const value in data) {
        const Repos = document.getElementById("page1-right-bottom-repos-list")
        const itemtool = document.createElement('div')
        itemtool.className = "oneitem"
        itemtool.innerHTML = `<a href="${data[value].href}"></a>
                                <div>
                                    <p class="oneitem-title"
                                        style="transform: translateY(-10px);font-size: 26px;margin: 20px 15px 0px 15px;">${data[value].name}</p>
                                    <p class="oneitem-concent"
                                        style="transform: translateY(-5px);font-family: 'Noto Sans SC', sans-serif;font-size: 18px;margin: 0px 15px 0px 15px; ">${data[value].content}</p>
                                </div>`
        Repos.appendChild(itemtool)
    }
}
function setTools(data) {
    data = data.tools;
    if (data.length > 3) {
        data = [data[0], data[1], data[2]]
    } else {
        data = data
    }
    for (const value in data) {
        const Tools = document.getElementById("page1-right-bottom-tools-list")
        const itemtool = document.createElement('div')
        itemtool.className = "oneitem"
        itemtool.innerHTML = `<a href="${data[value].href}"></a>
                                <div>
                                    <p class="oneitem-title"
                                        style="transform: translateY(-10px);font-size: 26px;margin: 20px 15px 0px 15px;">${data[value].name}</p>
                                    <p class="oneitem-concent"
                                        style="transform: translateY(-5px);font-family: 'Noto Sans SC', sans-serif;font-size: 18px;margin: 0px 15px 0px 15px; ">${data[value].content}</p>
                                </div>`
        Tools.appendChild(itemtool)
    }
}
function setPage2Repo(data) {
    data = data.repos
    const allrepos = document.getElementById("page2-left-list");
    for (const value in data) {
        const itemrepo = document.createElement('div')
        itemrepo.className = "oneitem"
        itemrepo.innerHTML = `<a href="${data[value].href}"></a>
                                <div>
                                    <p class="oneitem-title"
                                        style="transform: translateY(-10px);font-size: 26px;margin: 20px 15px 0px 15px;">${data[value].name}</p>
                                    <p class="oneitem-concent"
                                        style="transform: translateY(-5px);font-family: 'Noto Sans SC', sans-serif;font-size: 18px;margin: 0px 15px 0px 15px; ">${data[value].content}</p>
                                </div>`
        allrepos.appendChild(itemrepo)
    }
}
function setPage2Tool(data) {
    data = data.tools
    const alltools = document.getElementById("page2-right-list");
    for (const value in data) {
        const itemtool = document.createElement('div')
        itemtool.className = "oneitem"
        itemtool.innerHTML = `<a href="${data[value].href}"></a>
                                <div>
                                    <p class="oneitem-title"
                                        style="transform: translateY(-10px);font-size: 26px;margin: 20px 15px 0px 15px;">${data[value].name}</p>
                                    <p class="oneitem-concent"
                                        style="transform: translateY(-5px);font-family: 'Noto Sans SC', sans-serif;font-size: 18px;margin: 0px 15px 0px 15px; ">${data[value].content}</p>
                                </div>`
        alltools.appendChild(itemtool)
    }
}

function page1Click() {
    pages = document.getElementsByClassName("pages")
    for (const value of pages) {
        value.classList.add("no-active")
    }
    document.getElementById("page1").classList.remove("no-active")
}
function page2Click() {
    pages = document.getElementsByClassName("pages")
    for (const value of pages) {
        value.classList.add("no-active")
    } document.getElementById("page2").classList.remove("no-active")
}
