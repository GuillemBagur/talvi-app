const sendForm = id => {
  const form = document.getElementById(id);
  form.submit();
}

const loadFile = async path => {
    const file = await fetch(path, 
      {headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }});
    const json = await file.json();
    return json;
}

const loadWords = async () => await loadFile("data/words.json");


const isNumeric = num => {
  return !isNaN(num);
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const fetchStats = async (userID) => {
  try {
    if(!userID) return undefined;
    const res = await loadFile(`${serverURL}/purchases/${userID}`);
    const userPurchases = await res.json();
    if(!userPurchases) return undefined;
    const currentDate = new Date();
    const purchases = {
      lastWeek: userPurchases.filter(purchase => purchase.date > currentDate-7),
      lastMonth: userPurchases.filter(purchase => purchase.date.getFullYear() === currentDate.getFullYear() && purchase.date.getMonth() === currentDate.getMonth()),
      lastYear: userPurchases.filter(purchase => purchase.date.getFullYear() === currentDate.getFullYear())
    };

    return purchases;
  } catch(err) {
    console.error(err);
  }
  

}