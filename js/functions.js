const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i];
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
      }
    }
    return arr[t.length][s.length];
  };




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
    const res = await fetch(`${serverURL}/purchases/${userID}`);
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