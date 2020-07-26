var cityArea = {};
cityArea['Bhopal'] = ['Arera Colony', 'Bairagarh', 'Berasia Road', 'Bittan Market', 'Govind Pura',
    'Habib Ganj', 'Hamidia Road', 'Hoshangabad Road', 'Indrapuri', 'Jahangirabad', 'Jawahar Chowk',
    'Koh E Fiza', 'Kolar Road', 'Malviya Nagar', 'Marvadi Road', 'MP Nagar', 'Peer Gate', 'Raisen Road',
    'Shahpura', 'Shivaji Nagar', 'Sultania Road', 'TT Nagar'];
cityArea['Kanpur'] = ['Arya Nagar', 'Ashok Nagar', 'Azad Nagar', 'Bhauti', 'Barra', 'Chowk Sarafa',
    'Chunni Ganj', 'Civil Lines', 'Darshan Purwa', 'Defence Colony', 'Fazalganj', 'Ghumni Bazar',
    'G.T. Road', 'Govind Nagar', 'Indira Nagar', 'Indrapuri Road', 'Harjinder Nagar', 'Harsh Nagar',
    'Jawahar Nagar', 'Kakadev', 'Kalpi Road', 'Kalyanpur', 'Kaushal Puri', 'Kidwai Nagar', 'Koyla Nagar',
    'Khalasi Line', 'Lajpat Nagar', 'Lakhanpur', 'Lal Bangla', 'Mall Road', 'Nirala Nagar', 'Naubasta',
    'Nayaganj', 'Pandu Nagar', 'Panki', 'Ratan Lal Nagar', 'Saket Nagar', 'Sarvodaya Nagar', 'Shastri Nagar',
    'Shyam Nagar', 'Swaroop Nagar', 'Shanti Nagar', 'Sharda Nagar', 'Singhpur', 'Vikas Nagar', 'Vishnupuri',
    'Yashoda Nagar', 'Tatya Tope Nagar', 'Tilak Nagar', 'VIP Road'];

function cityChanged() {
    var cityList = document.getElementById("city");
    var areaList = document.getElementById("area");
    var selectCity = cityList.options[cityList.selectedIndex].value;
    while (areaList.options.length) {
        areaList.remove(0);
    }
    var areaOptions = cityArea[selectCity];
    if (areaOptions) {
        var i;
        for (i = 0; i < areaOptions.length; i++) {
            var cat = new Option(areaOptions[i], i);
            areaList.options.add(cat);
        }
    }
}

function saveDetails() {
    var mobileNumber = document.getElementById("mobileNumber");
    var phone_message = document.getElementById("phone_message");
    var cityList = document.getElementById("city");
    var areaList = document.getElementById("area");
    var categoryList = document.getElementById("category");

    if(mobileNumber.value.length !== 10)
    {
        console.log('Incorrect Phone Number: ' + mobileNumber.value);
        var badColor = "#FF6347";
        mobileNumber.style.backgroundColor = badColor;
        phone_message.style.color = badColor;
        phone_message.innerHTML = "Require 10 digits!"
        return;
    }
    else {
        var selectMobileNumber = mobileNumber.value;
        var selectCity = cityList.options[cityList.selectedIndex].value;
        var selectArea = areaList.options[areaList.selectedIndex].text;
        var selectCategory = categoryList.options[categoryList.selectedIndex].value;

        console.log('selectMobileNumber: ' + selectMobileNumber);
        console.log('selectCity: ' + selectCity);
        console.log('selectArea: ' + selectArea);
        console.log('selectCategory: ' + selectCategory);


        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var customerReqRef = firebase.database().ref().child("CustomerReq").child(dateTime);
        var customerReq =
            {
                "phone": selectMobileNumber,
                "city": selectCity,
                "area": selectArea,
                "category": selectCategory
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
    }
}

