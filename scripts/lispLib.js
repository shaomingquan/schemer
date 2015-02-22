// lispLib.js
//是否为数字，Number型
function isNumber(exp){

	return Number(exp) === exp;

}
//是否为数字，字符串型也可
function isFakeNumber(exp){

	return Number(exp) == exp;

}
//是否为lisp中的字符串
function isString(exp){

	var length = exp.length;
	return String(exp) === exp && exp[0] == "'" && exp[length - 1] == "'"; 

}
//是否为lisp中的布尔型
function isBoolean(exp){

	return exp == "true" || exp == "false";

}
//是否为lisp中的symbol
function isSymbol(exp){

	return String(exp) === exp && exp.indexOf("'") < 0 && exp.indexOf("\"") < 0;

}
//是否为引号表达式
function isQuote(exp){

	return String(exp) === exp && exp[0] == "'";

}
//打印
function _log(content){

	console.log(content);

}
function _error(content){

	console.error(content);

}
function _warn(content){

	console.warn(content);

}
//分割线
function div(){

	_log("********************************");

}
//list遍历打印函数，带list遍历层数
function makediv(floor ,content){

	var front = "";
	for(var i = 0 ; i < floor ; i ++){
		front += "~~";
	}
	console.log( front + content );

}
//序对实现
function cons(car ,cdr){

	var data = {
			car : car ,
			cdr : cdr
		},
		func = function(deal){
			return deal(data);
		};
	func.ifcons = null;
	return func;

}
//是否为序对
function ifcons(func){

	return func.hasOwnProperty("ifcons");

}
//获得car
function car(cons){

	return cons(function(data){
		return data.car;
	})

}
//获得cdr
function cdr(cons){

	return cons(function(data){
		return data.cdr;
	})

}
//重置car
function setcar(cons ,ele){

	return cons(function(data){
		data.car = ele;
	});

}
//重置cdr
function setcdr(cons ,ele){

	return cons(function(data){
		data.cdr = ele;
	})

}
//列表
function list(){

	var numbers = arguments,
		length = numbers.length;
	return (function(index){
		if(index >= length){
			return null;
		}else{
			return cons(numbers[index] ,arguments.callee(++index));
		}
	})(0)

}
//列表尾部加一个元素
function addToList(list ,ele){
	return (function(list ,ele){
		if(list == null){
			return cons(ele ,null);
		}else{
			return cons(car(list) ,arguments.callee(cdr(list) ,ele));
		}
	}(list ,ele))
}
//lisp列表转换成js数组
function listToArray(list){
	var re = [];
	(function(list){
		if(list == null){
			return false;
		}else{
			re.push(car(list));
			arguments.callee(cdr(list));
		}
	})(list);
	return re;

}
//每个element进行op
function map(op ,list){

	if(list == null){
		return null;
	}else{
		return cons(op(car(list)) ,map(op ,cdr(list)));
	}

}
//list的长度
function length(list){

	if(list == null){
		return 0;
	}else{
		return 1 + length(cdr(list));
	}

}
//两个list链接
function append(l1 ,l2){

	if(l1 == null){
		return l2;
	}else{
		return cons(car(l1) ,append(cdr(l1) ,l2));
	}

}
//遍历list或者tree
function traverse(tree){

	(function(things ,floor){
		if(things == null){
			return false;
		}else if(!ifcons(things)){
			makediv(floor ,things);
		}else{
			arguments.callee(car(things) , 1 + floor),
			arguments.callee(cdr(things) , floor);
		}
	})(tree ,0)

}