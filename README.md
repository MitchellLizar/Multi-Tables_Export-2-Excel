Multi-Tables_Export-2-Excel
===========================

Exporting multiple tables from HTML into Excel using Javascript or JQuery  -- from BOTH I.E. and Chrome/FireFox.

I'm looking to do several things with this project:

1) Export MULTIPLE tables to a single Excel file (multiple-tabs are acceptable)
        Currently the JQuery that I am using exports only 1 pre-named field... I need to be able to capture MULTIPLE
        fields whose names and / or IDs will vary.
        
2) Include the data from the comments fields - which are toggled hidden or shown depending on the NOK radio value
   of the related question.
        Currently the export gives me a blank field with no data even when it is made visible and data is input.
        
3) Format the checkboxes so that they don't sit on top of the text of the same line.
        Currently the exported boxes sit over the first few characters of the line they're associated with.
        
4) Find a good detection method for browsers which will support appropriate methodologies for doing the preceding.
        Current code doesn't find Internet Explorer ... I believe this is because it's looking for functionality that
        is now available but not related to the requirements for the exporting code.
