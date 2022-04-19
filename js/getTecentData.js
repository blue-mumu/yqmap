$.ajax({
    url: "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5",
    dataType: "jsonp",
    success: function(res) {
        // 6、设置确诊图表
        // 获取图表所需数据
        var allData = JSON.parse(res.data);
        var infoData = allData.areaTree[0].children;
        var addNewComfirmArr = [];
        for (var i = 0; i < infoData.length; i++) {
            var jwsr = infoData[i].children.find(function(element) {
                return element.name == "境外输入";
            })
            addNewComfirmArr.push({
                name: infoData[i].name,
                confirm: infoData[i].today.confirm,
                jwsr: jwsr && jwsr.today.confirm || 0
            });
        }
        addNewComfirmArr.sort(function(a, b) {
            return (b.confirm + b.jwsr) - (a.confirm + a.jwsr);
        });
        var nameArr = []
        var confirmArr = []
        var jwsrArr = []
        addNewComfirmArr.some(function(element, index) {
            nameArr.push(element.name)
            confirmArr.push(element.confirm)
            jwsrArr.push(element.jwsr)
            return index == 9;
        });
        // 基于准备好的dom，初始化echarts实例
        var confirm = echarts.init(document.querySelector(".confirmed .content"));
        // 窗口或框架被调整大小时执行chinaMap.resize
        window.addEventListener("resize", confirm.resize);
        // 创建图表配置项
        var option = {
            grid: {
                left: "30px",
                bottom: "35px",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                }
            },
            legend: {
                data: ["本土新增", "境外输入"],
                right: "10%",
                top: "3%",
                itemWidth: 10,
                itemHeight: 10,
                align: "left"
            },
            xAxis: {
                type: 'category',
                data: nameArr,
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
                type: 'value',
                axisLine: {
                    show: false
                }
            },
            series: [{
                name: '本土新增',
                data: confirmArr,
                type: 'bar',
                barWidth: 10,
                stack: 'total',
                itemStyle: {
                    color: "#e83232"
                }
            }, {
                name: '境外输入',
                data: jwsrArr,
                type: 'bar',
                barWidth: 10,
                stack: 'total',
                itemStyle: {
                    color: "#486da0"
                }
            }]
        };
        confirm.setOption(option);
    }
});