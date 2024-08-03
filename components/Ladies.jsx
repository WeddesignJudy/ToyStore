// import React from 'react';
// import { View, Text, Button } from 'react-native';

// const Ladies = ({ navigation }) => {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Ladies Screen</Text>
//             <Button
//                 title="Go to Details"
//                 onPress={() => navigation.navigate('Detail')}
//             />
//             <Button
//                 title="Go to Favorites"
//                 onPress={() => navigation.navigate('Favorite')}
//             />
//         </View>
//     );
// };

// export default Ladies;


/////////////////////////

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Ladies = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ladies Screen</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Detail')}
                color="#841584"
            />
            <View style={styles.spacing} />
            <Button
                title="Go to Favorites"
                onPress={() => navigation.navigate('Favorite')}
                color="#841584"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F8FF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    spacing: {
        height: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#841584',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Ladies;
