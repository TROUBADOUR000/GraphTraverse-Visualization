"use strict";

//获取远端模块，方便进行对话框
var { remote } = require('electron');

//用来进行echarts初始化的对象，由于最终有两块需要初始化的图形区域，因此构造两个初始化对象
var chart_object = {};
var chart_object2 = {};
var chart_object3 = {};

var node_info = {};

function showMatrixButtons1() {
    document.getElementById("adjacent_linked_list").style.display = "none";
    document.getElementById("_dfs").style.display = "none";
    document.getElementById("_bfs").style.display = "none";
    document.getElementById("check").style.display = "inline";
    document.getElementById("adjacent_matrix").style.display = "none";
}

function showMatrixButtons2() {
    document.getElementById("adjacent_linked_list").style.display = "inline";
    document.getElementById("_dfs").style.display = "inline";
    document.getElementById("_bfs").style.display = "inline";
    document.getElementById("check").style.display = "none";
    document.getElementById("adjacent_matrix").style.display = "none";
}

const option = {
    title: {
        text: ''
    },

    series: [
        {
            type: 'graph',
            layout: 'none',
            force: {
                repulsion: 700,
                layoutAnimation: true
            },
            symbolSize: 40,
            focusNodeAdjacency: true,
            draggable: false,
            animation: false,
            itemStyle: {
                color: "#00CC66",
            },
            label: {
                normal: {
                    show: true,
                    //决定了图节点上的内容如何显示
                    formatter: function (x) { return x.data.value; },
                    fontSize: 16,
                    color: 'black'
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 7],
            lineStyle: {
                normal: {
                    opacity: 1,
                    width: 2,
                    curveness: 0,
                    color: 'black'
                }
            },
            data: [],
            links: []
        },
    ]
};
var option2={};
var option3={};

function show_graph(option, chart_object, element_name = "draw_area", width = 0.99, height = 0.8) {

    //获取绘制对象
    const container = document.getElementById(element_name);
    container.style.width = window.innerWidth * width + 'px';
    container.style.height = window.innerHeight * height + 'px';
    if (chart_object != null && chart_object != "" && chart_object != undefined && Object.keys(chart_object).length != 0) {
        chart_object.dispose();
    }

    chart_object = echarts.init(container, 'light');
    chart_object.clear();
    chart_object.setOption(option);
    return chart_object;
}



//创建邻接矩阵表格
function createTable() {
    var row = document.getElementById("input_node_num").value;

    if(row > 26 || row < 3){
        remote.dialog.showErrorBox('输入有误','节点个数不符合要求');
        execute();
    }

    node_info = Array.from({ length: row }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));

    var col = row;

    var str = "<p align='center'>请输入邻接矩阵(1表示相连,0表示不相连)</p>";
    str += '<table id="myTable" align="center">';

    str += '<tr><td class="header-cell"> </td>';
    for (var j = 0; j < col; j++) {
        str += `<td class="header-cell">${node_info[j]}</td>`;
    }
    str += '</tr>';

    for (var i = 0; i < row; i++) {
        str += '<tr>';
        str += `<td class="header-cell">${node_info[i]}</td>`;
        for (var j = 0; j < col; j++) {
            str += '<td contenteditable="true" class="data-cell" height="1px" width="1px">0</td>';
        }
        str += '</tr>';
    }
    str += '</table>';
    var divobj = document.getElementById("table");
    divobj.innerHTML = str;
}


function checkTable() {
    var mytable = document.getElementById('myTable');
    if (mytable==null){
        remote.dialog.showErrorBox('输入有误','未生成邻接矩阵')
        execute();
    }
    for(var i=1,rows=mytable.rows.length; i<rows; i++){
        for(var j=1,cells=mytable.rows[i].cells.length; j<cells; j++){
            var x=mytable.rows[i].cells[j].innerHTML;
            //如果非0或者1，则输入错误退出该函数
            if(x!=0&&x!=1){
                remote.dialog.showErrorBox('输入有误','邻接矩阵只能输入0/1')
                execute();
            }
        }
    }
}

//选择遍历的起点
function createSelect() {

    var num = document.getElementById("input_node_num").value;
    node_info = Array.from({ length: num }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));

    var str = "<p align='center'>请选择从哪个顶点开始遍历：";
    str += '<select id="s1" name="s1">';
    for(var i = 0; i < num; i++) {
        str += '<option>';
        str += String(node_info[i]);
        str += '</option>';
    }
    str += '</select>  <button id="dfs" onclick="show_dfs(); start_dfs();">递归遍历</button>\
    <button id="dfs_stack" onclick="show_dfs(); start_dfs_stack();">非递归遍历</button>\
    <button id="bfs" onclick="start_bfs();">遍历</button></p>';
    var divobj = document.getElementById("select");
    divobj.innerHTML = str;
}

//深拷贝
function deepCopy(obj) {
    var result, oClass = Object.prototype.toString.call(obj).slice(8, -1);

    if (oClass == "Object") result = {}; //判断传入的如果是对象，继续遍历
    else if (oClass == "Array") result = []; //判断传入的如果是数组，继续遍历
    else return obj; //如果是基本数据类型就直接返回

    for (var i in obj) {
        var copy = obj[i];

        if (Object.prototype.toString.call(copy).slice(8, -1) == "Object") result[i] = deepCopy(copy); //递归方法 ，如果对象继续变量obj[i],下一级还是对象，就obj[i][i]
        else if (Object.prototype.toString.call(copy).slice(8, -1) == "Array") result[i] = deepCopy(copy); //递归方法 ，如果对象继续数组obj[i],下一级还是数组，就obj[i][i]
        else result[i] = copy; //基本数据类型则赋值给属性
    }

    return result;
}