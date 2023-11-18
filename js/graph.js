"use strict";

class myGraph{
    constructor()
    {
        this.node_num = Number(); // 结点数量
        this.vertexes = []; // 结点编号列表
        this.adjMatrix = []; // 邻接矩阵
        this.edges =new Array(); //边
    }
    //添加顶点
    addVertex(v){
        this.vertexes.push(v);
        this.edges[v]=[];
    }
    //添加边从v1到v2
    addEdge(v1,v2){
        this.edges[v1].push(v2);
    }

    //根据输入的顶点、边构建图结构
    read_input(){
        this.vertexes = [];
        this.adjMatrix = []; 
        this.edges =new Array(); 
        this.node_num=Number(document.getElementById("input_node_num").value);
        //先读取节点名称
        var node_info = Array.from({ length: this.node_num }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));

        for (var i = 0; i < this.node_num; i++) {
            this.addVertex(node_info[i])
        }
        var mytable = document.getElementById('myTable');

        for(var i=1,rows=mytable.rows.length; i<rows; i++){
            for(var j=1,cells=mytable.rows[i].cells.length; j<cells; j++){
                if(!this.adjMatrix[i - 1]){
                    this.adjMatrix[i - 1] = new Array();
                }
                var x=mytable.rows[i].cells[j].innerHTML;
                this.adjMatrix[i - 1][j - 1] = x;
                if(Number(x)==1){
                    this.addEdge(this.vertexes[i - 1],this.vertexes[j - 1]);
                }
            }
        }    
    }
}
//全局变量
let graph=new myGraph();
