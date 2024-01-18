import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function ProductionDetail ({ route, navigation }) {
    const { id } = route.params;
    const [production, setProduction] = useState({})
    const [productionCompany, setProductionCompany] = useState({})

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const fetchProductionData = async () => {
        try {
            const responseJSON = await fetchAuthWrapper(`http://192.168.1.156:5555/productions/${id}`, {
            // const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555/productions/${id}`, {
                method: 'GET',
            });

            // console.log('AFTER PRODUCTIONS FETCH: ', responseJSON)

            if (responseJSON) {
                try{
                    setProduction(responseJSON);
    
                // Extract productionCompanyId from the responseJSON
                const productionCompanyId = responseJSON.productionCompanyId;
        
                // Make the second fetch using productionCompanyId
                const pcResponse = await fetchAuthWrapper(`http://192.168.1.156:5555/productionCompanies/${productionCompanyId}`, {
                // const pcResponse = await fetchAuthWrapper(`http://10.129.3.82:5555/productionCompanies/${productionCompanyId}`, {
                    method: 'GET',
                });

                // console.log('AFTER PRODUCTIONS PC FETCH: ', pcResponse)
                
                // await production company data and set it
                const pcData = pcResponse;
                setProductionCompany(pcData);
                }
                catch (error) {
                    console.error('Error Fetchin Production Company: ', error)
                }
            }  
        } catch (error) {
            console.error('Error Fetching Production: ', error);
        }
    };

    function formatPhoneNumber(phoneNumber) {
        // Format phone number as (XXX) XXX-XXXX
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }

    const formattedPhoneNum = formatPhoneNumber(productionCompany.phoneNumber)

    useEffect(() => {
        fetchProductionData()
    }, [])

    const defaultDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam tincidunt sodales. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam tincidunt sodales.";


    return (
        <View style={styles.container}>
                <Text style={styles.title}>{production.name}</Text>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleLocation}>{production.location}</Text>
                    <Text style={styles.subtitle}>{production.type}</Text>
                </View>
                <Text style={styles.description}>{defaultDescription}</Text>
                <View style={styles.section}>
                    {/* <Text style={styles.sectionTitle}>Production Company</Text>
                    <View style={styles.infoItem}> */}
                        <Text style={styles.sectionTitle}>{productionCompany.companyName}</Text>
                    {/* </View> */}
                    <View style={styles.infoItem}>
                        <FontAwesome name="map-marker" size={20} color="#333" />
                        <Text style={styles.infoText}>{productionCompany.address}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome name="phone" size={20} color="#333" />
                        <Text style={styles.infoText}>{formattedPhoneNum}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome name="envelope" size={20} color="#333" />
                        <Text style={styles.infoText}>{productionCompany.email}</Text>
                    </View>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 16,
    },
    scrollView: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitleContainer:{
        flexDirection: 'row',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 8,
        color: '#555',
    },
    subtitleItalic: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 8,
        color: '#555',
    },
    subtitleLocation: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 8,
        marginRight: 50,
        color: '#555',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: '#777',
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
});

export default ProductionDetail