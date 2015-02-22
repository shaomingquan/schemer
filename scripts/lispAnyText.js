// lispUi.js

//test
//模拟编辑器输出文档
// var exp9 = textToEvalCode("(define (fib number) (cond ((= number 0) 0) ((= number 1) 1) (else (+ (fib (- number 2)) (fib (- number 1)))))) (define number 8) (fib number)")
//执行声明函数，执行fib函数
// _log(EVAL(exp9 ,theGlobalEnvironment));

//输入code文字输出可执行begin串，文字由文本编辑器提供，文本编辑器保障代码规范，回车换行\n，空格规范。
function textToEvalCode(text){

	return cons("begin",(function(input){
		//遍历器
		var sI = stringIter(input);

		return list.apply(null,getFirstBeginArray(sI));

	})(text))

}
//得到begin字句的调用数组
function getFirstBeginArray(sI){

	var listResult = [] ,
		curList = null ,
		curChar = "";
	while(curChar = sI.goNext()){
		//左括号是单个字句的开始
		if(curChar == "("){
			curList = getList(sI);
			listResult.push(curList);
		}else{
			continue;
		}

	}
	return listResult;

}
//得到单个字句
function getList(sI){

	return (function(sI){

		var re = list() ,
			curChar = "" ,
			thing = null ,
			cStack = [];

		while(curChar = sI.goNext()){
			//右括号退栈
			if(curChar == ")"){

				if(cStack.length > 0){
					thing = cStack.join("");
					if(isFakeNumber(thing)){
						re = addToList(re ,parseInt(thing));
					}else{
						re = addToList(re ,thing);
					}
					cStack = [];
				}
				return re;

			//左括号入栈递归
			}else if(curChar == "("){
				re = addToList(re,arguments.callee(sI));
			//空白符检查字符栈是否为空
			}else if(curChar == " " ||curChar == "\t" || curChar == "\n"){
				if(cStack.length > 0){
					thing = cStack.join("");
					if(isFakeNumber(thing)){
						re = addToList(re ,parseInt(thing));
					}else{
						re = addToList(re ,thing);
					}
					cStack = [];
				}
				continue;
			//数字的话
			}else{
				cStack.push(curChar);
			}
		}

	})(sI);
	
}
//遍历器
function stringIter(string){

	var index = -1,
		sLength = string.length;
	return {

		goNext : function(){
			return index < sLength && string.charAt(++ index); 
		},
		next : function(){
			return index < sLength && string.charAt(index + 1)
		},
		getIndex : function(){
			return index;
		}

	}

}

function printList(list){
	return "(" + (function(cur){
		if(ifcons(car(cur))){
			return printList(car(cur));
		}else{
			return car(cur) + " " + arguments.callee(cdr(cur));
		}
	})(list) + ")";
}