import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    Text,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get('window')

const ScreenMap: () => React$Node = () => {

    const [initialRegion, setInitialRegion] = useState({
        latitude: 50.450001,
        longitude: 30.523333,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      })
    const [place, setPlace] = useState(null)
    const mapView = useRef(null)
    const [permissions, setPermissions] = useState(0)
    const refRBSheet = useRef(null);

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse'
            });
        }

        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    useEffect(() => {
        Geolocation.getCurrentPosition((info) =>
            setInitialRegion({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
            })
        );
    }, [permissions])

    const onClick = async ({ latitude, longitude }) => {
        Geocoder.geocodePosition({ lat: latitude, lng: longitude }).then((info) => {
            setPlace(info)
            mapView.current.animateToRegion({
                latitude: info[0].position.lat, longitude: info[0].position.lng, latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }, 1000)
            setTimeout(() => openModal(), 100)
        }
        );
    }

    const openModal = () => {
        refRBSheet.current.open()
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <RBSheet
                ref={refRBSheet}
                height={height < 725 ? 275 : 325}
                openDuration={400}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: styles.modalContainer,
                }}
            >
                <View style={styles.modalWrapper}>
                    {place &&
                        <View>
                            <Text allowFontScaling={false} style={styles.title_1}>{place[0]?.country}{place[0] && ','} {place[0]?.locality}</Text>
                            <Text allowFontScaling={false} style={styles.title_2}>{place[0]?.formattedAddress || place[0]?.streetName}</Text>
                            <Text allowFontScaling={false} style={styles.title_3}>{place[0] && 'latitude: '}{place[0]?.position?.lat}</Text>
                            <Text allowFontScaling={false} style={styles.title_4}>{place[0] && 'longitude: '}{place[0]?.position?.lng}</Text>
                        </View>
                    }
                </View>
            </RBSheet>

            <SafeAreaView style={styles.wrapper}>
                <MapView
                    ref={mapView}
                    onPress={(e) => onClick(e?.nativeEvent?.coordinate)}
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                    showsUserLocation
                >
                    {place && <Marker coordinate={{ latitude: place[0]?.position?.lat, longitude: place[0]?.position?.lng }} />}
                </MapView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    title_1: {
        fontSize: 24, fontWeight: '600', textAlign: 'left'
    },
    title_2: {
        fontSize: 20, fontWeight: '400', textAlign: 'left', marginTop: 10
    },
    title_3: {
        fontSize: 16, fontWeight: '300', textAlign: 'left', marginTop: 12.5
    },
    title_4: {
        fontSize: 16, fontWeight: '300', textAlign: 'left', marginTop: 7.5
    },
    modalContainer: {
        alignItems: "center",
        borderTopLeftRadius: 14, borderTopRightRadius: 14,
        backgroundColor: '#fff',
        paddingHorizontal: 0,
        paddingVertical: 5
    },
    modalWrapper: {
        paddingVertical: 10,
        paddingHorizontal: '8%',
        width: '100%',
        alignItems: 'flex-start',
    },
    wrapper: {
        width: width, height: height
    }
})

export default ScreenMap