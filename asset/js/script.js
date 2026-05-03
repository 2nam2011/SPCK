// bai tap 1
let toan = 8;
let van = 7;
let anh = 6;
let dtb = (toan + anh + van);
if(dtb >= 8 && toan >= 6.5 && anh >= 6.5 && van >= 6.5)
{
    console.log("HSG");
}
else if(dtb >= 6.5 && toan >= 5 && anh >= 5 && van >=5)
{
    console.log("HSK");
}
else
{
    console.log("HSTB");
}

// bai tap 2
for(let i = 1; i <= 10; i++)
{
    console.log(i*i);
}