function generate_ran_password() 
{
    var low_lett_list = "abcdefghijklmnopqrstuvwxyz";
    var upp_lett_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var num_list = "0123456789";
    var special_list = "!@#$%^&*()_-/+={}|:\\\"'<>,.?";
    var checkbox_list = [];
    var low_lett_checkbox = document.getElementById("low_lett_checkbox");
    var upp_lett_checkbox = document.getElementById("upp_lett_checkbox");
    var num_list_checkbox = document.getElementById("num_list_checkbox");
    var spec_list_checkbox = document.getElementById("spec_list_checkbox");

    if (low_lett_checkbox.checked) 
    {
        checkbox_list.push(low_lett_list);
    }
    if (upp_lett_checkbox.checked) 
    {
        checkbox_list.push(upp_lett_list);
    }
    if (num_list_checkbox.checked) 
    {
        checkbox_list.push(num_list);
    }
    if (spec_list_checkbox.checked) 
    {
        checkbox_list.push(special_list);
    }

    var password_length = document.getElementById("password_length").value;
    password_length = parseInt(password_length);

    if (checkbox_list.length === 0) 
    {
        document.querySelector('.password').textContent = "Please select at least one password character type.";
        return;
    }

    var full_list = checkbox_list.join("");
    var generated_password = generate_password_length(full_list, password_length);

    document.querySelector('.password').textContent = generated_password;
}

function generate_password_length(characters, length) 
{
    var password = "";
    var characters_length = characters.length;

    for (var i = 0; i < length; i++) 
    {
        var random_index = Math.floor(Math.random() * characters_length);
        password += characters[random_index];
    }

    return password;
}