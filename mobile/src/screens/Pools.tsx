import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardPros[]>([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    setIsLoading(true);
    try {
      const response = await api.get('/pools');
      setPools(response.data);
    } catch (e) {
      console.error(e);
      toast.show({
        title: "Erro ao buscar os balões",
        placement: "top",
        bgColor: "red.500",
      })
    } finally {
      setIsLoading(false);
    }
  }
  
  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" size="md" color="black" />}
          onPress={() => navigate('find')}
        />
      </VStack>
      
      {
        isLoading ? (
          <Loading />
        ) : (
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      )}

    </VStack>
  )
}