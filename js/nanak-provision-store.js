$(document).ready(function () {
    var counter = 0;

    $("#add_row").on("click", function () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td><input type="text" class="form-control input-md" name="product_name' + counter + '"/></td>';
        cols += '<td><input type="text" class="form-control input-md" name="product_quantity' + counter + '"/></td>';
        cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger" value="X"></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
    });

    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });
});

var flag, phoneNumber;
var pod_name = [];
var quantity = [];
var name_counter = 0;
var quantity_counter = 0;

function placeOrder()
{
    flag = false;
    var user = firebase.auth().currentUser;
    if (user) {
        firebase.auth().signOut().then(function () {
            console.log('User was signed in. Sign-out successful');
        }).catch(function (error) {
            console.log('User is signed in. Could not sign out successfully');
            console.log(error.code);
            console.log(error.message);
        });
    }

    var mobile = document.getElementById("phone_number");
    var phone_message = document.getElementById('phone_message');
    var pname = document.getElementById("p_name");
    var product_message = document.getElementById('product_message');
    pod_name = [];
    quantity = [];
    name_counter = 0;
    quantity_counter = 0;

    var check = false;
    $("table.order-list").find('input[name^="product_name"]').each(function () {
        pod_name[name_counter++] = $(this).val();
        if($(this).val().localeCompare("") !== 0)
        {
            check = true;
        }
    });
    console.log(pod_name);
    $("table.order-list").find('input[name^="product_quantity"]').each(function () {
        quantity[quantity_counter++] = $(this).val();
        if($(this).val().localeCompare("") !== 0)
        {
            check = true;
        }
    });
    console.log(quantity);

    if(mobile.value.length !== 10)
    {
        console.log('Incorrect Phone Number: ' + mobile.value);
        var badColor = "#FF6347";
        mobile.style.backgroundColor = badColor;
        phone_message.style.color = badColor;
        phone_message.innerHTML = "Require 10 digits!"
    }
    else if(!check)
    {
        console.log('Empty Order');
        var badColor = "#FF6347";
        pname.style.backgroundColor = badColor;
        product_message.style.color = badColor;
        product_message.innerHTML = "Require atleast 1 product!"
    }
    else
    {
        phoneNumber = '+91'+mobile.value;
        console.log('Phone Number: ' + phoneNumber);
        firebase.auth().signInAnonymously().then(function ()
        {
            flag = true;
        }).catch(function(error) {
            console.log('Could not sign in anonymously');
            console.log(error.code);
            console.log(error.message);
            window.alert("Error: Cannot place order. Kindly contact +91 9151636015 for queries. Error Message: " + error.message);
        });
    }
}

//This function runs everytime the auth state changes. Use to verify if the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("USER LOGGED IN")
        if (flag) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var storeId = "0lZbMXmM2pRDDZd9vqNDl5nGeZq2";
            var phoneNumber = '+91' + document.getElementById("phone_number").value;
            var userName = document.getElementById("user_name").value;
            var orderRef = firebase.database().ref().child("Order").child(storeId).child(dateTime);
            var adminCartRef = firebase.database().ref().child("AdminCart").child(storeId).child(dateTime);
            var order =
                {
                    "phone": phoneNumber,
                    "pickupDate": "",
                    "pickupTime": "",
                    "state": "accepted",
                    "totalAmount": "",
                    "userName": userName
                };
            orderRef.set(order, function (error) {
                if (error) {
                    console.log(error.code);
                    console.log(error.message);
                    window.alert("Error: Cannot place order. Kindly contact +91 9151636015 for queries. Error Message: " + error.message);
                }
            }).then(function () {
                var cart = '{';
                var product_counter = 0;
                for(product_counter; product_counter < name_counter ; )
                {
                    if(pod_name[product_counter].localeCompare("") === 0 && quantity[product_counter].localeCompare("") === 0)
                    {
                        product_counter++;
                    }
                    else
                    {
                        break;
                    }
                }
                if (product_counter < name_counter)
                {
                    cart += ' "' + product_counter + '" : {'
                        + ' "image" : "", '
                        + ' "name" : "' + pod_name[product_counter] + '", '
                        + ' "pid" : "' + product_counter + '", '
                        + ' "price" : "", '
                        + ' "quantity" : "' + quantity[product_counter] + '"'
                        + '}';

                    product_counter++;
                }
                for (product_counter ; product_counter < name_counter; product_counter++)
                {
                    if(pod_name[product_counter].localeCompare("") === 0 && quantity[product_counter].localeCompare("") === 0)
                    {
                        continue;
                    }
                    else
                    {
                        cart += ', "' + product_counter + '" : {'
                            + ' "image" : "", '
                            + ' "name" : "' + pod_name[product_counter] + '", '
                            + ' "pid" : "' + product_counter + '", '
                            + ' "price" : "", '
                            + ' "quantity" : "' + quantity[product_counter] + '"'
                            + '}';
                    }
                }
                cart += '}';
                console.log(JSON.parse(cart));
                adminCartRef.set(JSON.parse(cart), function (error) {
                    if (error) {
                        console.log(error.code);
                        console.log(error.message);
                        window.alert("Error: Cannot place order. Kindly contact +91 9151636015 for queries. Error Message: " + error.message);
                    }
                }).then(function () {
                    firebase.auth().signOut().then(function () {
                        console.log('Sign-out successful');
                        flag = false;
                        window.location.replace('https://www.meristreet.com/success');
                    }).catch(function (error) {
                        console.log('Could not sign out successfully');
                        console.log(error.code);
                        console.log(error.message);
                    });
                });

            }).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                window.alert("Error: Cannot place order. Kindly contact +91 9151636015 for queries. Error Message: " + error.message);
            });
        }
    } else {
        // No user is signed in.
        console.log("USER NOT LOGGED IN");
    }
});