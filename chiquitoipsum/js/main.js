var chiquitoArray = ["fistro","torpedo","pecador","sexuarl","por la gloria de mi madre","diodeno","condemor","jarl","ese que llega","pupita","la caidita","te voy a borrar el cerito","al ataquerl","a wan","a peich","a gramenawer","no puedor","hasta luego Lucas","mamaar","apetecan","caballo blanco caballo negroorl","ese pedazo de","benemeritaar","te va a hasé pupitaa","de la pradera", "ese hombree", "quietooor", "qué dise usteer", "no te digo trigo por no llamarte Rodrigor", "está la cosa muy malar", "tiene musho peligro","ahorarr","diodenoo","amatomaa","me cago en tus muelas","llevame al sircoo", "papaar papaar", "se calle ustée", "va usté muy cargadoo"];
var latinArray = ["sit amet", "consectetur", "adipisicing", "elit", "sed", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "commodo", "consequat", "duis", "aute", "irure", "dolor", "reprehenderit", "voluptate", "velit", "esse", "cillum","occaecat", "qui", "officia"];

var paragraphNumber;
var firstLine = true;
var buttonCopyDisable = true;


/*COPY BUTTON*/
$(document).ready(function(){	
	$('#button-copy').zclip({
		path:'js/ZeroClipboard.swf',
		copy:function(){
			if(buttonCopyDisable==false){
				return $('#divText').text();
			}
		},
		afterCopy:function(){			
			$('#button-copy').html('Copied!');
		}
	});
});


$("#button-fistrum").click(function(){
	firstLine = true;
	
	/*paragraphNumber= $("#paragraph-number").val();*/
    $("#divText").html(generateFullText(chiquitoArray));
	initialAnimation();
	resetCopyButton("#button-copy");
});

$("#button-latin").click(function(){
	firstLine = true;
	
	/*paragraphNumber= $("#paragraph-number").val();*/
	var mixedArray = chiquitoArray.concat(latinArray);
    $("#divText").html(generateFullText(mixedArray)); 
	initialAnimation();
	resetCopyButton("#button-copy");
	
});


/*Dropdown paragraph menu*/


$(".paragraph-number-selector li").click(function(){
	paragraphNumber=$(this).html();
	$(".paragraph-active-number").html(paragraphNumber);
	$(".paragraph-number-selector li").removeClass("active-paragraph");
	$(this).addClass("active-paragraph");
});

function resetCopyButton(buttonId){
	buttonCopyDisable = false;
	/*$(buttonId).css("visibility","visible");*/
	$(buttonId).removeClass("button-copy-disable");
	$(buttonId).html("Copy");
}

function initialAnimation(){
	/*Animate buttons and text container*/
	$(".button-container").css("top","0px");
	$("#text-container").slideDown();
}

function generateRandom(initialValue,endValue){
	/*Generate a random number between initialValue and endValue*/
	var randomInterval;
	var randomValue;
	if(endValue>=initialValue){
		randomInterval=endValue-initialValue;
		randomValue=Math.floor(Math.random()*randomInterval)+initialValue;
	}else{
		randomInterval=initialValue-endValue;
		randomValue=Math.floor(Math.random()*randomInterval)+endValue;
	}
	return randomValue;
}

function generateLine(wordsArray){ 
	/*generate a line of random words*/
	var oneLine = new String();
	var wordRandom = new String();
	var wordsNumber = generateRandom(4,12);
	var wordRandomIndex;
	var lastWordExclamation = false;
	var i;
	
	wordRandomIndex = generateRandom(0,wordsArray.length);
	
	if(firstLine){
		oneLine="Lorem fistrum";
		firstLine=false;
	}else{
		oneLine=wordsArray[wordRandomIndex];
	}
	
	for (i=1;i<wordsNumber;i++){
		wordRandomIndex = generateRandom(0,wordsArray.length);
		wordRandom=wordsArray[wordRandomIndex];
		
		/*If the last word has an exclamation, it set the following letter to capital*/
		if(lastWordExclamation==true){ 
			wordRandom=wordRandom[0].toUpperCase()+wordRandom.substring(1);
			lastWordExclamation = false;
		}
		
		if(wordRandom.charAt(wordRandom.length-1)=='!'){
			lastWordExclamation = true;
		}else{
			lastWordExclamation = false;
		}
		
		oneLine=oneLine + ' ' + wordRandom;   
	}
	
	oneLine=oneLine[0].toUpperCase()+oneLine.substring(1);
	
	/*Add a period to the end of the line, unless the last character is an exclamation mark*/
	if(oneLine.charAt(oneLine.length-1)=='!'){
		oneLine=oneLine+' ';
	}else{
		oneLine=oneLine+'. ';
	}
	
	return oneLine;
}

function generateParagraph(wordsArray){
	/*Generate a paragraph with lines*/
	var oneParagraph = new String();
	var linesNumber = generateRandom(5,10);
	var i;
	
	oneParagraph=generateLine(wordsArray);
	
	for (i=1;i<linesNumber;i++){
		oneParagraph=oneParagraph + generateLine(wordsArray);   
	}
	
	/*Wrap the paragraph inside <p> tags*/
	oneParagraph='<p>'+oneParagraph+'</p>';
	
	return oneParagraph;
}

function generateFullText(wordsArray){
	/*Put together the number of paragraphs set by the user*/
	var FullText = new String();
	var i;
	
	FullText=generateParagraph(wordsArray);   

	for (i=1;i<paragraphNumber;i++){
		FullText=FullText+generateParagraph(wordsArray);  
	}
	return FullText;
}

/*FOOTER DATE*/
var dteNow = new Date();
var intYear = dteNow.getFullYear();
$("#footer-date").html(intYear);