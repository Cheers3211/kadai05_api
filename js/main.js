const WEATHER_API_KEY = "";

// 🌤 天気取得（位置情報）
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=ja`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const description = data.weather?.[0]?.description || "不明";
      const temp = data.main?.temp || "？";
      const name = data.name || "現在地";

      document.getElementById("weather").textContent =
        `${name}の天気：${description}（${temp}℃）`;

      const goodWeatherWords = ["晴", "曇", "雲", "くもり"];
      const isNiceWeather = goodWeatherWords.some(word =>
        description.includes(word)
      );

      if (isNiceWeather) {
        document.getElementById("mood-section").style.display = "block";
      }
    })
    .catch(() => {
      document.getElementById("weather").textContent = "天気情報の取得に失敗しました。";
    });
}

function error() {
  document.getElementById("weather").textContent = "位置情報の取得に失敗しました。";
}


  const moodRecommendations = {
    "のんびり": {
      text: "ゆったりしたい日は、緑に癒される『井の頭公園』がぴったり🌿",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Inokashira_Park.JPG/800px-Inokashira_Park.JPG",
      lat: 35.6975,
      lon: 139.5703
    },
    "アクティブ": {
      text: "にぎやかに楽しみたい日は『浅草〜スカイツリー』エリアがおすすめ！⛩️",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Asakusa_and_Skytree.jpg",
      lat: 35.7100,
      lon: 139.8107
    },
    "カフェでまったり": {
      text: "のんびり過ごしたい日は『中目黒・代官山』のカフェ巡りはいかが？☕",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Nakameguro_Canal.jpg",
      lat: 35.6467,
      lon: 139.6982
    }
  };


  function selectMood(mood) {
    const recommendation = moodRecommendations[mood];
    if (!recommendation) return;

    // おすすめ表示
    document.getElementById("recommendation").style.display = "block";
    document.getElementById("recommendation-text").textContent = recommendation.text;
    document.getElementById("recommendation-image").src = recommendation.image;
    document.getElementById("recommendation-image").alt = mood + "のおすすめスポット";

    // 地図をその場所へ移動
    map.setView([recommendation.lat, recommendation.lon], 15);



    // 新しいマーカー設置
    window.recommendMarker = L.marker([recommendation.lat, recommendation.lon])
      .addTo(map)
      .bindPopup(recommendation.text)
      .openPopup();
  }


// 🗺 地図表示
const map = L.map("map").setView([35.72, 139.77], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 🏞 スポット情報
const walkSpots = [
  {
    name: "上野恩賜公園",
    lat: 35.7148,
    lon: 139.7745,
    description: "緑豊かな都心のオアシス。美術館や博物館も充実！",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Ueno_Park_in_Tokyo.jpg"
  },
  {
    name: "谷中ぎんざ商店街",
    lat: 35.7221,
    lon: 139.7662,
    description: "猫の街として有名。昔ながらの商店街でお買い物も楽しい！",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/67/Yanaka_Ginza_Street_Tokyo.jpg"
  },
  {
    name: "日暮里駅前",
    lat: 35.7284,
    lon: 139.7708,
    description: "ゴール地点。駅近で帰りも便利。下町の雰囲気が心地いい。",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nippori_Station_east_exit.jpg"
  }
];

// 📍 マーカー・吹き出し表示
walkSpots.forEach(spot => {
  const marker = L.marker([spot.lat, spot.lon]).addTo(map);
  marker.bindPopup(`
    <strong>${spot.name}</strong><br>
    ${spot.description}<br>
    <img src="${spot.image}" alt="${spot.name}" width="200">
  `);
});

// 🔷 散歩コースのルート線
const routeLine = walkSpots.map(spot => [spot.lat, spot.lon]);
L.polyline(routeLine, { color: "blue", weight: 4 }).addTo(map);
