import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocation, fetchWeatherForcast } from "../api/weather";
import { weatherImages } from "../constants";
import { CircleSnail } from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";

export default function HomeScreen() {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyWeatherData = async () => {
            let myCity = await getData("city");
            let cityName = "Hanoi";

            if (myCity != null) cityName = myCity;

            fetchWeatherForcast({
                cityName: myCity,
                days: "7",
            }).then((data) => {
                setWeather(data);
                setLoading(false);
            });
        };

        fetchMyWeatherData();
    }, []);

    const handleLocation = (loc) => {
        setLoading(true);
        setLocations([]);

        fetchWeatherForcast({
            cityName: loc.name,
            days: "7",
        }).then((data) => {
            setWeather(data);
            setShowSearch(false);
            setLoading(false);
            storeData("city", loc.name);
        });
    };

    const handleSearch = (value) => {
        // fetch locations
        fetchLocation({ cityName: value }).then((data) => {
            setLocations(data ? data : []);
        });
    };

    const hanleTextDebounce = useCallback(debounce(handleSearch, 500), []);

    const { current, location } = weather;

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image blurRadius={70} className="absolute h-full w-full" source={require("../assests/images/bg.png")} />

            {loading ? (
                <View className="flex-1 flex-row justify-center items-center">
                    <CircleSnail thickness={10} size={140} color="#0bb3b2" />
                </View>
            ) : (
                <SafeAreaView className="flex flex-1" style={{ marginTop: 40 }}>
                    {/* search section */}
                    <View style={{ height: "7%" }} className="mx-4 relative z-50">
                        <View
                            className="flex-row justify-end items-center rounded-full"
                            style={showSearch ? styles.searchBar : "transparent"}
                        >
                            {showSearch ? (
                                <TextInput
                                    onChangeText={hanleTextDebounce}
                                    placeholder="Search City"
                                    placeholderTextColor={"lightgrey"}
                                    className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                                />
                            ) : null}
                            <TouchableOpacity
                                onPress={() => setShowSearch(!showSearch)}
                                style={styles.searchBar}
                                className="rounded-full p-3 m-1"
                            >
                                <MagnifyingGlassIcon size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        {locations.length > 0 && showSearch ? (
                            <View className="absolute w-full bg-green-50 top-16 rounded-3xl">
                                {locations.map((loc, index) => {
                                    let showBorder = index + 1 != locations.length;
                                    let borderClass = showBorder ? " border-b-2 border-b-grey-400" : "";
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleLocation(loc)}
                                            key={index}
                                            className={"flex-row items-center  border-0 p-3 px-4 mb-1" + borderClass}
                                        >
                                            <MapPinIcon size={25} color="grey" />
                                            <Text className="text-black text-lg ml-2">
                                                {loc?.name}, {loc?.country}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : null}
                    </View>

                    {showSearch ? (
                        <View className="flex-1 flex-row justify-center items-center">
                            <Text className="text-white text-xl">Searching...</Text>
                        </View>
                    ) : (
                        <Fragment>
                            <View className="mx-4 flex justify-around flex-1 mb-2">
                                {/* location */}
                                <Text className="text-white text-center text-2xl font-bold">
                                    {location?.name},
                                    <Text className="text-lg font-semibold text-gray-300">
                                        {" "}
                                        {" " + location?.country}
                                    </Text>
                                </Text>
                                {/* weather image */}
                                <View className="flex-row justify-center">
                                    <Image source={weatherImages[current?.condition?.text]} className="w-52 h-52" />
                                </View>
                                {/* degree celcius */}
                                <View className="space-y-2">
                                    <Text className="text-center font-bold text-white text-6xl ml-5">
                                        {current?.temp_c}&#176;
                                    </Text>
                                    <Text className="text-center text-white text-xl tracking-widest">
                                        {current?.condition?.text}
                                    </Text>
                                </View>
                                {/* other stats */}
                                <View className="flex-row justify-between mx-4">
                                    <View className="flex-row space-x-2 items-center">
                                        <Image source={require("../assests/icons/wind.png")} className="h-6 w-6" />
                                        <Text className="text-white font-semibold text-base">
                                            {current?.wind_kph}km
                                        </Text>
                                    </View>
                                    <View className="flex-row space-x-2 items-center">
                                        <Image source={require("../assests/icons/drop.png")} className="h-6 w-6" />
                                        <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                                    </View>
                                    <View className="flex-row space-x-2 items-center">
                                        <Image source={require("../assests/icons/sun.png")} className="h-6 w-6" />
                                        <Text className="text-white font-semibold text-base">
                                            {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Forecast for next days */}
                            <View className="mb-2 space-y-3">
                                <View className="flex-row items-center mx-5 space-x-5">
                                    <CalendarDaysIcon size="22" color="white" />
                                    <Text className="text-white text-base">Daily Forecast</Text>
                                </View>
                                <ScrollView
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: "long" };
                                        let dayName = date.toLocaleDateString("en-US", options);
                                        return (
                                            <View
                                                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                                style={styles.searchBar}
                                                key={index}
                                            >
                                                <Image
                                                    source={weatherImages[item?.day?.condition?.text]}
                                                    className="h-11 w-11"
                                                />
                                                <Text className="text-white">{dayName}</Text>
                                                <Text className="text-white text-xl font-semibold">
                                                    {item?.day?.avgtemp_c}&#176;
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </Fragment>
                    )}
                </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: "rgba(220, 220, 220, 0.2)",
    },
    searchBarIcon: {
        backgroundColor: "rgba(220, 220, 220, 0.2)",
    },
});
