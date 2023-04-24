function generate_ran_password()
{
    var low_lett_list = "abcdefghijklmnopqrstuvwxyz";
    var upp_lett_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var num_list = "0123456789";
    var special_list = "!@#$%^&*()_-+={}|:\\\"'<>,.?";

    // to do: checkbox from user, what var list use to generate a password

    var full_list = low_lett_list + upp_lett_list + num_list + special_list;
    var shuffle_full_list = shuffleString(full_list);
    document.querySelector('.password').textContent = shuffle_full_list;
}
function shuffleString(str) 
{
    let arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) 
    {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}