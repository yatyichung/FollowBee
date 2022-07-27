$(document).ready(function() {
    //set onclick function
      $(".category").click(function(){
        //hide other content except the content that matches with the category attribute
        $(".category-content").hide();
        //reference: https://stackoverflow.com/questions/10578566/jquery-this-id-return-undefined
        $("#category"+$(this).attr("num")).show();
        $(this).css({"background-color": "#f8d151","box-shadow": "0 2px 5px rgba(87, 87, 87, 0.2)", "font-weight": "bold"});
        $(this).siblings().css({"background-color": "transparent", "box-shadow": "none", "font-weight": "normal"});

      });
      
    });