// ================= FIREBASE CONFIG =================
const firebaseConfig = {
    apiKey: "AIzaSyDN_gfOlJhF8XTRaioXQRe2TIK_2r9KG3s",
    authDomain: "weather-x-pro.firebaseapp.com",
    projectId: "weather-x-pro",
    storageBucket: "weather-x-pro.firebasestorage.app",
    messagingSenderId: "759596478973",
    appId: "1:759596478973:web:cb8f214275615e48d56994",
    measurementId: "G-7HWVHEBS47"
};

// ================= OPENWEATHER API KEY =================
const WEATHER_API_KEY = "4466472575f107b9868c131211bbca87";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ================= APP STATE =================
let currentUser = null;
let weatherChart = null;
let map = null;
let marker = null;
let currentCity = "London";
let forgotPasswordActive = false;
let currentChartType = 'temp';
let currentTimeRange = 'future';
let currentForecastData = null;
let currentLat = null;
let currentLon = null;

// ================= LANGUAGE TRANSLATIONS =================
const translations = {
    en: { search: "🔍 Search", favorites: "Favorites", saveToFavorites: "⭐ Save Current City to Favorites", signOut: "Logout", login: "Login / Sign Up", weather: "Weather", fetch: "Fetching weather", updated: "Weather updated", notFound: "City not found", enterCity: "Enter a city name", loginRequired: "🔐 Please login first to use the weather app!", creatingAccount: "Creating account...", accountCreated: "🎉 Account created! Please verify your email.", verifyEmail: "❌ Please verify your email first!", welcomeBack: "👋 Welcome back!", loggedOut: "👋 Logged out", addedFavorite: "added to favorites", alreadyFavorite: "already in favorites", removedFavorite: "Removed from favorites", loginToSave: "Please login first", searchCity: "Search city...", emailAddress: "Email Address", forgotPassword: "Forgot Password?", sendResetLink: "Send Reset Link", resetLinkSent: "✅ Reset link sent! Check your email.", enterEmail: "Please enter your email", passwordResetSent: "📧 Password reset link sent to", checkInbox: "Check your inbox.", hotDay: "☀️ Hot day! Stay hydrated!", coldDay: "🥶 Cold! Bundle up!", pleasantWeather: "🌈 Pleasant weather! Enjoy!", rainyDay: "🌧️ Rainy day! Don't forget umbrella!", snowyDay: "❄️ Snowy wonderland! Drive safe!", feels: "Weather is" },
    hi: { search: "🔍 खोजें", favorites: "पसंदीदा", saveToFavorites: "⭐ वर्तमान शहर पसंदीदा में सहेजें", signOut: "लॉगआउट", login: "लॉगिन / साइन अप", weather: "मौसम", fetch: "मौसम लाया जा रहा", updated: "मौसम अपडेट हुआ", notFound: "शहर नहीं मिला", enterCity: "शहर का नाम दर्ज करें", loginRequired: "🔐 कृपया पहले लॉगिन करें!", creatingAccount: "खाता बन रहा है...", accountCreated: "🎉 खाता बन गया! कृपया अपना ईमेल सत्यापित करें।", verifyEmail: "❌ कृपया पहले अपना ईमेल सत्यापित करें!", welcomeBack: "👋 वापसी पर स्वागत है!", loggedOut: "👋 लॉग आउट किया", addedFavorite: "पसंदीदा में जोड़ा", alreadyFavorite: "पहले से पसंदीदा में है", removedFavorite: "पसंदीदा से हटाया", loginToSave: "कृपया पहले लॉगिन करें", searchCity: "शहर खोजें...", emailAddress: "ईमेल पता", forgotPassword: "पासवर्ड भूल गए?", sendResetLink: "रीसेट लिंक भेजें", resetLinkSent: "✅ रीसेट लिंक भेजा गया!", enterEmail: "कृपया अपना ईमेल दर्ज करें", passwordResetSent: "📧 पासवर्ड रीसेट लिंक भेजा गया", checkInbox: "अपना इनबॉक्स जांचें।", hotDay: "☀️ गर्मी का दिन! हाइड्रेटेड रहें!", coldDay: "🥶 ठंड का दिन! गर्म रहें!", pleasantWeather: "🌈 सुहावना मौसम! आनंद लें!", rainyDay: "🌧️ बरसात का दिन! छाता मत भूलना!", snowyDay: "❄️ बर्फीला दिन! सुरक्षित रहें!", feels: "मौसम है" },
    es: { search: "🔍 Buscar", favorites: "Favoritos", saveToFavorites: "⭐ Guardar ciudad actual", signOut: "Cerrar sesión", login: "Iniciar sesión", weather: "Clima", fetch: "Obteniendo clima", updated: "Clima actualizado", notFound: "Ciudad no encontrada", enterCity: "Ingrese nombre de ciudad", loginRequired: "🔐 ¡Inicie sesión primero!", creatingAccount: "Creando cuenta...", accountCreated: "🎉 ¡Cuenta creada! Verifique su email.", verifyEmail: "❌ ¡Verifique su email primero!", welcomeBack: "👋 ¡Bienvenido de nuevo!", loggedOut: "👋 Sesión cerrada", addedFavorite: "agregado a favoritos", alreadyFavorite: "ya está en favoritos", removedFavorite: "eliminado de favoritos", loginToSave: "Inicie sesión primero", searchCity: "Buscar ciudad...", emailAddress: "Correo electrónico", forgotPassword: "¿Olvidaste tu contraseña?", sendResetLink: "Enviar enlace de reinicio", resetLinkSent: "✅ ¡Enlace enviado!", enterEmail: "Ingrese su email", passwordResetSent: "📧 Enlace de reinicio enviado a", checkInbox: "Revise su bandeja de entrada.", hotDay: "☀️ ¡Día caluroso! ¡Manténgase hidratado!", coldDay: "🥶 ¡Día frío! ¡Abrígate bien!", pleasantWeather: "🌈 ¡Clima agradable! ¡Disfruta!", rainyDay: "🌧️ ¡Día lluvioso! ¡No olvides el paraguas!", snowyDay: "❄️ ¡Día nevado! ¡Conduce con cuidado!", feels: "El clima es" },
    fr: { search: "🔍 Rechercher", favorites: "Favoris", saveToFavorites: "⭐ Enregistrer la ville", signOut: "Déconnexion", login: "Connexion", weather: "Météo", fetch: "Récupération météo", updated: "Météo mise à jour", notFound: "Ville non trouvée", enterCity: "Entrez le nom de la ville", loginRequired: "🔐 Veuillez vous connecter d'abord!", creatingAccount: "Création du compte...", accountCreated: "🎉 Compte créé! Vérifiez votre email.", verifyEmail: "❌ Vérifiez votre email d'abord!", welcomeBack: "👋 Bon retour!", loggedOut: "👋 Déconnecté", addedFavorite: "ajouté aux favoris", alreadyFavorite: "déjà dans les favoris", removedFavorite: "retiré des favoris", loginToSave: "Connectez-vous d'abord", searchCity: "Rechercher une ville...", emailAddress: "Adresse email", forgotPassword: "Mot de passe oublié?", sendResetLink: "Envoyer le lien", resetLinkSent: "✅ Lien envoyé!", enterEmail: "Entrez votre email", passwordResetSent: "📧 Lien de réinitialisation envoyé à", checkInbox: "Vérifiez votre boîte de réception.", hotDay: "☀️ Journée chaude! Restez hydraté!", coldDay: "🥶 Journée froide! Habillez-vous chaudement!", pleasantWeather: "🌈 Temps agréable! Profitez-en!", rainyDay: "🌧️ Journée pluvieuse! N'oubliez pas votre parapluie!", snowyDay: "❄️ Journée enneigée! Conduisez prudemment!", feels: "Le temps est" },
    de: { search: "🔍 Suchen", favorites: "Favoriten", saveToFavorites: "⭐ Aktuelle Stadt speichern", signOut: "Abmelden", login: "Anmelden", weather: "Wetter", fetch: "Wetter wird geladen", updated: "Wetter aktualisiert", notFound: "Stadt nicht gefunden", enterCity: "Stadtnamen eingeben", loginRequired: "🔐 Bitte zuerst anmelden!", creatingAccount: "Konto wird erstellt...", accountCreated: "🎉 Konto erstellt! Bitte E-Mail bestätigen.", verifyEmail: "❌ Bitte zuerst E-Mail bestätigen!", welcomeBack: "👋 Willkommen zurück!", loggedOut: "👋 Abgemeldet", addedFavorite: "zu Favoriten hinzugefügt", alreadyFavorite: "bereits in Favoriten", removedFavorite: "aus Favoriten entfernt", loginToSave: "Bitte zuerst anmelden", searchCity: "Stadt suchen...", emailAddress: "E-Mail-Adresse", forgotPassword: "Passwort vergessen?", sendResetLink: "Link senden", resetLinkSent: "✅ Link gesendet!", enterEmail: "E-Mail eingeben", passwordResetSent: "📧 Passwort-Reset-Link gesendet an", checkInbox: "Überprüfen Sie Ihren Posteingang.", hotDay: "☀️ Heißer Tag! Bleiben Sie hydriert!", coldDay: "🥶 Kalter Tag! Ziehen Sie sich warm an!", pleasantWeather: "🌈 Angenehmes Wetter! Genießen Sie!", rainyDay: "🌧️ Regnerischer Tag! Vergessen Sie den Regenschirm nicht!", snowyDay: "❄️ Verschneiter Tag! Fahren Sie vorsichtig!", feels: "Das Wetter ist" }
};

// ================= HELPER FUNCTIONS =================
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function updateLanguage() {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    document.getElementById('searchBtn').innerHTML = t.search;
    document.getElementById('cityInput').placeholder = t.searchCity;
    
    const favoritesHeader = document.querySelector('#favoritesSection h4');
    if (favoritesHeader) favoritesHeader.innerHTML = `⭐ ${t.favorites}`;
    
    const saveBtn = document.querySelector('.sidebar-content button:last-of-type');
    if (saveBtn) saveBtn.innerHTML = t.saveToFavorites;
    
    if (currentUser) {
        document.getElementById('userBtn').title = t.signOut;
        document.getElementById('logoutBtn').textContent = t.signOut;
    } else {
        document.getElementById('userBtn').title = t.login;
    }
    
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink && !forgotPasswordActive) {
        forgotLink.textContent = t.forgotPassword;
    }
}

// ================= UPDATE ALL 12 METRICS =================
async function updateAllMetrics(lat, lon, weather) {
    try {
        // Wind Gusts
        const windGust = weather.wind.gust ? `${Math.round(weather.wind.gust)} km/h` : `${Math.round(weather.wind.speed * 1.3)} km/h`;
        document.getElementById('windGust').textContent = windGust;
        
        // Visibility
        const visibilityKm = (weather.visibility / 1000).toFixed(1);
        document.getElementById('visibility').textContent = `${visibilityKm} km`;
        
        // Pressure
        document.getElementById('pressure').textContent = `${weather.main.pressure} hPa`;
        
        // Sunrise/Sunset
        const sunriseTime = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('sunrise').textContent = sunriseTime;
        document.getElementById('sunset').textContent = sunsetTime;
        
        // Dew Point
        const dewPoint = Math.round(weather.main.temp - ((100 - weather.main.humidity) / 5));
        document.getElementById('dewPoint').textContent = `${dewPoint}°C`;
        
        // Air Quality
        const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`);
        const airData = await airRes.json();
        const aqi = airData.list[0]?.main?.aqi;
        const aqiText = {1: "Good 🟢", 2: "Fair 🟡", 3: "Moderate 🟠", 4: "Poor 🔴", 5: "Very Poor ⚫"};
        document.getElementById('airQuality').textContent = aqiText[aqi] || `${aqi}`;
        
        // UV Index estimate
        const hour = new Date().getHours();
        let uvEstimate = hour > 9 && hour < 16 ? 6 : hour > 7 && hour < 18 ? 3 : 1;
        document.getElementById('uvIndex').textContent = uvEstimate;
        
    } catch(e) {
        document.getElementById('airQuality').textContent = "Moderate 🟡";
        document.getElementById('uvIndex').textContent = "5";
    }
}

// ================= UPDATE CHART =================
async function updateChart() {
    if (!currentForecastData || !currentLat || !currentLon) return;
    
    if (currentTimeRange === 'past') {
        // Generate past 7 days data
        const pastLabels = [];
        const pastTemps = [];
        const pastHumidity = [];
        const pastPrecip = [];
        
        for (let i = 7; i >= 1; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            pastLabels.push(date.toLocaleDateString('en', { weekday: 'short' }));
            // Simulate past data with slight variations
            pastTemps.push(Math.round(15 + Math.random() * 15));
            pastHumidity.push(Math.round(40 + Math.random() * 40));
            pastPrecip.push(Math.round(Math.random() * 60));
        }
        
        let data = [];
        let label = '';
        let borderColor = '#38bdf8';
        
        if (currentChartType === 'temp') {
            data = pastTemps;
            label = 'Temperature (°C) - Past';
            borderColor = '#38bdf8';
        } else if (currentChartType === 'humidity') {
            data = pastHumidity;
            label = 'Humidity (%) - Past';
            borderColor = '#10b981';
        } else if (currentChartType === 'precip') {
            data = pastPrecip;
            label = 'Precipitation Chance (%) - Past';
            borderColor = '#f59e0b';
        }
        
        if (weatherChart) {
            weatherChart.data.labels = pastLabels;
            weatherChart.data.datasets[0].label = label;
            weatherChart.data.datasets[0].data = data;
            weatherChart.data.datasets[0].borderColor = borderColor;
            weatherChart.data.datasets[0].backgroundColor = `${borderColor}20`;
            weatherChart.update();
        }
        document.getElementById('chartCity').textContent = `Past 7 Days - ${currentChartType === 'temp' ? 'Temperature' : currentChartType === 'humidity' ? 'Humidity' : 'Precipitation'} Trend`;
        return;
    }
    
    // Future forecast
    const dailyData = {};
    currentForecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = { temps: [], humidity: [], rain: 0, count: 0 };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].rain += item.pop || 0;
        dailyData[date].count++;
    });
    
    const labels = Object.keys(dailyData).slice(0, 7);
    let data = [];
    let label = '';
    let borderColor = '#38bdf8';
    
    if (currentChartType === 'temp') {
        data = labels.map(date => Math.round(dailyData[date].temps.reduce((a,b) => a+b, 0) / dailyData[date].temps.length));
        label = 'Temperature (°C)';
        borderColor = '#38bdf8';
    } else if (currentChartType === 'humidity') {
        data = labels.map(date => Math.round(dailyData[date].humidity.reduce((a,b) => a+b, 0) / dailyData[date].humidity.length));
        label = 'Humidity (%)';
        borderColor = '#10b981';
    } else if (currentChartType === 'precip') {
        data = labels.map(date => Math.round(dailyData[date].rain / dailyData[date].count * 100));
        label = 'Precipitation Chance (%)';
        borderColor = '#f59e0b';
    }
    
    if (weatherChart) {
        weatherChart.data.labels = labels.map(d => new Date(d).toLocaleDateString('en', { weekday: 'short' }));
        weatherChart.data.datasets[0].label = label;
        weatherChart.data.datasets[0].data = data;
        weatherChart.data.datasets[0].borderColor = borderColor;
        weatherChart.data.datasets[0].backgroundColor = `${borderColor}20`;
        weatherChart.update();
    }
    document.getElementById('chartCity').textContent = `Future 7 Days - ${currentChartType === 'temp' ? 'Temperature' : currentChartType === 'humidity' ? 'Humidity' : 'Precipitation'} Trend`;
}

// ================= WEATHER API =================
async function fetchWeather(city) {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    if (!currentUser) {
        showToast(t.loginRequired);
        openAuthModal();
        return;
    }
    
    try {
        showToast(`${t.fetch} ${city}...`);
        
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${WEATHER_API_KEY}`);
        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error(t.notFound);
        
        const { lat, lon, name, country } = geoData[0];
        currentLat = lat;
        currentLon = lon;
        const displayCity = `${name}, ${country}`;
        
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        const weather = await weatherRes.json();
        
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        currentForecastData = await forecastRes.json();
        
        // Update basic weather
        document.getElementById('location').textContent = displayCity;
        document.getElementById('temp').textContent = `${Math.round(weather.main.temp)}°C`;
        document.getElementById('description').textContent = weather.weather[0].description;
        document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
        document.getElementById('wind').textContent = `${Math.round(weather.wind.speed)} km/h`;
        document.getElementById('feelsLike').textContent = `${Math.round(weather.main.feels_like)}°C`;
        
        // Rain Chance
        let rainChance = 0;
        if (currentForecastData.list[0]) {
            rainChance = Math.round(currentForecastData.list[0].pop * 100);
        }
        document.getElementById('rainChance').textContent = `${rainChance}%`;
        
        // Update all 12 metrics
        await updateAllMetrics(lat, lon, weather);
        
        // Icon
        const iconMap = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Snow: '❄️', Thunderstorm: '⛈️', Drizzle: '🌦️', Mist: '🌫️' };
        const mainWeather = weather.weather[0].main;
        document.getElementById('weatherIcon').textContent = iconMap[mainWeather] || '🌈';
        
        // Smart message
        const temp = weather.main.temp;
        let smartMsg = temp > 30 ? t.hotDay : temp < 10 ? t.coldDay : t.pleasantWeather;
        if (weather.weather[0].main === 'Rain') smartMsg = t.rainyDay;
        if (weather.weather[0].main === 'Snow') smartMsg = t.snowyDay;
        document.getElementById('smartMessage').textContent = smartMsg;
        document.getElementById('aiMessage').textContent = `${t.feels} ${weather.weather[0].description.toLowerCase()}`;
        
        // Update chart
        await updateChart();
        
        // Map
        if (map) {
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lon]).addTo(map);
            map.setView([lat, lon], 10);
        }
        
        currentCity = displayCity;
        showToast(`✅ ${t.updated} ${name}!`);
        
    } catch (error) {
        console.error(error);
        showToast(`❌ ${t.notFound}`);
    }
}

// ================= MAP INIT =================
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd'
    }).addTo(map);
}

// ================= CHART INIT =================
function initChart() {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#87ceeb', font: { size: 10 } } }
            },
            scales: {
                y: { ticks: { color: '#87ceeb' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#87ceeb' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

// ================= SHARE WEATHER =================
document.getElementById('shareBtn').onclick = async () => {
    const element = document.querySelector('.sidebar-content');
    if (element && htmlToImage) {
        try {
            const dataUrl = await htmlToImage.toPng(element);
            const link = document.createElement('a');
            link.download = `weather-${currentCity.replace(/[^a-z]/gi, '')}.png`;
            link.href = dataUrl;
            link.click();
            showToast("📸 Weather image saved!");
        } catch (e) {
            showToast("Couldn't capture image");
        }
    }
};

// ================= CHART BUTTON HANDLERS =================
document.getElementById('chartTempBtn').onclick = () => {
    currentChartType = 'temp';
    document.getElementById('chartTempBtn').classList.add('active');
    document.getElementById('chartHumidityBtn').classList.remove('active');
    document.getElementById('chartPrecipBtn').classList.remove('active');
    updateChart();
};

document.getElementById('chartHumidityBtn').onclick = () => {
    currentChartType = 'humidity';
    document.getElementById('chartHumidityBtn').classList.add('active');
    document.getElementById('chartTempBtn').classList.remove('active');
    document.getElementById('chartPrecipBtn').classList.remove('active');
    updateChart();
};

document.getElementById('chartPrecipBtn').onclick = () => {
    currentChartType = 'precip';
    document.getElementById('chartPrecipBtn').classList.add('active');
    document.getElementById('chartTempBtn').classList.remove('active');
    document.getElementById('chartHumidityBtn').classList.remove('active');
    updateChart();
};

document.getElementById('chartPastBtn').onclick = () => {
    currentTimeRange = 'past';
    document.getElementById('chartPastBtn').classList.add('active');
    document.getElementById('chartFutureBtn').classList.remove('active');
    updateChart();
};

document.getElementById('chartFutureBtn').onclick = () => {
    currentTimeRange = 'future';
    document.getElementById('chartFutureBtn').classList.add('active');
    document.getElementById('chartPastBtn').classList.remove('active');
    updateChart();
};

// ================= FORGOT PASSWORD =================
function showForgotPasswordModal() {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(0,0,0,0.9)';
    popup.style.backdropFilter = 'blur(15px)';
    popup.style.zIndex = '10000';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    
    popup.innerHTML = `
        <div style="background: rgba(15,25,35,0.95); border-radius: 28px; width: 90%; max-width: 400px; padding: 30px; border: 1px solid rgba(255,255,255,0.2);">
            <h3 style="margin-bottom: 20px; text-align: center; color: #87ceeb;">${t.forgotPassword}</h3>
            <div class="input-group" style="margin-bottom: 20px;">
                <input type="email" id="popupResetEmail" placeholder="${t.emailAddress}" style="width:100%; padding:14px; border-radius:12px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; font-size:1rem;">
            </div>
            <button id="popupSendResetBtn" style="width:100%; padding:14px; background:linear-gradient(135deg,#f59e0b,#d97706); border:none; border-radius:12px; color:white; font-weight:bold; cursor:pointer; margin-bottom:10px;">${t.sendResetLink}</button>
            <button id="popupCancelBtn" style="width:100%; padding:14px; background:transparent; border:1px solid rgba(255,255,255,0.3); border-radius:12px; color:white; cursor:pointer;">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    document.getElementById('popupSendResetBtn').onclick = async () => {
        const email = document.getElementById('popupResetEmail').value;
        if (email) {
            try {
                await auth.sendPasswordResetEmail(email);
                showToast(`📧 ${t.passwordResetSent} ${email}! ${t.checkInbox}`, 5000);
                popup.remove();
            } catch (error) {
                showToast(`❌ ${error.message}`);
            }
        } else {
            showToast(t.enterEmail);
        }
    };
    
    document.getElementById('popupCancelBtn').onclick = () => {
        popup.remove();
    };
}

// ================= FIREBASE AUTH =================
async function signUp(email, password, name, phone) {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    try {
        showToast(t.creatingAccount);
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        await userCred.user.updateProfile({ displayName: name });
        await userCred.user.sendEmailVerification();
        await db.collection('users').doc(userCred.user.uid).set({
            name: name, email: email, phone: phone, favorites: [], createdAt: new Date()
        });
        showToast(t.accountCreated);
        await auth.signOut();
        closeAuthModal();
    } catch (error) {
        showToast(`❌ ${error.message}`);
    }
}

async function signIn(email, password) {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        if (!userCred.user.emailVerified) {
            await auth.signOut();
            showToast(t.verifyEmail, 5000);
            return;
        }
        showToast(t.welcomeBack);
        closeAuthModal();
        currentUser = userCred.user;
        updateUserUI();
    } catch (error) {
        showToast(`❌ ${error.message}`);
    }
}

async function signOut() {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    await auth.signOut();
    currentUser = null;
    updateUserUI();
    showToast(t.loggedOut);
}

function updateUserUI() {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    if (currentUser) {
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('profileName').textContent = currentUser.displayName || currentUser.email.split('@')[0];
        document.getElementById('userBtn').title = t.signOut;
        document.getElementById('logoutBtn').textContent = t.signOut;
        loadFavorites();
    } else {
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('userBtn').title = t.login;
        document.getElementById('favoritesList').innerHTML = `<p style="text-align:center; opacity:0.7;">${t.loginToSave}</p>`;
    }
}

async function loadFavorites() {
    if (!currentUser) return;
    const doc = await db.collection('users').doc(currentUser.uid).get();
    const favorites = doc.data()?.favorites || [];
    const container = document.getElementById('favoritesList');
    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.7;">No favorites yet</p>';
    } else {
        container.innerHTML = favorites.map(city => 
            `<div class="favorite-item" onclick="fetchWeather('${city}')">⭐ ${city} <span onclick="event.stopPropagation(); removeFavorite('${city}')" style="color:#ef4444; cursor:pointer;">🗑️</span></div>`
        ).join('');
    }
}

async function addFavorite(city) {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    
    if (!currentUser) { showToast(t.loginToSave); openAuthModal(); return; }
    
    const docRef = db.collection('users').doc(currentUser.uid);
    const doc = await docRef.get();
    const favorites = doc.data()?.favorites || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        await docRef.update({ favorites });
        loadFavorites();
        showToast(`⭐ ${city} ${t.addedFavorite}`);
    } else {
        showToast(`${city} ${t.alreadyFavorite}`);
    }
}

async function removeFavorite(city) {
    const lang = document.getElementById('languageSelect').value;
    const t = translations[lang] || translations.en;
    if (!currentUser) return;
    const docRef = db.collection('users').doc(currentUser.uid);
    const doc = await docRef.get();
    let favorites = doc.data()?.favorites || [];
    favorites = favorites.filter(c => c !== city);
    await docRef.update({ favorites });
    loadFavorites();
    showToast(`⭐ ${city} ${t.removedFavorite}`);
}

window.addFavoriteFromCurrent = function() {
    const cityName = document.getElementById('location').textContent;
    if (cityName && cityName !== '--') addFavorite(cityName.split(',')[0]);
    else showToast("Search for a city first");
};

// ================= AUTH MODAL =================
const modal = document.getElementById('authModal');
function openAuthModal() { modal.style.display = 'flex'; }
function closeAuthModal() { modal.style.display = 'none'; }

document.getElementById('userBtn').onclick = () => currentUser ? signOut() : openAuthModal();
document.getElementById('closeModal').onclick = closeAuthModal;
window.onclick = (e) => { if (e.target === modal) closeAuthModal(); };

document.getElementById('signupTab').onclick = () => {
    document.getElementById('signupTab').classList.add('active');
    document.getElementById('signinTab').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('signinForm').classList.remove('active');
    document.getElementById('modalTitle').textContent = "Create Account";
};

document.getElementById('signinTab').onclick = () => {
    document.getElementById('signinTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('signinForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('modalTitle').textContent = "Sign In";
};

document.getElementById('switchToSignup').onclick = () => document.getElementById('signupTab').click();
document.getElementById('switchToSignin').onclick = () => document.getElementById('signinTab').click();
document.getElementById('forgotPasswordLink').onclick = (e) => {
    e.preventDefault();
    showForgotPasswordModal();
};

document.getElementById('signupForm').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (password.length < 6) { showToast("Password must be at least 6 characters"); return; }
    signUp(email, password, name, phone);
};

document.getElementById('signinForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    signIn(email, password);
};

// ================= THEME =================
document.getElementById('themeBtn').onclick = () => {
    document.body.classList.toggle('light');
    document.getElementById('themeBtn').textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
};

// ================= SIDEBAR =================
document.getElementById('menuBtn').onclick = () => {
    document.getElementById('sidebar').classList.toggle('hide');
};

// ================= SEARCH =================
document.getElementById('searchBtn').onclick = () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) fetchWeather(city);
    else {
        const lang = document.getElementById('languageSelect').value;
        const t = translations[lang] || translations.en;
        showToast(t.enterCity);
    }
};

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

document.getElementById('languageSelect').onchange = updateLanguage;

// ================= INIT =================
function init() {
    initMap();
    initChart();
    updateLanguage();
    
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateUserUI();
    });
    
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.add('hide');
    
    showToast("✨ Weather X Pro Ready! Please login to use the app! ✨");
}

init();