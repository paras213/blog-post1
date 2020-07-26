function submitDetails()
{
    var city = document.getElementById("City").value;
    var area = document.getElementById("Area").value;
    var category = document.getElementById("Category").value;
    var phone = document.getElementById("Phone").value;

    console.log('selectMobileNumber: ' + phone);
    console.log('selectCity: ' + city);
    console.log('selectArea: ' + area);
    console.log('selectCategory: ' + category);


    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    var customerReqRef = firebase.database().ref().child("CustomerReq").child(dateTime);

    var customerReq =
        {
            "phone": phone,
            "city": city,
            "area": area,
            "category": category
        };

    customerReqRef.set(customerReq, function (error) {
        if (error) {
            console.log(error.code);
            console.log(error.message);
            window.alert("Error: Cannot register. Kindly contact us on whatsapp for queries. Error Message: " + error.message);
}
    }).then(function () {
        console.log('Customer request saved successfully');
        window.location.replace('https://www.meristreet.com/registered');
    }).catch(function () {
        console.log(error.code);
        console.log(error.message);
        window.alert("Error: Cannot register. Kindly contact us on whatsapp for queries. Error Message: " + error.message);
});
    console.log('Saving done');

}