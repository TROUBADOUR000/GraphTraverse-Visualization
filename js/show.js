"use strict";

//进行邻接矩阵的显示
function show_adjacency_list(){

    graph.read_input();

    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "inline";
    document.getElementById("draw_area3").style.display = "inline";
    document.getElementById("select").style.display = "none";
    
    document.getElementById("adjacent_linked_list").style.display = "none";
    document.getElementById("adjacent_matrix").style.display = "none";
    document.getElementById("_dfs").style.display = "inline";
    document.getElementById("_bfs").style.display = "inline";

    //对配置项进行一些初始化操作
    option.title.text = "邻接链表";
    option.series[0].layout = "none";
    option.series[0].data = [];
    option.series[0].links = [];

    //对一些变量进行初始化
    var node_cnt = 0;
    var y_node_cnt = 0;
    var edge_cnt = 0;
    var gap_x = 40;
    var gap_y = 30;

    //遍历邻接表中的点和边，并将其加入配置项中
    for (var i in graph.vertexes) {
        option.series[0].data[node_cnt] = { value: String(graph.vertexes[i]), x: gap_x, y: gap_y * (y_node_cnt + 1) };
        node_cnt++;

        for (var j = 0; j < graph.edges[graph.vertexes[i]].length; j++) {
            option.series[0].data[node_cnt] = { value: graph.edges[graph.vertexes[i]][j], x: gap_x * (j + 2), y: gap_y * (y_node_cnt + 1), symbol: 'rect' };
            option.series[0].links[edge_cnt] = { source: node_cnt - 1, target: node_cnt };
            node_cnt++;
            edge_cnt++;
        }
        y_node_cnt++;

    }

    //进行图像的显示
    chart_object=show_graph(option,chart_object);
}

//访问数组
let visited=[];
//结点映射map
let node_num_map={};

//设置延时时间
let time=0;
const delay = n => new Promise(r => setTimeout(r, n));

//进行DFS的展示

// 在 dfs 函数内部记录遍历结果
function show_dfs() {
    graph.read_input();
    createSelect();

    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "inline";
    document.getElementById("draw_area3").style.display = "inline";
    document.getElementById("select").style.display = "inline";
    document.getElementById("bfs").style.display = "none";

    document.getElementById("adjacent_matrix").style.display = "none";
    document.getElementById("_dfs").style.display = "none";
    document.getElementById("adjacent_linked_list").style.display = "inline";
    document.getElementById("_bfs").style.display = "inline";

    //对配置项进行一些初始化操作
    option.title.text = "深度优先遍历";
    option.series[0].layout = "force";
    option.series[0].data = [];
    option.series[0].links = [];

    option2 = deepCopy(option);
    option2.title.text = "栈(左为栈底，右为栈顶)";
    option2.series[0].layout = "none";
    option2.series[0].data = [];
    option2.series[0].links = [];

    option3 = deepCopy(option);
    option3.title.text = "DFS遍历结果";
    option3.series[0].layout = "none";
    option3.series[0].data = [];
    option3.series[0].links = [];

    //将节点和边的信息加入到配置项中
    for (var i in graph.vertexes)
        option.series[0].data[i] = { id: String(graph.vertexes[i]),value: String(graph.vertexes[i]) };

    var edge_cnt = 0;
    for (var i in graph.vertexes)
        for (var j = 0; j < graph.edges[graph.vertexes[i]].length; j++) {
            option.series[0].links[edge_cnt] = { source: String(graph.vertexes[i]), target: graph.edges[graph.vertexes[i]][j]};
            edge_cnt++;
        }

    //进行图像的显示
    chart_object = show_graph(option,chart_object,"draw_area",0.9,0.5);
    chart_object2 = show_graph(option2, chart_object2, "draw_area2",0.9,0.15);
    chart_object3 = show_graph(option3, chart_object3, "draw_area3",0.9,0.15);
}

//开始深度优先遍历
function start_dfs(){
    //访问数组初始化
    for(var i=0;i<graph.vertexes.length;i++)
        visited[graph.vertexes[i]]=false;

    //结点映射map
    for(var i in option.series[0].data)
        node_num_map[option.series[0].data[i].id]=i;

    time=0;
    var oSelect = document.getElementById('s1');
    var v = oSelect.options[oSelect.selectedIndex].text;

    option3.series[0].data = [];

    dfs(v);
    setTimeout(() => {
        option2.series[0].data.pop();
        chart_object2.setOption(option2);
    }, time);

    setTimeout(() => {
        chart_object3.setOption(option3);
    }, time + 1000);

}

//递归深度优先搜索
function dfs(v){
    visited[v]=true;
    option.series[0].data[node_num_map[v]].itemStyle = {};
    setTimeout(() => {
        option.series[0].data[node_num_map[v]].itemStyle.color = "yellow";
        option2.series[0].data.push({ value: String(v), y: 50, x: 2*(option2.series[0].data.length + 1)});
        option3.series[0].data.push({ value: String(v), y: 50, x: 2*(option3.series[0].data.length + 1)});
        //chart_object3.setOption(option3);
        chart_object.setOption(option);
        chart_object2.setOption(option2);
    }, time);
    setTimeout(() => {
        option.series[0].data[node_num_map[v]].itemStyle.color = "#00CC66";
        chart_object.setOption(option);
    }, time+1000);
    time+=2000;
    for(var i in graph.edges[v]){
        if(visited[graph.edges[v][i]]==false){
            dfs(graph.edges[v][i]);
            setTimeout(() => {
                option2.series[0].data.pop();
                chart_object2.setOption(option2);
            }, time-1000);
        }
    }
}

//非递归深度优先搜索
async function start_dfs_stack(){
    //访问数组初始化
    for(var i=0;i<graph.vertexes.length;i++)
        visited[graph.vertexes[i]]=false;

    //结点映射map
    for(var i in option.series[0].data)
        node_num_map[option.series[0].data[i].id]=i;

    var oSelect = document.getElementById('s1');
    var v = oSelect.options[oSelect.selectedIndex].text;
    var stack=[];
    option3.series[0].data = [];
    stack.push(v);
    visited[v]=true;
    option.series[0].data[node_num_map[v]].itemStyle = {};
    option.series[0].data[node_num_map[v]].itemStyle.color = "yellow";
    option2.series[0].data.push({ value: String(v), y: 700, x: 2 });
    option3.series[0].data.push({ value: String(v), y: 900, x: 2 });
    chart_object.setOption(option);
    chart_object2.setOption(option2);
    await delay(1000);
    while(stack.length!=0){
        var x=stack[stack.length-1];
        option.series[0].data[node_num_map[x]].itemStyle.color = "#00CC66";
        var flag=0;
        for(var i in graph.edges[x]){
            if(visited[graph.edges[x][i]]==false){
                flag=1;
                visited[graph.edges[x][i]]=true;
                stack.push(graph.edges[x][i]);
                option3.series[0].data.push({ value: String(graph.edges[x][i]), y: 900, x: 2*(option3.series[0].data.length + 1)  });
                option.series[0].data[node_num_map[graph.edges[x][i]]].itemStyle = {};
                option.series[0].data[node_num_map[graph.edges[x][i]]].itemStyle.color = "yellow";
                option2.series[0].data.push({ value: String(graph.edges[x][i]), y: 700, x: 2 * (option2.series[0].data.length + 1) });
                break;
            }
        }
        if(flag==0){
            option2.series[0].data.pop();
            stack.pop();
        }
        chart_object.setOption(option);
        chart_object2.setOption(option2);
        await delay(1000);
    }
    chart_object3.setOption(option3);
}

//进行BFS的展示
function show_bfs() {
    graph.read_input();
    createSelect();

    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "inline";
    document.getElementById("draw_area3").style.display = "inline";
    document.getElementById("select").style.display = "inline";
    document.getElementById("dfs").style.display = "none";
    document.getElementById("dfs_stack").style.display = "none";

    document.getElementById("adjacent_matrix").style.display = "none";
    document.getElementById("_dfs").style.display = "inline";
    document.getElementById("adjacent_linked_list").style.display = "inline";
    document.getElementById("_bfs").style.display = "none";

    //对配置项进行一些初始化操作
    option.title.text = "广度优先遍历";
    option.series[0].layout = "force";
    option.series[0].data = [];
    option.series[0].links = [];

    option2 = deepCopy(option);
    option2.title.text = "队列(左为队头，右为队尾)";
    option2.series[0].layout = "none";
    option2.series[0].data = [];
    option2.series[0].links = [];

    option3 = deepCopy(option);
    option3.title.text = "DFS遍历结果";
    option3.series[0].layout = "none";
    option3.series[0].data = [];
    option3.series[0].links = [];

    //将节点和边的信息加入到配置项中
    for (var i in graph.vertexes) 
        option.series[0].data[i] = { id: String(graph.vertexes[i]),value: String(graph.vertexes[i]) };

    var edge_cnt = 0;
    for (var i in graph.vertexes) 
        for (var j = 0; j < graph.edges[graph.vertexes[i]].length; j++) {
            option.series[0].links[edge_cnt] = { source: String(graph.vertexes[i]), target: graph.edges[graph.vertexes[i]][j]};
            edge_cnt++;
        }   

    //进行图像的显示
    chart_object = show_graph(option,chart_object,"draw_area",0.9,0.5);
    chart_object2 = show_graph(option2, chart_object2, "draw_area2",0.9,0.15);
    chart_object3 = show_graph(option3, chart_object3, "draw_area3",0.9,0.15);
}

//开始广度优先遍历
async function start_bfs(){
    //访问数组初始化
    for(var i=0;i<graph.vertexes.length;i++)
        visited[graph.vertexes[i]]=false;

    //结点映射map
    for(var i in option.series[0].data)
        node_num_map[option.series[0].data[i].id]=i;

    var oSelect = document.getElementById('s1');
    var v = oSelect.options[oSelect.selectedIndex].text;
    var queue=[];
    visited[v]=true;
    queue.push(v);
    var cnt=1, cnt1 = 1;
    while(queue.length!=0) {
        v = queue.shift();
        option.series[0].data[node_num_map[v]].itemStyle = {};
        option.series[0].data[node_num_map[v]].itemStyle.color = "yellow";
        option3.series[0].data.push({ value: String(v), y: 50, x: 2 * cnt1  });
        cnt1 += 1;
        chart_object.setOption(option);

        for (var i in graph.edges[v]) {
            if (visited[graph.edges[v][i]] == false) {
                visited[graph.edges[v][i]] = true;
                queue.push(graph.edges[v][i]);
                option2.series[0].data.push({value: String(graph.edges[v][i]), y: 50, x: 2 * cnt});
                cnt += 1;
            }
        }
        chart_object2.setOption({series: option2.series[0]});
        await delay(1000);
        option2.series[0].data.shift();
        chart_object2.setOption({series: option2.series[0]});
        option.series[0].data[node_num_map[v]].itemStyle.color = "#00CC66";
        chart_object.setOption(option);
        await delay(1000);
    }
    chart_object3.setOption(option3);
}