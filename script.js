$(document).ready(function() {
   
    $("#submit-btn").on("click", function() {
       
        $("#schedule-table tbody").empty();

      
        var selectedDays = [];
        $("input[name='days']:checked").each(function() {
            selectedDays.push($(this).val());
        });

       
        if (selectedDays.length === 0) {
            alert("Please select at least one day.");
            return;
        }

     
        $.ajax({
            url: 'schedule.json', 
            method: "GET",
            success: function(response) {
                console.log("JSON Response:", response);

                if (!response.schedule) {
                    console.error("Missing 'schedule' key in the JSON.");
                    alert("Error: 'schedule' key is missing in the JSON.");
                    return;
                }

                
                var classesByPeriod = {
                    "1": [],
                    "2": [],
                    "3": [],
                    "4": [],
                    "5": [],
                    "6": [],
                    "7": []
                };

               
                response.schedule.forEach(function(item) {
                    if (item.period >= 1 && item.period <= 7) {
                        
                        classesByPeriod[item.period.toString()].push(item);
                    }
                });

               
                for (var period = 1; period <= 7; period++) {
                    var periodClasses = classesByPeriod[period.toString()];

                  
                    if (periodClasses.length === 0) {
                        $("#schedule-table tbody").append("<tr><td colspan='5'>No classes for Period " + period + ".</td></tr>");
                    } else {
                        
                        $("#schedule-table tbody").append("<tr><th colspan='5'>Period " + period + "</th></tr>");

                       
                        periodClasses.forEach(function(item) {
                    
                            var isClassOnSelectedDay = item.days.some(function(day) {
                                return selectedDays.includes(day);
                            });

                          
                            if (isClassOnSelectedDay) {
                                var row = $("<tr>");
                                row.append("<td>" + item.period + "</td>");
                                row.append("<td>" + item.time + "</td>");
                                row.append("<td>" + item.class_name + "</td>");
                                row.append("<td>" + item.teacher + "</td>");
                                row.append("<td>" + item.room + "</td>");
                                $("#schedule-table tbody").append(row);
                            }
                        });
                    }
                }
            },
            error: function(xhr, status, error) {
               
                console.error("AJAX Error:", status, error);
                alert("Error loading schedule data.");
            }
        });
    });
});

  