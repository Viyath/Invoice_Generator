$(function(){
    $('#addshift').on('click', function(){
        var dayOfWeek = document.getElementById('day'); 
        switch (dayOfWeek) {                    
            case "Monday":
                $("#day").val("Tuesday");                 
                break;
            case "Tuesday":
                $("#day").val("Wednesday");
                break;
            case "Wednesday":
                $("#day").val("Thursday");
                break;
            case "Thursday":
                $("#day").val("Friday");
                break;
            case "Friday":
                $("#day").val("Saturday");
                break;
            case "Saturday":
                $("#day").val("Sunday");
                break;
            case "Sunday":
                $("#day").val("Monday");
                break;    
        }
    });
});
/*    
    var usernameAddButton = $('button[name="addshift"]');
    
    usernameAddButton.click(function () {
        
        $("#worked_time").val(getTimeDifference());
            
    })
    $("#start_time").keyup(function(){
        var fieldValue = document.getElementById("start_time").value;  
        valLen = fieldValue.length;
        if(valLen === 2){
            fieldValue = fieldValue + ":";
            $("#start_time").val(fieldValue);
        }
        
    });
    $("#end_time").keyup(function(){
        var fieldValue = document.getElementById("end_time").value;  
        valLen = fieldValue.length;
        if(valLen === 2){
            fieldValue = fieldValue + ":";
            $("#end_time").val(fieldValue);
        }
        
    });
    function getTimeDifference(){
        var startTime = document.getElementById("start_time").value;
        var endTime = document.getElementById("end_time").value;
        var startHour = startTime.slice(0,2);
        var endHour = endTime.slice(0,2);
        console.log(startHour," & ",endHour);
        if(startHour <= endHour){
            var startMinute = startTime.slice(3,5);
            var endMinute = endTime.slice(3,5);
            console.log(startMinute," & ",endMinute);
            var timeWorked = ((endHour - startHour) + (endMinute + (60 - startMinute)));
        } 
        return timeWorked;
    }
