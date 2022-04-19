// 1.获取疫情数据
$.ajax({
    url: 'https://news.sina.com.cn/project/fymap/ncp2020_full_data.json',
    dataType: 'jsonp', // 解决跨域问题  jsonp请求得是函数
    jsonpCallback: 'jsoncallback', // 指定回调函数的名称
    success: function (res) {
        var allData = res.data; // 获取全部数据
        var historyList = res.data.historylist; // 获取历史数据
        // 2.更新时间
        var timespan = document.querySelector('.time').querySelector('span');
        timespan.innerHTML = allData.cachetime;
        // $('.time span').html(allData.cachetime); jquery写法
        // 3.设置详情信息
        (function () {
            // 配置项(将要变化的东西提取出来，方便开发)
            var infoConfig = {
                "cn_econNum": {
                    "title": "现有确诊",
                    "color": "#ff5e49"
                },
                "cn_asymptomNum": {
                    "title": "无症状",
                    "color": "#fe653b"
                },
                "cn_susNum": {
                    "title": "现有疑似",
                    "color": "#fe8d00"
                },
                "cn_heconNum": {
                    "title": "现有重症",
                    "color": "#525498"
                },
                "cn_conNum": {
                    "title": "累计确诊",
                    "color": "#ff0910"
                },
                "cn_jwsrNum": {
                    "title": "境外输入",
                    "color": "#356ea0"
                },
                "cn_cureNum": {
                    "title": "累计治愈",
                    "color": "#00b1b7"
                },
                "cn_deathNum": {
                    "title": "累计死亡",
                    "color": "#4c5054"
                }
            }
            var htmlStr = '';
            // for in 遍历对象
            for (const key in infoConfig) {
                // console.log(infoConfig[key]) 获取值
                // console.log(historyList[0][key]) 获取对应名称的值
                // 今天的数据 - 昨天的数据 = 是否新增
                var value = historyList[0][key] - historyList[1][key]
                // `${}` es6模板字符串
                htmlStr += `<li>
                    <h5>${infoConfig[key].title}<h5>
                    <p style="color:${infoConfig[key].color};">${historyList[0][key]}</p>
                    <span>
                        <em>昨日</em>
                        <i style="color:${infoConfig[key].color};">
                        ${value > 0 ? '+' + value : value} 
                        </i>
                    </span>
                </li>`
            }
            $('.info').html(htmlStr) // 将数据放到info中
        })();
        // 4.设置中国疫情地图
        (function () {
            // 初始化实例
            var china_map = echarts.init(document.querySelector('.china_map .content'))
            var nowlist = []
            var alllist = []
            // 提取数据
            for (let index = 0; index < allData.list.length; index++) {
                // 往数组里面用push添加对象
                nowlist.push({
                    name: allData.list[index].name,
                    value: allData.list[index].econNum
                })
                alllist.push({
                    name: allData.list[index].name,
                    value: allData.list[index].value
                })
            }
            var options = {
                geo: {
                    map: "china", // 直接使用中国地图
                    zoom: 1.2,
                    // 图形样式
                    itemStyle: {
                        areaColor: 'white',
                        borderColor: '#666',
                        borderWidth: '0.3'
                    },
                    // 文字样式
                    label: {
                        show: true,
                        fontSize: 10
                    },
                    // 高亮样式
                    emphasis: {
                        itemStyle: {
                            areaColor: '#b4ffff'
                        }
                    },
                    select: {
                        itemStyle: {
                            areaColor: "#b4ffff"
                        }
                    }
                },
                series: [{
                    type: 'map',
                    geoIndex: 0,
                    data: nowlist
                }],
                // 映射
                visualMap: {
                    type: 'piecewise',
                    pieces: [
                        { min: 0, max: 0, label: '0', color: '#fff' },
                        { min: 1, max: 9, label: '1-9', color: '#ffe4da' },
                        { min: 10, max: 99, label: '10-99', color: '#ff937f' },
                        { min: 100, max: 999, label: '100-999', color: '#ff6c5e' },
                        { min: 1000, max: 9999, label: '1000-9999', color: '#fe3335' },
                        { min: 10000, label: '≥10000', color: '#cd0000' },
                    ],
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 2,
                },
                tooltip: {
                    formatter: '<div style="display:flex;align-items:center;position:relative;z-index:999;">地区: {b}<br/>确诊: {c} <a style="display:flex;align-items:center; height:30px;border-left:1px solid #fff;padding-left:8px;color:#fff;font-size:12px;margin-left:10px;" >详情 ></a></div>',
                    // formatter: function(param) {
                    //     return `<section style="display:flex;align-items:center;position:relative;z-index:9999">
                    //             <div style="padding: 0px 10px;font-size:12px;">地区：${param.name} <br>确诊：${param.value}</div>
                    //             <a style="display:flex;align-items:center; height:30px;border-left:1px solid #fff;padding-left:8px;color:#fff;font-size:12px" href="#">详情 > </a>
                    //     </section>`;
                    // },
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderColor: 'black',
                    textStyle: {
                        color: '#fff'
                    },
                    triggerOn: 'click',
                    enterable: true,
                },
            };
            china_map.setOption(options) // 设置配置项
            // 设置切换效果 jquery
            // $('.china_map nav a').click(function () {
            //     $('.china_map nav a').toggleClass('active')
            //     // 切换地图数据
            //     options.series[0].data = $(this).index() == 0 ? nowlist : alllist
            //     china_map.setOption(options) // 重新渲染数据
            // })
            var alist = document.querySelectorAll('.china_map nav a');
            for (let index = 0; index < alist.length; index++) {
                alist[index].addEventListener('click',function(){
                    for(var i = 0;i<alist.length;i++){
                        alist[i].removeAttribute('class')
                    }
                    this.className = 'active';
                    options.series[0].data = index == 0 ? nowlist : alllist
                    china_map.setOption(options) // 重新渲染数据
                })
            }
        })();
        // 5.全国疫情趋势
        (function () {
            // 获取对应的数据
            var jwsrAdd = [];
            var conAdd = [];
            var dateArr = [];
            historyList.reverse().some(function(element, index) {
                jwsrAdd.push(element.cn_addjwsrNum);
                conAdd.push(element.cn_conadd);
                dateArr.push(element.date);
                return index == 365;
            })
            var trend = echarts.init(document.querySelector('.trend .content'))
            var options = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总新增确诊', '新增境外输入']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dateArr.slice(dateArr.length - 28),
                    splitNumber:15,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: 45,
                        fontSize: 10,
                        color: "#999"
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '总新增确诊',
                        type: 'line',
                        stack: '总量',
                        data: conAdd.slice(conAdd.length - 28)
                    },
                    {
                        name: '新增境外输入',
                        type: 'line',
                        stack: '总量',
                        data: jwsrAdd.slice(jwsrAdd.length - 28)
                    },
                ]
            };
            trend.setOption(options)
        })();
    }
})