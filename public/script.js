$(function(){
    $('#searchSite').on('click', function() {
        $.ajax({
            url: '/sites',
            success: function(response) {
                console.log('clicked', response.results1);
                // response.results1.forEach(function( eachResult){
                //     console.log(results1.S_name);
                // });  
            }
        });
             
    });
    $('#searchSite').on('keyup', function() {
        console.log('user is typing...');
        var searchSiteInput = document.getElementById('searchSite').value;
        console.log(searchSiteInput);
        if (searchSiteInput.length == 0){
            clearSiteDetails();
            $.ajax({
                url: '/site_details',
                success: function(response) {
                    // response.results1.forEach(function( eachResult){
                    //     console.log(results1.S_name);
                    // });  
                }
            });            
        }if (searchSiteInput.length > 0){
            //clear site details
            clearSiteDetails();
            console.log('searching for records...')
        }
    });
    $('button[name=save]').on('click',function(event){
        event.preventDefault();
        console.log(event.toElement.parentElement.querySelector('[name=site_name]').value)
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
        console.log('Deleted the record' + event.toElement.parentElement.querySelector('[name=site_name').value )
    });
    $('button[name=add]').on('click',function(event){
        event.preventDefault();
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


        var sAddressTextBox = document.createElement('input')
        sAddressTextBox.setAttribute("type","text")
        sAddressTextBox.setAttribute("class","form-control")
        sAddressTextBox.setAttribute("name","site_address")

        var addRecordButton = document.createElement('button')
        addRecordButton.setAttribute("id", "addNewSiteRecord")
        addRecordButton.setAttribute("type", "submit")
        addRecordButton.setAttribute("class", "btn btn-primary")
        addRecordButton.innerHTML="Submit"

        baseClassJumbotron.appendChild(sNameLable)
        baseClassJumbotron.appendChild(sNameTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(sAddressLable)
        subBase.appendChild(sAddressTextBox)
        baseClassJumbotron.appendChild(subBase)
        subBase.appendChild(employerNameLable)
        subBase.appendChild(employerName)
        baseClassJumbotron.appendChild(addRecordButton)
    })
    function clearSiteDetails(){
        var myNode = document.getElementsByClassName('jumbotron')
        var mySiteDetailsNode = myNode[0];
        while(myNode.length > 0){
            myNode[0].parentNode.removeChild(myNode[0]);
        }
    }
});
