fetch('data.json') /** * 从data.json文件获取数据并处理 * 使用fetch API异步获取JSON数据 * 然后处理数据并更新页面样式和内容 */
    .then(response => response.json()) //  将响应解析为JSON格式
    .then(data => {
        initnav_html(data.data, data); //  初始化页面样式和内容
    })
    .catch(error => { //  捕获并处理可能的错误
        console.error('Error fetching JSON:', error);
    });

function setStyle(key, value) {
    document.documentElement.style.setProperty(`--${key}`, value);
}
function setStyleFile(key, src) {
    document.documentElement.style.setProperty(`--${key}`, `url(${"../" + src})`);
    // console.log(`Set style for ${key}: url(${"../" + src})`);
}
function changeContent(key, value) {
    document.getElementById(key).textContent = value;
}
function changeContentFile(key, src) {
    document.getElementById(key).href = "assets/" + src;
}
function initnav_html(data, all) {
    setStyleFile('bg', data.bg.src) //  设置背景图片样式
    setStyleFile('icon', data.icon.src) //  设置图标样式 
    color_data = data.color_list //  获取颜色数据
    Object.entries(color_data).forEach(([k, v]) => //  遍历颜色数据并设置样式
        setStyle(k, v)
    );
    changeContentFile('t-favicon', data.icon.src);
    changeContent('nav-name', data.name); //  设置导航名称文本内容
}
function init_page1(data, all) {
    Object.entries(color_data).forEach(([k, v]) => //  遍历颜色数据并设置样式
        setStyle(k, v)
    );
}