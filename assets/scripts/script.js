var BODName = ""
var origianlMapFileString = ""
var uploadedFileName = ""
var functionAndLoopSequence = []
var loopMap = {}
var functionMap = {}
var parametersMap = {}
var ImplementationMap = {}
var constantMap = {}
var variablesMap = {}
var schemaInMap = {}
var schemaOutMap = {}
var linkMap = {}
var headerColor = document.getElementById("colorpicker").value
var originalEditedCode = ""
removeCommentedCode = false

function parseMapFile(mapFileString) {
    return new Promise((resolve, reject) => {
        var xmlParser = new DOMParser()
        xmlDocument = xmlParser.parseFromString(mapFileString, "text/xml");

        BODName = xmlDocument.getElementsByTagName("MappingMeta")[0].getElementsByTagName("Name")[0].innerHTML

        var sequenceList = xmlDocument.getElementsByTagName("SequenceList")[0].children
        for (var i = 0; i < sequenceList.length; i++) {
            // if(!functionAndLoopSequence.includes(sequenceList[i].children[1].attributes[0].nodeValue))
            functionAndLoopSequence.push(sequenceList[i].children[1].attributes[0].nodeValue + "," + sequenceList[i].children[2].innerHTML)
        }


        var loopList = xmlDocument.getElementsByTagName("Loops")[0].children
        for (var i = 0; i < loopList.length; i++) {
            var loopID = loopList[i].children[3].attributes[0].nodeValue
            var loopName = loopList[i].children[0].innerHTML
            var loopConditon = loopList[i].children[1].innerHTML
            loopMap[loopID] = [loopName, loopConditon]
        }

        var funcitonList = xmlDocument.getElementsByTagName("Functions")[0].children
        for (var i = 0; i < funcitonList.length; i++) {
            var functionType = funcitonList[i].children[3].innerHTML
            var functionID = funcitonList[i].children[5].attributes[0].nodeValue
            var functionName = funcitonList[i].children[2].innerHTML
            var functionPath = funcitonList[i].children[1].innerHTML
            functionMap[functionID] = [functionName, functionType, functionPath]
        }

        var parametersList = xmlDocument.getElementsByTagName("Parameters")[0].children
        for (var i = 0; i < parametersList.length; i++) {
            var parameterName = parametersList[i].children[1].innerHTML
            var parameterPosition = parametersList[i].children[0].innerHTML
            var parameterType = parametersList[i].children[2].innerHTML
            var parameterDataType = parametersList[i].children[4].innerHTML
            var parameterMandatory = parametersList[i].children[5].innerHTML
            var parameterFunction = parametersList[i].children[6].attributes[0].nodeValue
            var parameterID = parametersList[i].children[7].attributes[0].nodeValue
            // console.log(parameterName, parameterPosition, parameterType, parameterDataType, parameterMandatory, parameterFunction, parameterID)
            parametersMap[parameterID] = [parameterName, parameterPosition, parameterType, parameterDataType, parameterMandatory, parameterFunction]
        }

        var implementationList = xmlDocument.getElementsByTagName("Implementations")[0].children
        for (var i = 0; i < implementationList.length; i++) {
            var functionID = implementationList[i].children[0].attributes[0].nodeValue
            var functionCode = implementationList[i].innerHTML.trim()
            functionCode = functionCode.substring(functionCode.indexOf("<![CDATA["))
            functionCode = functionCode.substring(9, functionCode.length - 3)
            ImplementationMap[functionID] = functionCode
        }

        var constantsList = xmlDocument.getElementsByTagName("Constants")[0].children
        for (var i = 0; i < constantsList.length; i++) {
            var constantName = constantsList[i].children[0].innerHTML
            var constantValue = constantsList[i].children[1].innerHTML
            var constantType = constantsList[i].children[2].innerHTML
            var constantID = constantsList[i].children[4].attributes[0].nodeValue

            constantMap[constantID] = [constantName, constantType, constantValue]
        }

        var variablesList = xmlDocument.getElementsByTagName("Variables")[0].children
        for (var i = 0; i < variablesList.length; i++) {
            var variableName = variablesList[i].children[0].innerHTML
            var variableValue = variablesList[i].children[1].innerHTML
            var variableType = variablesList[i].children[2].innerHTML
            var variableID = variablesList[i].children[4].attributes[0].nodeValue

            variablesMap[variableID] = [variableName, variableType, variableValue]
        }


        var schemaInList = xmlDocument.getElementsByTagName("SchemaIn")[1].children
        for (var i = 1; i < schemaInList.length; i++) {
            // var variableName = schemaInList[i].children[0].innerHTML
            // var variableValue = schemaInList[i].children[1].innerHTML
            // var variableType = schemaInList[i].children[2].innerHTML
            // var variableID = variablesList[i].children[4].attributes[0].nodeValue

            var schemaInID = schemaInList[i].children[1].attributes[0].nodeValue
            var schemaInType = schemaInList[i].children[2].innerHTML
            var schemaInPath = schemaInList[i].children[0].innerHTML


            schemaInMap[schemaInID] = [schemaInType, schemaInPath]
        }

        var schemaOutList = []
        if (xmlDocument.getElementsByTagName("SchemaOut").length > 1) {
            // console.log(xmlDocument.getElementsByTagName("SchemaOut"))
            schemaOutList = xmlDocument.getElementsByTagName("SchemaOut")[1].children
            for (var i = 1; i < schemaOutList.length; i++) {
                // var variableName = schemaOutList[i].children[0].innerHTML
                // var variableValue = schemaOutList[i].children[1].innerHTML
                // var variableType = schemaOutList[i].children[2].innerHTML
                // var variableID = variablesList[i].children[4].attributes[0].nodeValue

                var schemaOutID = schemaOutList[i].children[1].attributes[0].nodeValue
                var schemaOutType = schemaOutList[i].children[2].innerHTML
                var schemaOutPath = schemaOutList[i].children[0].innerHTML

                schemaOutMap[schemaOutID] = [schemaOutType, schemaOutPath]
            }
        }


        var linkList = xmlDocument.getElementsByTagName("Links")[0].children
        for (var i = 1; i < linkList.length; i++) {
            var linkFrom = linkList[i].children[0].attributes[0].nodeValue
            var linkTo = linkList[i].children[1].attributes[0].nodeValue
            // console.log(linkList[i].children[4].innerHTML)
            if (!linkMap.hasOwnProperty(linkList[i].children[4].innerHTML)) {
                // console.log(linkList[i].children[4].innerHTML)
                linkMap[linkList[i].children[4].innerHTML] = [[linkFrom, linkTo, linkList[i].children[2].innerHTML, linkList[i].children[3].innerHTML]]
            } else {
                var temp = linkMap[linkList[i].children[4].innerHTML]
                // console.log(temp)
                temp.push([linkFrom, linkTo, linkList[i].children[2].innerHTML, linkList[i].children[3].innerHTML])
            }
            // linkMap[linkFrom] = [linkTo]
        }
        // console.log(linkMap)

        resolve()
    })
}

function download(filename, text) {
    var element = document.createElement('a');
    // console.log(encodeURIComponent(text))
    // element.setAttribute('href', 'data:text/xml;charset=UTF-16BE,' + encodeURIComponent(text));
    var uint8array = new TextEncoder('utf-16', { NONSTANDARD_allowLegacyEncoding: true }).encode(text);
    var blob = new Blob([uint8array], { type: "text/xml;charset=UTF-16BE" });
    var url = URL.createObjectURL(blob);
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    $("#downloadedModal").modal('toggle');
}


function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}


function authorUpdate(event) {
    document.getElementById("mapAuthor").innerHTML = event.target.value;
}

function colorUpdate(event) {
    headerColor = event.target.value
    var customColorElements = document.getElementsByClassName("customColor")
    for (var i = 0; i < customColorElements.length; i++) {
        // if(customColorElements.item(i).classList[0] == "TableHeader"){
        //     customColorElements.item(i).style.backgroundColor = headerColor
        // } else {
        customColorElements.item(i).style.color = headerColor
        // }
    }

    var customBackgroundColorElements = document.getElementsByClassName("customBackgroundColor")
    for (var i = 0; i < customBackgroundColorElements.length; i++) {
        // if(customBackgroundColorElements.item(i).classList[0] == "TableHeader"){
        //     customBackgroundColorElements.item(i).style.backgroundColor = headerColor
        // } else {
        customBackgroundColorElements.item(i).style.backgroundColor = headerColor
        var invertedColor = invertColor(headerColor, true)
        // console.log(invertedColor)
        customBackgroundColorElements.item(i).style.color = invertedColor
        // }
    }

    // $("table tr:even").addClass("evenClassName");
    // console.log($("table tr:even"))
    // $("table tr:odd").css({ 'background-color': shadeBlendConvert(0.9, headerColor) })
    $("table").each(function () {
        // console.log(this)
        $(this).find("tr:odd").css({ 'background-color': shadeBlendConvert(0.9, headerColor) })
    });
    // console.log(shadeBlendConvert(0.25, headerColor))
}

function updateBackgroundColor() {
    var customBackgroundColorElements = document.getElementsByClassName("customBackgroundColor")
    for (var i = 0; i < customBackgroundColorElements.length; i++) {
        // if(customBackgroundColorElements.item(i).classList[0] == "TableHeader"){
        //     customBackgroundColorElements.item(i).style.backgroundColor = headerColor
        // } else {
        customBackgroundColorElements.item(i).style.backgroundColor = headerColor
        var invertedColor = invertColor(headerColor, true)
        // console.log(invertedColor)
        customBackgroundColorElements.item(i).style.color = invertedColor
        // }
    }
}

getInputParametersOfFunction = function (obj, functionID) {
    let result = {}, key;
    for (key in obj) {
        if ((key.startsWith("IID")) && obj.hasOwnProperty(key) && obj[key][5] == functionID) {
            result[key] = obj[key];
        }
    }
    return result;
};

getOutputParametersOfFunction = function (obj, functionID) {
    let result = {}, key;
    for (key in obj) {
        if ((key.startsWith("OID")) && obj.hasOwnProperty(key) && obj[key][5] == functionID) {
            result[key] = obj[key];
        }
    }
    return result;
};

function updatePDF() {
    document.getElementById("mapName").innerHTML = BODName
    document.getElementById("mapAuthor").style.visibility = "visible"

    document.getElementById("documentationTitle").style.visibility = "visible";
    document.getElementById("horizontalLine").style.visibility = "visible";

    var mapDescriptionHeader = document.createElement("H4");
    var mapDescriptionHeaderText = document.createTextNode(BODName);
    mapDescriptionHeader.id = "mapDescriptionHeader"
    mapDescriptionHeader.className = "customColor"
    mapDescriptionHeader.style.color = headerColor
    mapDescriptionHeader.appendChild(mapDescriptionHeaderText);
    document.getElementById("mapContent").appendChild(mapDescriptionHeader);

    var mybr = document.createElement('br');
    document.getElementById("mapContent").appendChild(mybr);


    var mapDescriptionElement = document.createElement("span")
    var mapDescriptionText = document.createTextNode($("#mapDescriptionInput").val())
    mapDescriptionElement.appendChild(mapDescriptionText)
    document.getElementById("mapContent").appendChild(mapDescriptionElement)

    var mybr = document.createElement('br');
    document.getElementById("mapContent").appendChild(mybr);
    var mybr = document.createElement('br');
    document.getElementById("mapContent").appendChild(mybr);

    var mappingLayoutDiv = document.getElementById("mappingLayout");

    //! Mapping Layout

    var functionHeader = document.createElement("H4");
    var functionHeaderText = document.createTextNode("Mapping Layout");
    functionHeader.id = "mappingLayoutHeader"
    functionHeader.className = "customColor"
    functionHeader.style.color = headerColor
    functionHeader.appendChild(functionHeaderText);
    document.getElementById("mappingLayout").appendChild(functionHeader);

    var mybr = document.createElement('br');
    document.getElementById("mappingLayout").appendChild(mybr);
    var padding = 0

    var currentParent = document.createElement("ul");
    currentParent.className = "tree";
    var parentList = [currentParent];

    for (var i = 0; i < functionAndLoopSequence.length; i++) {
        var elementID = functionAndLoopSequence[i].split(",")[0].trim()
        var elementType = functionAndLoopSequence[i].split(",")[1].trim()
        if (elementID in functionMap) {
            var a = document.createElement('a');
            a.className = "mappingElement"
            if (functionMap[elementID][1].startsWith("AV")) {
                var link = document.createTextNode(functionMap[elementID][2].substring(1).replace("\/", "."));
            } else {
                var link = document.createTextNode(functionMap[elementID][0]);
            }
            a.appendChild(link);
            a.title = functionMap[elementID][0];
            a.href = "#" + elementID;
            // a.style.cssText = "padding-left:" + padding + "vw";
            // mappingLayoutDiv.appendChild(a);

            // console.log(functionMap[elementID][0]);

            var li = document.createElement("li");
            var span = document.createElement("span");
            span.appendChild(a);
            li.appendChild(span);

            currentParent.appendChild(li);

        } else if (elementID in loopMap) {
            if (elementType == "LB") {
                // var a = document.createElement('a');
                // a.className = "mappingElement"
                // var link = document.createTextNode(loopMap[elementID][0]);
                // a.appendChild(link);
                // a.title = loopMap[elementID][0];
                // a.href = "";
                // a.style.cssText = "padding-left:" + padding + "vw";
                // mappingLayoutDiv.appendChild(a);
                // padding = padding + 3;
                var a = document.createElement('span');
                a.className = "mappingElement"
                var loopType = loopMap[elementID][1] == "WT" ? "Multiple Loop" : loopMap[elementID][1] == "IT" ? "Single Loop" : "";
                var link = document.createTextNode(loopMap[elementID][0] + " - " + loopType);
                a.appendChild(link);
                a.title = loopMap[elementID][0];
                a.href = "";
                // a.style.cssText = "padding-left:" + padding + "vw";
                // mappingLayoutDiv.appendChild(a);
                padding = padding + 3;
                // console.log(loopMap[elementID][0]);


                // var ul = document.createElement("ul");
                // ul.appendChild(a);

                // currentParent.appendChild(ul);

                // parentList.push(ul);
                // currentParent = ul;
                var loopDiv = document.createElement("div");
                loopDiv.className = "loopElement";
                // loopDiv.style.float = "left"
                var collapseIcon = document.createElement("i");
                collapseIcon.style.width = "20px";
                collapseIcon.style.paddingLeft = "8px";
                collapseIcon.className = "fas fa-minus fa-1x collapseIcon";

                loopDiv.appendChild(collapseIcon);
                loopDiv.appendChild(a);


                var li = document.createElement("li");
                li.appendChild(loopDiv);
                currentParent.appendChild(li);

                var ul = document.createElement("ul");
                loopDiv.appendChild(ul);
                parentList.push(ul);
                currentParent = ul;

            } else if (elementType == "LE") {
                padding = padding - 3;
                parentList.pop();
                currentParent = parentList[parentList.length - 1];
            }
        }
    }

    console.log(currentParent);
    document.getElementById("mappingLayout").appendChild(currentParent);

    var pageBreak = document.createElement("div")
    pageBreak.className = "pagebreak"
    document.getElementById("mapContent").appendChild(mappingLayoutDiv)
    document.getElementById("mapContent").appendChild(pageBreak)

    //! Function Definition

    for (var i = 0; i < functionAndLoopSequence.length; i++) {
        var elementID = functionAndLoopSequence[i].split(",")[0].trim()

        // if (elementID != "FID68") continue

        // console.log(functionMap)

        if (elementID in functionMap) {
            var functionName = functionMap[elementID][0]
            var functionType = functionMap[elementID][1]
            var functionPath = functionMap[elementID][2]
            // console.log(functionType)

            if (/*functionType == "UV" || functionType == "UB"*/true) {

                var functionContentsDiv = document.createElement("div")
                functionContentsDiv.id = "functionDiv-" + elementID

                //* Java or Boolean Function - Add Function Header
                var functionHeader = document.createElement("H4");
                functionHeader.className = "functionHeader customColor"
                functionHeader.style.color = headerColor
                functionHeader.id = elementID
                if (functionType.startsWith("AV")) {
                    var functionHeaderText = document.createTextNode(functionPath.substring(1).replace("\/", "."));
                } else {
                    var functionHeaderText = document.createTextNode(functionName);
                }
                functionHeader.appendChild(functionHeaderText);


                var row = document.createElement("div")
                row.className = "parent"
                row.id = "row-" + elementID

                row.appendChild(functionHeader)
                // row.append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">Launch demo modal</button>')

                functionContentsDiv.appendChild(row);
                // $("#row-" + elementID).append('<button type="button" class="btn btn-danger editDescriptionButton" data-toggle="modal" data-target="#exampleModalCenter">Add/Edit Function Description</button>')


                //* Add Function comment
                var functionCode = ImplementationMap[elementID]

                //* Get Function description
                const functionDescriptionRegex = /\/\/!.*?$/gm;

                let m;
                var functionDescription = "";

                while ((m = functionDescriptionRegex.exec(functionCode)) !== null) {
                    if (m.index === functionDescriptionRegex.lastIndex) {
                        functionDescriptionRegex.lastIndex++;
                    }
                    m.forEach((match, groupIndex) => {
                        functionDescription = functionDescription + " " + match.substring(3)
                    });
                }


                var functionDescriptionElement = document.createElement("span");
                functionDescriptionElement.className = "functionDescription"
                functionDescriptionElement.id = elementID + "-desc"
                var functionDescriptionText = document.createTextNode(functionDescription);
                functionDescriptionElement.appendChild(functionDescriptionText);
                functionContentsDiv.appendChild(functionDescriptionElement);

                var mybr = document.createElement('br');
                functionContentsDiv.appendChild(mybr);


                // console.log(parametersMap)
                var functionInputParameters = getInputParametersOfFunction(parametersMap, elementID)
                // console.log(functionInputParameters)
                if (Object.keys(functionInputParameters).length) {

                    var inputTableCreated = false

                    //* There are parameters in the function
                    // console.log(functionInputParameters)
                    // console.log(variablesMap)
                    // console.log(constantMap)
                    // console.log(linkMap)
                    // console.log(schemaInMap)

                    //* Check Variable to Parameter mapping
                    var variableToParameterLinks = linkMap["VP"]
                    if (variableToParameterLinks == undefined) variableToParameterLinks = []

                    if (variableToParameterLinks)
                        variableToParameterLinks = variableToParameterLinks.filter(arr => arr[1] in functionInputParameters)
                    // console.log(variableToParameterLinks)

                    var constantToParameterLinks = linkMap["KP"]
                    if (constantToParameterLinks == undefined) constantToParameterLinks = []

                    if (constantToParameterLinks)
                        constantToParameterLinks = constantToParameterLinks.filter(arr => arr[1] in functionInputParameters)
                    // console.log(constantToParameterLinks)

                    var schemaToParameterLinks = linkMap["MP"]
                    if (schemaToParameterLinks == undefined) schemaToParameterLinks = []

                    if (schemaToParameterLinks)
                        schemaToParameterLinks = schemaToParameterLinks.filter(arr => arr[1] in functionInputParameters)
                    // console.log(schemaToParameterLinks)


                    if (variableToParameterLinks.length > 0 || constantToParameterLinks.length > 0 || schemaToParameterLinks.length > 0) {
                        //*Print Input Variables
                        var functionHeader = document.createElement("H5");
                        var functionHeaderText = document.createTextNode("Input Variables");
                        functionHeader.appendChild(functionHeaderText);
                        functionContentsDiv.appendChild(functionHeader);

                        for (const parameter in functionInputParameters) {
                            const parameterDetails = functionInputParameters[parameter];
                            if (variableToParameterLinks)
                                var tempvariableToParameterLinks = variableToParameterLinks.filter(arr => arr[1] == parameter)
                            var inputTableDataRow = undefined
                            // console.log(parameterDetails)
                            // console.log(tempvariableToParameterLinks)

                            if (constantToParameterLinks)
                                var tempconstantToParameterLinks = constantToParameterLinks.filter(arr => arr[1] == parameter)


                            if (tempvariableToParameterLinks && tempvariableToParameterLinks[0] && tempvariableToParameterLinks[0][0] in variablesMap) {
                                // console.log(variablesMap[tempvariableToParameterLinks[0][0]])
                                // console.log(parameterDetails[0])



                                // var inputVariable = document.createElement("span");
                                // var inputVariableText = document.createTextNode(parameterDetails[0] + "-> " + variablesMap[tempvariableToParameterLinks[0][0]][0]);
                                // inputVariable.appendChild(inputVariableText);
                                // functionContentsDiv.appendChild(inputVariable);
                                // var mybr = document.createElement('br');
                                // functionContentsDiv.appendChild(mybr);

                                if (!inputTableCreated) {
                                    var inputTable = document.createElement('table');
                                    inputTable.className = "table table-bordered"

                                    var inputTableHeaderRow = document.createElement('thead');
                                    inputTableHeaderRow.className = "TableHeader customBackgroundColor"
                                    inputTableHeaderRow.style.cssText = "background-color:" + headerColor

                                    var LocalParameter = document.createElement('th');
                                    var LocalParameterText = document.createTextNode('Parameter');

                                    var LocalParameterSource = document.createElement('th');
                                    var LocalParameterSourceText = document.createTextNode('Variable/Constant/XPath');

                                    LocalParameter.appendChild(LocalParameterText)
                                    LocalParameterSource.appendChild(LocalParameterSourceText)

                                    inputTableHeaderRow.appendChild(LocalParameter)
                                    inputTableHeaderRow.appendChild(LocalParameterSource)

                                    inputTable.appendChild(inputTableHeaderRow)
                                    inputTableCreated = true
                                }

                                if (tempvariableToParameterLinks.length > 0) {
                                    var inputTableDataRow = document.createElement('tr');

                                    var LocalParameterData = document.createElement('td');
                                    var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                    var LocalParameterSourceData = document.createElement('td');
                                    var LocalParameterSourceTextData = document.createTextNode(variablesMap[tempvariableToParameterLinks[0][0]][0]);

                                    LocalParameterData.appendChild(LocalParameterTextData)
                                    LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

                                    inputTableDataRow.appendChild(LocalParameterData)
                                    inputTableDataRow.appendChild(LocalParameterSourceData)
                                    inputTable.appendChild(inputTableDataRow)
                                }
                            }

                            // console.log(tempconstantToParameterLinks)
                            if (tempconstantToParameterLinks && tempconstantToParameterLinks[0] && tempconstantToParameterLinks[0][0] in constantMap) {
                                // console.log(constantMap[tempconstantToParameterLinks[0][0]])
                                // console.log(parameterDetails[0])



                                // var inputVariable = document.createElement("span");
                                // var inputVariableText = document.createTextNode(parameterDetails[0] + "-> " + constantMap[tempconstantToParameterLinks[0][0]][2]);
                                // inputVariable.appendChild(inputVariableText);
                                // functionContentsDiv.appendChild(inputVariable);
                                // var mybr = document.createElement('br');
                                // functionContentsDiv.appendChild(mybr);


                                if (!inputTableCreated) {
                                    var inputTable = document.createElement('table');
                                    inputTable.className = "table table-bordered"

                                    var inputTableHeaderRow = document.createElement('thead');
                                    inputTableHeaderRow.className = "TableHeader customBackgroundColor"
                                    inputTableHeaderRow.style.cssText = "background-color:" + headerColor

                                    var LocalParameter = document.createElement('th');
                                    var LocalParameterText = document.createTextNode('Parameter');

                                    var LocalParameterSource = document.createElement('th');
                                    var LocalParameterSourceText = document.createTextNode('Variable/Constant/XPath');

                                    LocalParameter.appendChild(LocalParameterText)
                                    LocalParameterSource.appendChild(LocalParameterSourceText)

                                    inputTableHeaderRow.appendChild(LocalParameter)
                                    inputTableHeaderRow.appendChild(LocalParameterSource)

                                    inputTable.appendChild(inputTableHeaderRow)
                                    inputTableCreated = true
                                }

                                if (tempconstantToParameterLinks.length > 0) {
                                    var inputTableDataRow = document.createElement('tr');

                                    var LocalParameterData = document.createElement('td');
                                    var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                    var LocalParameterSourceData = document.createElement('td');
                                    var LocalParameterSourceTextData = document.createTextNode(constantMap[tempconstantToParameterLinks[0][0]][2]);

                                    LocalParameterData.appendChild(LocalParameterTextData)
                                    LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

                                    inputTableDataRow.appendChild(LocalParameterData)
                                    inputTableDataRow.appendChild(LocalParameterSourceData)
                                    inputTable.appendChild(inputTableDataRow)
                                }
                            }
                            if (schemaToParameterLinks)
                                var tempschemaToParameterLinks = schemaToParameterLinks.filter(arr => arr[1] == parameter)
                            // console.log(tempschemaToParameterLinks)
                            if (tempschemaToParameterLinks && tempschemaToParameterLinks[0] && tempschemaToParameterLinks[0][0] in schemaInMap) {
                                // console.log(schemaInMap[tempschemaToParameterLinks[0][0]])
                                // console.log(parameterDetails[0])



                                // var inputVariable = document.createElement("span");
                                // var inputVariableText = document.createTextNode(parameterDetails[0] + "-> " + schemaInMap[tempschemaToParameterLinks[0][0]][1]);
                                // inputVariable.appendChild(inputVariableText);
                                // functionContentsDiv.appendChild(inputVariable);
                                // var mybr = document.createElement('br');
                                // functionContentsDiv.appendChild(mybr);


                                if (!inputTableCreated) {
                                    var inputTable = document.createElement('table');
                                    inputTable.className = "table table-bordered"

                                    var inputTableHeaderRow = document.createElement('thead');
                                    inputTableHeaderRow.className = "TableHeader customBackgroundColor"
                                    inputTableHeaderRow.style.cssText = "background-color:" + headerColor

                                    var LocalParameter = document.createElement('th');
                                    var LocalParameterText = document.createTextNode('Parameter');

                                    var LocalParameterSource = document.createElement('th');
                                    var LocalParameterSourceText = document.createTextNode('Variable/Constant/XPath');

                                    LocalParameter.appendChild(LocalParameterText)
                                    LocalParameterSource.appendChild(LocalParameterSourceText)

                                    inputTableHeaderRow.appendChild(LocalParameter)
                                    inputTableHeaderRow.appendChild(LocalParameterSource)

                                    inputTable.appendChild(inputTableHeaderRow)
                                    inputTableCreated = true
                                }

                                if (tempschemaToParameterLinks.length > 0) {
                                    var inputTableDataRow = document.createElement('tr');

                                    var LocalParameterData = document.createElement('td');
                                    var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                    var LocalParameterSourceData = document.createElement('td');
                                    var LocalParameterSourceTextData = document.createTextNode(schemaInMap[tempschemaToParameterLinks[0][0]][1]);
                                    LocalParameterData.appendChild(LocalParameterTextData)
                                    LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

                                    inputTableDataRow.appendChild(LocalParameterData)
                                    inputTableDataRow.appendChild(LocalParameterSourceData)
                                    inputTable.appendChild(inputTableDataRow)
                                }
                            }


                        }
                        if (inputTableCreated)
                            functionContentsDiv.appendChild(inputTable);
                    }
                }

                var outputTableCreated = false;

                var functionOutputParameters = getOutputParametersOfFunction(parametersMap, elementID)
                // console.log(functionOutputParameters)
                if (Object.keys(functionOutputParameters).length) {

                    //* There are parameters in the function
                    // console.log(functionOutputParameters)
                    // console.log(variablesMap)
                    // console.log(constantMap)
                    // console.log(linkMap)
                    // console.log(schemaOutMap)

                    //* Check Variable to Parameter mapping
                    // console.log(linkMap["VP"])
                    var parameterToVariableLinks = linkMap["PV"]
                    if (parameterToVariableLinks == undefined) parameterToVariableLinks = []
                    if (parameterToVariableLinks)
                        parameterToVariableLinks = parameterToVariableLinks.filter(arr => arr[0] in functionOutputParameters)
                    // console.log(parameterToVariableLinks)

                    var parameterToSchemaLinks = linkMap["PM"]
                    if (parameterToSchemaLinks == undefined) parameterToSchemaLinks = []
                    if (parameterToSchemaLinks)
                        parameterToSchemaLinks = parameterToSchemaLinks.filter(arr => arr[0] in functionOutputParameters)
                    // console.log(parameterToSchemaLinks)


                    if (parameterToVariableLinks.length > 0 || parameterToSchemaLinks.length > 0) {
                        //*Print Output Variables


                        for (const parameter in functionOutputParameters) {
                            const parameterDetails = functionOutputParameters[parameter];
                            var outputableDataRow = undefined
                            // console.log(parameter)
                            // console.log(parameterDetails)
                            // console.log(parameterToVariableLinks)
                            if (parameterToVariableLinks)
                                var tempparameterToVariableLinks = parameterToVariableLinks.filter(arr => arr[0] == parameter)
                            // console.log(tempparameterToVariableLinks)
                            if (tempparameterToVariableLinks[0] && tempparameterToVariableLinks[0][1] in variablesMap) {
                                // console.log(variablesMap[tempparameterToVariableLinks[0][1]])
                                // console.log(parameterDetails[0])


                                // var inputVariable = document.createElement("span");
                                // var inputVariableText = document.createTextNode(parameterDetails[0] + "-> " + variablesMap[tempparameterToVariableLinks[0][1]][0]);
                                // inputVariable.appendChild(inputVariableText);
                                // functionContentsDiv.appendChild(inputVariable);
                                // var mybr = document.createElement('br');
                                // functionContentsDiv.appendChild(mybr);


                                if (!outputTableCreated) {
                                    var functionHeader = document.createElement("H5");
                                    var functionHeaderText = document.createTextNode("Output Variables");
                                    functionHeader.appendChild(functionHeaderText);
                                    functionContentsDiv.appendChild(functionHeader);

                                    var outputTable = document.createElement('table');
                                    outputTable.className = "outputTable"

                                    var outputTableHeaderRow = document.createElement('thead');
                                    outputTableHeaderRow.className = "TableHeader customBackgroundColor"
                                    outputTableHeaderRow.style.cssText = "background-color:" + headerColor

                                    var LocalParameter = document.createElement('th');
                                    var LocalParameterText = document.createTextNode('Parameter');

                                    var LocalParameterSource = document.createElement('th');
                                    var LocalParameterSourceText = document.createTextNode('Variable/XPath');

                                    LocalParameter.appendChild(LocalParameterText)
                                    LocalParameterSource.appendChild(LocalParameterSourceText)

                                    outputTableHeaderRow.appendChild(LocalParameter)
                                    outputTableHeaderRow.appendChild(LocalParameterSource)

                                    outputTable.appendChild(outputTableHeaderRow)
                                    outputTableCreated = true
                                }

                                if (tempparameterToVariableLinks.length > 0) {
                                    var outputableDataRow = document.createElement('tr');

                                    var LocalParameterData = document.createElement('td');
                                    var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                    var LocalParameterSourceData = document.createElement('td');

                                    var LocalParameterSourceTextData = document.createTextNode(variablesMap[tempparameterToVariableLinks[0][1]][0]);

                                    // console.log(LocalParameterData)
                                    LocalParameterData.appendChild(LocalParameterTextData)
                                    LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

                                    outputableDataRow.appendChild(LocalParameterData)
                                    outputableDataRow.appendChild(LocalParameterSourceData)
                                    outputTable.appendChild(outputableDataRow)
                                }


                                // var outputableDataRow = document.createElement('tr');

                                // var LocalParameterData = document.createElement('td');
                                // var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                // var LocalParameterSourceData = document.createElement('td');
                                // var LocalParameterSourceTextData = document.createTextNode(variablesMap[tempparameterToVariableLinks[0][1]][0]);
                            }

                            if (parameterToSchemaLinks)
                                var tempparameterToSchemaLinks = parameterToSchemaLinks.filter(arr => arr[0] == parameter)
                            // console.log(tempparameterToSchemaLinks)
                            if (tempparameterToSchemaLinks && tempparameterToSchemaLinks[0] && tempparameterToSchemaLinks[0][1] in schemaOutMap) {
                                // console.log(schemaOutMap[tempparameterToSchemaLinks[0][1]])
                                // console.log(parameterDetails[0])



                                // var inputVariable = document.createElement("span");
                                // var inputVariableText = document.createTextNode(parameterDetails[0] + "-> " + schemaOutMap[tempparameterToSchemaLinks[0][1]][1]);
                                // inputVariable.appendChild(inputVariableText);
                                // functionContentsDiv.appendChild(inputVariable);
                                // var mybr = document.createElement('br');
                                // functionContentsDiv.appendChild(mybr);

                                if (!outputTableCreated) {
                                    var functionHeader = document.createElement("H5");
                                    var functionHeaderText = document.createTextNode("Output Variables");
                                    functionHeader.appendChild(functionHeaderText);
                                    functionContentsDiv.appendChild(functionHeader);

                                    var outputTable = document.createElement('table');
                                    outputTable.className = "outputTable"

                                    var outputTableHeaderRow = document.createElement('thead');
                                    outputTableHeaderRow.className = "TableHeader customBackgroundColor"
                                    outputTableHeaderRow.style.cssText = "background-color:" + headerColor

                                    var LocalParameter = document.createElement('th');
                                    var LocalParameterText = document.createTextNode('Parameter');

                                    var LocalParameterSource = document.createElement('th');
                                    var LocalParameterSourceText = document.createTextNode('Variable/XPath');

                                    LocalParameter.appendChild(LocalParameterText)
                                    LocalParameterSource.appendChild(LocalParameterSourceText)

                                    outputTableHeaderRow.appendChild(LocalParameter)
                                    outputTableHeaderRow.appendChild(LocalParameterSource)

                                    outputTable.appendChild(outputTableHeaderRow)
                                    outputTableCreated = true
                                }



                                if (tempparameterToSchemaLinks.length > 0) {
                                    var outputableDataRow = document.createElement('tr');

                                    var LocalParameterData = document.createElement('td');
                                    var LocalParameterTextData = document.createTextNode(parameterDetails[0]);

                                    var LocalParameterSourceData = document.createElement('td');
                                    var LocalParameterSourceTextData = document.createTextNode(schemaOutMap[tempparameterToSchemaLinks[0][1]][1]);


                                    // console.log(LocalParameterData)
                                    LocalParameterData.appendChild(LocalParameterTextData)
                                    LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

                                    outputableDataRow.appendChild(LocalParameterData)
                                    outputableDataRow.appendChild(LocalParameterSourceData)
                                    outputTable.appendChild(outputableDataRow)
                                }
                            }


                        }

                        if (outputTableCreated)
                            functionContentsDiv.appendChild(outputTable);

                    }
                }


                if (functionType == "UV" || functionType == "UB") {
                    //* Add Code Segment
                    var functionCodeHeader = document.createElement("H5");
                    var functionCodeHeaderText = document.createTextNode("Function Code");
                    functionCodeHeader.appendChild(functionCodeHeaderText);
                    functionContentsDiv.appendChild(functionCodeHeader);

                    //* Get Function Code

                    if (removeCommentedCode) {
                        const removeSingleCommentRegex = /((\/\/!.*?$)|\/\/.*?$)/gm;
                        functionCode = functionCode.replace(removeSingleCommentRegex, "").trim();

                        const removeBulkCommentRegex = /\/\*(\*(?!\/)|[^*])*\*\//gm;
                        functionCode = functionCode.replace(removeBulkCommentRegex, "").trim();
                    }

                    var preDiv = document.createElement("div")
                    preDiv.className = "preDiv"

                    var editCodeLink = document.createElement("a")
                    editCodeLink.className = "btn editCodeClass"
                    editCodeLink.href = "#"
                    editCodeLink.title = "Edit the function code"
                    editCodeLink.setAttribute("data-bs-toggle", "tooltip")
                    editCodeLink.setAttribute("data-bs-placement", "bottom")
                    editCodeLink.style.float = "right"

                    var editCodeIcon = document.createElement("i")
                    editCodeIcon.className = "fas fa-edit editCodeButton"
                    editCodeIcon.id = "editCode-" + elementID

                    editCodeLink.appendChild(editCodeIcon)
                    preDiv.appendChild(editCodeLink)

                    var functionPreSegment = document.createElement("pre");
                    functionPreSegment.id = "pre-" + elementID
                    functionPreSegment.className = "preClass"
                    // functionPreSegment.contentEditable = "true"

                    var functionCodeSegment = document.createElement("code");
                    var functionCodeSegmentText = document.createTextNode(js_beautify(functionCode.trim()));

                    functionCodeSegment.className = "functionCode"
                    functionCodeSegment.id = "code-" + elementID
                    functionCodeSegment.appendChild(functionCodeSegmentText)
                    functionPreSegment.appendChild(functionCodeSegment)
                    preDiv.appendChild(functionPreSegment)
                    functionContentsDiv.appendChild(preDiv)
                }


                var mybr = document.createElement('br');
                functionContentsDiv.appendChild(mybr);
                var mybr = document.createElement('br');
                functionContentsDiv.appendChild(mybr);

                document.getElementById("mapContent").appendChild(functionContentsDiv);
                $("#row-" + elementID).append('<div class="modificationDiv"><a class="btn" href="#" id ="editLink" data-bs-toggle="tooltip" data-bs-placement="bottom" title = "Edit the function\'s name and description" > <i class="fas fa-edit editButton" id="edit-' + elementID + '" functionType=' + functionType + ' data-bs-toggle="modal" data-bs-target="#functionModal"></i></a > <a class="btn" href="#" id="deleteLink" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete this function from the document"><i class="fas fa-trash-alt deleteButton" id="delete-' + elementID + '" data-bs-toggle="modal" data-bs-target="#confirm-delete"></i></a></div > ')
                // $("#row-" + elementID).append('')

            }

            inputTableCreated = false;
            outputTableCreated = false;
        }
    }

    // console.log(constantMap)
    if (constantMap && Object.keys(constantMap).length > 0) {
        var Constants = document.createElement("H4");
        Constants.className = "Constants customColor"
        Constants.style.color = headerColor

        var ConstantsText = document.createTextNode("Constants");
        Constants.appendChild(ConstantsText);
        document.getElementById("mapContent").appendChild(Constants);

        var constantTable = document.createElement('table');
        constantTable.className = "constantTable"

        var constantTableHeaderRow = document.createElement('thead');
        constantTableHeaderRow.className = "TableHeader customBackgroundColor"
        constantTableHeaderRow.style.cssText = "background-color:" + headerColor

        var LocalParameter = document.createElement('th');
        var LocalParameterText = document.createTextNode('Parameter');

        var LocalParameterSource = document.createElement('th');
        var LocalParameterSourceText = document.createTextNode('Variable/XPath');

        LocalParameter.appendChild(LocalParameterText)
        LocalParameterSource.appendChild(LocalParameterSourceText)

        constantTableHeaderRow.appendChild(LocalParameter)
        constantTableHeaderRow.appendChild(LocalParameterSource)

        constantTable.appendChild(constantTableHeaderRow)



        for (var constant in constantMap) {
            // console.log(constant)
            var constanttableDataRow = document.createElement('tr');

            var LocalParameterData = document.createElement('td');
            var LocalParameterTextData = document.createTextNode(constantMap[constant][0]);

            var LocalParameterSourceData = document.createElement('td');

            var LocalParameterSourceTextData = document.createTextNode(constantMap[constant][2]);

            // console.log(LocalParameterData)
            LocalParameterData.appendChild(LocalParameterTextData)
            LocalParameterSourceData.appendChild(LocalParameterSourceTextData)

            constanttableDataRow.appendChild(LocalParameterData)
            constanttableDataRow.appendChild(LocalParameterSourceData)
            constantTable.appendChild(constanttableDataRow)
        }

        document.getElementById("mapContent").appendChild(constantTable);


    }

    $(document).on("click", ".editButton", function () {
        var clickedID = $(this)[0].id;
        // console.log($(this).attr("functionType"))
        $("#functionNameInput").val($("#" + (clickedID.split("-")[1]))[0].innerText);
        // console.log($("#" + ((clickedID.split("-")[1]) + "-desc")))
        $("#functionDescriptionInput").val($("#" + ((clickedID.split("-")[1]) + "-desc"))[0].innerText);
        $("#saveEdit").attr("functionType", $(this).attr("functionType"))
        $("#saveEdit").attr("id", "saveEdit-" + clickedID.split("-")[1])

    });

    $(document).on("click", ".editCodeButton", function () {
        var saveClass = document.getElementsByClassName("saveCodeButton")
        if (saveClass.length > 0) {
            // console.log(saveClass[0].id.split("-")[1])
            document.getElementById("code-" + saveClass[0].id.split("-")[1]).innerHTML = originalEditedCode
            // saveClass[0].innerHTML = originalEditedCode
            saveClass[0].classList.add("editCodeButton")
            saveClass[0].classList.add("fa-edit")
            saveClass[0].classList.remove("fa-save")
            saveClass[0].classList.remove("saveCodeButton")
        }

        var clickedID = $(this)[0].id;
        var functionID = clickedID.split("-")[1]

        originalEditedCode = document.getElementById("code-" + functionID).innerText
        $(this).removeClass("fa-edit")
        $(this).addClass("fa-save")
        $(this).removeClass("editCodeButton")
        $(this).prop('title', 'Save the edited function code')
        $(this).addClass("saveCodeButton")

        originalEditedCode = document.getElementById("code-" + functionID).innerText
        document.getElementById("pre-" + functionID).contentEditable = "true"
        document.getElementById("pre-" + functionID).click()
        document.getElementById("pre-" + functionID).focus()
    });

    $(document).on("click", ".saveCodeButton", function () {
        var clickedID = $(this)[0].id;
        var functionID = clickedID.split("-")[1]

        originalEditedCode = document.getElementById("code-" + functionID).innerText

        $(this).removeClass("fa-save")
        $(this).addClass("fa-edit")
        $(this).prop('title', 'Edit the function code')
        $(this).removeClass("saveCodeButton")
        $(this).addClass("editCodeButton")
        // console.log(functionID);

        document.getElementById("pre-" + functionID).contentEditable = "false"
    });

    $(document).on("click", ".deleteButton", function () {
        var clickedID = $(this)[0].id;
        // console.log(clickedID)
        // console.log($("#" + (clickedID.split("-")[1]))[0].innerText)
        $("#deleteModalTitle")[0].innerHTML = "Delete " + $("#" + (clickedID.split("-")[1]))[0].innerText + "?"
        $("#deleteText")[0].innerHTML = "Are you sure you want to delete the element " + $("#" + (clickedID.split("-")[1]))[0].innerText + "?"
        $("#confirmDelete").attr("id", "confirmDelete-" + clickedID.split("-")[1])
    });

    $(document).on("click", ".saveChangesButton", function () {
        var clickedID = $(this)[0].id;
        if (!clickedID.toString().includes("-")) return
        var functionType = $(this).attr("functionType")
        console.log(clickedID)
        var functionID = clickedID.split("-")[1]
        $("#" + functionID).text($("#functionNameInput").val())
        $("#" + (functionID + "-desc")).text($("#functionDescriptionInput").val())
        document.querySelectorAll("a[href='#" + functionID + "']")[0].innerHTML = $("#functionNameInput").val()

        if (!functionType.startsWith("AV")) {
            var tempxmlParser = new DOMParser()
            var tempxmlDocument = tempxmlParser.parseFromString(origianlMapFileString, "text/xml");
            // console.log(tempxmlDocument)

            var nodeList = tempxmlDocument.querySelectorAll('[IDREF="' + functionID.trim() + '"]')
            var index = Array.from(nodeList).findIndex(temp => temp.nodeName == "Language")

            var functionCode = tempxmlDocument.querySelectorAll('[IDREF="' + functionID.trim() + '"]')[index].parentElement.innerHTML.trim()
            // console.log(functionCode)
            const regex = /\/\/!.*?$/gm;
            functionCode = functionCode.replace(regex, "");
            functionCode = functionCode.substring(functionCode.indexOf("<![CDATA["))
            functionCode = functionCode.substring(9, functionCode.length - 3)
            // console.log(functionCode)

            functionCode = "//!" + $("#functionDescriptionInput").val() + "\n" + functionCode

            tempxmlDocument.querySelectorAll('[IDREF="' + functionID.trim() + '"]')[index].parentElement.innerHTML = '<Language IDREF="' + functionID.trim() + '">Java</Language>\n<![CDATA[' + functionCode + ']]>'
            // console.log(tempxmlDocument)

            origianlMapFileString = new XMLSerializer().serializeToString(tempxmlDocument)
        }

        // console.log(origianlMapFileString)

        $("#" + clickedID).attr("id", "saveEdit")
        $("#functionModal").modal('toggle');
    })

    $(document).on("click", ".confirmDeleteButton", function () {
        var clickedID = $(this)[0].id;
        // console.log(clickedID)
        var functionID = clickedID.split("-")[1]
        document.getElementById("functionDiv-" + functionID).remove()
        document.querySelectorAll("a[href='#" + functionID + "']")[0].parentElement.parentElement.remove()
        $("#" + clickedID).attr("id", "confirmDelete")
        // $("#confirm-delete").modal('toggle');
    })
    updateBackgroundColor()
    $('.bubble').click(function () {
        // $(this).find('.hiddenInput').toggle();
        $(this).animate({ bottom: '36', width: '15vw' }, 300);
    });


    setEventListenersToLoops();

}

document.getElementById("downloadButtonLink").addEventListener("click", function () {
    // Generate download of hello.txt file with some content
    $("#downloadModal").modal('toggle');
    // download(filename, text);
}, false);

document.getElementById("confirmDownload").addEventListener("click", function () {
    // Generate download of hello.txt file with some content
    var text = origianlMapFileString;
    var filename = uploadedFileName;

    download(filename, text);
}, false);


async function loadFile(file) {
    let text = await file.text();
    // console.log(text);
    return text;
}

function uploadFile() {

    functionAndLoopSequence = []
    loopMap = {}
    functionMap = {}
    parametersMap = {}
    ImplementationMap = {}
    constantMap = {}
    variablesMap = {}
    schemaInMap = {}
    schemaOutMap = {}
    linkMap = {}
    headerColor = document.getElementById("colorpicker").value;



    var mappingLayout = document.getElementById('mappingLayout');
    while (mappingLayout.children.length > 0) {
        mappingLayout.removeChild(mappingLayout.lastChild);
    }
    var mapContent = document.getElementById('mapContent');
    while (mapContent.children.length > 0) {
        mapContent.removeChild(mapContent.lastChild);
    }
    // for (let index = 0; index < 4; index++) {
    //     var mapContent = document.getElementById('mapContent');
    //     if (mapContent.children[0].id != "mappingLayout")
    //         mapContent.removeChild(mapContent.children[0]);

    // }

    var mappingLayoutDiv = document.createElement("div")
    mappingLayoutDiv.className = "mappingLayout"
    mappingLayoutDiv.id = "mappingLayout"

    var mapContent = document.getElementById('mapContent');
    mapContent.appendChild(mappingLayoutDiv)


    document.getElementById("todayDate").innerHTML = "";
    document.getElementById("mapName").innerHTML = "";
    document.getElementById("documentationTitle").style.visibility = "hidden";
    document.getElementById("horizontalLine").style.visibility = "hidden";

    originalEditedCode = "";


    const selectedFile = document.getElementById('fileInput').files
    var authorName = document.getElementById("authorInput").value

    const logoFile = document.getElementById('logoInput').files
    const customerLogoFile = document.getElementById('customerLogoInput').files

    // console.log(logoFile, customerLogoFile)

    if (selectedFile.length > 0 && authorName.trim() != "") {
        var myFile = selectedFile[0];
        const filePath = URL.createObjectURL(myFile);

        uploadedFileName = myFile.name
        loadFile(myFile).then(mapFileString => {
            //    console.log(result)
            origianlMapFileString = mapFileString
            removeCommentedCode = document.getElementById("commentCheckbox").checked
            parseMapFile(mapFileString).then(result => {
                updatePDF()
                document.title = BODName
                document.getElementsByClassName("printerDiv")[0].style.visibility = "visible"
                document.getElementById("mapAuthor").style.visibility = "visible"
                document.getElementById("todayDate").style.visibility = "visible"
                document.getElementById("todayDate").innerHTML = moment().format('MMMM Do YYYY');

                var watermarkDiv = document.getElementById("watermarkDiv");
                watermarkDiv.innerHTML = "";

                var watermarkAuthor = document.createElement("span");
                // watermarkAuthor.innerText = "Ajay Yadukrishnan";
                watermarkAuthor.id = "watermarkAuthor";
                watermarkDiv.appendChild(watermarkAuthor);

                if (logoFile.length > 0) {
                    document.getElementById("logo").src = URL.createObjectURL(logoFile[0])
                    document.getElementById("logo").style.visibility = "visible"
                    var src = URL.createObjectURL(logoFile[0]);
                    console.log(src)
                    document.body.style.background = 'url(' + src + ') repeat 0 0';

                    var img = document.createElement("img");
                    img.src = src;

                    var watermarkDiv = document.getElementById("watermarkDiv");

                    watermarkDiv.appendChild(img);

                    document.getElementsByTagName("body")[0].appendChild(watermarkDiv);

                    // div.innerHTML = "Ajay Yadukrishnan"
                    // div.style.color = "#bbb";
                    // div.style.fontSize = "100px";
                    // div.style.position = "fixed";
                    // div.style.top = "50%";
                    // div.style.left = "60%";
                    // div.style.zIndex = "99";
                    // div.style.opacity = "0.1"

                    // div.style.transform = "rotate(-45deg)"; //standard
                    // div.style.msTransform = "rotate(-45deg)"; //IE
                    // div.style.mozTransform = "rotate(-45deg)"; //Firefox
                    // div.style.webkitTransform = "rotate(-45deg)"; //Chrome
                    // div.style.oTransform = "rotate(-45deg)"; //Opera
                    img.id = "watermarkImage";
                    // img.style.color = "#bbb";
                    // img.style.fontSize = "100px";
                    // img.style.position = "fixed";
                    // img.style.top = "50%";
                    // img.style.left = "60%";
                    // img.style.zIndex = "98";
                    // img.style.opacity = "0.05"

                    // img.style.transform = "rotate(-45deg)"; //standard
                    // img.style.msTransform = "rotate(-45deg)"; //IE
                    // img.style.mozTransform = "rotate(-45deg)"; //Firefox
                    // img.style.webkitTransform = "rotate(-45deg)"; //Chrome
                    // img.style.oTransform = "rotate(-45deg)"; //Opera
                }

                if (customerLogoFile.length > 0) {
                    document.getElementById("customerLogo").src = URL.createObjectURL(customerLogoFile[0])
                    document.getElementById("customerLogo").style.visibility = "visible"
                }

                // $("table tr:odd").css({ 'background-color': shadeBlendConvert(0.9, headerColor) })
                $("table").each(function () {
                    // console.log(this)
                    $(this).find("tr:odd").css({ 'background-color': shadeBlendConvert(0.9, headerColor) })
                });
            })
        }).catch(error => {
            console.log(error)
        })
    } else {
        // console.log($("#errorModal"))
        $("#errorModal").modal('toggle');
    }

}

function setEventListenersToLoops() {
    var loopElements = document.getElementsByClassName("loopElement")
    for (let index = 0; index < loopElements.length; index++) {
        // console.log(loopElements[index])
        // loopElements[index].addEventListener("click", function (e) {
        //     console.log(e.currentTarget.children);
        //     // var children = $(this).parent('li.parent_li').find(' > ul > li');
        //     var child = e.currentTarget.children[0];
        //     // if (children.is(":visible")) {
        //     //     children.hide('fast');
        //     //     // $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        //     // } else {
        //     //     children.show('fast');
        //     //     // $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        //     // }
        //     console.log(child.style.visibility);
        //     console.log(child.style.display);
        //     console.log(child);

        //     if (child.style.display === "" || child.style.display === undefined || child.style.display === "block") {
        //         child.style.display = "none";
        //     } else {
        //         child.style.display = "block";
        //     }
        //     e.stopPropagation();
        // });


    }

    $(".loopElement").children(".mappingElement").each(function () {
        var loopElement = this;
        console.log(loopElement);

        loopElement.addEventListener("click", function (e) {
            // console.log(e.currentTarget.children);
            // console.log($(this).find("ul")[0])
            // var children = $(this).parent('li.parent_li').find(' > ul > li');
            // var child = e.currentTarget.children[0];
            var parent = $(this).parent()
            var icon = parent.find("i")[0];

            var child = parent.find("ul")[0];
            // console.log(child.style.visibility);
            // console.log(child.style.display);
            // console.log(child);

            if (child.style.display === "" || child.style.display === undefined || child.style.display === "block") {
                child.style.display = "none";
                // icon.className = "fas fa-plus fa-1x collapseIcon";
                console.log(icon.classList);
                icon.classList.remove("fa-minus")
                icon.classList.add("fa-plus");
            } else {
                child.style.display = "block";
                // icon.className = "fas fa-minus fa-1x collapseIcon";
                console.log(icon.classList);
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
            }
            e.stopPropagation();
        });
    });
}



function shadeBlendConvert(p, from, to) {
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (from) != "string" || (from[0] != 'r' && from[0] != '#') || (to && typeof (to) != "string")) return null; //ErrorCheck
    if (!this.sbcRip) this.sbcRip = (d) => {
        let l = d.length, RGB = {};
        if (l > 9) {
            d = d.split(",");
            if (d.length < 3 || d.length > 4) return null;//ErrorCheck
            RGB[0] = i(d[0].split("(")[1]), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
        } else {
            if (l == 8 || l == 6 || l < 4) return null; //ErrorCheck
            if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 or 4 digit
            d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = -1;
            if (l == 9 || l == 5) RGB[3] = r((RGB[2] / 255) * 10000) / 10000, RGB[2] = RGB[1], RGB[1] = RGB[0], RGB[0] = d >> 24 & 255;
        } return RGB;
    }
    var i = parseInt, r = Math.round, h = from.length > 9, h = typeof (to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = this.sbcRip(from), t = this.sbcRip(to);
    if (!f || !t) return null; //ErrorCheck
    if (h) return "rgb" + (f[3] > -1 || t[3] > -1 ? "a(" : "(") + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
    else return "#" + (0x100000000 + r((t[0] - f[0]) * p + f[0]) * 0x1000000 + r((t[1] - f[1]) * p + f[1]) * 0x10000 + r((t[2] - f[2]) * p + f[2]) * 0x100 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255)).toString(16).slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2);
}

(function () {
    document.getElementById("mapName").className = "bodName customColor"
    document.getElementById("mapName").style.color = headerColor

    document.getElementById("documentationTitle").style.visibility = "hidden";
    document.getElementById("horizontalLine").style.visibility = "hidden";

    document.getElementById("mapAuthor").style.visibility = "hidden"

    const authorInput = document.getElementById("authorInput")
    authorInput.addEventListener("input", authorUpdate)

    const colorInput = document.getElementById("colorpicker")
    colorInput.addEventListener("input", colorUpdate)

    document.getElementsByClassName("printerDiv")[0].style.visibility = "hidden"

    document.getElementById("logo").style.visibility = "hidden"
    document.getElementById("customerLogo").style.visibility = "hidden"
    document.getElementById("todayDate").style.visibility = "hidden"

    document.getElementById("watermarkDiv").innerHTML = ""

    // $("[data-toggle = 'tooltip']").tooltip();

    // if (window.location.href == "ajayyadukrishnan.github.io") {
    //     var image = document.createElement("img")
    //     image.src = "https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fajayyadukrishnan.github.io%2Fmec-map-documentation-webapp&count_bg=%23632F94&title_bg=%23BB84EF&icon=github.svg&icon_color=%23000000&title=Total+Page+Visits&edge_flat=false"
    //     image.className = "hitCount"
    //     document.getElementsByClassName("left")[0].appendChild(image)
    // } else {
    //     var image = document.createElement("img")
    //     image.src = "https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fdoppio-group.github.io%2Fmec-map-documentation&count_bg=%23643590&title_bg=%23B887E7&icon=github.svg&icon_color=%23000000&title=Total+Page+Visits&edge_flat=false"
    //     image.className = "hitCount"
    //     document.getElementsByClassName("left")[0].appendChild(image)
    // }

    var loopElements = document.getElementsByClassName("loopElement")
    for (let index = 0; index < loopElements.length; index++) {
        // console.log(loopElements[index])
        loopElements[index].removeEventListener("click", () => { })
    }

}());
