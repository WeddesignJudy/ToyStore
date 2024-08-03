import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ribbon from './Ribbon';

const Detail = ({ route, navigation }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const perfume = route.params?.perfume;

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const favoritesString = await AsyncStorage.getItem('favorites');
                if (favoritesString) {
                    const favoritesArray = JSON.parse(favoritesString);
                    const isFavoritePerfume = favoritesArray.some(item => item.id === perfume.id);
                    setIsFavorite(isFavoritePerfume);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        if (perfume) {
            checkFavoriteStatus();
        }
    }, [perfume]);

    const addToFavorites = async () => {
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            const favoritesArray = favoritesString ? JSON.parse(favoritesString) : [];
            const perfumeExists = favoritesArray.some(item => item.id === perfume.id);

            let updatedFavorites;
            if (perfumeExists) {
                updatedFavorites = favoritesArray.filter(item => item.id !== perfume.id);
            } else {
                updatedFavorites = [...favoritesArray, perfume];
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorite(!perfumeExists);
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    if (!perfume) {
        return (
            <View style={styles.container}>
                <Text style={styles.placeholderText}>Please select the product you want to see details!</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Favorite')} style={styles.favoriteButton}>
                <Ionicons name="heart" size={24} color="#FFD700" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Image source={{ uri: perfume.image }} style={styles.image} />
                {perfume.modern && <Ribbon text="True" />}
                <Text style={styles.perfumeName}>{perfume.toyName}</Text>
                <Text style={styles.price}>${perfume.price}</Text>
                <Text style={styles.description}>{perfume.toyDescription}</Text>
                <Text style={styles.description}>{perfume.address}</Text>
                 {/* Automatic */}
                 <View style={styles.automaticInfo}>
                <Text style={styles.itemInfo}>Gender: </Text>
                <Text>
                    {perfume.modern ? (
                        <Ionicons name="checkmark-outline" size={35} color="#22BB33" />
                    ) : (
                        <Ionicons name="close-outline" size={45} color="#BB2124" />
                    )}
                </Text>
                    </View>

            </View>
            <Pressable onPress={addToFavorites} style={({ pressed }) => [styles.addToFavoritesButton, { backgroundColor: pressed ? '#f0f0f0' : '#fff' }]}>
                {({ pressed }) => (
                    <>
                        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="red" />
                        <Text style={[styles.addToFavoritesButtonText, { color: pressed ? '#999' : 'red' }]}>{isFavorite ? 'Added to Favorites' : 'Add to Favorites'}</Text>
                    </>
                )}
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F8F8FF',
    },
    container: {
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    perfumeName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#444',
    },
    description: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    addToFavoritesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'red',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 30,
    },
    addToFavoritesButtonText: {
        marginLeft: 5,
        fontSize: 18,
    },
    placeholderText: {
        fontSize: 20,
        color: '#999',
        textAlign: 'center',
    },
});

export default Detail;
