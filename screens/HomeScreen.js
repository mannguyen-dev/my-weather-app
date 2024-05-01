import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";

export default function HomeScreen() {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3]);

    const handleLocation = (loc) => {
        console.log(loc);
    };

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image blurRadius={70} className="absolute h-full w-full" source={require("../assests/images/bg.png")} />

            <SafeAreaView className="flex flex-1" style={{ marginTop: 40 }}>
                {/* search section */}
                <View style={{ height: "7%" }} className="mx-4 relative z-50">
                    <View
                        className="flex-row justify-end items-center rounded-full"
                        style={showSearch ? styles.searchBar : "transparent"}
                    >
                        {showSearch ? (
                            <TextInput
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
                                        <Text className="text-black text-lg ml-2">London, UK</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : null}
                </View>

                <View className="mx-4 flex justify-around flex-1 mb-2">
                    {/* location */}
                    <Text className="text-white text-center text-2xl font-bold">
                        London,
                        <Text className="text-lg font-semibold text-gray-300"> United Kingdom</Text>
                    </Text>
                    {/* weather image */}
                    <View className="flex-row justify-center">
                        <Image source={require("../assests/images/partlycloudy.png")} className="w-52 h-52" />
                    </View>
                    {/* degree celcius */}
                    <View className="space-y-2">
                        <Text className="text-center font-bold text-white text-6xl ml-5">23&#176;</Text>
                        <Text className="text-center text-white text-xl tracking-widest">Partly Cloudy</Text>
                    </View>
                    {/* other stats */}
                    <View className="flex-row justify-between mx-4">
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assests/icons/wind.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">22km</Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assests/icons/drop.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">23%</Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assests/icons/sun.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">6:05 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Forecast for next days */}
                <View className="mb-2 space-y-3">
                    <View className="flex-row items-center mx-5 space-x-5">
                        <CalendarDaysIcon size="22" color="white" />
                        <Text className="text-white text-base">Daily Forecast</Text>
                    </View>
                </View>
            </SafeAreaView>
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
