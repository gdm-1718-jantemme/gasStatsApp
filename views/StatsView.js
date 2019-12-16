import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, RefreshControl } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { LinearGradient } from 'expo-linear-gradient'

import db from '../db/db'

export default function StatsView() {
    const [data, setData] = useState({})
    const [refreshing, setRefreshing] = React.useState(true);

    useEffect(() => {
        readDb()
        return
    }, [])

    const onRefresh = () => {
        setRefreshing(true)
        readDb()
    }

    const readDb = () => {
        db.ref('/stats').once('value')
        .then(function(snapshot) {
            if(snapshot.val())
                setData(snapshot.val())
            else
                setData({'No Data': ""})

            setRefreshing(false)
        });
    }

    return (
            <View style={{flex:1}}>
                <StatusBar barStyle="dark-content" />
                <LinearGradient colors={['#1b89e4', '#0daeda']} start={[0, 0]} end={[1, 1]} style={{flexDirection: 'row', backgroundColor: '#FFF', paddingTop: 50, padding: 10}}>
                        <Text style={styles.heading}>Gas Stats</Text>
                </LinearGradient>
                <TouchableOpacity style={{position: 'absolute' ,width: 70, height: 70, alignSelf: 'center', bottom: 30, elevation: 1, zIndex: 1}} onPress={() => Actions.home()}>
                    <Image style={{width: 70, height: 70, alignSelf: 'center'}} source={require('../assets/add.png')} />
                </TouchableOpacity>
                <ScrollView style={{flex: 1,}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} tintColor={'#0daeda'} onRefresh={onRefresh} />
                }
                >
                    <View style={styles.container}>
                        {Object.entries(data).map(([key,v])=>{
                            return(
                                <View key={key}>
                                    <Text style={styles.label}>{key}</Text>
                                    {Object.entries(v).map(([key2,v2])=>{
                                        return(
                                            <TouchableOpacity key={key2} style={styles.dataContainer} onPress={() => Actions.detail({data: v2})}>
                                                <Text style={styles.data}>{key2}</Text>
                                                <Text style={styles.data}>{v2.km} km | €{v2.price}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        justifyContent: 'space-between',
    },
    heading: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 30,
        alignSelf: 'center',
    },
    label: {
        color: '#0c3759',
        fontSize: 20,
        paddingTop: 20,
        fontWeight: '600',
        paddingLeft: '4%',
    },
    data: {
        color: '#0c3759',
        fontSize: 16,
        fontWeight: '400',
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        width: '100%',
        marginBottom: 2,
        padding: 10,
        paddingLeft: '4%',

    },
    form: {
        alignSelf: 'center',
        width: '96%'
    },
    rate: {
        alignSelf: 'center',
        color: '#FFF',
        fontWeight: '400',
        fontSize: 18,
        paddingTop: 20,
        fontWeight: '500',
    },
    button_save: {
        width: '60%',
        padding: 12,
        borderRadius: 4,
        backgroundColor: '#35e865',
        alignSelf: 'center',
        alignItems: 'center',
    },
    button_refresh: {
        width: '60%',
        padding: 12,
        borderRadius: 4,
        backgroundColor: '#34abeb',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 80,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 20,
        fontWeight: '500',
    },
});
