// lispCore.js
//lisp解释器内核部分

//识别各种语法
function EVAL(exp ,env){

	if(isSelfEvaluationg(exp)){

		return exp;

	}else if(isVariable(exp)){

		return lookupVarValue(exp ,env);

	}else if(isQuoted(exp)){

		return textOfQuotation(exp);

	}else if(isAssignment(exp)){

		return evalAssignment(exp ,env);

	}else if(isDefinition(exp)){

		return evalDefinition(exp ,env);

	}else if(isIf(exp)){

		return evalIf(exp ,env);

	}else if(isLambda(exp)){

		return makeProcedure(
			lambdaParameters(exp) ,
			lambdaBody(exp) ,
			env
		);

	}else if(isLet(exp)){

		return EVAL(
			letToLambda(exp) ,
			env
		);

	}else if(isBegin(exp)){

		return evalSequence(
			beginActions(exp) ,
			env
		);

	}else if(isCond(exp)){

		return EVAL(
			condToIf(exp) ,
			env
		);
	//以上表达式类型都不是的话，就是应用过程
	}else if(isApplication(exp)){

		return APPLY(
			//操作符规约到环境
			EVAL( operator(exp) ,env ) ,
			listOfValue( operands(exp) , env )
		);

	}else{

		throw new Error("unknow expression type");

	}

}
//将过程应用于实际参数
function APPLY(procedure ,arguments){
	//如果是基本过程的话
	if(isPrimitiveProcedure(procedure)){

		return applyPrimitiveProcedure(procedure ,arguments);
	//如果不是基本过程
	}else if(isCompoundProcedure(procedure)){
		//规约各个表达式串，生成新环境
		return evalSequence(
			procedureBody(procedure) ,
			extendEnv(
				procedureParameters(procedure) ,
				arguments ,
				procedureEnv(procedure)
			)
		);

	}else{

		throw new Error("unknow procedure type");

	}

}
//实际参数列表，规约到环境
function listOfValue(exps ,env){

	if(isNoOperands(exps)){
		return null;
	}else{
		return cons(
			EVAL(
				firstOperand(exps) ,
				env
			) ,
			listOfValue(
				restOperands(exps) ,
				env
			)
		);
	}

}
//scheme中的set！操作
function evalAssignment(exp ,env){

	setVariblValue(
		assignmentVariable(exp) ,
		EVAL(assignmentValue(exp) ,env) ,
		env
	);

}
//define操作
function evalDefinition(exp ,env){

	defineVariable(
		definitionVariable(exp) ,
		EVAL(definitionValue(exp) ,env) ,
		env
	);

}
//if操作
function evalIf(exp ,env){

	if(true == EVAL(ifPredicate(exp) ,env)){
		return EVAL(ifConsequent(exp) ,env);
	}else {
		return EVAL(ifAlternative(exp) ,env);			
	}

}
//规约一串表达式
function evalSequence(exps ,env){

	if(isLastExp(exps)){
		return EVAL(firstExp(exps) ,env);
	}else{
		EVAL(firstExp(exps),env);
		return evalSequence(restExps(exps) ,env);
	}

}
//是否为基本元素，数字字符串布尔
function isSelfEvaluationg(exp){

	if(isNumber(exp) || isString(exp) || isBoolean(exp)){
		return true;
	}else{
		return false;
	}

}
//是否为变量
function isVariable(exp){

	return isSymbol(exp)

}
//是否为引号表达式
function isQuoted(exp){

	return isQuote(exp)

}
//返回引号表达式的值
function textOfQuotation(exp){

	return exp.substring(1)

}
//复合过程的类型判断
function taggedList(exp ,tag){

	if(ifcons(exp)){
		return car(exp) == tag;
	}else{
		return false;
	}

}
//是否为赋值操作
function isAssignment(exp){

	return taggedList(exp ,"'set!");

}
//赋值表达式的变两部分
function assignmentVariable(exp){

	return car(cdr(exp));

}
//赋值表达式的值部分
function assignmentValue(exp){

	return car(cdr(cdr(exp)));

}
//是否为定义操作
function isDefinition(exp){

	return taggedList(exp ,"define")

}
//定义表达式的变量部分
function definitionVariable(exp){

	if(isSymbol(car(cdr(exp)))){
		return car(cdr(exp));
	}else{
		return car(car(cdr(exp)));
	}

}
//定义表达式的值部分
function definitionValue(exp){
	
	if(isSymbol(car(cdr(exp)))){
		return car(cdr(cdr(exp)));
	}else{
		return makeLambda(
			cdr(car(cdr(exp))) ,
			cdr(cdr(exp))
		);
	}

}
//是否为lambda表达式
function isLambda(exp){

	return (taggedList(exp ,"lambda"))

}
//参数部分
function lambdaParameters(exp){

	return car(cdr(exp));

}
//函数体
function lambdaBody(exp){

	return cdr(cdr(exp));

}
//得到一个lambda表达式
function makeLambda(paras ,body){

	return cons("lambda" ,cons(paras ,body));

}
//是否为if操作
function isIf(exp){

	return taggedList(exp ,"if");

}
//条件部分
function ifPredicate(exp){

	return car(cdr(exp));

}
//true结果
function ifConsequent(exp){

	return car(cdr(cdr(exp)));

}
//false结果
function ifAlternative(exp){

	if(cdr(cdr(cdr(exp)))){
		return car(cdr(cdr(cdr(exp))));
	}else{
		return false;
	}

}
//cond变成if
function makeIf(predicate ,consequent ,alternative){

	return list.apply(null,[].concat.apply(["if"],arguments));

}
//是否为begin
function isBegin(exp){

	return taggedList(exp ,"begin");

}
//begin中的表达式串
function beginActions(exp){

	return cdr(exp);

}
//是否为最后一个表达式
function isLastExp(seq){

	return cdr(seq) == null;

}
//第一个表达式
function firstExp(seq){

	return car(seq);

}
//剩下的表达式
function restExps(seq){

	return cdr(seq);

}
//一串表达式变成一个表达式，便于condToIf操作
function seqToExp(seq){

	if(seq == null){
		return seq;
	}else if(isLastExp(seq)){
		return firstExp(seq);
	}else{
		return makeBegin(seq);
	}

}
//返回一个begin表达式
function makeBegin(seq){

	return cons("begin" ,seq);

}
//是否为应用过程表达式
function isApplication(exp){

	return ifcons(exp);

}
//操作符，基本操作符，或者声明的函数
function operator(exp){

	return car(exp);

}
//操作数
function operands(exp){

	return cdr(exp);

}
//是否有操作数
function isNoOperands(ops){

	return null == ops;

}
//第一个操作数
function firstOperand(ops){

	return car(ops);

}
//剩下的操作数
function restOperands(ops){

	return cdr(ops);

}
//是否为cond表达式（条件表达式）
function isCond(exp){

	return taggedList(exp ,"cond");

}
//条件表达式的操作体
function condClauses(exp){

	return cdr(exp);

}
//是不是cond表达式中的else子表达式
function ifCondElseClause(clause){

	return condPredicate(clause) == "else";

}
//cond子表达式中的子句中的条件部分
function condPredicate(clause){

	return car(clause);

}
//cond子表达式为true
function condActions(clause){

	return cdr(clause);

}
//cond转if串
function condToIf(exp){

	return (function expandClauses(clauses){

		if(null == clauses){
			return false;
		}else{
			var first = car(clauses) ,
				rest = cdr(clauses) ;
			if(ifCondElseClause(first)){
				//最后那个
				if(null == rest){
					return seqToExp(condActions(first))
				}else{
					throw new Error("else clause is not the last");
				}
			}else{
				//if三要素
				return makeIf(
					condPredicate(first) ,
					seqToExp(condActions(first)) ,
					expandClauses(rest)
				)
			}
		}

	})(condClauses(exp));

}
//是不是let
function isLet(exp){

	return taggedList(exp ,"let");

}
//let转lambda
function letToLambda(exp){

	var varAndExpList = letVarAndExp(exp) ,
		body = letBody(exp) ,
		//提取varlist
		varList = map(function(ele){
			return car(ele);
		} ,varAndExpList) ,
		//提取表达式
		expList = map(function(ele){
			return car(cdr(ele));
		} ,varAndExpList);
	//按照let定义组装表达式
	return list(
		makeLambda(varList ,body) ,
		expList
	);

}
//rt
function letVarAndExp(exp){

	return car(cdr(exp));

}
//rt
function letBody(exp){

	return cdr(cdr(exp));

}
//返回可执行过程
function makeProcedure(parameters ,body ,env){

	return list("procedure" ,parameters ,body ,env);

}
//是不是过程
function isCompoundProcedure(p){

	return taggedList(p ,"procedure");

}
//过程中的参数
function procedureParameters(p){

	return car(cdr(p));

}
//过程体
function procedureBody(p){

	return car(cdr(cdr(p)));

}
//过程的环境
function procedureEnv(p){

	return car(cdr(cdr(cdr(p))));

}
//查找scope chain
function lookupVarValue(v ,env){

	return (function envloop(env){

		function scan(vars ,vals){
			if(null == vars){
				return envloop(enclosingEnviroment(env));
			}else if(v == car(vars)){
				return car(vals);
			}else{
				return scan(cdr(vars) ,cdr(vals));
			}
		}
		if(env == theEmptyEnviroment()){
			throw new Error("unbound variable");
		}else{
			var frame = firstFrame(env);
			return scan(
				frameVariables(frame) ,
				frameValues(frame)
			);
		}

	})(env)

}
//生成子环境，继承父环境
function extendEnv(vars ,values ,baseEnv){

	if(length(vars) == length(values)){
		return cons(makeFrame(vars ,values) ,baseEnv);
	}else if(length(vars) < length(values)){
		throw new Error("to many arguments");
	}else{
		throw new Error("to few arguments");
	}

}
//添加或者更改变量
function defineVariable(v ,value ,env){

	var frame = firstFrame(env);
	function scan(vars ,vals){
		if(null == vars){
			addBindingToFrame(v ,value ,frame);
		}else if(v == car(vars)){
			setcar(vals ,value);
		}else{
			scan(cdr(vars) ,cdr(vals));
		}
	}
	scan(
		frameVariables(frame) ,
		frameValues(frame)
	);

}
//与define不同的是不会创建新的变量
function setVariblValue(v ,value ,env){

	return (function envloop(env){

		function scan(vars ,vals){
			if(null == vars){
				envloop(enclosingEnviroment(env));
			}else if(v == car(vars)){
				setcar(vals ,value);
			}else{
				scan(cdr(vars) ,cdr(vals));
			}
		}
		if(env == theEmptyEnviroment()){
			throw new Error("unbound variable");
		}else{
			var frame = firstFrame(env);
			scan(
				frameVariables(frame) ,
				frameValues(frame)
			);
		}

	})(env)

}
//下一层环境
function enclosingEnviroment(env){
	
	return cdr(env);

}
//当前环境
function firstFrame(env){

	return car(env);

}
//空环境
function theEmptyEnviroment(){

	return list();

}
//一个作用域
function makeFrame(variables ,values){

	return cons(variables ,values);

}
//作用域的vars
function frameVariables(frame){

	return car(frame);

}
//作用域的values
function frameValues(frame){

	return cdr(frame);

}
//把变量加入指定的frame，也就是scope
function addBindingToFrame(variable ,value ,frame){

	setcar(frame ,cons(variable ,car(frame)));
	setcdr(frame ,cons(value ,cdr(frame)));

}
//初始化环境，加入基本操作
function setupEnvironment(){

	var initialEnv = extendEnv(
		primitiveProcedureNames() ,
		primitiveProcedureObjects() ,
		theEmptyEnviroment()
	);
	defineVariable("true" ,true ,initialEnv);
	defineVariable("false" ,false ,initialEnv);
	return initialEnv;

}
//是不是基本环境
function isPrimitiveProcedure(proc){

	return taggedList(proc ,"primitive");

}
//过程体
function primitiveImplementation(proc){

	return car(cdr(proc));

}
//初始过程
function primitiveProcedures(){

	return list(
		list("car" ,car) ,
		list("cdr" ,cdr) ,
		list("cons" ,cons) ,
		list("list" ,list) ,
		list("null?" ,function(ele){return ele == null}) ,
		list("+" ,add) ,
		list("-" ,sub) ,
		list("/" ,divide) ,
		list("*" ,multi) ,
		list("%" ,mod) ,
		list("<" ,lessThan) ,
		list(">" ,greaterThan) ,
		list("=" ,equal)
	)

}
function add(){

	var numbers = arguments;
	var result = 0;
	var length = numbers.length;
	for(var i = 0 ; i< length ; i++){
		result += numbers[i];
	}
	return result;

}
function sub(){

	var numbers = arguments;
	var result = arguments[0];
	var length = numbers.length;
	for(var i = 1; i<length ; i++){
		result -= numbers[i];
	}
	return result;

}
function divide(){

	var numbers = arguments;
	var result = arguments[0];
	var length = numbers.length;
	for(var i = 1; i<length ; i++){
		result /= numbers[i];
	}
	return result;

}
function multi(){

	var numbers = arguments;
	var result = arguments[0];
	var length = numbers.length;
	for(var i = 1; i<length ; i++){
		result *= numbers[i];
	}
	return result;

}
function mod(){

	var numbers = arguments;
	var result = arguments[0];
	var length = numbers.length;
	for(var i = 1; i<length ; i++){
		result %= numbers[i];
	}
	return result;

}
function lessThan(arg1 ,arg2){

	return arg1 < arg2;

}
function greaterThan(arg1 ,arg2){
	if(isNumber(arg1) && isNumber(arg2)){
		return arg1 > arg2;
	}else{
		throw new Error("operator '=' must number");
	}

}
function equal(arg1 ,arg2){

	return arg1 == arg2;

}
//初始过程名
function primitiveProcedureNames(){

	return map(
		function(ele){
			return car(ele);
		} ,
		primitiveProcedures()
	);

}
//初始函数函数体
function primitiveProcedureObjects(){

	return map(
		function(proc){
			return list("primitive" ,car(cdr(proc)))
		} ,primitiveProcedures()
	);

}
//实际执行
function applyPrimitiveProcedure(proc ,args){
	return JSAPPLY(
		primitiveImplementation(proc) ,
		args
	);
}
//js apply
function JSAPPLY(func ,args){
	var argArray = listToArray(args);
	return func.apply(null ,argArray);
}
//全局环境
var theGlobalEnvironment = setupEnvironment();

//测试数据

// exp0 = list("define","a",0);
// exp1 = list("define","t",1);
// exp2 = list("define","y",2);
// exp3 = list("define",list("squareAdd","a","b"),list("define","a",list("+","t","y")),list("+",list("*","a","a"),list("*","y","y")));
// exp4 = list("squareAdd",4,4);
// exp5 = list(
// 	list(
// 		"lambda",
// 		list("arg1","arg2"),
// 		list("define" ,"t" ,3),
// 		list(
// 			"+",
// 			list("*","arg1","arg1"),
// 			list("*","t","t"))),1,2);
// exp6 = list(
// 	"begin" ,
// 	list("*",2,3) ,
// 	list("+",4,5)
// );
// exp7 = list(
// 	"if",
// 	list("<","t",0),
// 	"true",
// 	"false"
// );
// exp8 = list(
// 	"cond",
// 	list(
// 		list(">","a",0),1
// 	),
// 	list(
// 		list("<","a",0),2
// 	),
// 	list("else",3)
// );
// exp9 = list("define" ,list("fib", "number"),
// 	      list("cond",
// 		    list(list("=", "number", 0), 0),
// 		    list(list("=", "number", 1), 1),
// 		    list("else", list("+", list("fib", list("-", "number", 2)) ,
// 		             			   list("fib", list("-", "number", 1))))))
// traverse(exp9);
// exp = list(exp1 ,exp2 ,exp3);
// EVAL(exp0 ,theGlobalEnvironment)
// EVAL(exp1 ,theGlobalEnvironment)
// EVAL(exp2 ,theGlobalEnvironment)
// EVAL(exp3 ,theGlobalEnvironment)

// _log(EVAL(exp4 ,theGlobalEnvironment));
// _log(EVAL(exp5 ,theGlobalEnvironment));
// _log(EVAL(exp7 ,theGlobalEnvironment));
// _log(EVAL(exp8 ,theGlobalEnvironment));
