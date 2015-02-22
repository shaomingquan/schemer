// lispEditorConfig.js
/*

keyword，只是特殊的word，only the action：发现它是keyword，add class

*/
var config = {
	/*
	是否显示行号
	关键字集合（不论我觉得这是什么字的，就随意命名，挺好）
	回车是否缩进
	回车缩进时另一半括号到下一行
	括号配对提醒
	括号成对出现

	变量颜色，括号颜色，关键字颜色，保留字颜色（随意定义吧）
	*/
	ifLineNumber : true ,

	ifEnterIndent : true ,

	ifBracketsNextLine : true ,

	ifBracketsLint : true ,

	ifBracketsTogather : true ,

	ifAutoFocus : true ,

	stagePadding : 8 ,

	codeStageBackgroundColor : "#eee" ,

	codeStageBorderColor : "purple" , 

	lineNumberWidth : 20 ,

	lineNumberFontSize : 16 ,

	lineNumberLineColor : "purple" ,

	lineHeight : 18 ,

	words : {
		key : ["if" ,"else" ,"cond" ,"set?" ,"setcar?" ,"setcdr?" ,"define" ,"cons" ,"list" ,"car" ,"cdr" ,"lambda" ,"quote" ,"begin" ,"let"]
	} ,

	brackets : ["("] ,

	colors : {
		lineNumberBackGround : "black" ,
		lineNumberFontColor : "white" ,
		contentBackGround : "white" ,
		contentFontColor : "white" ,
		bracketsColor : "gray" ,
		words : {
			key : "red"
		}
	}
}