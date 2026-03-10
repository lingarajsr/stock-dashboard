const stocks=[

{name:"Apple",symbol:"AAPL",price:150,change:2},
{name:"Tesla",symbol:"TSLA",price:220,change:-1.5},
{name:"Amazon",symbol:"AMZN",price:130,change:0},
{name:"Microsoft",symbol:"MSFT",price:300,change:1.2},
{name:"Google",symbol:"GOOGL",price:2700,change:-0.5}

];

const container=document.getElementById("stockContainer");
const watchlistUI=document.getElementById("watchlist");
const search=document.getElementById("search");

let watchlist=
JSON.parse(localStorage.getItem("watchlist"))||[];

let alerts={};

function renderStocks(data){

container.innerHTML="";

data.forEach(stock=>{

let badge="badge-neutral";

if(stock.change>0)
badge="badge-positive";
else if(stock.change<0)
badge="badge-negative";

let favClass="";

if(watchlist.find(s=>s.symbol===stock.symbol))
favClass="favorite";

const card=`

<div class="col-md-6">

<div class="card stock-card mb-3 shadow-sm ${favClass}">

<div class="card-body">

<h5>

${stock.name}

<span class="star"
onclick="toggleFavorite('${stock.symbol}')">
⭐
</span>

</h5>

<p class="text-muted">${stock.symbol}</p>

<div class="price">$${stock.price}</div>

<span class="badge ${badge}">
${stock.change>0?"+":""}${stock.change}%
</span>

<br><br>

<button class="btn btn-sm btn-info"
onclick="showChart('${stock.symbol}')">
Chart
</button>

<button class="btn btn-sm btn-warning"
onclick="setAlert('${stock.symbol}')">
Alert
</button>

</div>

</div>

</div>

`;

container.innerHTML+=card;

});

}

function toggleFavorite(symbol){

const stock=stocks.find(s=>s.symbol===symbol);

const index=
watchlist.findIndex(s=>s.symbol===symbol);

if(index>-1)
watchlist.splice(index,1);
else
watchlist.push(stock);

localStorage.setItem(
"watchlist",
JSON.stringify(watchlist)
);

renderStocks(stocks);
renderWatchlist();

}

function renderWatchlist(){

watchlistUI.innerHTML="";

if(watchlist.length===0){

document.getElementById("emptyWatchlist")
.style.display="block";

return;

}

document.getElementById("emptyWatchlist")
.style.display="none";

watchlist.forEach(stock=>{

const item=

`<li class="list-group-item">

${stock.name} (${stock.symbol})

<span class="remove-btn"
onclick="toggleFavorite('${stock.symbol}')">
✖
</span>

</li>`;

watchlistUI.innerHTML+=item;

});

}

search.addEventListener("keyup",function(){

const value=search.value.toLowerCase();

const filtered=stocks.filter(stock=>

stock.name.toLowerCase().includes(value) ||

stock.symbol.toLowerCase().includes(value)

);

if(filtered.length===0){

container.innerHTML="";

document.getElementById("noStocks")
.style.display="block";

}

else{

document.getElementById("noStocks")
.style.display="none";

renderStocks(filtered);

}

});

function sortByPrice(){

stocks.sort((a,b)=>b.price-a.price);

renderStocks(stocks);

}

function sortByChange(){

stocks.sort((a,b)=>b.change-a.change);

renderStocks(stocks);

}

let chart;

function showChart(symbol){

const prices=[];

for(let i=0;i<10;i++)
prices.push(Math.random()*100+100);

const ctx=
document.getElementById("stockChart");

if(chart)
chart.destroy();

chart=new Chart(ctx,{

type:"line",

data:{
labels:["1","2","3","4","5","6","7","8","9","10"],
datasets:[{
label:symbol+" Price",
data:prices,
borderColor:"blue",
fill:false
}]
}

});

$('#chartModal').modal('show');

}

function setAlert(symbol){

let price=prompt("Enter alert price");

alerts[symbol]=price;

alert("Alert set for "+symbol);

}

setInterval(()=>{

stocks.forEach(stock=>{

let randomChange=(Math.random()*4-2).toFixed(2);

stock.change=parseFloat(randomChange);

stock.price=
(parseFloat(stock.price)+
parseFloat(randomChange)).toFixed(2);

if(alerts[stock.symbol] &&
stock.price>=alerts[stock.symbol]){

alert(stock.symbol+
" reached alert price!");

delete alerts[stock.symbol];

}

});

renderStocks(stocks);

},5000);

function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

}

renderStocks(stocks);
renderWatchlist();