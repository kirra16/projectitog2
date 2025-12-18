import React, { useEffect, useRef, useState } from 'react';
import './Map.css';

const Map = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hallsLocations = [
    {
      id: 1,
      name: 'Natural Vibe',
      address: 'ул. Большая Садовая, 115, Ростов-на-Дону',
      coordinates: [47.222531, 39.718676],
      color: 'green'
    },
    {
      id: 2,
      name: 'Red Wine',
      address: 'пр. Социалистическая, 13, Ростов-на-Дону',
      coordinates: [47.217704, 39.701293],
      color: 'red'
    },
    {
      id: 3,
      name: 'White Room',
      address: 'ул. Кировский, 69, Ростов-на-Дону',
      coordinates: [47.233089, 39.726581],
      color: 'blue'
    },
    {
      id: 4,
      name: 'Golden River',
      address: 'ул. Будёновский, 105, Ростов-на-Дону',
      coordinates: [47.242573, 39.699814],
      color: 'yellow'
    }
  ];

  useEffect(() => {
    const loadMap = () => {
      if (window.ymaps && window.ymaps.Map) {
        initMap();
        return;
      }

      if (window.loadingYandexMaps) {
        const checkInterval = setInterval(() => {
          if (window.ymaps && window.ymaps.Map) {
            clearInterval(checkInterval);
            initMap();
          }
        }, 100);
        return;
      }

      window.loadingYandexMaps = true;
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      
      let timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError('Карта загружается слишком долго. Попробуйте обновить страницу.');
      }, 10000);

      script.onload = () => {
        clearTimeout(timeoutId);
        if (window.ymaps && window.ymaps.ready) {
          setIsLoading(false);
          window.ymaps.ready(() => {
            setTimeout(initMap, 500);
          });
        } else {
          setIsLoading(false);
          setError('Библиотека загрузилась, но с ошибкой. Попробуйте обновить страницу.');
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setError('Не удалось загрузить Яндекс.Карты. Проверьте подключение к интернету.');
      };
      
      document.head.appendChild(script);
    };

    const initMap = () => {
      try {
        if (mapContainer.current) {
          mapContainer.current.innerHTML = '';
        }

        mapInstance.current = new window.ymaps.Map(mapContainer.current, {
          center: [47.231350, 39.723281],
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl']
        });

        hallsLocations.forEach((hall) => {
          const placemark = new window.ymaps.Placemark(
            hall.coordinates,
            {
              balloonContentHeader: `<strong>${hall.name}</strong>`,
              balloonContentBody: `
                <div style="margin: 10px 0;">
                  <strong>Адрес:</strong> ${hall.address}<br/>
                  <strong>Телефон:</strong> +7 (928) 198-88-35
                </div>
              `,
              hintContent: hall.name
            },
            {
              preset: `islands#${hall.color}Icon`,
              balloonCloseButton: true
            }
          );

          mapInstance.current.geoObjects.add(placemark);
        });

        const bounds = mapInstance.current.geoObjects.getBounds();
        if (bounds) {
          mapInstance.current.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: 50
          });
        }

      } catch (err) {
        console.error('Ошибка создания карты:', err);
        setError('Ошибка при создании карты. Попробуйте обновить страницу.');
        setIsLoading(false);
      }
    };

    loadMap();

    return () => {
      if (mapInstance.current && mapInstance.current.destroy) {
        try {
          mapInstance.current.destroy();
        } catch (e) {
          console.warn('Ошибка при очистке карты:', e);
        }
      }
      delete window.loadingYandexMaps;
    };
  }, []);

  const renderFallbackMap = () => (
    <div className="fallback-map">
      <img 
        src="https://static-maps.yandex.ru/1.x/?ll=39.723281,47.231350&z=12&l=map&size=650,400&pt=39.718676,47.222531,pm2gnl1~39.701293,47.217704,pm2rdl1~39.726581,47.233089,pm2bll1~39.699814,47.242573,pm2yll1"
        alt="Карта с расположением залов"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="fallback-overlay">
        <p>Интерактивная карта временно недоступна</p>
        <button 
          onClick={() => window.location.reload()}
          className="reload-btn"
        >
          Обновить карту
        </button>
      </div>
    </div>
  );

  return (
    <div className="map-section" id="map">
      <div className="map-container">
        <h2 className="map-title">Наши залы на карте</h2>
        <p className="map-subtitle">Нажмите на метку для просмотра информации о зале</p>
        
        <div className="map-wrapper">
          {isLoading && (
            <div className="map-loading">
              <div className="spinner"></div>
              <p>Загрузка карты...</p>
            </div>
          )}
          
          {error ? (
            <div className="map-error">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                Обновить страницу
              </button>
              <div style={{ marginTop: '20px' }}>
                {renderFallbackMap()}
              </div>
            </div>
          ) : (
            <div ref={mapContainer} className="yandex-map"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;