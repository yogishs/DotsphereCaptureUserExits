importPackage(com.awpl.dsc.domain);
importPackage(com.awpl.dsc.util);

log.info("Batch Type Name: " + dscDocument.getBatch().getBatchType().getBatchTypeName());
if (dscDocument.getBatch().getBatchType().getBatchTypeName() == "Customers") 
{
log.info("ECM DocumentID before user exit " + docstoreItemIdentifier);
var documentrefno = "";
if (indexValues != null) 
{
	for ( var i = 0; i < indexValues.length; i++) 
	{
		indexname = indexValues[i].getKeyFieldName();
		if(indexname=="DOC_REF_NUM")	{
			documentrefno = indexValues[i].getStringValue();
		}
	}
}
log.info("Document Ref Number to check = " + documentrefno);
/*
 Invoke itaps service, pass the document reference no as a parameter. the itaps service
 will check if the document is ready for release, if so, it will update the db status of the document
 from 2 to 3 or 7 to 8, depending on rescan. If its a rescan request then return the document id as a response.
 this user exit needs to set the 'docstoreItemIdentifier' as the value if the document is a rescan request.
*/
var client		= new XMLHttpRequest();
var itaps_url	= "http://cibfilenet.abcbank.com:9080/integration.web/CaptureOperations.htm?updaterelease=true&documentrefno="+documentrefno;
client.open('GET', itaps_url, false, '', '');
client.send(null);
if (client.status == 200)
{
	
		
	log.info("The request succeeded!\n\nThe response representation was:\n\n"+ client.responseText + "\n");
	var responseObject = eval('(' + client.responseText + ')');
	log.info(responseObject.title);
	log.info(responseObject.documentID);
	if (responseObject.singer != "") 
	{
	    docstoreItemIdentifier = "ITAPS::"+responseObject.documentID;
	}
	else
	{
	   docstoreItemIdentifier = responseObject.documentID;
	}
	
}
else 
{
	log.info("The request did not succeed!\n\nThe response status was: "+ client.status + " " + client.statusText + ".");
}
}