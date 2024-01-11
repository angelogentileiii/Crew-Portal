import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';

import * as SecureStore from 'expo-secure-store'

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function ProductionDetail ({ route, navigation }) {
    const { id } = route.params;
    const [production, setProduction] = useState({})
    const [productionCompany, setProductionCompany] = useState({})

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    console.log( id )

    const fetchProductionData = async () => {
        try {
            let token = await SecureStore.getItemAsync('accessToken')
            // const responseJSON = await fetchAuthWrapper(`http://192.168.1.156:5555/productions/${id}`, {
            const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555/productions/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            setProduction(responseJSON);
    
            // Extract productionCompanyId from the responseJSON
            const productionCompanyId = responseJSON.productionCompanyId;
            console.log(productionCompanyId)
    
            // Make the second fetch using productionCompanyId
            // const pcResponse = await fetchAuthWrapper(`http://192.168.1.156:5555/productionCompanies/${productionCompanyId}`, {
            const pcResponse = await fetchAuthWrapper(`http://10.129.3.82:5555/productionCompanies/${productionCompanyId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            
            // await production company data and set it
            const pcData = await pcResponse;
            setProductionCompany(pcData);
        } catch (error) {
            console.error('Error Fetching Production: ', error);
        }
    };

    useEffect(() => {
        fetchProductionData()
    }, [])

    return (
        <View>
            <ScrollView>
                <Text>{production.name}</Text>
                <Text>{production.location}</Text>
                <Text>{production.type}</Text>
                <View style={{paddingTop: '2%'}}>
                    <Text>{productionCompany.companyName}</Text>
                    <Text>{productionCompany.address}</Text>
                    <Text>{productionCompany.phoneNumber}</Text>
                    <Text>{productionCompany.email}</Text>
                </View>
            </ScrollView>
        </View>
    )

}

export default ProductionDetail