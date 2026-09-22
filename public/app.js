const products=[
{id:'essential',name:'Blackout Essential',type:'baseball',price:45900,desc:'Black / logo bordado'},
{id:'chrome',name:'Chrome Signal',type:'baseball',price:49900,desc:'Silver / reflective'},
{id:'shadow',name:'Shadow Dad Cap',type:'dadcap',price:42900,desc:'Washed black / relaxed'},
{id:'no-signal',name:'No Signal Trucker',type:'trucker',price:47900,desc:'Black / mesh técnico'},
{id:'after-dark',name:'After Dark',type:'dadcap',price:44900,desc:'Graphite / tonal'},
{id:'tactical',name:'Tactical 002',type:'baseball',price:53900,desc:'Black / utility strap'},
{id:'silver-line',name:'Silver Line',type:'dadcap',price:46900,desc:'Steel / logo frontal'},
{id:'urban-mesh',name:'Urban Mesh',type:'trucker',price:45900,desc:'Black / silver mesh'}
];
let cart=JSON.parse(localStorage.getItem('blackout-cart')||'[]');
const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const grid=document.querySelector('#productGrid');
function cap(){return '<div class="mini-cap"></div>'}
function renderProducts(list=products){grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-visual">${cap()}</div><div class="product-info"><span class="price">${money(p.price)}</span><h3>${p.name}</h3><p>${p.desc}</p></div><button class="add" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button></article>`).join('')}
function save(){localStorage.setItem('blackout-cart',JSON.stringify(cart));renderCart()}
function renderCart(){const count=cart.reduce((a,x)=>a+x.quantity,0);document.querySelector('#cartCount').textContent=count;document.querySelector('#drawerCount').textContent=`(${count})`;const el=document.querySelector('#cartItems');if(!cart.length){el.innerHTML='<div class="empty"><p>Tu bag está vacía.</p><a href="#catalogo" class="text-link">Explorar productos →</a></div>'}else el.innerHTML=cart.map(x=>`<div class="cart-row"><div class="product-visual">${cap()}</div><div><h4>${x.name}</h4><p>${money(x.price)}</p><div class="qty"><button data-minus="${x.id}">−</button><span>${x.quantity}</span><button data-plus="${x.id}">+</button></div></div><button class="remove" data-remove="${x.id}">×</button></div>`).join('');const subtotal=cart.reduce((a,x)=>a+x.price*x.quantity,0);document.querySelector('#subtotal').textContent=money(subtotal);document.querySelector('#checkoutBtn').disabled=!cart.length;document.querySelector('#checkoutBtn').style.opacity=cart.length?1:.45}
function openCart(){document.querySelector('#drawer').classList.add('open');document.querySelector('#overlay').classList.add('show')}
function closePanels(){document.querySelector('#drawer').classList.remove('open');document.querySelector('#checkoutModal').classList.remove('open');document.querySelector('#overlay').classList.remove('show')}
renderProducts();renderCart();
grid.addEventListener('click',e=>{const id=e.target.dataset.add;if(!id)return;const p=products.find(x=>x.id===id), item=cart.find(x=>x.id===id);item?item.quantity++:cart.push({...p,quantity:1});save();openCart()});
document.querySelector('#cartItems').addEventListener('click',e=>{const id=e.target.dataset.plus||e.target.dataset.minus||e.target.dataset.remove;if(!id)return;const item=cart.find(x=>x.id===id);if(e.target.dataset.plus)item.quantity++;if(e.target.dataset.minus)item.quantity--;if(e.target.dataset.remove)item.quantity=0;cart=cart.filter(x=>x.quantity>0);save()});
document.querySelector('#cartBtn').onclick=openCart;document.querySelector('#closeCart').onclick=closePanels;document.querySelector('#overlay').onclick=closePanels;
document.querySelectorAll('.filter').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderProducts(btn.dataset.filter==='all'?products:products.filter(p=>p.type===btn.dataset.filter))});
document.querySelector('#sort').onchange=e=>{let list=[...products];if(e.target.value==='low')list.sort((a,b)=>a.price-b.price);if(e.target.value==='high')list.sort((a,b)=>b.price-a.price);renderProducts(list)};
document.querySelector('#checkoutBtn').onclick=()=>{if(cart.length){document.querySelector('#drawer').classList.remove('open');document.querySelector('#checkoutModal').classList.add('open')}};document.querySelector('#closeCheckout').onclick=closePanels;
document.querySelectorAll('.payment').forEach(btn=>btn.onclick=async()=>{const form=document.querySelector('#checkoutForm');if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));const msg=document.querySelector('#checkoutMessage');msg.textContent='Conectando con el medio de pago...';const shipping=cart.reduce((a,x)=>a+x.price*x.quantity,0)>=100000?0:8500;try{const r=await fetch(`/api/checkout/${btn.dataset.pay}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart,customer:data,shipping})});const result=await r.json();if(!r.ok)throw new Error(result.error);window.location.href=result.url}catch(error){msg.textContent=error.message}});
document.querySelector('#newsletter').onsubmit=e=>{e.preventDefault();e.target.innerHTML='<p>Listo. Nos vemos en la oscuridad.</p>'};
