import { useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const { kakao } = window;

function MapComponent({ latitude, longitude, title }) {

    useEffect(() => {
        kakao.maps.load(() => {
            // 
        });
    }, []);

    return (
        <Map
        center={{lat: latitude, lng: longitude}}
        style={{ width: '100%', height: '400px',  borderRadius: '12px', }}
        level={3}>
            <MapMarker position={{ lat: latitude, lng: longitude}}>
                <div style={{padding: "5px", color:"#000"}}>{title}</div>
            </MapMarker>
        </Map>
    );
}

export default MapComponent;