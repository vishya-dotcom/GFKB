

////////////////////////////////
$(document ).ready(function() {

	setGlobalMenuCn();        
	var sections = getSections();
        $("#modulesectionscn").html(sections);
	$("#modulesearchboxcn").html(getSearchBoxCn());
	var fieldName = $.urlParam('searchfield1');
        var fieldValue = $.urlParam('searchvalue1');
       
	if(fieldName && fieldValue){
                pageId = "proteinview";
        }
	setPageFrame();
	fillFrameCn();
});

////////////////////////////
function setPageFrame(){

	var pageFrame = "";
        if(pageId == 'statsview'){
		pageFrame += '<table width=100% style="font-size:13px;" cellspacing=0 cellpadding=0 border=0>' +
			'<tr height=40><td id=downloader valign=middle></td></tr>' +
			'<tr><td id=statsviewcn colspan=2></td></tr>' +
                	'</table>';
	}
	else if(pageId == 'searchresults'){
                pageFrame += '<table width=100% style="font-size:13px;" cellspacing=0 cellpadding=0 border=0>' +
                        '<tr height=40><td id=downloader valign=middle></td></tr>' +
                        '<tr><td id=searchresults colspan=2></td></tr>' +
                        '</table>';
        }
	else if(pageId == 'proteinview'){
		var sHash = {
			"s2":"cursor:hand;height:15px;padding:10 0 10 5;color:"+moduleMenuFg+";font-weight:bold;border-bottom:1px solid #fff;cursor:hand;"
			,"s3":"font-weight:bold;"
			,"s4":"text-align:center;"
			,"filtertitlecn":"height:15px;padding:10 0 10 5;color:"+moduleMenuFg+";font-weight:bold;border-bottom:1px solid #fff;cursor:hand;"
			,"filtercn":"height:50px;padding:10px;display:none;"
			,"iconcn":"width:25px;padding:0 0 0 15;border-bottom:1px solid #fff;cursor:hand;"
		};



		pageFrame += '<table width=100% border=0 cellspacing=0>' +
                        '<tr height=50>'+ 
			'<td id=tabletitlecn style="font-weight:bold;" valign=bottom colspan=2></td></tr>' +
                        '<tr><td id=tabledesccn colspan=2></tr>'+
			'<tr><td id=downloadlinkcn valign=bottom align=right colspan=2></td></tr>' +
			'<tr><td class=titlecn id=filtericoncn style="'+sHash["iconcn"]+'"></td><td class=titlecn id=filtertitlecn style="'+sHash["filtertitlecn"]+'"></td></tr>' +
			'<tr><td id=filtercn style="'+sHash["filtercn"]+'" colspan=2></td></tr>' +
			'<tr><td class=titlecn id=plottitleiconcn1 style="'+sHash["iconcn"]+'"></td><td class=titlecn id=plottitlecn1 style="'+sHash["s2"]+'"></td></tr>' +
                        '<tr><td id=plotdesccn1 style="font-size:11px;padding:10px;display:none;" colspan=2></td></tr>' +
			'<tr><td id=plotcn1 style="height:400px;width:80%;display:none;" colspan=2></td></tr>' +
			'<tr><td class=titlecn id=plottitleiconcn2 style="'+sHash["iconcn"]+'"></td><td class=titlecn id=plottitlecn2 style="'+sHash["s2"]+'"></td></tr>' +
			'<tr><td id=plotdesccn2 style="font-size:11px;padding:10px;display:none;" colspan=2></td></tr>' +
			'<tr><td id=plotcn2 style="height:400px;width:80%;display:none;" colspan=2></td></tr>' +
                        '<tr height=20><td colspan=2>&nbsp;</td></tr>' +
			'<tr><td id=mutationtablecn colspan=2></td></tr>' +
                        '<tr><td id=mutationtablefootnotecn colspan=2></td></tr>' +
                        '</table>';
	}
	$("#pagecn").html(pageFrame);
	return;
}


////////////////////////////
function fillFrameCn(){

	if(pageId == 'statsview'){
		fillStatsViewCn("1");
        }
	else if(pageId == 'searchresults'){
		fillSearchResultsCn();
        }
        else if(pageId == 'proteinview'){
		fillProteinViewCn();
        }
        else{
		fillStaticHtmlCn('/content/page.'+pageId+'.html', '#pagecn');
        }
        return;
}




///////////////////////
function fillStatsViewCn(statId){
        
	$("#statsviewcn").html(getWaitMsg());

	var versionName = 'v3.0';
        var url = cgiRoot + '/servlet.cgi';
        var reqObj = new XMLHttpRequest();
        reqObj.versionName = versionName;
	reqObj.divId = "#statsviewcn";
        reqObj.statId = statId;
	reqObj.open("POST", url, true);
        reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        reqObj.onreadystatechange = function() {
                if (reqObj.readyState == 4 && reqObj.status == 200) {
			try{
				var resObj = JSON.parse(reqObj.responseText);
				var emInfoObj = {name:"statid", class:"", value:this.statId,
					"onchange":"changeStatView();",
					type:"select", style:"width:50%;height:30px;", 
					options:resObj["titles"]
                        	};
				var cn = '<table width=100% border=0>';
				cn += '<tr><td style="font-weight:bold;">BioMuta ' + reqObj.versionName+' statistics</td></tr>';
				cn += '<tr><td style="font-style:italic;"><br>Select statistics category<br>' + 
						getElement(emInfoObj) + '</td></tr>';
				cn += '<tr><td id=statcn style="padding:20 0 0 0;"></td></tr>';
				cn += '</table>';
				$(this.divId).html(cn);
				drawTable(resObj["dataframe"], "statcn", {"pagesize":1000});
			}
                        catch(e){
				$(this.divId).html(getErrorMsg("fillStatsViewCn, please report this error!"));
                                console.log(e);	
			}
		}
        };
        var postData = 'mode=json&svc=getStats&injson=' +  JSON.stringify({"statid":parseInt(statId)});
        reqObj.send(postData);
	console.log(postData);
}


//////////////////////////////////
function changeStatView(){

	event.preventDefault();
	var statId =  $("select[name=statid]").val();
	fillStatsViewCn(statId);
	
}


///////////////////////
function fillSearchResultsCn(){

	var style = "text-align:center;color:red;"
	var msgTable = '<table width=100%><tr><td style="'+style+'">Please submit valid query!</td></tr></table>';
	var qryList = [];
	var junList = [];
	var fieldName = $.urlParam('searchfield1');
	var fieldValue = $.urlParam('searchvalue1');
	if(fieldName != ''){
		qryList.push({"fieldname":fieldName, "fieldvalue":fieldValue});
		if(fieldValue.trim().length == 0){
			$("#searchresults").html(msgTable);
			return;
		}
	}
	else{	
		var fieldNameList  = $('.fieldselectorcls');
		var fieldValueList = $('.valuetxtboxcls');
		for(var i=0; i < fieldNameList.length; i++){
			if(fieldValueList[i].value.trim().length == 0){
                        	$("#searchresults").html(msgTable);
                        	return;
                	}
			qryList.push({"fieldname":fieldNameList[i].value, "fieldvalue":fieldValueList[i].value});
		}
		var junctionList  = $('.junctionselectorcls');
		for(var i=0; i < junctionList.length; i++){
			junList.push(junctionList[i].value)
		}	
	}

        var inJson = JSON.stringify({"qryList":qryList, "junList":junList});
	inJson = inJson.replace(";", "");

	$("#searchresults").html(getWaitMsg());
        var url = cgiRoot + '/servlet.cgi';
        var reqObj = new XMLHttpRequest();
	reqObj.open("POST", url, true);
       

	reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	reqObj.onreadystatechange = function() {
                if (reqObj.readyState == 4 && reqObj.status == 200) {
			try {
				resJson = JSON.parse(reqObj.responseText);
				if(resJson["taskStatus"] == 1){
					$("#searchstatus").css("display", "");
        				$("#searchstatus").css("background", "#fff");
        				$("#searchstatus").css("color", "#777");
					if(resJson["searchresults"].length == 0){
						var style = "text-align:center;color:red;"
                				var table = '<table width=100%><tr><td style="'+style + '">No results found!</td></tr></table>';
               					$("#searchresults").html(table);
					}
					else{
        					$("#downloader").html(getDownloadLink());
						drawTable(resJson["searchresults"], "searchresults", {"pagesize":100});
					}
				}
                        	else{
                                	$("#searchresults").html(getErrorMsg(resJson["errorMsg"]));
                        	}
			}
			catch(e){
				$("#searchresults").html(getErrorMsg("fillSearchResultsCn, please report this error!"));
				console.log(e);
			}
                }
        };
        var postData = 'mode=json&svc=searchBioMuta&inJson=' + inJson;
        reqObj.send(postData);
	console.log(postData);
}

///////////////////////
function fillProteinViewCn(){

	$("#plotcn1").html(getWaitMsg());
	$("#mutationtablecn").html(getWaitMsg());
        var versionName = 'v3.0';
        var url = cgiRoot + '/servlet.cgi';
        var reqObj = new XMLHttpRequest();
        reqObj.versionName = versionName;
        reqObj.open("POST", url, true);
        reqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        reqObj.onreadystatechange = function() {
                if (reqObj.readyState == 4 && reqObj.status == 200) {
                       try {
			 	//console.log('response='+reqObj.responseText);
                       		resJson = JSON.parse(reqObj.responseText);
                        	rndrProteinViewCn();
                	}
			catch(e){
                                $("#mutationtablecn").html(getErrorMsg("fillProteinViewCn, please report this error!"));
				$("#plotcn1").html(getErrorMsg("fillProteinViewCn, please report this error!"));
                                console.log(e);
                        }
		}
        };
        var fieldName = $.urlParam('searchfield1');
        var fieldValue = $.urlParam('searchvalue1');
        if(fieldName == ''){
                fieldName = "uniprot_ac";
                var parts = location.href.split("/");
                fieldValue = parts[parts.length-1];
        }

        var inJson = JSON.stringify({"fieldname":fieldName, "fieldvalue":fieldValue});
        inJson = inJson.replace(";", "");
        var postData = 'mode=json&svc=getProteinData&inJson='+ inJson;
        reqObj.send(postData);
        console.log('request='+postData);
}




///////////////////////////////
function getDownloadLink(){

	var fileName = resJson["downloadfilename"];
        var url = htmlRoot + '/tmp/' + fileName;
        var downloadLink = '<a href="'+url+'"  download="'+fileName+'">Download table in CSV format</a>';
	return downloadLink;
}





/////////////////////////////////////
function rndrProteinViewCn(){


	var searchQuery = resJson["inJson"]["fieldvalue"];
	$('.valuetxtboxcls')[0].value = searchQuery; 
 


	var s =  'width:80px;height:25px;';
        var applybtn = '<input type=submit class=filterbtn id=apply style="'+s+'" value=" Apply ">';
	var resetbtn = '<input type=submit class=filterbtn id=reset style="'+s+'" value=" Reset ">';

        

	 
	var filterTable = '<table style="width:100%;font-size:13px;" border=0>';
	for (var filterName in resJson["pageconf"]["sitefilters"]){
		filterTable += '<tr><td style="font-weight:bold;">' + 
				resJson["pageconf"]["sitefilters"][filterName]["title"]+'</td></tr>';
		filterTable += '<tr><td style="padding:0 0 0 10;" nowrap>';
		var i = 0;
		for (var key in resJson["pageconf"]["sitefilters"][filterName]["filterhash"]){
			var val = resJson["pageconf"]["sitefilters"][filterName]["filterhash"][key];
			var chkbox = '<input type=checkbox class="'+filterName+'" value="'+val+'" >';
			filterTable += ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + chkbox + key ;
			filterTable += ((i > 0 && i%4 == 0) ? '<br>' :'');
			i += 1;
		}
		filterTable += '</td></tr><tr><td>&nbsp;</td></tr>';
	}
	filterTable += '<tr><td align=right>'+applybtn + '&nbsp;&nbsp;&nbsp;&nbsp;' + resetbtn +'</td></tr>';
	filterTable += '</table>';
	$("#filtercn").html(filterTable);



	$("#plotcn1").html("xxxx");
	$("#plottitlecn1").html(resJson["pageconf"]["plottitle_1"]);
	$("#plottitlecn2").html(resJson["pageconf"]["plottitle_2"]);
	$(".titlecn").css("background", "#f1f1f1");
	$("#plottitleiconcn1").html(collapseicon);
        $("#plottitleiconcn2").html(collapseicon);
	$("#plottitleiconcn1").css("background", "#f1f1f1");
	$("#plottitleiconcn2").css("background", "#f1f1f1");


	$("#filtertitlecn").html(resJson["pageconf"]["filtertitle"]);
	$("#filtertitlecn").css("background", "#f1f1f1");
	$("#filtericoncn").html(collapseicon);
        $("#filtericoncn").css("background", "#f1f1f1");



	$("#plotdesccn1").html(resJson["pageconf"]["plotdesc_1"]);
	$("#plotdesccn2").html(resJson["pageconf"]["plotdesc_2"]);

	$("#tabletitlecn").html(resJson["pageconf"]["tabletitle"]);
	$("#tabledesccn").html(resJson["pageconf"]["tabledesc"]);
	$("#downloadlinkcn").html(getDownloadLink());
	
	drawTable(resJson["mutationtable"], "mutationtablecn", {"pagesize":1000});
	$("#mutationtablefootnotecn").html(resJson["pageconf"]["tablefootnote"]);

	var plotWidth = 100;
	if(resJson["plotdata1"] != null) {
                var divName = 'plotcn1';
                var title = '';
                var xTitle = 'Cancer type';
                var yTitle = 'Frequency of variations';
                var tickFreq = 'showTextEvery:1';
                vjHighChartsSingleSeries(resJson["plotdata1"], title, divName, xTitle, yTitle, tickFreq, plotWidth);
        }

	plotWidth = $("#plotcn1").width();
	if(resJson["plotdata2"] != null) {
                var divName = 'plotcn2';
                var title = '';
                var xTitle = 'Position in amino acid sequence';
                var yTitle = 'Frequency of variations';
                var tickFreq = '';
                vjHighChartsSingleSeries(resJson["plotdata2"], title, divName, xTitle, yTitle, tickFreq, plotWidth);
        }
	return;

}





//////////////////////Event handlers
$(document).on('click', '.filterbtn', function (event) {
        event.preventDefault();
        $("#mutationtablecn").html(getWaitMsg());

        if (this.id == "apply"){
                var dataFrame = [resJson["mutationtable"][0], resJson["mutationtable"][1]];
                var colindexHash = {"uniprot":7, "predictions":8};
                for (var filterName in resJson["pageconf"]["sitefilters"]){
                        var chkList = [];
                        var colIndex = colindexHash[filterName];
                        var className = "." + filterName + ":checked";
                        $(className).each(function() {
                                chkList.push(this.value);
                        });
                        for (var i = 2; i < resJson["mutationtable"].length; i++){
                                for (var j in chkList){
                                        if (resJson["mutationtable"][i][colIndex].indexOf(chkList[j]) != -1){
                                                dataFrame.push(resJson["mutationtable"][i]);
                                                break;
                                        }
                                }
                        }
                }
                drawTable(dataFrame, "mutationtablecn", {"pagesize":1000});
        }
        else if (this.id == "reset"){
                for (var filterName in resJson["pageconf"]["sitefilters"]){
                        var className = "." + filterName + ":checked";
                        $(className).prop('checked', false);
                }
                drawTable(resJson["mutationtable"], "mutationtablecn", {"pagesize":1000});
        }
});





////////////////////////////////////   
$(document).on('click', '.searchbtn', function (event) {
	window.history.pushState("", "BioMuta Search", baseUrl+"/searchresults");
	pageId = "searchresults";
	setPageFrame();
        fillFrameCn();
});


///////////////////////////////////////////////////
$(document).on('click', '.titlecn', function (event) {
        event.preventDefault();
	if (this.id == "plottitlecn1" || this.id == "plottitleiconcn1"){
		$("#plotcn1").toggle();
		$("#plotdesccn1").toggle();
		$("#plotcn2").css("display", "none");
		$("#plotdesccn2").css("display", "none");
		$("#filtercn").css("display", "none");
		$("#plottitleiconcn1").children("#iconid").toggleClass("closedcircle openedcircle");
	}
	else if (this.id == "plottitlecn2" || this.id == "plottitleiconcn2"){
		$("#plotcn2").toggle();
		$("#plotdesccn2").toggle();
		$("#plotcn1").css("display", "none");
		$("#plotdesccn1").css("display", "none");
               	$("#filtercn").css("display", "none");
		$("#plottitleiconcn2").children("#iconid").toggleClass("closedcircle openedcircle");
	}
	else if (this.id == "filtertitlecn" || this.id == "filtericoncn"){
                $("#filtercn").toggle();
                $("#plotcn1").css("display", "none");
		$("#plotdesccn1").css("display", "none");
                $("#plotcn2").css("display", "none");
                $("#plotdesccn2").css("display", "none");
		$("#filtericoncn").children("#iconid").toggleClass("closedcircle openedcircle");
        }


});

