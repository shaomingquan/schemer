// lispEditor.js
/*

oninput 
	回车新建一行。
	正常输入时，维护一个末端的文本节点，维护一个文本节点内容的栈，每次输入时逆序查找栈，若有关键字将其提升至node节点
	


*/
//编辑器初始化
window.onload = function(){
	var editor = new Editor(document.getElementById("editorStage") ,config);
	editor.init();
}
//样式表类
function StyleSheet(){
	this.entity = $create("style");
}
StyleSheet.prototype.addStyle = function(selector ,properties){
	var propertiesContent = "";
	for(attr in properties){
		if(this.isSpecail(attr)){
			propertiesContent += (this.specailAttrToNormal(attr) + ":" + properties[attr] + ";");
		}else{
			propertiesContent += (attr + ":" + properties[attr] + ";");
		}
	}
	this.entity.innerHTML += (selector+"{"+propertiesContent+"}");
}
StyleSheet.prototype.eval = function(){
	document.body.appendChild(this.entity);
}
StyleSheet.prototype.isSpecail = function(attr){
	return attr.search("webkit") >= 0 || attr.search("line") >= 0 || attr.search("font") >= 0 || attr.search("box") >= 0 || attr.search(/border\w/) >= 0;
}
StyleSheet.prototype.specailAttrToNormal = function(specailAttr){
	if(attr.search("box") >= 0){
		return "box-sizing";
	}
	switch(specailAttr[0]){
		case "w" : {
			return "-webkit-" + specailAttr.substring(6).toLocaleLowerCase();
		}case "l" : {
			return "line-" + specailAttr.substring(4).toLocaleLowerCase()
		}case "f" : {			
			return "font-" + specailAttr.substring(4).toLocaleLowerCase()
		}case "b" : {
			return "border-" + specailAttr.substring(6).toLocaleLowerCase()
		}
	}
}
//代码行类
function Line(parent,content){
	this.entity = $create("div");
	this.entity.setAttribute("class","code-line");
	//解析内容有关键字还是数字什么的
	this.evalContent = function(){
		//exp:(define a 2)
	}
	this.getColor = function(word){

	}
	this.spaceNode = function(number){

	}
}
//光标类
function Iter(){
	this.col = 0;
	this.row = 0;
	this.addRow = function(){
		this.row ++;
		return this.row;
	}
	this.addCol = function(){
		this.col ++;
		return this.col;
	}
	this.position = function(){
		return {
			col : this.col ,
			row : this.row
		}
	}
}
//编辑器类
function Editor(stage ,config){
	//插件作用体
	this.stage = stage ;

	this.mainStageHeight = this.stage.offsetHeight;
	this.mainStageWidth = this.stage.offsetWidth;
	//style
	this.styleSheet = new StyleSheet();
	//代码部分
	this.codeContent = null;
	//行号部分
	this.lineNumber = null;
	//游标dom
	this.iter = null;
	//选中元素dom
	this.select = null;
	//插件配置
	this.config = config ;
	this.padding = this.config.stagePadding ;
	//要有这个
	this.selectBuffer = null;
	//游标位置
	this.iterPosition = null;

	//是否被focus
	this.isFocused = true;
	//

}
function $id(id){
	return document.getElementById(id);
}
function $create(tagName){
	return document.createElement(tagName);
}
function $class(parentId ,className){
	var re = [] ,
		allNodes = $id(parentId).getElementsByTagName("*") ,
		length = addNodes.length ,
		curNode = null;
	for(var i = 0 ; i < length ; i ++){

		curNode = allNodes[i];
		if(curNode.getAttribute("class").search(tagName)){
			re.push(curNode);
		}

	}
	return re;
}
//编辑器初始化
Editor.prototype.init = function(){
	//根据那个配置文件插入一个style标签
	this.styleInit() ;
	//dom初始化，游标的初始化，根据配置文件显示或者不显示行号
	this.domInit() ;
	//事件初始化，双击，粘贴，oninput，单击，mousedown,mousemove,mouseup
	this.eventsInit() ;

}

Editor.prototype.styleInit = function(){
	//基本的样式和，配置中的颜色
	this.basicStyleInit();
	this.configStyleInit();
	this.styleSheet.eval();
}

Editor.prototype.basicStyleInit = function(){
	this.styleSheet.addStyle(".code-stage",{
		position : "relative" ,
		webkitTransform : ("translateX(" + this.padding + "px) translateY(" + this.padding + "px)") ,
		height : (this.mainStageHeight - this.padding * 2) + "px" ,
		width : (this.mainStageWidth - this.padding * 2) + "px" ,
		background : this.config.codeStageBackgroundColor ,
		border : "1px solid " + this.config.codeStageBorderColor
	});
	this.styleSheet.addStyle(".code-content:before",{

	});
	this.styleSheet.addStyle(".code-content:focus",{
		outline : "none"
	});
	this.styleSheet.addStyle(".code-content",{
		position : "absolute" ,
		height : (this.mainStageHeight - this.padding * 2) + "px" ,
		width : (this.mainStageWidth - this.padding * 2  - this.config.lineNumberWidth) + "px" ,
		borderLeft : "1px solid " + this.config.lineNumberLineColor ,
		right : "0px",
		padding : "5px" ,
		boxSizing : "border-box" 
	});
}

Editor.prototype.configStyleInit = function(){

}

Editor.prototype.domInit = function(){

	var codeStage = $create("div");
	codeStage.setAttribute("class","code-stage");
	var codeContent = $create("div");
	this.codeContent = codeContent;
	codeContent.setAttribute("class","code-content");
	codeContent.setAttribute("contenteditable",true);
	codeContent.setAttribute("spellcheck",false);
	codeStage.appendChild(codeContent);
	this.stage.appendChild(codeStage);
	// if(this.config.ifLineNumber){
	// 	this.domWithLineNumberInit();
	// }else{
	// 	this.domWithoutLineNumberInit();
	// }

}

Editor.prototype.domWithLineNumberInit = function(){

}

Editor.prototype.domWithoutLineNumberInit = function(){

}

Editor.prototype.eventsInit = function(){
	var tn = document.createTextNode("/    /");
	this.codeContent.appendChild(tn);
	// if(this.config.ifLineNumber){
	// 	this.lineNumber.onclick = this.lineNumberOnclickHandler;
	// }
	// this.codeContent.onclick = this.codeContentOnclickHandler;
	// this.codeContent.ondbclick = this.condeContentOndbclickHandler;

	// this.codeContent.onmousedown = this.codeContentOnmousedownHandler;
	// this.codeContent.onmousemove = this.codeContentOnmousemoveHandler;
	// this.codeContent.onmouseup = this.codeContentOnmouseupHandler;

	this.codeContent.onkeydown = this.codeContentOnkeydownHandler;

	// this.codeContent.onfocus = this.codeContentOnfocusHandler;
	// this.codeContent.onblur = this.codeContentOnblurHandler;
}
Editor.prototype.codeContentOnkeydownHandler = function(e){
	switch(e.keyCode){
		//tab
		case 9:
			// addTab();
			document.execCommand("Indent")
			e.preventDefault();
			break;
		default:
			break;
	}
}