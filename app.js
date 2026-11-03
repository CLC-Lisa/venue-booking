'use strict';
const $=id=>document.getElementById(id);
const key='venue-booking-demo-v1';
const rooms=['大堂','接待室','喜樂廳'];
let records=[];
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved)) records=saved.filter(r=>r&&typeof r.id==='string'&&rooms.includes(r.room)&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&/^\d{2}:\d{2}$/.test(r.start)&&/^\d{2}:\d{2}$/.test(r.end)&&typeof r.purpose==='string');}catch{$('message').textContent='無法讀取本機紀錄，請確認瀏覽器允許儲存。';}
const today=new Date();const localDate=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
$('date').min=localDate;$('date').value=localDate;
function selectRoom(room){$('room').value=room;document.querySelectorAll('.space').forEach(b=>{const active=b.dataset.room===room;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});}
document.querySelectorAll('.space').forEach(b=>b.addEventListener('click',()=>selectRoom(b.dataset.room)));
$('room').addEventListener('change',()=>selectRoom($('room').value));
function save(next){try{localStorage.setItem(key,JSON.stringify(next));records=next;render();return true;}catch{$('message').textContent='儲存失敗：瀏覽器未允許儲存或空間不足。';return false;}}
function render(){const list=$('records');list.replaceChildren();if(!records.length){const p=document.createElement('p');p.className='muted';p.textContent='尚無示範登記，從左側試填開始。';list.append(p);return;}[...records].sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)).forEach(r=>{const card=document.createElement('div');card.className='record';const title=document.createElement('strong');title.textContent=r.room+' · '+r.purpose;const time=document.createElement('p');time.textContent=r.date+' / '+r.start+'–'+r.end;const remove=document.createElement('button');remove.className='textbutton';remove.textContent='刪除此筆示範';remove.setAttribute('aria-label','刪除 '+r.purpose);remove.onclick=()=>{if(save(records.filter(x=>x.id!==r.id)))$('message').textContent='已刪除示範登記。';};card.append(title,time,remove);list.append(card);});}
$('booking').addEventListener('submit',e=>{e.preventDefault();const room=$('room').value,date=$('date').value,start=$('start').value,end=$('end').value,purpose=$('purpose').value.trim();if(!purpose||date<localDate||start>=end){$('message').textContent='請填寫活動名稱，並確認日期及結束時間晚於開始時間（限當日使用）。';return;}if(records.some(r=>r.room===room&&r.date===date&&start<r.end&&end>r.start)){$('message').textContent='此瀏覽器已有相同場地的重疊時段，請調整時間。';return;}if(save([...records,{id:crypto.randomUUID(),room,date,start,end,purpose}])){$('message').textContent='已儲存本機示範，尚未送出正式預約。';$('purpose').value='';}});
$('clear').onclick=()=>{if(records.length&&confirm('確定清除這個瀏覽器的全部示範紀錄？'))if(save([]))$('message').textContent='已清除全部示範紀錄。';};render();
