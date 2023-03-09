const drawStats = (selector, periods, stats, fields) => {
  console.log(stats);
  for (let period of periods) {
    const element = document.querySelector(
      `[data-role="${selector}"][data-period="${period}"]`
    );
    element.innerHTML = "";
    let toRender = "";
    for (let field of Object.keys(fields)) {
      const periodStats = stats[period];
      console.log(periodStats);
      const func = fields[field];
      const stat = func(periodStats);
      const result = `<h3>${field}</h3>
			<span>${stat}</span>`;
      toRender += result;
    }

    element.innerHTML = toRender;
  }
};

const renderStats = async () => {
  const stats = await fetchStats("123");
  drawStats("purchases-info", ["lastweek", "lastmonth"], stats, {
    "Total gastat": (data) => {
      const sum = data.reduce((a, b) => a.total + b.total);
      if (isNaN(sum)) return data[0].total;
      return sum;
    },
    "Número de compres": (data) => {
      return data.length;
    },
    "Compra més gran": (data) => {
      const biggestPurchase = data.sort((a, b) => b.total - a.total)[0];
      if (!biggestPurchase) return "";
      if (!biggestPurchase.shop) return "";
      return biggestPurchase.shop.name || "No disponible";
    },
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  renderStats();
});
