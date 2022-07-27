window.onload = function (){
    //retrieve HTML elements through DOM
    var formHandle = document.forms.searchForm;
    var inputCity = searchForm.city;
    var warningTest = document.getElementById("warning");
    // document.getElementById("hello").src = "https://magsbc.com/wp-content/uploads/2022/07/placeholder.png"



    //set variables
    /*
        check if a string contain number reference:
        https://dev.to/melvin2016/how-to-check-if-a-string-contains-at-least-one-number-using-regular-expression-regex-in-javascript-3n5h
    */
    var numRegex = /\d/;


    if(imageNull == "" ||  imageNull == undefined||imageNull == null){
        imageNull= "https://www.cityworks.com/wp-content/uploads/2022/05/placeholder.png";
    }
    //====FORM VALIDATION====
    //call submitForm function
    formHandle.onsubmit = submitForm;
    function submitForm(){
        //if the input is null or empty, it'll display warning message
        if(inputCity.value == null || inputCity.value == "" ){
            warningTest.style.display = "block";
            warningTest.innerHTML = "Error: empty input.";
            inputCity.focus();
            return false;
        } else if (numRegex.test(inputCity.value)){
            warningTest.style.display = "block";
            warningTest.innerHTML = "Error: input shouldn't contain number(s).";
            inputCity.focus();
            return false;
        }   
    }   
}
     