// ----------------- Password Analyzer + Crack Time -----------------
let history = [];

function checkPassword() {
  const password = document.getElementById('passwordInput').value;
  const result = document.getElementById('result');
  if(!password){ result.innerHTML="Please enter a password."; return; }

  let score=0;

  // Length scoring
  if(password.length<6) score+=1;
  else if(password.length<10) score+=2;
  else score+=3;

  // Character variety
  const variety={
    lower:/[a-z]/.test(password),
    upper:/[A-Z]/.test(password),
    number:/[0-9]/.test(password),
    symbol:/[^A-Za-z0-9]/.test(password)
  };
  score += Object.values(variety).filter(v=>v).length*2;

  // Weak patterns penalty
  const weakPasswords=["123456","password","qwerty","111111","letmein"];
  if(weakPasswords.includes(password.toLowerCase())) score=0;
  if(/^(.)\1+$/.test(password)) score=1;
  const seq="abcdefghijklmnopqrstuvwxyz0123456789";
  const pwLower=password.toLowerCase();
  for(let i=0;i<pwLower.length-2;i++){
    if(seq.includes(pwLower.substring(i,i+3))) score-=2;
  }

  // Strength label
  let strength="";
  if(score<=2) strength="Very Weak";
  else if(score<=4) strength="Weak";
  else if(score<=6) strength="Moderate";
  else if(score<=8) strength="Strong";
  else strength="Very Strong";

  // Brute-force estimation
  let charsetSize=0;
  if(variety.lower) charsetSize+=26;
  if(variety.upper) charsetSize+=26;
  if(variety.number) charsetSize+=10;
  if(variety.symbol) charsetSize+=32;

  let attempts=Math.pow(charsetSize,password.length);
  let adjustedAttempts = attempts / (score || 1);
  let seconds = adjustedAttempts/1000000000; // 1B attempts/sec
  let timeEstimate="";
  if(seconds<60) timeEstimate=`${Math.floor(seconds)} seconds`;
  else if(seconds<3600) timeEstimate=`${Math.floor(seconds/60)} minutes`;
  else if(seconds<86400) timeEstimate=`${Math.floor(seconds/3600)} hours`;
  else if(seconds<31536000) timeEstimate=`${Math.floor(seconds/86400)} days`;
  else timeEstimate=`${Math.floor(seconds/31536000)} years`;

  result.innerHTML=`<strong>Password Strength:</strong> ${strength}<br>`;
  result.innerHTML+=`<strong>Estimated Brute-Force Time:</strong> ${timeEstimate}<br>`;

  saveHistory(`Password: ${password} → ${strength}, ${timeEstimate}`);
}

// ----------------- Password Generator -----------------
function generatePassword(length=12){
  const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let pw="";
  for(let i=0;i<length;i++) pw+=chars.charAt(Math.floor(Math.random()*chars.length));
  document.getElementById('passwordInput').value=pw;
  checkPassword();
}

// ----------------- History -----------------
function saveHistory(entry){
  history.push(entry);
  if(history.length>10) history.shift();
  displayHistory();
}
function displayHistory(){
  const histDiv=document.getElementById('history');
  histDiv.innerHTML="<strong>History:</strong><br>"+history.join("<br>");
}

// ----------------- Device Info -----------------
function getDeviceInfo(){
  const result=document.getElementById('result');
  const ua=navigator.userAgent;
  const isAndroid=/Android/i.test(ua);
  let infoText="<strong>Device Info:</strong><br>";
  infoText+=`User Agent: ${ua}<br>`;
  infoText+=`Platform: ${navigator.platform}<br>`;
  infoText+=`Language: ${navigator.language}<br>`;
  infoText+=`Online: ${navigator.onLine}<br>`;
  infoText+=isAndroid?"Android device detected ":"Non-Android device ";
  result.innerHTML+=infoText+"<br>";
}

// ----------------- Network Info -----------------
async function getNetworkInfo(){
  const result=document.getElementById('result');
  let connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  let type=connection?connection.effectiveType:"Unknown";
  let safety=type.includes("wifi")?"Safe ":type.includes("cellular")?"Moderate ":"Unknown";
  try{
    let response=await fetch('https://api.ipify.org?format=json');
    let data=await response.json();
    result.innerHTML+=`<strong>Network Info:</strong><br>Connection: ${type}<br>Public IP: ${data.ip}<br>Safety: ${safety}<br>`;
  }catch(e){ result.innerHTML+="Could not fetch public IP.<br>"; }
}

// ----------------- Cyber Tips -----------------
const tips=[
  "Use strong, unique passwords for every account.",
  "Enable 2-factor authentication wherever possible.",
  "Avoid public Wi-Fi without VPN.",
  "Update apps & system regularly.",
  "Do not click suspicious links.",
  "Do not reuse passwords across accounts.",
  "Use password managers."
];
function showTip(){
  const result=document.getElementById('result');
  const tip=tips[Math.floor(Math.random()*tips.length)];
  result.innerHTML+=`<strong>Cyber Tip:</strong> ${tip}<br>`;
}

// ----------------- Theme Toggle -----------------
function toggleTheme(){ document.body.classList.toggle("dark"); }

// ----------------- Simple Security Quiz -----------------
const quizData=[
  {q:"Use same password on all sites?", a:false},
  {q:"Enable 2FA for your accounts?", a:true},
  {q:"Click suspicious email links?", a:false},
  {q:"Use strong password generator?", a:true},
];
function startQuiz(){
  const quizDiv=document.getElementById('quiz');
  quizDiv.innerHTML="";
  let score=0;
  quizData.forEach((q,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`<strong>Q${i+1}:</strong> ${q.q} <button onclick="answerQuiz(${i},true)">Yes</button> <button onclick="answerQuiz(${i},false)">No</button>`;
    quizDiv.appendChild(div);
  });
  quizDiv.dataset.score=0;
}
function answerQuiz(index,ans){
  const quizDiv=document.getElementById('quiz');
  if(ans===quizData[index].a) quizDiv.dataset.score++;
  if(index===quizData.length-1 || quizDiv.children.length===quizData.length){
    alert(`Quiz Finished! Score: ${quizDiv.dataset.score}/${quizData.length}`);
  }
}
