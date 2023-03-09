Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = (today - onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};

const sendForm = (id) => {
  const form = document.getElementById(id);
  form.submit();
};

const loadFile = async (path) => {
  console.log(path);
  const file = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const json = await file.json();
  return json;
};

const isNumeric = (num) => {
  return !isNaN(num);
};

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const fetchStats = async (userID) => {
  try {
    if (!userID) return undefined;
    let userPurchases = await loadFile(`${serverURL}/purchases/${userID}`);
    if (!userPurchases) return undefined;
    userPurchases = userPurchases.reverse();
    const currentDate = new Date();
    const purchases = {
      lastweek: userPurchases.filter((purchase) => {
        const purchaseDate = new Date(purchase.createdAt);
        return (
          purchaseDate.getFullYear() === currentDate.getFullYear() &&
          purchaseDate.getWeek() === currentDate.getWeek()
        );
      }),
      lastmonth: userPurchases.filter((purchase) => {
        const purchaseDate = new Date(purchase.createdAt);
        return (
          purchaseDate.getFullYear() === currentDate.getFullYear() &&
          purchaseDate.getMonth() === currentDate.getMonth()
        );
      }),

      all: userPurchases,
    };

    return purchases;
  } catch (err) {
    console.error(err);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate;
};
