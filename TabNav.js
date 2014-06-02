function navigate(evt)
{
    var key = evt.keyCode | evt.which;

    /* handle only Enter (13), arrow down key(40) and arrow up key (38) */
    if(key != 13 && key != 40 && key != 38) return;

    /* IE 8 does not have target so will resolve with srcElement */
    /* thought accessing target is faster than another jquery selector $(':focus'); */
    var cur_elem = $(evt.target || evt.srcElement);

    // implementing textarea logic
    if(cur_elem.is("textarea")) return;

    ////discarding slider navigation using arrow key.
    //if((cur_elem.hasClass('ui-slider-handle')) && (key == 40 || key == 38)) {return;}

    /*{

     if(key == 13) return;

     var firstNewline = cur_elem.val().indexOf('\n');
     var lastNewline = cur_elem.val().lastIndexOf('\n');
     var cursorPos = cur_elem.prop("selectionStart");

     if(firstNewline > -1)
     {
     // if we are not in first or last line, don't navigate.
     if (cursorPos > firstNewline && cursorPos <= lastNewline) return;

     // if we are in the first line, but up key was not pressed, don't navigate.
     if(cursorPos <= firstNewline && key != 38) return;

     // if we are in last line, but down key was not pressed, don't navigate.
     if(cursorPos > lastNewline && key != 40) return;
     }

     }*/

    /* getting current field location.. */
    /* here 10 means we want to use decimal number system for parsing */
    var cur_sheet = parseInt(cur_elem.attr('data-sheet'), 10);
    var cur_row = parseInt(cur_elem.attr('data-row'), 10);
    var cur_col = parseInt(cur_elem.attr('data-col'), 10);

    var foundFocus = false;

    /* caching the sheet div selector */
    var sheetSelector = $('#sheet-' + cur_sheet + '');
    var inputSelector = 'input:not(":hidden,:button,[readonly=readonly],:disabled"),select,a.ui-slider-handle,textarea';
    var next_row = cur_row + 1;
    var prev_row = cur_row - 1;

    /* assuming next row is the last row */
    var max_row = next_row;
    var min_row = prev_row;

    while((key == 40 && next_row <= max_row) || (key == 38 && prev_row >= min_row))
    {
        /* looking for next higher data-row with same data-sheet and data-col.. */
        /* if found, it results in faster navigation */
        var next_focus_elem = sheetSelector.find(inputSelector).filter('[data-sheet='+ cur_sheet +'][data-row='+ (key == 38 ? prev_row  : next_row) + '][data-col='+ cur_col + ']');
        if(next_focus_elem.length > 0)
        {
            next_focus_elem[0].focus();
            foundFocus = true;
            break;
        }
        else
        {
            var arrRows;

            /* if not saved eariler into jquery data store of sheet div  */
            if(sheetSelector.data('col'+ cur_col) == undefined)
            {
                /* create array of data-row for given data-sheet and data-col */
                arrRows = sheetSelector.find(inputSelector).filter('[data-sheet=' + cur_sheet + '][data-col='+ cur_col + ']').map(
                    function(){
                        return parseInt($(this).attr('data-row'), 10);
                    }).toArray();

                /* store into data-colx data store of sheet div where x is the cur_col */
                sheetSelector.data('col' + cur_col, arrRows);
            }
            else
            {
                /* fetch from jquery data store of sheet div */
                arrRows = sheetSelector.data('col' + cur_col);
            }

            /* assuming array is sorted.. */
            max_row = arrRows[arrRows.length - 1];
            min_row = arrRows[0];
            /* IE 8 does not have indexOf so using jquery method inArray as alternative */
            var rowIndex = ('indexOf' in Array.prototype) ? arrRows.indexOf(cur_row): $.inArray(cur_row, arrRows);

            if(key == 40 && cur_row < max_row)
            {
                next_row =  arrRows[rowIndex + 1];
            }
            else if(key == 38 && cur_row > min_row)
            {
                prev_row =  arrRows[rowIndex - 1];
            }
            else
            {
                break;
            }
        }
    }
    if(!foundFocus) /* navigate to next tab index if not found. */
    {
        var next_idx;
        if(key == 38) next_idx = parseInt(cur_elem.attr('tabindex'), 10) - 1;
        else next_idx = parseInt(cur_elem.attr('tabindex'), 10) + 1;

        /* look for next navigable field with higher tab index..*/
        var next_input = sheetSelector.find(inputSelector).filter('[data-sheet][data-row][data-col][tabindex=' + next_idx + ']');
        if(next_input.length > 0)
        {
            next_input.focus();
        }
        else
        {
            /* move to first tab index as last resort. */
            sheetSelector.find(inputSelector).filter('[data-sheet][data-row][data-col][tabindex]:first').focus();
        }
    }
    /* IE lack preventDefault so */
    evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
}

// Global Variables
var DataExist = false;
var EditablefieldExist = false;

/***process all fields in a Tab and Returns a Boolean Variable showing Tab fields contain data(true) or Not (false).*****/
function isTabContainData(TabObj)
{
    DataExist = false;
    var inputElements=TabObj.getElementsByTagName("input");
    var TextAreaElements = TabObj.getElementsByTagName("textarea");
    var SelectElements = TabObj.getElementsByTagName("select");
    for (var x = 0; x < inputElements.length; x++)
    {
        if(!DataExist)
        {
            if(inputElements[x].type != "hidden")
            {
                //alert(inputElements[x].type);
                if(inputElements[x].className=="longtextfield readonly" || inputElements[x].className=="textfield" || inputElements[x].className=="textfield Step2Calendar" || inputElements[x].className=="textfield readonly" || inputElements[x].className=="checkboxfield" || inputElements[x].className=="longtextfield" || inputElements[x].className=="textfield1" || inputElements[x].className=="ttextfield" || inputElements[x].className=="ttextfield readonly" || inputElements[x].className=="textfieldnowidth readonly" || inputElements[x].className=="checkboxfield required")
                    if(inputElements[x].value != "")
                    {
                        if(inputElements[x].className!="checkboxfield")
                        {
                            if(inputElements[x].className!="checkboxfield required")
                            {
                                DataExist = true;
                            }
                            else
                            {
                                if(inputElements[x].checked)
                                    DataExist = true;
                            }
                        }
                        else
                        {
                            if(inputElements[x].checked)
                                DataExist = true;
                        }
                    } //End if(inputElements[x].value != "")
            }  //End if(inputElements[x].type != "hidden")
        }  //End If (!DataExist)
    } //End For Loop
    //Now Check Values in TextArea Fields
    if(!DataExist)
    {
        for (var x = 0; x < TextAreaElements.length; x++)
        {
            if(TextAreaElements[x].className=="textarea" || TextAreaElements[x].className=="ttextarea" || TextAreaElements[x].className=="ltextarea" || TextAreaElements[x].className=="shorttextarea" || TextAreaElements[x].className=="shorttextarea readonly" || TextAreaElements[x].className=="longtextarea readonly" || TextAreaElements[x].className=="longtextarea" || TextAreaElements[x].className=="signatureField")
                if(TextAreaElements[x].value != "")
                {
                    DataExist = true;
                } //End if(TextAreaElements[x].value != "")
        }  //End For Loop
    } //End If (!DataExist)
    //Now Check Values in Single-Select/Mult-Select Fields
    if(!DataExist)
    {
        for (var x = 0; x < SelectElements.length; x++)
        {
            if(SelectElements[x].style.display != 'none')
            {
                SelectElements[x].className = Trim(SelectElements[x].className);
                if(SelectElements[x].className=="dropdownfield" || SelectElements[x].className=="dropdownfield readonly" || SelectElements[x].className=="listfield" || SelectElements[x].className=="listfield readonly" || SelectElements[x].className=="tdropdownfield1" || SelectElements[x].className=="tdropdownfield")
                    if(SelectElements[x].value != "")
                    {
                        if(SelectElements[x].value != 0)
                        {
                            DataExist = true;
                        }
                    }
                    else if(SelectElements[x].length != 0)
                    {
                        DataExist = true;
                    }//End if(SelectElements[x].value != "")
            }//End if(SelectElements[x].style.display != 'none')
        }//End For Loop
    } //End If (!DataExist)
    return DataExist;
}

/****processes all fields in a Tab and Returns a Boolean Variable showing Tab fields are Editable (true) or Not (false).*****/
function EditableFields(TabObj)
{
    EditablefieldExist = false;
    var inputElements=TabObj.getElementsByTagName("input");
    var TextAreaElements = TabObj.getElementsByTagName("textarea");
    var SelectElements = TabObj.getElementsByTagName("select");

    //----------- LOOP FOR INPUT ELEMENTS ------------
    for (var x = 0; x < inputElements.length; x++)
    {
        if(!EditablefieldExist)
        {
            if(inputElements[x].type != "hidden")
            {
                if(inputElements[x].className=="longtextfield readonly" || inputElements[x].className=="textfield" || inputElements[x].className=="textfield readonly" || inputElements[x].className=="checkboxfield" || inputElements[x].className=="longtextfield" || inputElements[x].className=="textfield1" || inputElements[x].className=="ttextfield" || inputElements[x].className=="ttextfield readonly" || inputElements[x].className=="textfieldnowidth" || inputElements[x].className=="textfieldnowidth readonly" || inputElements[x].className=="checkboxfield required")
                {
                    if(!inputElements[x].disabled)
                    {
                        EditablefieldExist = true;
                    }
                }
            }  //End if(inputElements[x].type != "hidden")
        } // End if(!EditablefieldExist)
    } //End For Loop
    //----------- LOOP FOR TEXTAREA ELEMENTS ------------
    if(!EditablefieldExist)
    {
        //Now Check Disabled TextArea Fields
        for (var x = 0; x < TextAreaElements.length; x++)
        {
            if(TextAreaElements[x].className=="textarea" || TextAreaElements[x].className=="ttextarea" || TextAreaElements[x].className=="ltextarea" || TextAreaElements[x].className=="shorttextarea" || TextAreaElements[x].className=="shorttextarea readonly" || TextAreaElements[x].className=="longtextarea readonly" || TextAreaElements[x].className=="longtextarea")
            {
                if(!TextAreaElements[x].disabled)
                {
                    EditablefieldExist = true;
                } //End if(TextAreaElements[x].disabled)
            }
        }	//End For Loop
    } //End if(!EditablefieldExist)
    //----------- LOOP FOR SELECT ELEMENTS ------------
    if(!EditablefieldExist)
    {
        //Now Check Disabled Single-Select/Mult-Select Fields
        for (var x = 0; x < SelectElements.length; x++)
        {
            if(SelectElements[x].className=="dropdownfield" || SelectElements[x].className=="dropdownfield readonly" || SelectElements[x].className=="listfield" || SelectElements[x].className=="listfield readonly" || SelectElements[x].className=="tdropdownfield1" || SelectElements[x].className=="tdropdownfield")
            {
                if(SelectElements[x].name.indexOf("mastercontrol.attachments") == 0 || SelectElements[x].name.indexOf("mastercontrol.links") == 0)
                {//do nothing
                }
                else if(!SelectElements[x].disabled)
                {
                    EditablefieldExist = true;
                } //End if(!SelectElements[x].disabled)
            }
        }  //End For Loop
    } //End if(!EditablefieldExist)
    return EditablefieldExist;
}
// ========= END FUNCTION EditableFields(TabObj) ===================
(function () {
    window.scrollTo(0, 0);
//    SetForm();
}())
function Trim(value)
{
    return value.replace(/^\s+|\s+$/g, "");
}

/*==================================================
 START TABING INTERFACE JavaScript
 *===================================================*/
/*==================================================
 $Id: tabber.js,v 1.9 2006/04/27 20:51:51 pat Exp $
 tabber.js by Patrick Fitzgerald pat@barelyfitz.com
 Documentation can be found at the following URL:
 http://www.barelyfitz.com/projects/tabber/
 License (http://www.opensource.org/licenses/mit-license.php)
 Copyright (c) 2006 Patrick Fitzgerald
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation files
 (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge,
 publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 ==================================================*/

function tabberObj(argsObj)
{
    /* name of an argument to override */
    var arg;
    /* Element for the main tabber div. If you supply this in argsObj, then the init() method will be called. */
    this.div = null;

    /* Class of the main tabber div */
    this.classMain = "tabber";
    /* Rename classMain to classMainLive after tabifying(so a different style can be applied) */
    this.classMainLive = "tabberlive";

    /* Class of each DIV that contains a tab */
    this.classTab = "tabbertab";

    /* Class to indicate which tab should be active on startup */
    this.classTabDefault = "tabbertabdefault";

    /* Class for the navigation UL */
    this.classNav = "tabbernav";

    /* When a tab is to be hidden, instead of setting display='none', we set the class of the div to classTabHide. In your screen
     stylesheet you should set classTabHide to display:none.  In your print stylesheet you should set display:block to ensure that all
     the information is printed. */
    this.classTabHide = "tabbertabhide";

    /* Class to set the navigation LI when the tab is active, so you can use a different style on the active tab. */
    this.classNavActive = "tabberactive";

    /* Elements that might contain the title for the tab, only used if a title is not specified in the TITLE attribute of DIV classTab.*/
    this.titleElements = ['h2','h3','h4','h5','h6'];

    /* Strip out the HTML from the innerHTML of the title elements.*/
    this.titleElementsStripHTML = true;

    /* If the user specified the tab names using a TITLE attribute on the DIV, then the browser will display a tooltip whenever the
     mouse is over the DIV. To prevent this tooltip, we can remove the TITLE attribute after getting the tab name.*/
    this.removeTitle = true;

    /* If you want to add an id to each link set this to true */
    this.addLinkId = true;

    /* If addIds==true, then you can set a format for the ids. <tabberid> will be replaced with the id of the main tabber div.
     <tabnumberzero> will be replaced with the tab number (tab numbers starting at zero) <tabnumberone> will be replaced
     with the tab number (tab numbers starting at one) <tabtitle> will be replaced by the tab title (with all non-alphanumeric
     characters removed) */
    this.linkIdFormat = '<tabberid>nav<tabnumberone>';

    /* You can override the defaults listed above by passing in an object: var mytab = new tabber({property:value,property:value});*/
    for (arg in argsObj) { this[arg] = argsObj[arg]; }

    /* Create regular expressions for the class names; Note: if you change the class names after a new object is created you must
     also change these regular expressions. */
    this.REclassMain = new RegExp('\\b' + this.classMain + '\\b', 'gi');
    this.REclassMainLive = new RegExp('\\b' + this.classMainLive + '\\b', 'gi');
    this.REclassTab = new RegExp('\\b' + this.classTab + '\\b', 'gi');
    this.REclassTabDefault = new RegExp('\\b' + this.classTabDefault + '\\b', 'gi');
    this.REclassTabHide = new RegExp('\\b' + this.classTabHide + '\\b', 'gi');

    /* Array of objects holding info about each tab */
    this.tabs = new Array();

    /* If the main tabber div was specified, call init() now */
    if (this.div) {

        this.init(this.div);

        /* We don't need the main div anymore, and to prevent a memory leak in IE, we must remove the circular reference between the div
         and the tabber object. */
        this.div = null;
    }
}

/*----- Methods for tabberObj -------*/
tabberObj.prototype.init = function(e)
{
    /* Set up the tabber interface. e = element (the main containing div)Example: init(document.getElementById('mytabberdiv')) */
    var
        childNodes, /* child nodes of the tabber div */
        i, i2, /* loop indices */
        t, /* object to store info about a single tab */
        defaultTab=0, /* which tab to select by default */
        DOM_ul, /* tabbernav list */
        DOM_li, /* tabbernav list item */
        DOM_a, /* tabbernav link */
        aId, /* A unique id for DOM_a */
        headingElement; /* searching for text to use in the tab */

    /* Verify that the browser supports DOM scripting */
    if (!document.getElementsByTagName) { return false; }

    /* If the main DIV has an ID then save it. */
    if (e.id) {
        this.id = e.id;
    }

    /* Clear the tabs array (but it should normally be empty) */
    this.tabs.length = 0;

    /* Loop through an array of all the child nodes within our tabber element. */
    childNodes = e.childNodes;
    for(i=0; i < childNodes.length; i++) {

        /* Find the nodes where class="tabbertab" */
        if(childNodes[i].className &&
            childNodes[i].className.match(this.REclassTab)) {

            /* Create a new object to save info about this tab */
            t = new Object();

            /* Save a pointer to the div for this tab */
            t.div = childNodes[i];

            /* Add the new object to the array of tabs */
            this.tabs[this.tabs.length] = t;

            /* If the class name contains classTabDefault, then select this tab by default. */
            if (childNodes[i].className.match(this.REclassTabDefault)) {
                defaultTab = this.tabs.length-1;
            }
        }
    }

    /* Create a new UL list to hold the tab headings */
    DOM_ul = document.createElement("ul");
    DOM_ul.className = this.classNav;

    /* Loop through each tab we found */
    for (i=0; i < this.tabs.length; i++) {

        t = this.tabs[i];

        /* Get the label to use for this tab: From the title attribute on the DIV, Or from one of the this.titleElements[] elements,
         Or use an automatically generated number. */
        t.headingText = t.div.title;

        /* Remove the title attribute to prevent a tooltip from appearing */
        if (this.removeTitle) { t.div.title = ''; }

        if (!t.headingText) {

            /* Title was not defined in the title of the DIV, So try to get the title from an element within the DIV.
             Go through the list of elements in this.titleElements (typically heading elements ['h2','h3','h4']) */
            for (i2=0; i2<this.titleElements.length; i2++) {
                headingElement = t.div.getElementsByTagName(this.titleElements[i2])[0];
                if (headingElement) {
                    t.headingText = headingElement.innerHTML;
                    if (this.titleElementsStripHTML) {
                        t.headingText.replace(/<br>/gi," ");
                        t.headingText = t.headingText.replace(/<[^>]+>/g,"");
                    }
                    break;
                }
            }
        }

        if (!t.headingText) {
            /* Title was not found (or is blank) so automatically generate a number for the tab. */
            t.headingText = i + 1;
        }

        /* Create a list element for the tab */
        DOM_li = document.createElement("li");

        /* Save a reference to this list item so we can later change it to the "active" class */
        t.li = DOM_li;

        /* Create a link to activate the tab */
        DOM_a = document.createElement("a");
        DOM_a.appendChild(document.createTextNode(t.headingText));
        DOM_a.href = "javascript:void(null);";
        DOM_a.title = t.headingText;
        DOM_a.onclick = this.navClick;

        /* Add some properties to the link so we can identify which tab was clicked. Later the navClick method will need this.*/
        DOM_a.tabber = this;
        DOM_a.tabberIndex = i;

        /* Do we need to add an id to DOM_a? */
        if (this.addLinkId && this.linkIdFormat) {

            /* Determine the id name */
            aId = this.linkIdFormat;
            aId = aId.replace(/<tabberid>/gi, this.id);
            aId = aId.replace(/<tabnumberzero>/gi, i);
            aId = aId.replace(/<tabnumberone>/gi, i+1);
            aId = aId.replace(/<tabtitle>/gi, t.headingText.replace(/[^a-zA-Z0-9\-]/gi, ''));

            DOM_a.id = aId;
        }

        /* Add the link to the list element */
        DOM_li.appendChild(DOM_a);

        /* Add the list element to the list */
        DOM_ul.appendChild(DOM_li);
    }

    /* Add the UL list to the beginning of the tabber div */
    e.insertBefore(DOM_ul, e.firstChild);

    /* Make the tabber div "live" so different CSS can be applied */
    e.className = e.className.replace(this.REclassMain, this.classMainLive);

    /* Activate the default tab, and do not call the onclick handler */
    this.tabShow(defaultTab);

    /* If the user specified an onLoad function, call it now. */
    if (typeof this.onLoad == 'function') {
        this.onLoad({tabber:this});
    }
    return this;
};

tabberObj.prototype.navClick = function(event)
{
    /* This method should only be called by the onClick event of an <A> element, in which case we will determine which tab
     was clicked by examining a property that we previously attached to the <A> element.
     Since this was triggered from an onClick event, the variable "this" refers to the <A> element that triggered the onClick
     event (and not to the tabberObj).
     When tabberObj was initialized, we added some extra properties to the <A> element, for the purpose of retrieving them now. Get
     the tabberObj object, plus the tab number that was clicked. */
    var
        rVal, /* Return value from the user onclick function */
        a, /* element that triggered the onclick event */
        self, /* the tabber object */
        tabberIndex, /* index of the tab that triggered the event */
        onClickArgs; /* args to send the onclick function */

    a = this;
    if (!a.tabber) { return false; }
    self = a.tabber;
    tabberIndex = a.tabberIndex;

    /* Remove focus from the link because it looks ugly. */
    a.blur();

    /* If the user specified an onClick function, call it now. If the function returns false then do not continue.*/
    if (typeof self.onClick == 'function') {

        onClickArgs = {'tabber':self, 'index':tabberIndex, 'event':event};

        /* IE uses a different way to access the event object */
        if (!event) { onClickArgs.event = window.event; }

        rVal = self.onClick(onClickArgs);
        if (rVal === false) { return false; }
    }
    self.tabShow(tabberIndex);
    return false;
};

tabberObj.prototype.tabHideAll = function()
{
    var i; /* counter */

    /* Hide all tabs and make all navigation links inactive */
    for (i = 0; i < this.tabs.length; i++) {
        this.tabHide(i);
    }
};

tabberObj.prototype.tabHide = function(tabberIndex)
{
    var div;

    if (!this.tabs[tabberIndex]) { return false; }

    /* Hide a single tab and make its navigation link inactive */
    div = this.tabs[tabberIndex].div;

    /* Hide the tab contents by adding classTabHide to the div */
    if (!div.className.match(this.REclassTabHide)) {
        div.className += ' ' + this.classTabHide;
    }
    this.navClearActive(tabberIndex);

    return this;
};

tabberObj.prototype.tabShow = function(tabberIndex)
{
    /* Show the tabberIndex tab and hide all the other tabs */
    var div;
    if (!this.tabs[tabberIndex]) { return false; }

    /* Hide all the tabs first */
    this.tabHideAll();

    /* Get the div that holds this tab */
    div = this.tabs[tabberIndex].div;

    /* Remove classTabHide from the div */
    div.className = div.className.replace(this.REclassTabHide, '');

    /* Mark this tab navigation link as "active" */
    this.navSetActive(tabberIndex);

    /* If the user specified an onTabDisplay function, call it now. */
    if (typeof this.onTabDisplay == 'function') {
        this.onTabDisplay({'tabber':this, 'index':tabberIndex});
    }
    return this;
};

tabberObj.prototype.navSetActive = function(tabberIndex)
{
    /* Set classNavActive for the navigation list item */
    this.tabs[tabberIndex].li.className = this.classNavActive;
    return this;
};

tabberObj.prototype.navClearActive = function(tabberIndex)
{
    /* Note: this method does *not* enforce the rule that one nav should always be active. */
    /* Remove classNavActive from the navigation list item */
    this.tabs[tabberIndex].li.className = '';
    return this;
};

function tabberAutomatic(tabberArgs)
{
    /* This function finds all DIV elements in the document where class=tabber.classMain, then converts them to use the tabber
     interface.    tabberArgs = an object to send to "new tabber()" */
    var
        tempObj, /* Temporary tabber object */
        divs, /* Array of all divs on the page */
        i; /* Loop index */
    if (!tabberArgs) { tabberArgs = {}; }

    /* Create a tabber object so we can get the value of classMain */
    tempObj = new tabberObj(tabberArgs);

    /* Find all DIV elements in the document that have class=tabber */
    /* First get an array of all DIV elements and loop through them */
    divs = document.getElementsByTagName("div");
    for (i=0; i < divs.length; i++)
    {  /* Is this DIV the correct class? */
        if (divs[i].className &&
            divs[i].className.match(tempObj.REclassMain))
        {  /* Now tabify the DIV */
            tabberArgs.div = divs[i];
            divs[i].tabber = new tabberObj(tabberArgs);
        }
    }
    return this;
}

function tabberAutomaticOnLoad(tabberArgs)
{
    /* This function adds tabberAutomatic to the window.onload event, so it will run after the document has finished loading. */
    var oldOnLoad;

    if (!tabberArgs) { tabberArgs = {}; }

    oldOnLoad = window.onload;
    if (typeof window.onload != 'function')
    {
        window.onload = function() {
            tabberAutomatic(tabberArgs);
        };
    }
    else
    {
        window.onload = function()
        {
            oldOnLoad();
            tabberAutomatic(tabberArgs);
        };
    }
}

/* Run tabberAutomaticOnload() unless the "manualStartup" option was specified */
if (typeof tabberOptions == 'undefined') {
    tabberAutomaticOnLoad();
}
else
{
    if (!tabberOptions['manualStartup']) {
        tabberAutomaticOnLoad(tabberOptions);
    }
}
