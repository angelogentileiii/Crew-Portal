import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function ProductionDetail ({ route, navigation }) {
    const { id } = route.params;
    const [production, setProduction] = useState({})
    const [productionCompany, setProductionCompany] = useState({})

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const fetchProductionData = async () => {
        try {
            // const responseJSON = await fetchAuthWrapper(`http://192.168.1.156:5555/productions/${id}`, {
            const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555/productions/${id}`, {
                method: 'GET',
            });

            // console.log('AFTER PRODUCTIONS FETCH: ', responseJSON)

            if (responseJSON) {
                try{
                    setProduction(responseJSON);
    
                // Extract productionCompanyId from the responseJSON
                const productionCompanyId = responseJSON.productionCompanyId;
        
                // Make the second fetch using productionCompanyId
                // const pcResponse = await fetchAuthWrapper(`http://192.168.1.156:5555/productionCompanies/${productionCompanyId}`, {
                const pcResponse = await fetchAuthWrapper(`http://10.129.3.82:5555/productionCompanies/${productionCompanyId}`, {
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