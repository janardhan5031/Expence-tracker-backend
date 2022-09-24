//


document.getElementById('reset_btn').addEventListener('click',(e)=>{
    e.preventDefault();
    const new_pswd = document.getElementById('new_pswd').value;
    const confirm_pswd = document.getElementById('confirm_pswd').value;

    console.log(new_pswd,confirm_pswd)
})



/*
const newPswd = document.getElementById('new_pswd').value;
const confirm_pswd = document.getElementById('confirm_pswd').value;

document.getElementById('reset_btn').addEventListener('click',(e)=>{
    e.preventDefault();
    const url = window.location.href;
    console.log(newPswd,confirm_pswd)
    if(newPswd===confirm_pswd){
        axios.post(url,{new_password:newPswd})
        .then(result =>{
            window.alert(result.data.msg);
        })
        .catch(err=>console.log(err));
    }else{
        window.alert('both passwords are not matched. pls check again')
    }
    
})*/