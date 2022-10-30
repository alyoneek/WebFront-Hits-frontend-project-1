$(document).ready(function() {
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImUiLCJlbWFpbCI6ImFhYUBleGFtcGxlLmNvbSIsIm5iZiI6MTY2NzA5NzY5NiwiZXhwIjoxNjY3MTAxMjk2LCJpYXQiOjE2NjcwOTc2OTYsImlzcyI6Imh0dHBzOi8vcmVhY3QtbWlkdGVybS5rcmVvc29mdC5zcGFjZS8iLCJhdWQiOiJodHRwczovL3JlYWN0LW1pZHRlcm0ua3Jlb3NvZnQuc3BhY2UvIn0.4UIJKRReMH_iEXFc1VX6kJmBYvWbmZuw47CdGbaHKq4`
        }
    })
    .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then(data => {
        let profileDetails = $("#profile-details");
        profileDetails.find(".nickName").text(data.nickName);
        profileDetails.find("#email").val(data.email);
        profileDetails.find("#avatarLink").val(data.avatarLink);
        profileDetails.find("#name").val(data.name);
        profileDetails.find("#birthDate").val(new Date(data.birthDate).toLocaleDateString().split('.').reverse().join('-'));
        //console.log(new Date(data.birthDate).toLocaleDateString().split('.').reverse().join('-'))
        profileDetails.find("#gender").val(data.gender);
    })
    .catch(error => console.log(error));
});