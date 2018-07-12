$(function(){
        
        //$.ajax({
        //    url: '/sites',
        //    success: function(response) {
        //        console.log('clicked', response.results1);
        //        // response.results1.forEach(function( eachResult){
        //        //    console.log(results1.S_name);
        //        // });  
        //    }
        //});
             
    $('#searchSite').on('keyup', function() {
        console.log('user is typing...');
        var searchSiteInput = document.getElementById('searchSite').value;
        console.log(searchSiteInput);
        if (searchSiteInput.length == 0){
            clearSiteDetails();  
            $.ajax({
                url: '/sites',
                success: function(response) {
                    response.results1.forEach(function(eachResult){
                        DisplayRecord(eachResult);
                    })
                }
            });     
        }
        if (searchSiteInput.length > 0){
            //clear site details
            clearSiteDetails();
            console.log('searching for records...')
            $.ajax({
                url: '/sites',
                success: function(response) {
                    //console.log('All the Sites records ', response.results1);
                    response.results1.forEach(function(eachResult){
                        let siteName = eachResult.S_name;
                        if(searchSiteInput === siteName){
                            console.log("Site Name is : ", siteName)
                            DisplayRecord(eachResult);
                        }
                    });
                    // response.results1.forEach(function( eachResult){
                    //     console.log(results1.S_name);
                    // });  
                }
            });  
        }
    });
    
    $('button[name=update]').on('click',function(event){
        event.preventDefault();
        console.log(event.toElement.parentElement.querySelector('[name=site_name]').value)
        /*
        $.ajax({
            url: '/updateSite',
            success: function(response) {
                console.log(response);
            }
        });
        /*  */
    });
    $('button[name=delete]').on('click',function(event){
        event.preventDefault();
        console.log('Deleted the record ' + event.toElement.parentElement.querySelector('[name=site_name').value )
    });
    $('button[name=add]').on('click',function(event){
        event.preventDefault();
        clearSiteDetails();
        var formNode = document.getElementById('mainForm')
        
        var addSiteRecordFrom = document.createElement('form')
        addSiteRecordFrom.setAttribute("id","addSiteRecordForm")
        addSiteRecordFrom.setAttribute("method","POST")
        addSiteRecordFrom.setAttribute("action","/addNewSiteRecord")

        var baseClassJumbotron = document.createElement('div')
        baseClassJumbotron.setAttribute("class", "jumbotron")
        baseClassJumbotron.setAttribute("id","addNewSiteRecord")

        var sNameLable = document.createElement('lable')
        sNameLable.innerHTML = "Site Name"

        var sNameTextBox = document.createElement('input')
        sNameTextBox.setAttribute("type","text")
        sNameTextBox.setAttribute("class","form-control")
        sNameTextBox.setAttribute("name","site_name1")

        var subBase = document.createElement('div')
        subBase.setAttribute("class", "form-group")
        
        var sAddressLable = document.createElement('lable')
        sAddressLable.innerHTML = "Site Address"

        var employerNameLable = document.createElement('lable')
        employerNameLable.innerHTML = "Employer Name"

        var employerName = document.createElement('input')
        employerName.setAttribute("type","text")
        employerName.setAttribute("class","form-control")
        employerName.setAttribute("name","employer_name")


        var sAddressTextBox = document.createElement('input')
        sAddressTextBox.setAttribute("type","text")
        sAddressTextBox.setAttribute("class","form-control")
        sAddressTextBox.setAttribute("name","site_address")

        var addRecordButton = document.createElement('button')
        addRecordButton.setAttribute("id", "addNewSiteRecord")
        addRecordButton.setAttribute("name","addNewSiteRecord")
        addRecordButton.setAttribute("type", "submit")
        addRecordButton.setAttribute("class", "btn btn-primary")
        addRecordButton.innerHTML="Submit"
        addRecordButton.addEventListener('click',addNewRecord)

        var cancelButton = document.createElement('button')
        cancelButton.setAttribute("id", "cancel")
        cancelButton.setAttribute("name","cancel")
        cancelButton.setAttribute("type", "submit")
        cancelButton.setAttribute("class", "btn btn-primary")
        cancelButton.innerHTML="Cancel"
        cancelButton.addEventListener('click',cancel)

        formNode.appendChild(addSiteRecordFrom)
        addSiteRecordFrom.appendChild(baseClassJumbotron)
        baseClassJumbotron.appendChild(sNameLable)
        baseClassJumbotron.appendChild(sNameTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(sAddressLable)
        subBase.appendChild(sAddressTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(employerNameLable)
        subBase.appendChild(employerName)
        baseClassJumbotron.appendChild(addRecordButton)
        baseClassJumbotron.appendChild(cancelButton)
    });
    $('button[name=addNewSiteRecord]').on('click',function(event){
        event.preventDefault();
        console.log('Adding a new record to the DB')
    });
    function addNewRecord(event){
        event.preventDefault();
        var siteName = event.toElement.parentElement.querySelector('[name=site_name1').value
        var siteAddress = event.toElement.parentElement.querySelector('[name=site_address').value
        var employerName = event.toElement.parentElement.querySelector('[name=employer_name').value

        console.log(siteName,siteAddress,employerName)
        $.ajax({
            url: '/addNewSiteRecord',
            method: 'POST',
            contetntType: 'application/json',
            data: JSON.stringify({siteName: siteName, siteAddress: siteAddress, employerName: employerName}),
            success: function(response) {
                console.log(response);
            }
        });
    }
    function cancel(event){
        console.log("clicked cancel")
        event.preventDefault();
        displayALlSiteRecords();
    }
    function clearSiteDetails(){
        var myNode = document.getElementsByClassName('jumbotron')
        var mySiteDetailsNode = myNode[0];
        while(myNode.length > 0){
            myNode[0].parentNode.removeChild(myNode[0]);
        }
    }
    function displayALlSiteRecords(){
        clearSiteDetails();  
        $.ajax({
            url: '/sites',
            success: function(response) {
                response.results1.forEach(function(eachResult){
                    DisplayRecord(eachResult);
                })
            }
        });  
    }
    function DisplayRecord(obj){
        var formNode = document.getElementById('mainForm')
        
        var baseClassJumbotron = document.createElement('div')
        baseClassJumbotron.setAttribute("class", "jumbotron")
        
        formNode.appendChild(baseClassJumbotron)

        var sNameLable = document.createElement('lable')
        sNameLable.innerHTML = "Site Name"

        var sNameTextBox = document.createElement('input')
        sNameTextBox.setAttribute("type","text")
        sNameTextBox.setAttribute("class","form-control")
        sNameTextBox.setAttribute("name","site_name")
        sNameTextBox.setAttribute("value",obj.S_name)

        var subBase = document.createElement('div')
        subBase.setAttribute("class", "form-group")
        
        var sAddressLable = document.createElement('lable')
        sAddressLable.innerHTML = "Site Address"

        var employerNameLable = document.createElement('lable')
        employerNameLable.innerHTML = "Employer Name"

        var employerName = document.createElement('input')
        employerName.setAttribute("type","text")
        employerName.setAttribute("class","form-control")
        employerName.setAttribute("name","site_address")
        employerName.setAttribute("value",obj.FK_E_Name)

        var sAddressTextBox = document.createElement('input')
        sAddressTextBox.setAttribute("type","text")
        sAddressTextBox.setAttribute("class","form-control")
        sAddressTextBox.setAttribute("name","site_address")
        sAddressTextBox.setAttribute("value",obj.S_address)

        var updateButton = document.createElement('button')
        updateButton.setAttribute("name", "update")
        updateButton.setAttribute("type", "submit")
        updateButton.setAttribute("class", "btn btn-primary")
        updateButton.innerHTML="Update"

        var deleteButton = document.createElement('button')
        deleteButton.setAttribute("id", "deleteSiteRecord")
        deleteButton.setAttribute("type", "submit")
        deleteButton.setAttribute("class", "btn btn-primary")
        deleteButton.innerHTML="Delete"

        baseClassJumbotron.appendChild(sNameLable)
        baseClassJumbotron.appendChild(sNameTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(sAddressLable)
        subBase.appendChild(sAddressTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(employerNameLable)
        subBase.appendChild(employerName)
        baseClassJumbotron.appendChild(updateButton) 
        baseClassJumbotron.appendChild(deleteButton)
    }
});
